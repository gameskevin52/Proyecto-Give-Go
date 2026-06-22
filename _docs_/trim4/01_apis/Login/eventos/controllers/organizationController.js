const Organization = require("../models/organization");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

function normalizeOrganization(body) {
  return {
    id: body.id || body.id_Organizaciones || body.organizacion_id,
    name: body.name || body.nombre_organizaciones || body.organizacion_nombre,
    address: body.address || body.direccion_organizaciones || body.organizacion_direccion,
    email: body.email || body.correo_organizaciones || body.organizacion_correo,
    password: body.password || body.password_organizaciones,
  };
}

module.exports = {
  login(req, res) {
    const { email, password } = normalizeOrganization(req.body);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "El correo y la contrasena son obligatorios",
      });
    }

    Organization.findByEmail(email, async (err, organization) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al consultar la organizacion",
          error: err,
        });
      }

      if (!organization) {
        return res.status(401).json({
          success: false,
          message: "El correo no existe en la base de datos",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, organization.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Contrasena o correo incorrecto",
        });
      }

      const token = jwt.sign(
        {
          id: organization.id,
          email: organization.email,
          role: "Organizacion",
        },
        keys.secretOrKey,
        { expiresIn: "1h" }
      );

      delete organization.password;

      return res.status(200).json({
        success: true,
        message: "Organizacion autenticada",
        data: {
          ...organization,
          role: "Organizacion",
          session_token: `JWT ${token}`,
        },
      });
    });
  },

  getAllOrganizations(req, res) {
    Organization.findAll((err, organizations) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al listar organizaciones",
          error: err,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Lista de organizaciones",
        data: organizations,
      });
    });
  },

  getOrganizationById(req, res) {
    const id = req.params.id;

    Organization.findById(id, (err, organization) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al consultar la organizacion",
          error: err,
        });
      }

      if (!organization) {
        return res.status(404).json({
          success: false,
          message: "Organizacion no encontrada",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Organizacion encontrada",
        data: organization,
      });
    });
  },

  register(req, res) {
    const organization = normalizeOrganization(req.body);

    if (!organization.name || !organization.address || !organization.email || !organization.password) {
      return res.status(400).json({
        success: false,
        message: "Nombre, direccion, correo y contrasena son obligatorios",
      });
    }

    Organization.create(organization, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al crear la organizacion",
          error: err,
        });
      }

      return res.status(201).json({
        success: true,
        message: "Organizacion creada correctamente",
        data,
      });
    });
  },

  getOrganizationUpdate(req, res) {
    const organization = normalizeOrganization({ ...req.body, id: req.params.id });

    Organization.update(organization, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al actualizar la organizacion",
          error: err,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Organizacion actualizada",
        data,
      });
    });
  },

  getOrganizationDelete(req, res) {
    const id = req.params.id;

    Organization.delete(id, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error al eliminar la organizacion",
          error: err,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Organizacion eliminada",
        data,
      });
    });
  },
};
