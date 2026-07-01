import { Request, Response } from 'express';
import { DonacionModel } from '../models/donacionModel';

const mapDonationToFrontend = (d: any) => {
  const isMonetary = d.tipo.toLowerCase() === 'monetaria';
  const donationId = `don_${d.id_donacion}`;

  return {
    id: donationId,
    categoria: d.categoria || (isMonetary ? 'Económico' : d.objeto_categoria),
    tipo: isMonetary ? 'monetaria' : 'objeto',
    fecha: d.fecha ? d.fecha.split('T')[0] : new Date().toISOString().split('T')[0],
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
  }
};
