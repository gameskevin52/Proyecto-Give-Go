const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

function normalizeUser(body) {
  return {
    id: body.id || body.id_usuario,
    role: body.role || body.roles || "Voluntario",
    first_name: body.first_name || body.name || body.nombre1_usuario,
    second_name: body.second_name || body.nombre2_usuario,
    first_lastname: body.first_lastname || body.lastname || body.apellido1_usuario,
    second_lastname: body.second_lastname || body.apellido2_usuario,
    phone: body.phone || body.telefono_usuario,
    email: body.email || body.correo_usuario,
    password: body.password || body.password_usuario,
  };
}

function isValidRole(role) {
  return ["Admin", "Voluntario", "Beneficiario"].includes(role);
}

module.exports = {
  login(req, res) {
    const { email, password } = normalizeUser(req.body);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "El correo y la contrasena son obligatorios",
      });
    }

    User.findByEmail(email, async (err, myUser) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al consultar el usuario",
          error: err,
        });
      }

      if (!myUser) {
        return res.status(401).json({
          success: false,
          message: "El correo no existe en la base de datos",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, myUser.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Contrasena o correo incorrecto",
        });
      }

      const token = jwt.sign(
        {
          id: myUser.id,
          email: myUser.email,
          role: myUser.role,
        },
        keys.secretOrKey,
        { expiresIn: "1h" }
      );

      delete myUser.password;

      return res.status(200).json({
        success: true,
        message: "Usuario autenticado",
        data: {
          ...myUser,
          session_token: `JWT ${token}`,
        },
      });
    });
  },

  getAllUsers(req, res) {
    User.findAll((err, users) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al listar usuarios",
          error: err,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lista de usuarios",
        data: users,
      });
    });
  },

  getUserById(req, res) {
    const id = req.params.id;

    User.findById(id, (err, user) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al consultar el usuario",
          error: err,
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Usuario encontrado",
        data: user,
      });
    });
  },

  register(req, res) {
    const user = normalizeUser(req.body);

    if (!user.first_name || !user.first_lastname || !user.phone || !user.email || !user.password) {
      return res.status(400).json({
        success: false,
        message: "Primer nombre, primer apellido, telefono, correo y contrasena son obligatorios",
      });
    }

    if (!isValidRole(user.role)) {
      return res.status(400).json({
        success: false,
        message: "El rol debe ser Admin, Voluntario o Beneficiario",
      });
    }

    User.create(user, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al crear el usuario",
          error: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Usuario creado correctamente",
        data,
      });
    });
  },

  getUserUpdate(req, res) {
    const user = normalizeUser({ ...req.body, id: req.params.id });

    if (user.role && !isValidRole(user.role)) {
      return res.status(400).json({
        success: false,
        message: "El rol debe ser Admin, Voluntario o Beneficiario",
      });
    }

    User.update(user, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al actualizar el usuario",
          error: err,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Usuario actualizado",
        data,
      });
    });
  },

  getUserDelete(req, res) {
    const id = req.params.id;

    User.delete(id, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al eliminar el usuario",
          error: err,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Usuario eliminado",
        data,
      });
    });
  },
};
