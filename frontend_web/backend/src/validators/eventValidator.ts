import { body } from 'express-validator';
import { validateResults } from './validateHelper';

export const validateEvent = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre del evento es obligatorio.')
    .isLength({ min: 3, max: 150 }).withMessage('El nombre debe tener entre 3 y 150 caracteres.'),
  body('categoria')
    .notEmpty().withMessage('La categoría es obligatoria.'),
  body('fecha')
    .notEmpty().withMessage('La fecha del evento es obligatoria.')
    .isISO8601().withMessage('Debe proporcionar un formato de fecha válido (ISO8601).'),
  body('organizacionId')
    .notEmpty().withMessage('La organización de origen es obligatoria.'),
  validateResults
];
