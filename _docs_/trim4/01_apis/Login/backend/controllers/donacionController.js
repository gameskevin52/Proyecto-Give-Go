const Donacion = require("../models/donacion");


exports.findAll = (req, res) => {
  Donacion.findAll((err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Error al obtener las donaciones"
      });
    }

    res.status(200).json(data);
  });
};

exports.findById = (req, res) => {
  const { id } = req.params;

 Donacion.findById(id, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Error al consultar la donación"
      });
    }

    if (!data) {
      return res.status(404).json({
        message: "Donación no encontrada"
      });
    }

    res.status(200).json(data);
  });
};

exports.create = (req, res) => {
  Donacion.create(req.body, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: err.message || "Error al crear la donación"
      });
    }

    res.status(201).json(data);
  });
};

exports.update = (req, res) => {
  const { id } = req.params;

  Donacion.update(id, req.body, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Error al actualizar la donación"
      });
    }

    res.status(200).json({
      message: "Donación actualizada correctamente",
      data
    });
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;

  Donacion.delete(id, (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Error al eliminar la donación"
      });
    }

    res.status(200).json({
      message: "Donación eliminada correctamente",
      data
    });
  });
};

  