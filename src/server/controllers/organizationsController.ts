import { Request, Response } from 'express';
import { db, getDbStatus } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getOrganizations = async (req: Request, res: Response) => {
  const dbStatus = getDbStatus();
  if (!dbStatus.connected) {
    return res.status(503).json({ error: 'Base de datos MySQL desconectada' });
  }

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      'SELECT id_organizacion, nombre, direccion, telefono, correo, descripcion, nit, barrio, localidad, ciudad, categoria, logo, foto_portada, verificada, estado_verificacion FROM organizaciones WHERE estado = 1'
    );
    return res.json({ organizations: rows });
  } catch (error: any) {
    console.error('Error al obtener organizaciones:', error);
    return res.status(500).json({ error: 'Error al consultar organizaciones', details: error.message });
  }
};

export const requestVerification = async (req: Request, res: Response) => {
  const { organizacion_id, nombre_organizacion, correo_organizacion, nit, mensaje, documentos } = req.body;

  if (!organizacion_id || !nombre_organizacion || !correo_organizacion) {
    return res.status(400).json({ error: 'Campos obligatorios incompletos' });
  }

  const dbStatus = getDbStatus();
  if (!dbStatus.connected) {
    return res.status(503).json({ error: 'Base de datos MySQL desconectada' });
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `INSERT INTO solicitudes_verificacion (
        organizacion_id, nombre_organizacion, correo_organizacion, nit, mensaje, documentos, estado
      ) VALUES (?, ?, ?, ?, ?, ?, 'pendiente')`,
      [
        organizacion_id,
        nombre_organizacion,
        correo_organizacion,
        nit || null,
        mensaje || null,
        documentos || null,
      ]
    );

    await db.execute(
      `UPDATE organizaciones SET estado_verificacion = 'pendiente' WHERE id_organizacion = ?`,
      [organizacion_id]
    );

    return res.status(201).json({
      message: 'Solicitud de verificación enviada exitosamente',
      id_solicitud: result.insertId,
    });
  } catch (error: any) {
    console.error('Error en solicitud de verificación:', error);
    return res.status(500).json({ error: 'Error interno al registrar solicitud', details: error.message });
  }
};
