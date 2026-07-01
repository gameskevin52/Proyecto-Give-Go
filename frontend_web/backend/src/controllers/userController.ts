import { Request, Response } from 'express';
import { UsuarioModel, UsuarioDB } from '../models/usuarioModel';
import { generateToken, hashPassword, comparePassword } from '../utils/auth';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

// Mapeadores auxiliares para asegurar compatibilidad perfecta con el Frontend
const mapRoleToFrontend = (role: string): string => {
  return role.toLowerCase();
};

const mapRoleToBackend = (role: string): 'Admin' | 'Voluntario' | 'Beneficiario' | 'Organizacion' => {
  const normalized = role.toLowerCase();
  if (normalized === 'admin') return 'Admin';
  if (normalized === 'voluntario') return 'Voluntario';
  if (normalized === 'beneficiario') return 'Beneficiario';
  return 'Organizacion';
};

const mapUserToFrontend = (user: UsuarioDB) => {
  return {
    id: String(user.id_usuario),
    rol: mapRoleToFrontend(user.rol),
    nombre1: user.nombre1,
    nombre2: user.nombre2 || '',
    apellido1: user.apellido1,
    apellido2: user.apellido2 || '',
    telefono: user.telefono || '',
    correo: user.correo,
    password: '', // No devolvemos hashes ni contraseñas desencriptadas al cliente por seguridad
    estado: user.estado === 1 ? 'activo' : 'inactivo'
  };
};

export const UserController = {
  // Login unificado para la API REST (para futuras llamadas de login JWT)
  async login(req: Request, res: Response) {
    try {
      const { correo, password } = req.body;
      
      const user = await UsuarioModel.getByEmail(correo);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'El correo electrónico no está registrado.',
          errors: []
        });
      }

      if (user.estado === 0) {
        return res.status(403).json({
          success: false,
          message: 'Su cuenta está inactiva. Contacte al administrador.',
          errors: []
        });
      }

      // Unificación con bcrypt para todos los usuarios
      const isMatch = await comparePassword(password, user.password || '');

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'La contraseña es incorrecta.',
          errors: []
        });
      }

      const frontendUser = mapUserToFrontend(user);
      const token = generateToken({
        id: user.id_usuario,
        rol: user.rol,
        correo: user.correo
      });

      // Configurar cookie segura opcional
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
      });

      return res.status(200).json({
        success: true,
        message: 'Sesión iniciada correctamente.',
        data: {
          user: frontendUser,
          token
        }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Error al iniciar sesión.',
        errors: []
      });
    }
  },

  // Registro de usuarios estándar
  async register(req: Request, res: Response) {
    try {
      const { rol, nombre1, nombre2, apellido1, apellido2, telefono, correo, password } = req.body;
      
      const existing = await UsuarioModel.getByEmail(correo);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'El correo ya está registrado por otro usuario.',
          errors: []
        });
      }

      const hashedPassword = await hashPassword(password);
      
      const insertId = await UsuarioModel.create({
        rol: mapRoleToBackend(rol),
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        telefono,
        correo,
        password: hashedPassword,
        estado: 1 // activo por defecto
      });

      const user = await UsuarioModel.getById(insertId);
      if (!user) throw new Error('Error al recuperar el usuario creado.');

      const frontendUser = mapUserToFrontend(user);
      const token = generateToken({
        id: user.id_usuario,
        rol: user.rol,
        correo: user.correo
      });

      return res.status(201).json({
        success: true,
        message: 'Usuario registrado con éxito.',
        data: {
          user: frontendUser,
          token
        }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Error al registrar el usuario.',
        errors: []
      });
    }
  },

  // Obtener perfil actual
  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) throw new Error('No autenticado.');
      const user = await UsuarioModel.getById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado.',
          errors: []
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Perfil recuperado.',
        data: mapUserToFrontend(user)
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
        errors: []
      });
    }
  },

  // Actualizar perfil del usuario logueado
  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) throw new Error('No autenticado.');
      const id = req.user.id;
      const { nombre1, nombre2, apellido1, apellido2, telefono, correo, password } = req.body;

      const updateData: Partial<UsuarioDB> = {};
      if (nombre1 !== undefined) updateData.nombre1 = nombre1;
      if (nombre2 !== undefined) updateData.nombre2 = nombre2;
      if (apellido1 !== undefined) updateData.apellido1 = apellido1;
      if (apellido2 !== undefined) updateData.apellido2 = apellido2;
      if (telefono !== undefined) updateData.telefono = telefono;
      if (correo !== undefined) updateData.correo = correo;
      if (password && password.trim() !== '') {
        updateData.password = await hashPassword(password);
      }

      await UsuarioModel.update(id, updateData);
      const updatedUser = await UsuarioModel.getById(id);
      if (!updatedUser) throw new Error('Usuario no encontrado.');

      return res.status(200).json({
        success: true,
        message: 'Perfil actualizado correctamente.',
        data: mapUserToFrontend(updatedUser)
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Error al actualizar perfil.',
        errors: []
      });
    }
  },

  // CRUD Administrativo
  async getAll(req: Request, res: Response) {
    try {
      const users = await UsuarioModel.getAll();
      return res.status(200).json({
        success: true,
        message: 'Usuarios recuperados correctamente.',
        data: users.map(mapUserToFrontend)
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
        errors: []
      });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await UsuarioModel.getById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado.',
          errors: []
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Usuario recuperado.',
        data: mapUserToFrontend(user)
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
        errors: []
      });
    }
  },

  async getByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const user = await UsuarioModel.getByEmail(email);
      if (!user) {
        return res.status(200).json({
          success: true,
          message: 'Usuario no registrado.',
          data: null
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Usuario recuperado.',
        data: mapUserToFrontend(user)
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
        errors: []
      });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const { rol, nombre1, nombre2, apellido1, apellido2, telefono, correo, password, estado } = req.body;
      const existing = await UsuarioModel.getByEmail(correo);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'El correo electrónico ya está registrado.',
          errors: []
        });
      }

      const hashedPassword = await hashPassword(password || 'User123*');
      const insertId = await UsuarioModel.create({
        rol: mapRoleToBackend(rol),
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        telefono,
        correo,
        password: hashedPassword,
        estado: estado === 'activo' || estado === 1 ? 1 : 0
      });

      const user = await UsuarioModel.getById(insertId);
      if (!user) throw new Error('Error al crear usuario.');
      return res.status(201).json({
        success: true,
        message: 'Usuario creado correctamente.',
        data: mapUserToFrontend(user)
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
        errors: []
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const { rol, nombre1, nombre2, apellido1, apellido2, telefono, correo, password, estado } = req.body;

      const updateData: Partial<UsuarioDB> = {};
      if (rol !== undefined) updateData.rol = mapRoleToBackend(rol);
      if (nombre1 !== undefined) updateData.nombre1 = nombre1;
      if (nombre2 !== undefined) updateData.nombre2 = nombre2;
      if (apellido1 !== undefined) updateData.apellido1 = apellido1;
      if (apellido2 !== undefined) updateData.apellido2 = apellido2;
      if (telefono !== undefined) updateData.telefono = telefono;
      if (correo !== undefined) updateData.correo = correo;
      if (estado !== undefined) updateData.estado = estado === 'activo' || estado === 1 ? 1 : 0;
      if (password && password.trim() !== '') {
        updateData.password = await hashPassword(password);
      }

      const ok = await UsuarioModel.update(id, updateData);
      if (!ok) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado.',
          errors: []
        });
      }

      const user = await UsuarioModel.getById(id);
      if (!user) throw new Error('Usuario no encontrado.');
      return res.status(200).json({
        success: true,
        message: 'Usuario actualizado correctamente.',
        data: mapUserToFrontend(user)
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
        errors: []
      });
    }
  },

  async getVolunteersCount(req: Request, res: Response) {
    try {
      const users = await UsuarioModel.getAll();
      const count = users.filter(u => u.rol === 'Voluntario').length;
      return res.status(200).json({
        success: true,
        message: 'Conteo de voluntarios obtenido correctamente.',
        data: count
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
        errors: []
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id, 10);
      const ok = await UsuarioModel.delete(id);
      if (!ok) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado.',
          errors: []
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Usuario eliminado correctamente.',
        data: { id }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
        errors: []
      });
    }
  }
};
