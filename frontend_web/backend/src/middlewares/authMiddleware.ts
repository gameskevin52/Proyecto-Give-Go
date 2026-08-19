//VERIFICA TOKENS JWT. BASICAENTE ES UN SISTEMA DE AUTENTICACION
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    rol: string;
    correo: string;
  };
}

// Middleware para verificar la validez del token JWT
export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
//Verifica donde esta o donde viene el token
  const authHeader = req.headers.authorization;
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
//Filtros
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado. No se proporcionó ningún token de autenticación.',
      errors: []
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({//Si el token fue modificado, está mal redactado o ya expiró, devuelve un error 403 Forbidden
      success: false,
      message: 'Token inválido o expirado.',
      errors: []
    });
  }

  req.user = decoded;
  next();
};

// Middleware para autorizar según el rol del usuario
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) { // Si no se ejecuto authenticateJWt ante, arroja un error 401 Unauthorized
      return res.status(401).json({
        success: false,
        message: 'No autenticado.',
        errors: []
      });
    }

    // Normalizar roles para comparación insensible a mayúsculas
    const userRole = req.user.rol.toLowerCase();
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

    if (!normalizedAllowed.includes(userRole)) {//Si el rol NO está en la lista: Detiene todo y responde con un error 403 Forbidden
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos suficientes para realizar esta acción.',
        errors: []
      });
    }

    next();
  };
};
