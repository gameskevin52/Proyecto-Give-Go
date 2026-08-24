import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, getDbStatus } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const JWT_SECRET = process.env.JWT_SECRET || 'giveandgo_secret_key_2026';

export const loginUser = async (req: Request, res: Response) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos' });
  }

  const dbStatus = getDbStatus();
  if (!dbStatus.connected) {
    return res.status(503).json({
      error: 'La base de datos MySQL no está disponible. Asegúrate de iniciar XAMPP/MySQL.',
      dbStatus,
    });
  }

  try {
    // 1. Buscar primero en la tabla `usuarios`
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM usuarios WHERE correo = ? AND estado = 1',
      [correo]
    );

    let user: any = rows[0];
    let isOrganization = false;

    // 2. Si no se encuentra en `usuarios`, buscar en `organizaciones`
    if (!user) {
      const [orgRows] = await db.execute<RowDataPacket[]>(
        'SELECT * FROM organizaciones WHERE correo = ? AND estado = 1',
        [correo]
      );
      if (orgRows.length > 0) {
        user = orgRows[0];
        isOrganization = true;
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas o usuario inactivo' });
    }

    // Comprobar contraseña (soporta hash bcrypt y texto plano para desarrollo)
    let passwordValid = false;
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      passwordValid = await bcrypt.compare(password, user.password);
    } else {
      passwordValid = password === user.password;
    }

    if (!passwordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const userId = isOrganization ? user.id_organizacion : user.id_usuario;
    const userRole = isOrganization
      ? 'Organizacion'
      : (user.rol as 'Admin' | 'Voluntario' | 'Beneficiario' | 'Organizacion');

    const token = jwt.sign(
      {
        id: userId,
        correo: user.correo,
        rol: userRole,
        isOrganization,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Preparar objeto de usuario limpiando la contraseña
    const userData = { ...user };
    delete userData.password;

    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: userId,
        rol: userRole,
        nombre: isOrganization ? user.nombre : `${user.nombre1} ${user.apellido1}`.trim(),
        nombre1: user.nombre1 || user.nombre,
        apellido1: user.apellido1 || '',
        correo: user.correo,
        telefono: user.telefono,
        direccion: user.direccion,
        barrio: user.barrio,
        localidad: user.localidad,
        ciudad: user.ciudad || 'Bogotá',
        isOrganization,
        verificada: user.verificada || 0,
        detalles: userData,
      },
    });
  } catch (error: any) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno del servidor al autenticar', details: error.message });
  }
};

export const registerUser = async (req: Request, res: Response) => {
  const {
    rol,
    nombre1,
    nombre2,
    apellido1,
    apellido2,
    tipo_documento,
    num_documento,
    fecha_nacimiento,
    telefono,
    correo,
    password,
    direccion,
    barrio,
    localidad,
    ciudad = 'Bogotá',
    departamento = 'Bogotá D.C.',
    pais = 'Colombia',
  } = req.body;

  if (!correo || !password || !nombre1 || !apellido1 || !rol) {
    return res.status(400).json({
      error: 'Campos requeridos incompletos (rol, nombre1, apellido1, correo y password son obligatorios)',
    });
  }

  // Validar enum de rol
  const allowedRoles = ['Admin', 'Voluntario', 'Beneficiario', 'Organizacion'];
  if (!allowedRoles.includes(rol)) {
    return res.status(400).json({ error: `El rol debe ser uno de: ${allowedRoles.join(', ')}` });
  }

  const dbStatus = getDbStatus();
  if (!dbStatus.connected) {
    return res.status(503).json({
      error: 'La base de datos MySQL no está disponible. Verifica la conexión a XAMPP.',
    });
  }

  try {
    // Verificar que el correo no esté registrado
    const [existing] = await db.execute<RowDataPacket[]>(
      'SELECT id_usuario FROM usuarios WHERE correo = ?',
      [correo]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: 'El correo electrónico ya se encuentra registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO usuarios (
        rol, nombre1, nombre2, apellido1, apellido2,
        tipo_documento, num_documento, fecha_nacimiento, telefono, correo,
        password, direccion, barrio, localidad, ciudad, departamento, pais, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        rol,
        nombre1,
        nombre2 || null,
        apellido1,
        apellido2 || null,
        tipo_documento || 'CC',
        num_documento || null,
        fecha_nacimiento || null,
        telefono || null,
        correo,
        hashedPassword,
        direccion || null,
        barrio || null,
        localidad || null,
        ciudad,
        departamento,
        pais,
      ]
    );

    const newUserId = result.insertId;

    const token = jwt.sign(
      { id: newUserId, correo, rol, isOrganization: false },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      message: 'Usuario registrado exitosamente en MySQL',
      token,
      user: {
        id: newUserId,
        rol,
        nombre: `${nombre1} ${apellido1}`.trim(),
        nombre1,
        apellido1,
        correo,
        telefono,
        ciudad,
      },
    });
  } catch (error: any) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ error: 'Error al registrar usuario en la base de datos', details: error.message });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    if (decoded.isOrganization) {
      const [orgs] = await db.execute<RowDataPacket[]>(
        'SELECT id_organizacion, nombre, correo, telefono, direccion, barrio, localidad, ciudad, nit, verificada, estado_verificacion FROM organizaciones WHERE id_organizacion = ?',
        [decoded.id]
      );
      if (orgs.length === 0) return res.status(404).json({ error: 'Organización no encontrada' });
      return res.json({ user: { ...orgs[0], rol: 'Organizacion', isOrganization: true } });
    } else {
      const [users] = await db.execute<RowDataPacket[]>(
        'SELECT id_usuario, rol, nombre1, nombre2, apellido1, apellido2, correo, telefono, direccion, barrio, localidad, ciudad FROM usuarios WHERE id_usuario = ?',
        [decoded.id]
      );
      if (users.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
      const u = users[0];
      return res.json({
        user: {
          id: u.id_usuario,
          rol: u.rol,
          nombre: `${u.nombre1} ${u.apellido1}`.trim(),
          correo: u.correo,
          telefono: u.telefono,
          isOrganization: false,
        },
      });
    }
  } catch (err: any) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
