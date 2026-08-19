//CAPTURA ERRORES GLOBALES 400 o 500
import { Request, Response, NextFunction } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
  errors?: any[];
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Error:', err);//Imprime el error completo en la consola del servidor para que el podamos ver solo el programador pueda ver que fallo en tiempo real

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor.';
  const errors = err.errors || [];

  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};
