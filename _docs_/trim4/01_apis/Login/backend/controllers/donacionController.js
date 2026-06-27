const Donacion = require("../models/donacion");

/**
 * Validar si los datos de la donación son válidos
 */
function validateDonationData(donation) {
  if (!donation.category) {
    return { valid: false, message: "La categoría es obligatoria" };
  }

  if (!donation.donation_type) {
    return { valid: false, message: "El tipo de donación es obligatorio" };
  }

  if (!['Monetario', 'Objeto'].includes(donation.donation_type)) {
    return { valid: false, message: "El tipo debe ser 'Monetario' u 'Objeto'" };
  }

  if (!donation.organization_id) {
    return { valid: false, message: "El ID de la organización es obligatorio" };
  }

  if (!donation.user_id) {
    return { valid: false, message: "El ID del usuario es obligatorio" };
  }

  if (donation.donation_type === "Monetario") {
    if (!donation.payment_method) {
      return { valid: false, message: "El método de pago es obligatorio para donaciones monetarias" };
    }
    if (!donation.total_value) {
      return { valid: false, message: "El valor total es obligatorio para donaciones monetarias" };
    }
    if (isNaN(donation.total_value) || donation.total_value <= 0) {
      return { valid: false, message: "El valor debe ser un número positivo" };
    }
  }

  if (donation.donation_type === "Objeto") {
    if (!donation.object_category) {
      return { valid: false, message: "La categoría de objeto es obligatoria" };
    }
    if (!donation.quantity || isNaN(donation.quantity) || donation.quantity <= 0) {
      return { valid: false, message: "La cantidad debe ser un número positivo" };
    }
  }

  return { valid: true };
}

/**
 * Obtener todas las donaciones
 */
exports.findAll = (req, res) => {
  Donacion.findAll((err, data) => {
    if (err) {
      console.log("Error al listar donaciones:", err);
      return res.status(500).json({
        success: false,
        message: "Error al obtener las donaciones",
        error: err.message
      });
    }

    res.status(200).json({
      success: true,
      message: "Lista de donaciones obtenida correctamente",
      data: data
    });
  });
};

/**
 * Obtener donación por ID
 */
exports.findById = (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "ID de donación inválido"
    });
  }

  Donacion.findById(id, (err, data) => {
    if (err) {
      console.log("Error al consultar donación:", err);
      return res.status(500).json({
        success: false,
        message: "Error al consultar la donación",
        error: err.message
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Donación no encontrada"
      });
    }

    res.status(200).json({
      success: true,
      message: "Donación encontrada",
      data: data
    });
  });
};

/**
 * Crear nueva donación
 */
exports.create = (req, res) => {
  const validation = validateDonationData(req.body);
  
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: validation.message
    });
  }

  Donacion.create(req.body, (err, data) => {
    if (err) {
      console.log("Error al crear donación:", err);
      return res.status(500).json({
        success: false,
        message: "Error al crear la donación",
        error: err.message
      });
    }

    res.status(201).json({
      success: true,
      message: "Donación creada correctamente",
      data: data
    });
  });
};

/**
 * Actualizar donación existente
 */
exports.update = (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "ID de donación inválido"
    });
  }

  const validation = validateDonationData(req.body);
  
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      message: validation.message
    });
  }

  Donacion.update(id, req.body, (err, data) => {
    if (err) {
      console.log("Error al actualizar donación:", err);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar la donación",
        error: err.message
      });
    }

    if (data.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Donación no encontrada"
      });
    }

    res.status(200).json({
      success: true,
      message: "Donación actualizada correctamente",
      data: data
    });
  });
};

/**
 * Eliminar donación
 */
exports.delete = (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "ID de donación inválido"
    });
  }

  Donacion.delete(id, (err, data) => {
    if (err) {
      console.log("Error al eliminar donación:", err);
      return res.status(500).json({
        success: false,
        message: "Error al eliminar la donación",
        error: err.message
      });
    }

    if (data.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Donación no encontrada"
      });
    }

    res.status(200).json({
      success: true,
      message: "Donación eliminada correctamente",
      data: data
    });
  });
};