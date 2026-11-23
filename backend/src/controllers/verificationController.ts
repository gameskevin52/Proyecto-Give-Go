import { Request, Response } from 'express';
import { SolicitudVerificacionModel, SolicitudVerificacionDB } from '../models/solicitudVerificacionModel';
import { OrganizacionModel } from '../models/organizacionModel';
import { UsuarioModel } from '../models/usuarioModel';
import { logAudit } from '../utils/auditLogger';

const mapRequestToFrontend = (req: SolicitudVerificacionDB) => {
  return {
    id: `ver_${req.id_solicitud}`,
    id_solicitud: req.id_solicitud,
    organizacionId: `org_${req.organizacion_id}`,
    id_organizacion: req.organizacion_id,
    nombreOrganizacion: req.nombre_organizacion,
    correoOrganizacion: req.correo_organizacion,
    nit: req.nit || '',
    mensaje: req.mensaje || '',
    documentos: req.documentos || '',
    estado: req.estado,
    respuestaAdmin: req.respuesta_admin || '',
    fechaSolicitud: req.fecha_solicitud || new Date().toISOString(),
    fechaRespuesta: req.fecha_respuesta || null
  };
};

export const VerificationController = {
  async getAll(req: Request, res: Response) {
    try {
      const requests = await SolicitudVerificacionModel.getAll();
      return res.status(200).json({
        success: true,
        message: 'Solicitudes de verificación recuperadas.',
        data: requests.map(mapRequestToFrontend)
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Error al obtener las solicitudes.',
        errors: []
      });
    }
  },

  async getOrgStatus(req: Request, res: Response) {
    try {
      const rawId = req.params.orgId;
      const orgId = parseInt(String(rawId).replace('org_', '').replace('usr_', ''), 10);

      let org = !isNaN(orgId) ? await OrganizacionModel.getById(orgId) : null;
      if (!org && !isNaN(orgId)) {
        const linkedUser = await UsuarioModel.getById(orgId);
        if (linkedUser && linkedUser.correo) {
          org = await OrganizacionModel.getByEmail(linkedUser.correo);
        }
      }

      if (!org) {
        return res.status(200).json({
          success: true,
          message: 'Estado de verificación recuperado.',
          data: {
            verificada: false,
            estadoVerificacion: 'no_solicitado',
            activeRequest: null
          }
        });
      }

      const latestReq = await SolicitudVerificacionModel.getLatestByOrgId(org.id_organizacion);
      const isVerified = Boolean(org.verificada);
      const estadoVerificacion = org.estado_verificacion || (isVerified ? 'aprobada' : 'no_solicitado');

      return res.status(200).json({
        success: true,
        message: 'Estado de verificación recuperado.',
        data: {
          verificada: isVerified,
          estadoVerificacion,
          activeRequest: latestReq ? mapRequestToFrontend(latestReq) : null
        }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
        errors: []
      });
    }
  },

  async createRequest(req: Request, res: Response) {
    try {
      const { organizacionId, nit, mensaje, documentos } = req.body;
      if (!organizacionId) {
        return res.status(400).json({
          success: false,
          message: 'El ID de la organización es obligatorio.',
          errors: []
        });
      }

      const parsedId = parseInt(String(organizacionId).replace('org_', '').replace('usr_', ''), 10);
      let org = !isNaN(parsedId) ? await OrganizacionModel.getById(parsedId) : null;
      if (!org && !isNaN(parsedId)) {
        const linkedUser = await UsuarioModel.getById(parsedId);
        if (linkedUser && linkedUser.correo) {
          org = await OrganizacionModel.getByEmail(linkedUser.correo);
        }
      }
      if (!org) {
        return res.status(404).json({
          success: false,
          message: 'La organización especificada no existe.',
          errors: []
        });
      }
      const orgId = org.id_organizacion;

      // Verificar si ya existe una solicitud pendiente
      const pending = await SolicitudVerificacionModel.getPendingByOrgId(orgId);
      if (pending) {
        return res.status(400).json({
          success: false,
          message: 'Ya tienes una solicitud de verificación pendiente de revisión por el administrador.',
          errors: []
        });
      }

      const insertId = await SolicitudVerificacionModel.create({
        organizacion_id: orgId,
        nombre_organizacion: org.nombre,
        correo_organizacion: org.correo,
        nit: nit || org.nit || '',
        mensaje: mensaje || '',
        documentos: documentos || '',
        estado: 'pendiente'
      });

      // Actualizar estado en la organización
      await OrganizacionModel.update(orgId, {
        estado_verificacion: 'pendiente',
        ...(nit ? { nit } : {})
      });

      await logAudit(
        typeof orgId === 'number' ? orgId : 1,
        `Solicitud de verificación enviada por la organización "${org.nombre}"`
      );

      const created = await SolicitudVerificacionModel.getById(insertId);
      return res.status(201).json({
        success: true,
        message: 'Solicitud de verificación enviada exitosamente.',
        data: created ? mapRequestToFrontend(created) : null
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Error al enviar la solicitud de verificación.',
        errors: []
      });
    }
  },

  async respondRequest(req: Request, res: Response) {
    try {
      const rawId = req.params.id;
      const requestId = parseInt(rawId.replace('ver_', ''), 10);
      const { estado, respuestaAdmin } = req.body;

      if (!['aprobada', 'rechazada'].includes(estado)) {
        return res.status(400).json({
          success: false,
          message: 'Estado inválido. Debe ser "aprobada" o "rechazada".',
          errors: []
        });
      }

      const verificationReq = await SolicitudVerificacionModel.getById(requestId);
      if (!verificationReq) {
        return res.status(404).json({
          success: false,
          message: 'Solicitud de verificación no encontrada.',
          errors: []
        });
      }

      const ok = await SolicitudVerificacionModel.updateStatus(requestId, estado as 'aprobada' | 'rechazada', respuestaAdmin);
      if (!ok) {
        return res.status(500).json({
          success: false,
          message: 'No se pudo actualizar el estado de la solicitud.',
          errors: []
        });
      }

      // Actualizar la organización
      const isApproved = estado === 'aprobada';
      await OrganizacionModel.update(verificationReq.organizacion_id, {
        verificada: isApproved ? 1 : 0,
        estado_verificacion: estado
      });

      const reqUser = (req as any).user;
      const adminUserId = reqUser ? reqUser.id : 1;
      const adminUserName = reqUser ? `${reqUser.nombre1} ${reqUser.apellido1 || ''}`.trim() : 'Administrador General';

      await logAudit(
        typeof adminUserId === 'number' ? adminUserId : 1,
        `Solicitud de verificación ${estado === 'aprobada' ? 'APROBADA' : 'RECHAZADA'} para la organización "${verificationReq.nombre_organizacion}"`
      );

      const updated = await SolicitudVerificacionModel.getById(requestId);
      return res.status(200).json({
        success: true,
        message: `Solicitud de verificación ${estado === 'aprobada' ? 'aprobada' : 'rechazada'} correctamente.`,
        data: updated ? mapRequestToFrontend(updated) : null
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Error al responder a la solicitud de verificación.',
        errors: []
      });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const rawId = req.params.id;
      const requestId = parseInt(rawId.replace('ver_', ''), 10);
      const item = await SolicitudVerificacionModel.getById(requestId);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Solicitud no encontrada.',
          errors: []
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Solicitud obtenida con éxito.',
        data: mapRequestToFrontend(item)
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
      const rawId = req.params.id;
      const requestId = parseInt(rawId.replace('ver_', ''), 10);
      const { nit, mensaje, documentos, estado, respuestaAdmin } = req.body;

      const item = await SolicitudVerificacionModel.getById(requestId);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Solicitud de verificación no encontrada.',
          errors: []
        });
      }

      const updateData: any = {};
      if (nit !== undefined) updateData.nit = nit;
      if (mensaje !== undefined) updateData.mensaje = mensaje;
      if (documentos !== undefined) updateData.documentos = documentos;
      if (estado !== undefined) updateData.estado = estado;
      if (respuestaAdmin !== undefined) updateData.respuesta_admin = respuestaAdmin;

      await SolicitudVerificacionModel.update(requestId, updateData);

      if (estado === 'aprobada' || estado === 'rechazada') {
        await OrganizacionModel.update(item.organizacion_id, {
          verificada: estado === 'aprobada' ? 1 : 0,
          estado_verificacion: estado
        });
      }

      const updated = await SolicitudVerificacionModel.getById(requestId);
      return res.status(200).json({
        success: true,
        message: 'Solicitud de verificación actualizada exitosamente.',
        data: updated ? mapRequestToFrontend(updated) : null
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Error al actualizar solicitud.',
        errors: []
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const rawId = req.params.id;
      const requestId = parseInt(rawId.replace('ver_', ''), 10);
      const item = await SolicitudVerificacionModel.getById(requestId);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Solicitud no encontrada.',
          errors: []
        });
      }

      await SolicitudVerificacionModel.delete(requestId);
      return res.status(200).json({
        success: true,
        message: 'Solicitud de verificación eliminada correctamente.',
        data: { id: rawId }
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Error al eliminar solicitud.',
        errors: []
      });
    }
  }
};
