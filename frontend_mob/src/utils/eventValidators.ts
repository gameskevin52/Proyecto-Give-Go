/**
 * Validaciones de formulario para creación y actualización de eventos (HU013 / HU014)
 * Mobile first layer de validación basada en las reglas del backend (eventValidator.ts)
 */

import { CreateEventDTO, UpdateEventDTO, EventFormErrors } from '../types/event.types';

export interface ValidationResult {
  isValid: boolean;
  errors: EventFormErrors;
}

/**
 * Valida si un string de fecha y hora es posterior al instante actual
 */
export function isFutureDate(dateString: string): boolean {
  const parsedDate = new Date(dateString);
  if (isNaN(parsedDate.getTime())) {
    return false;
  }
  const now = new Date();
  return parsedDate.getTime() > now.getTime();
}

/**
 * Valida los datos del formulario de creación o actualización de evento
 */
export function validateEventForm(data: Partial<CreateEventDTO | UpdateEventDTO>): ValidationResult {
  const errors: EventFormErrors = {};

  // 1. Nombre del evento
  if (!data.nombre || data.nombre.trim().length === 0) {
    errors.nombre = 'El nombre del evento es obligatorio.';
  } else if (data.nombre.trim().length < 3) {
    errors.nombre = 'El nombre debe tener al menos 3 caracteres.';
  } else if (data.nombre.trim().length > 150) {
    errors.nombre = 'El nombre no puede exceder 150 caracteres.';
  }

  // 2. Categoría
 if (!data.categoria || Number(data.categoria) <= 0) {
  errors.categoria = 'Debes seleccionar una categoría válida.';
}

  // 3. Descripción
  if (!data.descripcion || data.descripcion.trim().length === 0) {
    errors.descripcion = 'La descripción del evento es obligatoria.';
  } else if (data.descripcion.trim().length < 10) {
    errors.descripcion = 'La descripción debe tener al información más detallada (mínimo 10 caracteres).';
  }

  // 4. Dirección
  if (!data.direccion || data.direccion.trim().length === 0) {
    errors.direccion = 'La dirección del evento es obligatoria.';
  }

  // 5. Fecha y hora
  if (!data.fecha || data.fecha.trim().length === 0) {
    errors.fecha = 'La fecha y hora del evento son obligatorias.';
  } else {
    const dateObj = new Date(data.fecha);
    if (isNaN(dateObj.getTime())) {
      errors.fecha = 'Formato de fecha inválido. Usa el selector de fecha y hora.';
    } else if (!isFutureDate(data.fecha)) {
      errors.fecha = 'La fecha y hora del evento deben ser posteriores a la fecha y hora actuales.';
    }
  }

  // 6. Cupo total
  if (data.cupo === undefined || data.cupo === null || isNaN(Number(data.cupo))) {
    errors.cupo = 'El cupo total es obligatorio.';
  } else if (Number(data.cupo) <= 0) {
    errors.cupo = 'El cupo total debe ser un número entero mayor a 0.';
  }

  // 7. Vacantes para voluntarios
  if (
  data.vacantesVoluntarios === undefined ||
  data.vacantesVoluntarios === null ||
  isNaN(Number(data.vacantesVoluntarios))
) {
  errors.vacantesVoluntarios = 'Las vacantes de voluntarios son obligatorias.';
} else if (Number(data.vacantesVoluntarios) < 0) {
  errors.vacantesVoluntarios =
    'Las vacantes de voluntarios no pueden ser negativas.';
}

  // 8. Vacantes para beneficiarios
  if (
  data.vacantesBeneficiarios === undefined ||
  data.vacantesBeneficiarios === null ||
  isNaN(Number(data.vacantesBeneficiarios))
) {
  errors.vacantesBeneficiarios =
    'Las vacantes de beneficiarios son obligatorias.';
} else if (Number(data.vacantesBeneficiarios) < 0) {
  errors.vacantesBeneficiarios =
    'Las vacantes de beneficiarios no pueden ser negativas.';
}

    // Coherencia entre cupos
  if (
    data.cupo !== undefined &&
    data.vacantesVoluntarios !== undefined &&
    data.vacantesBeneficiarios !== undefined
  ) {
    const totalVacantes =
      Number(data.vacantesVoluntarios) +
      Number(data.vacantesBeneficiarios);

    if (totalVacantes > Number(data.cupo)) {
      errors.cupo =
        'La suma de voluntarios y beneficiarios supera el cupo total.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Mantener compatibilidad directa con HU013
export const validateCreateEvent = validateEventForm;
export const validateUpdateEvent = validateEventForm;