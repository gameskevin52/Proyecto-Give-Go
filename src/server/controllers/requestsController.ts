import { Request, Response } from 'express';
import { db, getDbStatus } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getRequests = async (req: Request, res: Response) => {
  const dbStatus = getDbStatus();
  if (!dbStatus.connected) {
    return res.status(503).json({ error: 'Base de datos MySQL desconectada' });
  }

  try {
    const query = `
      SELECT 
        s.id_solicitud,
        s.usuario_id,
        s.titulo,
        s.descripcion,
        s.estado,
        s.fecha,
        CONCAT(u.nombre1, ' ', u.apellido1) AS usuario_nombre,
        u.correo AS usuario_correo,
        u.barrio AS usuario_barrio
      FROM solicitudes s
      LEFT JOIN usuarios u ON s.usuario_id = u.id_usuario
      ORDER BY s.fecha DESC
    `;

    const [rows] = await db.execute<RowDataPacket[]>(query);
    return res.json({ requests: rows });
  } catch (error: any) {
    console.error('Error al obtener solicitudes:', error);
    return res.status(500).json({ error: 'Error al consultar solicitudes', details: error.message });
  }
};

export const createRequest = async (req: Request, res: Response) => {
  const { usuario_id, titulo, descripcion } = req.body;

  if (!usuario_id || !titulo || !descripcion) {
    return res.status(400).json({ error: 'usuario_id, titulo y descripcion son obligatorios' });
  }

  const dbStatus = getDbStatus();
  if (!dbStatus.connected) {
    return res.status(503).json({ error: 'Base de datos MySQL desconectada' });
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO solicitudes (usuario_id, titulo, descripcion, estado)
       VALUES (?, ?, ?, 'Pendiente')`,
      [usuario_id, titulo, descripcion]
    );

    return res.status(201).json({
      message: 'Solicitud creada con éxito en MySQL',
      id_solicitud: result.insertId,
      estado: 'Pendiente',
    });
  } catch (error: any) {
    console.error('Error al crear solicitud:', error);
    return res.status(500).json({ error: 'Error al crear solicitud', details: error.message });
  }
};
