import { Request, Response } from 'express';
import { db, getDbStatus } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getAudits = async (req: Request, res: Response) => {
  const dbStatus = getDbStatus();
  if (!dbStatus.connected) {
    return res.status(503).json({ error: 'Base de datos MySQL desconectada' });
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT id_audit, fecha, accion, id_usuario, nombre_usuario, rol_usuario FROM auditorias ORDER BY id_audit DESC LIMIT 100'
    );
    return res.json({ audits: rows });
  } catch (error: any) {
    console.error('Error al consultar auditorías:', error);
    return res.status(500).json({ error: 'Error al consultar auditorías', details: error.message });
  }
};

export const createAudit = async (req: Request, res: Response) => {
  const { accion, id_usuario = 1, nombre_usuario = 'Usuario App', rol_usuario = 'Voluntario' } = req.body;

  if (!accion) {
    return res.status(400).json({ error: 'La acción es requerida para el registro de auditoría' });
  }

  const dbStatus = getDbStatus();
  if (!dbStatus.connected) {
    return res.status(503).json({ error: 'Base de datos MySQL desconectada' });
  }

  try {
    const fechaIso = new Date().toISOString();
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO auditorias (fecha, accion, id_usuario, nombre_usuario, rol_usuario)
       VALUES (?, ?, ?, ?, ?)`,
      [fechaIso, accion, id_usuario, nombre_usuario, rol_usuario]
    );

    return res.status(201).json({ message: 'Registro de auditoría guardado', id_audit: result.insertId });
  } catch (error: any) {
    console.error('Error al guardar auditoría:', error);
    return res.status(500).json({ error: 'Error al registrar auditoría', details: error.message });
  }
};
