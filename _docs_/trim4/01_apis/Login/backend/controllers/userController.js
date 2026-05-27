const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

function normalizeUser(body) {
  return {
    id: body.id || body.usuario_id,
    name: body.name || body.usuario_nombre,
    lastname: body.lastname || body.usuario_apellido,
    address: body.address || body.usuario_direccion,
    phone: body.phone || body.usuario_telefono,
    stratum: body.stratum || body.usuario_estrato,
    email: body.email || body.usuario_correo,
    password: body.password || body.usuario_contraseña,
    organization_id: body.organization_id || body.organizacion_id,
  };
}

module.exports = {
  login(req, res) {
    const { email, password } = normalizeUser(req.body);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "El correo y la contraseña son obligatorios",
      });
    }

    User.findByEmail(email, async (err, myUser) => {
      if (err) {
        return res.status(501).json({
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
          message: "Contraseña o correo incorrecto",
        });
      }

      const token = jwt.sign(
        {
          id: myUser.id,
          email: myUser.email,
          role: "user",
          organization_id: myUser.organization_id,
        },
        keys.secretOrKey,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        success: true,
        message: "Usuario autenticado",
        data: {
          id: myUser.id,
          name: myUser.name,
          lastname: myUser.lastname,
          address: myUser.address,
          phone: myUser.phone,
          stratum: myUser.stratum,
          email: myUser.email,
          role: "user",
          organization_id: myUser.organization_id,
          session_token: `Bearer ${token}`,
        },
      });
    });
  },

  getAllUsers(req, res) {
    User.findAll((err, users) => {
      if (err) {
        return res.status(501).json({
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
        return res.status(501).json({
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

      delete user.password;

      return res.status(200).json({
        success: true,
        message: "Usuario encontrado",
        data: user,
      });
    });
  },

  register(req, res) {
    const user = normalizeUser(req.body);

    if (!user.name || !user.lastname || !user.email || !user.password) {
      return res.status(400).json({
        success: false,
        message: "Nombre, apellido, correo, contraseña y son obligatorios",
      });
    }

    User.create(user, (err, data) => {
      if (err) {
        return res.status(501).json({
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

    User.update(user, (err, data) => {
      if (err) {
        return res.status(501).json({
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
        return res.status(501).json({
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
