import { Request, Response } from 'express';
import { DonacionModel } from '../models/donacionModel';

const mapDonationToFrontend = (d: any) => {
  const isMonetary = d.tipo.toLowerCase() === 'monetaria';
  const donationId = `don_${d.id_donacion}`;

  // Formatear fecha de forma segura
  let fecha = new Date().toISOString().split('T')[0];
  if (d.fecha) {
    if (typeof d.fecha === 'string') {
      fecha = d.fecha.split('T')[0];
    } else if (d.fecha instanceof Date) {
      fecha = d.fecha.toISOString().split('T')[0];
    }
  }

  return {
    id: donationId,
    categoria: d.categoria || (isMonetary ? 'Económico' : d.objeto_categoria),
    tipo: isMonetary ? 'monetaria' : 'objeto',
    fecha: fecha,
    usuarioId: `usr_${d.usuario_id}`,
    organizacionId: `org_${d.organizacion_id}`,
    organizacionNombre: d.organizacion_nombre || 'Organización',
    usuarioNombre: `${d.usuario_nombre} ${d.usuario_apellido || ''}`.trim() || 'Donante Anónimo',
    monetaria: isMonetary && d.valor !== null ? {
      id: `dm_${d.id_donacion}`,
      metodo: d.metodo || 'tarjeta',
      cuenta: d.cuenta || '',
      valor: d.valor ? parseFloat(String(d.valor)) : 0,
      donacionId: donationId
    } : undefined,
    objeto: !isMonetary && d.cantidad !== null ? {
      id: `do_${d.id_donacion}`,
      categoria: d.objeto_categoria || d.categoria || '',
      descripcion: d.objeto_descripcion || '',
      cantidad: d.cantidad ? parseInt(String(d.cantidad), 10) : 0,
      donacionId: donationId
    } : undefined
  };
};

export const DonationController = {
  async getAll(req: Request, res: Response) {
    try {
      const list = await DonacionModel.getAll();
      return res.status(200).json({
        success: true,
        message: 'Donaciones recuperadas con éxito.',
        data: list.map(mapDonationToFrontend)
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
      const id = parseInt(rawId.replace('don_', ''), 10);

      const d = await DonacionModel.getById(id);
      if (!d) {
        return res.status(404).json({
          success: false,
          message: 'Donación no encontrada.',
          errors: []
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Donación recuperada.',
        data: mapDonationToFrontend(d)
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
        errors: []
      });
    }
  },

  async getByVolunteer(req: Request, res: Response) {
    try {
      const rawId = req.params.usuarioId;
      const id = parseInt(rawId.replace('usr_', ''), 10);

      const list = await DonacionModel.getByVolunteer(id);
      return res.status(200).json({
        success: true,
        message: 'Donaciones del voluntario recuperadas.',
        data: list.map(mapDonationToFrontend)
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
        errors: []
      });
    }
  },

  async getByOrganization(req: Request, res: Response) {
    try {
      const rawId = req.params.organizacionId;
      const id = parseInt(rawId.replace('org_', ''), 10);

      const list = await DonacionModel.getByOrganization(id);
      return res.status(200).json({
        success: true,
        message: 'Donaciones recibidas por la organización recuperadas.',
        data: list.map(mapDonationToFrontend)
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
        errors: []
      });
    }
  },

  async createMonetary(req: Request, res: Response) {
    try {
      const { donation, monetary } = req.body;
      
      const uId = parseInt(String(donation.usuarioId).replace('usr_', ''), 10);
      const orgId = parseInt(String(donation.organizacionId).replace('org_', ''), 10);

      const id_donacion = await DonacionModel.createMonetary({
        categoria: donation.categoria || 'Económico',
        usuario_id: uId,
        organizacion_id: orgId,
        estado: 1,
        observaciones: donation.observaciones || ''
      }, {
        metodo: monetary.metodo,
        cuenta: monetary.cuenta || '',
        valor: parseFloat(String(monetary.valor))
      });

      const d = await DonacionModel.getById(id_donacion);
      if (!d) throw new Error('Error al recuperar la donación monetaria creada.');

      return res.status(201).json({
        success: true,
        message: 'Donación monetaria registrada con éxito.',
        data: mapDonationToFrontend(d)
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Error al registrar donación monetaria.',
        errors: []
      });
    }
  },

  async createObject(req: Request, res: Response) {
    try {
      const { donation, objectDetail } = req.body;
      
      const uId = parseInt(String(donation.usuarioId).replace('usr_', ''), 10);
      const orgId = parseInt(String(donation.organizacionId).replace('org_', ''), 10);

      const id_donacion = await DonacionModel.createObject({
        categoria: donation.categoria || objectDetail.categoria,
        usuario_id: uId,
        organizacion_id: orgId,
        estado: 1,
        observaciones: donation.observaciones || ''
      }, {
        categoria: objectDetail.categoria,
        descripcion: objectDetail.descripcion || '',
        cantidad: parseInt(String(objectDetail.cantidad), 10)
      });

      const d = await DonacionModel.getById(id_donacion);
      if (!d) throw new Error('Error al recuperar la donación de objeto creada.');

      return res.status(201).json({
        success: true,
        message: 'Donación de objeto registrada con éxito.',
        data: mapDonationToFrontend(d)
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Error al registrar donación de objeto.',
        errors: []
      });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const rawId = req.params.id;
      const id = parseInt(rawId.replace('don_', ''), 10);

      const ok = await DonacionModel.delete(id);
      if (!ok) {
        return res.status(404).json({
          success: false,
          message: 'Donación no encontrada.',
          errors: []
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Donación eliminada con éxito.',
        data: { id: `don_${id}` }
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
      const id = parseInt(rawId.replace('don_', ''), 10);
      const { donation, monetary, objectDetail } = req.body;

      // Obtener la donación antes de actualizar para verificar el tipo
      const d = await DonacionModel.getById(id);
      if (!d) {
        return res.status(404).json({
          success: false,
          message: 'Donación no encontrada.',
          errors: []
        });
      }

      const isMonetary = d.tipo.toLowerCase() === 'monetaria';

      // Preparar los datos de actualización
      const updateDonation: any = {};
      if (donation) {
        if (donation.categoria) updateDonation.categoria = donation.categoria;
        if (donation.observaciones !== undefined) updateDonation.observaciones = donation.observaciones;
        if (donation.estado !== undefined) updateDonation.estado = donation.estado;
      }

      const updateMonetary = isMonetary && monetary ? {
        metodo: monetary.metodo || undefined,
        cuenta: monetary.cuenta || undefined,
        valor: monetary.valor ? parseFloat(String(monetary.valor)) : undefined
      } : null;

      const updateObject = !isMonetary && objectDetail ? {
        categoria: objectDetail.categoria || undefined,
        descripcion: objectDetail.descripcion || undefined,
        cantidad: objectDetail.cantidad ? parseInt(String(objectDetail.cantidad), 10) : undefined
      } : null;

      // Ejecutar actualización
      const ok = await DonacionModel.update(id, updateDonation, updateMonetary, updateObject);
      if (!ok) {
        return res.status(500).json({
          success: false,
          message: 'No se pudo actualizar la donación.',
          errors: []
        });
      }

      // Obtener la donación actualizada
      const updatedDonation = await DonacionModel.getById(id);
      return res.status(200).json({
        success: true,
        message: 'Donación actualizada con éxito.',
        data: mapDonationToFrontend(updatedDonation)
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Error al actualizar la donación.',
        errors: []
      });
    }
  }
};
