import { body } from 'express-validator';
console.log('🔥 EVENT VALIDATOR CARGADO');
import { validateResults } from './validateHelper';
import { NextFunction } from 'express';

export const validateEvent = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre del evento es obligatorio.')
    .isLength({ min: 3, max: 150 }).withMessage('El nombre debe tener entre 3 y 150 caracteres.'),
  body('categoria')
    .notEmpty().withMessage('La categoría es obligatoria.'),
  body('direccion')
    .trim()
    .notEmpty().withMessage('La dirección completa es obligatoria.'),
  body('barrio')
    .trim()
    .notEmpty().withMessage('El barrio es obligatorio.'),
  body('localidad')
    .trim()
    .notEmpty().withMessage('La localidad es obligatoria.'),
  body('ciudad')
    .trim()
    .notEmpty().withMessage('La ciudad es obligatoria.'),
  body('departamento')
    .trim()
    .notEmpty().withMessage('El departamento es obligatorio.'),
  body('pais')
    .trim()
    .notEmpty().withMessage('El país es obligatorio.'),
  body('fecha')
    .notEmpty().withMessage('La fecha del evento es obligatoria.')
    .isISO8601().withMessage('Debe proporcionar un formato de fecha válido (ISO8601).'),
  body('organizacionId')
    .notEmpty().withMessage('La organización de origen es obligatoria.'),
  body('latitud')
    .optional({ nullable: true })
    .isFloat({ min: -90, max: 90 }).withMessage('La latitud debe ser un número entre -90 y 90.'),
  body('longitud')
    .optional({ nullable: true })
    .isFloat({ min: -180, max: 180 }).withMessage('La longitud debe ser un número entre -180 y 180.'),

    (req: Request, res: Response, next: NextFunction) => {
    console.log('DATOS RECIBIDOS POR VALIDATOR:', req.body);
    next();
  },
  validateResults
];
