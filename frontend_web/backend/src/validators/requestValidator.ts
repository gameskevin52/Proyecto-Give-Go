import { body } from 'express-validator';
import { validateResults } from './validateHelper';

export const validateRequest = [
  body('beneficiarioId')
    .notEmpty().withMessage('El ID del beneficiario es obligatorio.'),
  body('titulo')
    .trim()
    .notEmpty().withMessage('El título es obligatorio.')
    .isLength({ min: 5, max: 150 }).withMessage('El título debe tener entre 5 y 150 caracteres.'),
  body('descripcion')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria.'),
  validateResults
];
