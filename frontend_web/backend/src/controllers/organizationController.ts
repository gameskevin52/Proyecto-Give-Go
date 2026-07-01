import { Request, Response } from 'express';
import { OrganizacionModel, OrganizacionDB } from '../models/organizacionModel';
import { UsuarioModel } from '../models/usuarioModel';
import { hashPassword } from '../utils/auth';

const mapOrgToFrontend = (org: OrganizacionDB) => {
  return {
    id: `org_${org.id_organizacion}`,
    nombre: org.nombre,
    direccion: org.direccion || '',
    telefono: org.telefono || '',
    correo: org.correo,
    descripcion: org.descripcion || ''
  };
};

export const OrganizationController = {
  async getAll(req: Request, res: Response) {
    try {
      const orgs = await OrganizacionModel.getAll();
      return res.status(200).json({
        success: true,
        message: 'Organizaciones recuperadas correctamente.',
        data: orgs.map(mapOrgToFrontend)
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
      // Soportar IDs en formato string 'org_X' o número X
      const rawId = req.params.id;
      const id = parseInt(rawId.replace('org_', ''), 10);
      
      const org = await OrganizacionModel.getById(id);
      if (!org) {
        return res.status(404).json({
          success: false,
          message: 'Organización no encontrada.',
          errors: []
        });
      }
      return res.status(200).json({
        success: true,
        message: 'Organización recuperada.',
        data: mapOrgToFrontend(org)
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
      const { nombre, direccion, correo, password, telefono, descripcion } = req.body;
      
      const existingUser = await UsuarioModel.getByEmail(correo);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'El correo electrónico ya está registrado por otra cuenta.',
          errors: []
        });
      }

      const hashedPassword = await hashPassword(password);

      // 1. Crear organización en `organizaciones`
      const id_organizacion = await OrganizacionModel.create({
        nombre,
        direccion,
        correo,
        password: hashedPassword,
        telefono: telefono || '+57 300 000 0000',
        descripcion: descripcion || '',
        estado: 1
      });

      // 2. Crear usuario asociado en `usuarios` para el login
      await UsuarioModel.create({
        rol: 'Organizacion',
        nombre1: nombre,
        apellido1: 'Organización',
        telefono: telefono || '+57 300 000 0000',
        correo,
        password: hashedPassword,
        estado: 1
      });

      const org = await OrganizacionModel.getById(id_organizacion);
      if (!org) throw new Error('Error al recuperar la organización creada.');

      return res.status(201).json({
        success: true,
        message: 'Organización registrada con éxito.',
        data: mapOrgToFrontend(org)
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || 'Error al registrar la organización.',
        errors: []
      });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const rawId = req.params.id;
      const id = parseInt(rawId.replace('org_', ''), 10);
      const { nombre, direccion, correo, password, telefono, descripcion } = req.body;

      // Recuperar actual para saber el correo y sincronizar con usuario
      const currentOrg = await OrganizacionModel.getById(id);
      if (!currentOrg) {
        return res.status(404).json({
          success: false,
          message: 'Organización no encontrada.',
          errors: []
        });
      }

      const updateData: Partial<OrganizacionDB> = {};
      if (nombre !== undefined) updateData.nombre = nombre;
      if (direccion !== undefined) updateData.direccion = direccion;
      if (telefono !== undefined) updateData.telefono = telefono;
      if (correo !== undefined) updateData.correo = correo;
      if (descripcion !== undefined) updateData.descripcion = descripcion;
      if (password) {
        updateData.password = await hashPassword(password);
      }

      // 1. Actualizar organización
      const ok = await OrganizacionModel.update(id, updateData);
      if (!ok) {
        return res.status(404).json({
          success: false,
          message: 'Organización no encontrada.',
          errors: []
        });
      }

      // 2. Sincronizar con el usuario correspondiente en `usuarios`
      const user = await UsuarioModel.getByEmail(currentOrg.correo);
      if (user) {
        const userUpdate: any = {};
        if (nombre !== undefined) userUpdate.nombre1 = nombre;
        if (correo !== undefined) userUpdate.correo = correo;
        if (password) userUpdate.password = updateData.password;
        if (telefono !== undefined) userUpdate.telefono = telefono;
        await UsuarioModel.update(user.id_usuario, userUpdate);
      }

      const org = await OrganizacionModel.getById(id);
      if (!org) throw new Error('Organización no encontrada.');
      return res.status(200).json({
        success: true,
        message: 'Organización actualizada correctamente.',
        data: mapOrgToFrontend(org)
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
      const id = parseInt(rawId.replace('org_', ''), 10);

      const org = await OrganizacionModel.getById(id);
      if (!org) {
        return res.status(404).json({
          success: false,
          message: 'Organización no encontrada.',
          errors: []
        });
      }

      // 1. Eliminar de `organizaciones`
      await OrganizacionModel.delete(id);

      // 2. Eliminar de `usuarios`
      const user = await UsuarioModel.getByEmail(org.correo);
      if (user) {
        await UsuarioModel.delete(user.id_usuario);
      }

      return res.status(200).json({
        success: true,
        message: 'Organización eliminada correctamente.',
        data: { id: `org_${id}` }
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
