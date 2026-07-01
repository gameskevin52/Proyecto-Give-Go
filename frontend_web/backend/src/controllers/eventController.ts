import { Request, Response } from 'express';
import { EventoModel } from '../models/eventoModel';
import { CategoriaModel } from '../models/categoriaModel';

const mapEventToFrontend = (evt: any) => {
  let estadoStr = 'activo';
  if (evt.estado === 2) estadoStr = 'finalizado';
  if (evt.estado === 0) estadoStr = 'cancelado';

  return {
    id: `evt_${evt.id_evento}`,
    nombre: evt.nombre,
    categoria: evt.categoria_nombre || 'General',
    descripcion: evt.descripcion || '',
    direccion: evt.direccion || '',
    fecha: evt.fecha,
    estado: estadoStr,
    organizacionId: `org_${evt.organizacion_id}`
  };
};

const mapUserToFrontend = (user: any) => {
  return {
    id: String(user.id_usuario),
    rol: user.rol.toLowerCase(),
    nombre1: user.nombre1,
    nombre2: user.nombre2 || '',
    apellido1: user.apellido1,
    apellido2: user.apellido2 || '',
    telefono: user.telefono || '',
    correo: user.correo,
    estado: user.estado === 1 ? 'activo' : 'inactivo'
  };
};

export const EventController = {
  async getAll(req: Request, res: Response) {
    try {
      const events = await EventoModel.getAll();
      return res.status(200).json({
        success: true,
        message: 'Eventos recuperados con éxito.',
        data: events.map(mapEventToFrontend)
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
      const rawId = req.params.id;
      const id = parseInt(rawId.replace('evt_', ''), 10);
      
      const evt = await EventoModel.getById(id);
      if (!evt) {
        return res.status(404).json({
          success: false,
          message: 'Evento no encontrado.',
          errors: []
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Evento recuperado.',
        data: mapEventToFrontend(evt)
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
      const { nombre, categoria, descripcion, direccion, fecha, cupo, estado, organizacionId } = req.body;
      
      const orgId = parseInt(String(organizacionId).replace('org_', ''), 10);
      
      // Intentar buscar la categoría por nombre, si no existe buscar por ID, o crear/usar por defecto 1
      let catId = 1;
      const matchedCat = await CategoriaModel.getByName(categoria);
      if (matchedCat) {
        catId = matchedCat.id_categoria;
      } else {
        const checkId = parseInt(categoria.replace('cat_', ''), 10);
        if (!isNaN(checkId)) {
          catId = checkId;
        }
      }

      let estadoInt = 1;
      if (estado === 'finalizado') estadoInt = 2;
      if (estado === 'cancelado') estadoInt = 0;

      const insertId = await EventoModel.create({
        nombre,
        id_categoria: catId,
        descripcion,
        direccion,
        fecha,
        cupo: cupo ? parseInt(String(cupo), 10) : 0,
        estado: estadoInt,
        organizacion_id: orgId
      });

      const evt = await EventoModel.getById(insertId);
      if (!evt) throw new Error('Error al recuperar el evento creado.');

      return res.status(201).json({
        success: true,
        message: 'Evento creado con éxito.',
        data: mapEventToFrontend(evt)
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Error al crear evento.',
        errors: []
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const rawId = req.params.id;
      const id = parseInt(rawId.replace('evt_', ''), 10);
      const { nombre, categoria, descripcion, direccion, fecha, cupo, estado, organizacionId } = req.body;

      const updateData: any = {};
      if (nombre !== undefined) updateData.nombre = nombre;
      if (descripcion !== undefined) updateData.descripcion = descripcion;
      if (direccion !== undefined) updateData.direccion = direccion;
      if (fecha !== undefined) updateData.fecha = fecha;
      if (cupo !== undefined) updateData.cupo = parseInt(String(cupo), 10);
      
      if (organizacionId !== undefined) {
        updateData.organizacion_id = parseInt(String(organizacionId).replace('org_', ''), 10);
      }

      if (categoria !== undefined) {
        const matchedCat = await CategoriaModel.getByName(categoria);
        if (matchedCat) {
          updateData.id_categoria = matchedCat.id_categoria;
        } else {
          const checkId = parseInt(categoria.replace('cat_', ''), 10);
          if (!isNaN(checkId)) {
            updateData.id_categoria = checkId;
          }
        }
      }

      if (estado !== undefined) {
        let estadoInt = 1;
        if (estado === 'finalizado') estadoInt = 2;
        if (estado === 'cancelado') estadoInt = 0;
        updateData.estado = estadoInt;
      }

      const ok = await EventoModel.update(id, updateData);
      if (!ok) {
        return res.status(404).json({
          success: false,
          message: 'Evento no encontrado.',
          errors: []
        });
      }

      const evt = await EventoModel.getById(id);
      if (!evt) throw new Error('Evento no encontrado.');

      return res.status(200).json({
        success: true,
        message: 'Evento actualizado con éxito.',
        data: mapEventToFrontend(evt)
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
      const rawId = req.params.id;
      const id = parseInt(rawId.replace('evt_', ''), 10);

      const ok = await EventoModel.delete(id);
      if (!ok) {
        return res.status(404).json({
          success: false,
          message: 'Evento no encontrado.',
          errors: []
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Evento eliminado con éxito.',
        data: { id: `evt_${id}` }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
        errors: []
      });
    }
  },

  // Obtener participantes registrados de un evento
  async getParticipants(req: Request, res: Response) {
    try {
      const rawId = req.params.id;
      const id = parseInt(rawId.replace('evt_', ''), 10);

      const participants = await EventoModel.getParticipants(id);
      return res.status(200).json({
        success: true,
        message: 'Participantes del evento recuperados.',
        data: participants.map(mapUserToFrontend)
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
        errors: []
      });
    }
  },

  // Registrar inscripción de voluntario
  async registerParticipant(req: Request, res: Response) {
    try {
      const rawId = req.params.id;
      const id = parseInt(rawId.replace('evt_', ''), 10);
      const { usuarioId } = req.body;
      const uId = parseInt(String(usuarioId).replace('usr_', ''), 10);

      const ok = await EventoModel.registerParticipant(id, uId);
      if (!ok) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo realizar la inscripción. Es posible que ya esté inscrito.',
          errors: []
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Inscripción realizada con éxito.',
        data: { inscrito: true }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
        errors: []
      });
    }
  },

  // Cancelar inscripción
  async unregisterParticipant(req: Request, res: Response) {
    try {
      const rawId = req.params.id;
      const id = parseInt(rawId.replace('evt_', ''), 10);
      const { usuarioId } = req.body;
      const uId = parseInt(String(usuarioId).replace('usr_', ''), 10);

      const ok = await EventoModel.unregisterParticipant(id, uId);
      if (!ok) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo cancelar la inscripción.',
          errors: []
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Inscripción cancelada con éxito.',
        data: { inscrito: false }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
        errors: []
      });
    }
  },

  // Obtener eventos inscritos de un voluntario
  async getEventsByVolunteer(req: Request, res: Response) {
    try {
      const rawUserId = req.params.usuarioId;
      const usuarioId = parseInt(rawUserId.replace('usr_', ''), 10);

      const events = await EventoModel.getEventsByVolunteer(usuarioId);
      return res.status(200).json({
        success: true,
        message: 'Eventos del voluntario recuperados.',
        data: events.map(mapEventToFrontend)
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
