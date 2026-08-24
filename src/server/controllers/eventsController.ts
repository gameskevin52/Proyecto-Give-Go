import { Request, Response } from 'express';
import { db, getDbStatus } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const getEvents = async (req: Request, res: Response) => {
  const dbStatus = getDbStatus();
  if (!dbStatus.connected) {
    return res.status(503).json({ error: 'Base de datos MySQL desconectada' });
  }

  try {
    const query = `
      SELECT 
        e.id_evento,
        e.nombre,
        e.descripcion,
        e.direccion,
        e.fecha,
        e.cupo,
        e.vacantes_voluntarios,
        e.vacantes_beneficiarios,
        e.ayuda_ofrecida,
        e.estado,
        e.barrio,
        e.localidad,
        e.ciudad,
        e.imagen,
        c.nombre AS categoria_nombre,
        o.id_organizacion,
        o.nombre AS organizacion_nombre,
        o.logo AS organizacion_logo
      FROM eventos e
      LEFT JOIN categorias c ON e.id_categoria = c.id_categoria
      LEFT JOIN organizaciones o ON e.organizacion_id = o.id_organizacion
      WHERE e.estado = 1
      ORDER BY e.fecha ASC
    `;

    const [rows] = await db.execute<RowDataPacket[]>(query);
    return res.json({ events: rows });
  } catch (error: any) {
    console.error('Error al consultar eventos:', error);
    return res.status(500).json({ error: 'Error al consultar eventos', details: error.message });
  }
};

export const applyToEvent = async (req: Request, res: Response) => {
  const { id_evento, id_usuario, tipo_postulacion = 'voluntario', observaciones } = req.body;

  if (!id_evento || !id_usuario) {
    return res.status(400).json({ error: 'id_evento e id_usuario son obligatorios' });
  }

  const dbStatus = getDbStatus();
  if (!dbStatus.connected) {
    return res.status(503).json({ error: 'Base de datos MySQL desconectada' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Insertar en `tabla_postulaciones`
    const [postulacionResult] = await connection.execute<ResultSetHeader>(
      `INSERT INTO tabla_postulaciones (id_evento, id_usuario, tipo_postulacion, estado_postulacion, observaciones)
       VALUES (?, ?, ?, 'pendiente', ?)
       ON DUPLICATE KEY UPDATE estado_postulacion = 'pendiente', observaciones = VALUES(observaciones)`,
      [id_evento, id_usuario, tipo_postulacion, observaciones || null]
    );

    // Insertar o actualizar en `seguimiento_eventos`
    await connection.execute(
      `INSERT INTO seguimiento_eventos (evento_id, usuario_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE fecha = CURRENT_TIMESTAMP`,
      [id_evento, id_usuario]
    );

    await connection.commit();
    connection.release();

    return res.status(201).json({
      message: 'Postulación registrada exitosamente en MySQL',
      id_postulacion: postulacionResult.insertId,
      id_evento,
      id_usuario,
    });
  } catch (error: any) {
    await connection.rollback();
    connection.release();
    console.error('Error al postularse al evento:', error);
    return res.status(500).json({ error: 'Error al procesar la postulación', details: error.message });
  }
};
