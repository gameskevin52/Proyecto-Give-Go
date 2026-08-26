import {
  CreateEventDTO,
  UpdateEventDTO,
  EventFormErrors,
} from '../types/event.types';

type EventData = Partial<CreateEventDTO | UpdateEventDTO>;

interface ValidationResult {
  isValid: boolean;
  errors: EventFormErrors;
}

/**
 * Valida los datos necesarios para crear un evento.
 */
export const validateCreateEvent = (
  data: CreateEventDTO
): ValidationResult => {
  const errors: EventFormErrors = {};

  // Nombre
  if (!data.nombre || !data.nombre.trim()) {
    errors.nombre = 'El nombre del evento es obligatorio.';
  } else if (data.nombre.trim().length < 3) {
    errors.nombre = 'El nombre debe tener al menos 3 caracteres.';
  }

  // Categoría
  if (!data.id_categoria || Number(data.id_categoria) <= 0) {
    errors.id_categoria = 'Selecciona una categoría válida.';
  }

  // Descripción
  if (!data.descripcion || !data.descripcion.trim()) {
    errors.descripcion = 'La descripción es obligatoria.';
  } else if (data.descripcion.trim().length < 10) {
    errors.descripcion =
      'La descripción debe tener al menos 10 caracteres.';
  }

  // Dirección
  if (!data.direccion || !data.direccion.trim()) {
    errors.direccion = 'La dirección es obligatoria.';
  }

  // Fecha
  if (!data.fecha || !data.fecha.trim()) {
    errors.fecha = 'La fecha y hora son obligatorias.';
  } else {
    validateDate(data.fecha, errors);
  }

  // Cupo
  const cupo = Number(data.cupo);

  if (!Number.isFinite(cupo) || cupo <= 0) {
    errors.cupo = 'El cupo debe ser mayor que 0.';
  }

  // Vacantes voluntarios
  const vacantesVoluntarios = Number(
    data.vacantes_voluntarios
  );

  if (
    !Number.isFinite(vacantesVoluntarios) ||
    vacantesVoluntarios < 0
  ) {
    errors.vacantes_voluntarios =
      'Las vacantes de voluntarios no pueden ser negativas.';
  }

  // Vacantes beneficiarios
  const vacantesBeneficiarios = Number(
    data.vacantes_beneficiarios
  );

  if (
    !Number.isFinite(vacantesBeneficiarios) ||
    vacantesBeneficiarios < 0
  ) {
    errors.vacantes_beneficiarios =
      'Las vacantes de beneficiarios no pueden ser negativas.';
  }

  // Validación de capacidad
  if (
    Number.isFinite(cupo) &&
    Number.isFinite(vacantesVoluntarios) &&
    Number.isFinite(vacantesBeneficiarios) &&
    vacantesVoluntarios + vacantesBeneficiarios > cupo
  ) {
    errors.cupo =
      'La suma de las vacantes no puede superar el cupo total.';
  }

  // Ayuda ofrecida
  if (!data.ayuda_ofrecida || !data.ayuda_ofrecida.trim()) {
    errors.ayuda_ofrecida =
      'Debes indicar qué ayuda o recursos se ofrecerán.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Valida los datos necesarios para actualizar un evento.
 */
export const validateUpdateEvent = (
  data: UpdateEventDTO
): ValidationResult => {
  const errors: EventFormErrors = {};

  // Nombre
  if (!data.nombre || !data.nombre.trim()) {
    errors.nombre = 'El nombre del evento es obligatorio.';
  } else if (data.nombre.trim().length < 3) {
    errors.nombre = 'El nombre debe tener al menos 3 caracteres.';
  }

  // Categoría
  if (!data.id_categoria || Number(data.id_categoria) <= 0) {
    errors.id_categoria = 'Selecciona una categoría válida.';
  }

  // Descripción
  if (!data.descripcion || !data.descripcion.trim()) {
    errors.descripcion = 'La descripción es obligatoria.';
  } else if (data.descripcion.trim().length < 10) {
    errors.descripcion =
      'La descripción debe tener al menos 10 caracteres.';
  }

  // Dirección
  if (!data.direccion || !data.direccion.trim()) {
    errors.direccion = 'La dirección es obligatoria.';
  }

  // Fecha
  if (!data.fecha || !data.fecha.trim()) {
    errors.fecha = 'La fecha y hora son obligatorias.';
  } else {
    validateDate(data.fecha, errors);
  }

  // Cupo
  const cupo = Number(data.cupo);

  if (!Number.isFinite(cupo) || cupo <= 0) {
    errors.cupo = 'El cupo debe ser mayor que 0.';
  }

  // Vacantes voluntarios
  const vacantesVoluntarios = Number(
    data.vacantes_voluntarios
  );

  if (
    !Number.isFinite(vacantesVoluntarios) ||
    vacantesVoluntarios < 0
  ) {
    errors.vacantes_voluntarios =
      'Las vacantes de voluntarios no pueden ser negativas.';
  }

  // Vacantes beneficiarios
  const vacantesBeneficiarios = Number(
    data.vacantes_beneficiarios
  );

  if (
    !Number.isFinite(vacantesBeneficiarios) ||
    vacantesBeneficiarios < 0
  ) {
    errors.vacantes_beneficiarios =
      'Las vacantes de beneficiarios no pueden ser negativas.';
  }

  // Validación de capacidad
  if (
    Number.isFinite(cupo) &&
    Number.isFinite(vacantesVoluntarios) &&
    Number.isFinite(vacantesBeneficiarios) &&
    vacantesVoluntarios + vacantesBeneficiarios > cupo
  ) {
    errors.cupo =
      'La suma de las vacantes no puede superar el cupo total.';
  }

  // Ayuda ofrecida
  if (!data.ayuda_ofrecida || !data.ayuda_ofrecida.trim()) {
    errors.ayuda_ofrecida =
      'Debes indicar qué ayuda o recursos se ofrecerán.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Valida fecha y hora.
 *
 * Formato esperado:
 * YYYY-MM-DD HH:mm:ss
 */
const validateDate = (
  fecha: string,
  errors: EventFormErrors
): void => {
  const date = new Date(fecha.replace(' ', 'T'));

  if (Number.isNaN(date.getTime())) {
    errors.fecha =
      'La fecha debe tener un formato válido.';
    return;
  }

  const now = new Date();

  if (date <= now) {
    errors.fecha =
      'La fecha y hora deben ser posteriores al momento actual.';
  }
};