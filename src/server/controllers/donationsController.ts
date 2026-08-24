import { Request, Response } from 'express';
import { db, getDbStatus } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// 1. Crear Donación Monetaria con Transacción ACID MySQL
export const createMonetaryDonation = async (req: Request, res: Response) => {
  const {
    usuario_id = 2, // Usuario predeterminado si no se pasa uno en la petición
    organizacion_id = 1,
    categoria = 'Económico',
    metodo = 'pse',
    cuenta = 'Cuenta Principal',
    valor,
    observaciones = 'Donación monetaria efectuada desde la app móvil',
  } = req.body;

  if (!valor || isNaN(Number(valor)) || Number(valor) <= 0) {
    return res.status(400).json({ error: 'El valor de la donación debe ser un número mayor a 0' });
  }

  const dbStatus = getDbStatus();
  if (!dbStatus.connected) {
    return res.status(503).json({
      error: 'Base de datos MySQL desconectada. No se pudo registrar la donación.',
    });
  }

  // Normalizar IDs
  const parsedUserId = parseInt(String(usuario_id).replace(/\D/g, ''), 10) || 2;
  let parsedOrgId = parseInt(String(organizacion_id).replace(/\D/g, ''), 10) || 1;

  if (isNaN(parsedOrgId) || parsedOrgId <= 0) parsedOrgId = 1;

  const connection = await db.getConnection();

  try {
    // Iniciar Transacción SQL
    await connection.beginTransaction();

    // Validar existencia de la organización
    const [orgCheck] = await connection.execute<RowDataPacket[]>(
      'SELECT id_organizacion FROM organizaciones WHERE id_organizacion = ?',
      [parsedOrgId]
    );

    const targetOrgId = orgCheck.length > 0 ? parsedOrgId : 1;

    // A. Insertar en tabla principal `donaciones`
    const [donacionResult] = await connection.execute<ResultSetHeader>(
      `INSERT INTO donaciones (categoria, tipo, usuario_id, organizacion_id, estado, observaciones)
       VALUES (?, 'Monetaria', ?, ?, 1, ?)`,
      [categoria, parsedUserId, targetOrgId, observaciones]
    );

    const idDonacion = donacionResult.insertId;

    // B. Insertar en tabla especifica `donaciones_monetarias`
    await connection.execute<ResultSetHeader>(
      `INSERT INTO donaciones_monetarias (metodo, cuenta, valor, donacion_id)
       VALUES (?, ?, ?, ?)`,
      [metodo, cuenta, valor, idDonacion]
    );

    // Confirmar Transacción
    await connection.commit();
    connection.release();

    const trackingNumber = `GG-2026-${idDonacion.toString().padStart(4, '0')}`;

    return res.status(201).json({
      message: 'Donación monetaria registrada con éxito en MySQL',
      id_donacion: idDonacion,
      trackingNumber,
      tipo: 'Monetaria',
      valor,
      metodo,
      organizacion_id: targetOrgId,
    });
  } catch (error: any) {
    // Deshacer cambios en caso de error
    await connection.rollback();
    connection.release();
    console.error('Error en transacción de donación monetaria:', error);
    return res.status(500).json({
      error: 'Error de servidor al guardar la donación monetaria',
      details: error.message,
    });
  }
};

// 2. Crear Donación de Objetos con Transacción ACID MySQL
export const createObjectDonation = async (req: Request, res: Response) => {
  const {
    usuario_id = 2,
    organizacion_id = 1,
    categoria = 'Alimentos',
    descripcion,
    cantidad = 1,
    observaciones = 'Donación de objeto/especie efectuada desde la app móvil',
  } = req.body;

  if (!descripcion || !descripcion.trim()) {
    return res.status(400).json({ error: 'La descripción del objeto a donar es obligatoria' });
  }

  const dbStatus = getDbStatus();
  if (!dbStatus.connected) {
    return res.status(503).json({
      error: 'Base de datos MySQL desconectada. No se pudo registrar la donación.',
    });
  }

  const parsedUserId = parseInt(String(usuario_id).replace(/\D/g, ''), 10) || 2;
  let parsedOrgId = parseInt(String(organizacion_id).replace(/\D/g, ''), 10) || 1;
  if (isNaN(parsedOrgId) || parsedOrgId <= 0) parsedOrgId = 1;

  const connection = await db.getConnection();

  try {
    // Iniciar Transacción SQL
    await connection.beginTransaction();

    const [orgCheck] = await connection.execute<RowDataPacket[]>(
      'SELECT id_organizacion FROM organizaciones WHERE id_organizacion = ?',
      [parsedOrgId]
    );

    const targetOrgId = orgCheck.length > 0 ? parsedOrgId : 1;

    // A. Insertar en tabla principal `donaciones`
    const [donacionResult] = await connection.execute<ResultSetHeader>(
      `INSERT INTO donaciones (categoria, tipo, usuario_id, organizacion_id, estado, observaciones)
       VALUES (?, 'Objeto', ?, ?, 1, ?)`,
      [categoria, parsedUserId, targetOrgId, observaciones]
    );

    const idDonacion = donacionResult.insertId;

    // B. Insertar en tabla específica `donaciones_objetos`
    await connection.execute<ResultSetHeader>(
      `INSERT INTO donaciones_objetos (categoria, descripcion, cantidad, donacion_id)
       VALUES (?, ?, ?, ?)`,
      [categoria, descripcion, cantidad, idDonacion]
    );

    // Confirmar Transacción
    await connection.commit();
    connection.release();

    const trackingNumber = `GG-2026-${idDonacion.toString().padStart(4, '0')}`;

    return res.status(201).json({
      message: 'Donación de objeto registrada con éxito en MySQL',
      id_donacion: idDonacion,
      trackingNumber,
      tipo: 'Objeto',
      descripcion,
      cantidad,
      organizacion_id: targetOrgId,
    });
  } catch (error: any) {
    await connection.rollback();
    connection.release();
    console.error('Error en transacción de donación de objeto:', error);
    return res.status(500).json({
      error: 'Error de servidor al guardar la donación de objeto',
      details: error.message,
    });
  }
};

// 3. Obtener todas las donaciones registradas con JOINs
export const getDonations = async (req: Request, res: Response) => {
  const dbStatus = getDbStatus();
  if (!dbStatus.connected) {
    return res.status(503).json({ error: 'Base de datos MySQL desconectada' });
  }

  try {
    const query = `
      SELECT 
        d.id_donacion,
        d.categoria,
        d.tipo,
        d.fecha,
        d.usuario_id,
        d.organizacion_id,
        d.estado,
        d.observaciones,
        CONCAT(u.nombre1, ' ', u.apellido1) AS usuario_nombre,
        u.correo AS usuario_correo,
        o.nombre AS organizacion_nombre,
        o.logo AS organizacion_logo,
        dm.metodo AS monetario_metodo,
        dm.cuenta AS monetario_cuenta,
        dm.valor AS monetario_valor,
        dob.categoria AS objeto_categoria,
        dob.descripcion AS objeto_descripcion,
        dob.cantidad AS objeto_cantidad
      FROM donaciones d
      LEFT JOIN usuarios u ON d.usuario_id = u.id_usuario
      LEFT JOIN organizaciones o ON d.organizacion_id = o.id_organizacion
      LEFT JOIN donaciones_monetarias dm ON d.id_donacion = dm.donacion_id AND d.tipo = 'Monetaria'
      LEFT JOIN donaciones_objetos dob ON d.id_donacion = dob.donacion_id AND d.tipo = 'Objeto'
      ORDER BY d.fecha DESC
    `;

    const [rows] = await db.execute<RowDataPacket[]>(query);
    return res.json({ count: rows.length, donations: rows });
  } catch (error: any) {
    console.error('Error al consultar donaciones:', error);
    return res.status(500).json({ error: 'Error al consultar donaciones', details: error.message });
  }
};
