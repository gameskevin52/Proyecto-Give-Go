import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateResults = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación en los campos enviados.',
      errors: errors.array().map(err => ({
        campo: (err as any).path || (err as any).param,
        mensaje: err.msg
      }))
    });
  }
  next();
};
