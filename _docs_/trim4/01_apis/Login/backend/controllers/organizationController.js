const Organization = require("../models/organization");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

function normalizeOrganization(body) {
  return {
    id: body.id || body.organizacion_id,
    name: body.name || body.organizacion_nombre,
    address: body.address || body.organizacion_direccion,
    email: body.email || body.organizacion_correo,
    password: body.password || body.organizacion_contraseña,
  };
}

module.exports = {
  login(req, res) {
    const { email, password } = normalizeOrganization(req.body);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "El correo y la contraseña son obligatorios",
      });
    }

    Organization.findByEmail(email, async (err, organization) => {
      if (err) {
        return res.status(501).json({
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
          message: "Contraseña o correo incorrecto",
        });
      }

      const token = jwt.sign(
        {
          id: organization.id,
          email: organization.email,
          role: "organization",
        },
        keys.secretOrKey,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        success: true,
        message: "Organizacion autenticada",
        data: {
          id: organization.id,
          name: organization.name,
          address: organization.address,
          email: organization.email,
          role: "organization",
          session_token: `Bearer ${token}`,
        },
      });
    });
  },

  getAllOrganizations(req, res) {
    Organization.findAll((err, organizations) => {
      if (err) {
        return res.status(501).json({
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
        return res.status(501).json({
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

      delete organization.password;

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
        message: "Nombre, direccion, correo y contraseña son obligatorios",
      });
    }

    Organization.create(organization, (err, data) => {
      if (err) {
        return res.status(501).json({
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
        return res.status(501).json({
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
        return res.status(501).json({
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
