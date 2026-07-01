import { db } from '../config/db';

export interface UsuarioDB {
  id_usuario: number;
  rol: 'Admin' | 'Voluntario' | 'Beneficiario' | 'Organizacion';
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  telefono?: string;
  correo: string;
  password?: string;
  estado: number; // 1 = activo, 0 = inactivo
  fecha_registro?: string;
}

export const UsuarioModel = {
  async getAll(): Promise<UsuarioDB[]> {
    if (db.isMySQLConnected()) {
      const [rows] = await db.query('SELECT * FROM usuarios ORDER BY id_usuario DESC');
      return rows as UsuarioDB[];
    } else {
      return db.getFallbackData().usuarios;
    }
  },

  async getById(id: number): Promise<UsuarioDB | null> {
    if (db.isMySQLConnected()) {
      const [rows] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
      const users = rows as UsuarioDB[];
      return users.length > 0 ? users[0] : null;
    } else {
      const user = db.getFallbackData().usuarios.find((u: any) => u.id_usuario === id);
      return user || null;
    }
  },

  async getByEmail(correo: string): Promise<UsuarioDB | null> {
    if (db.isMySQLConnected()) {
      const [rows] = await db.query('SELECT * FROM usuarios WHERE LOWER(correo) = LOWER(?)', [correo]);
      const users = rows as UsuarioDB[];
      return users.length > 0 ? users[0] : null;
    } else {
      const user = db.getFallbackData().usuarios.find((u: any) => u.correo.toLowerCase() === correo.toLowerCase());
      return user || null;
    }
  },

  async create(data: Omit<UsuarioDB, 'id_usuario' | 'fecha_registro'>): Promise<number> {
    const estado = data.estado !== undefined ? data.estado : 1;
    if (db.isMySQLConnected()) {
      const [result] = await db.query(
        `INSERT INTO usuarios (rol, nombre1, nombre2, apellido1, apellido2, telefono, correo, password, estado) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.rol, data.nombre1, data.nombre2 || null, data.apellido1, data.apellido2 || null, data.telefono || null, data.correo, data.password, estado]
      );
      return (result as any).insertId;
    } else {
      const users = db.getFallbackData().usuarios;
      const nextId = users.length > 0 ? Math.max(...users.map((u: any) => u.id_usuario)) + 1 : 1;
      const newUser = {
        id_usuario: nextId,
        rol: data.rol,
        nombre1: data.nombre1,
        nombre2: data.nombre2 || '',
        apellido1: data.apellido1,
        apellido2: data.apellido2 || '',
        telefono: data.telefono || '',
        correo: data.correo,
        password: data.password,
        estado,
        fecha_registro: new Date().toISOString()
      };
      users.push(newUser);
      db.saveFallbackData();
      return nextId;
    }
  },

  async update(id: number, data: Partial<Omit<UsuarioDB, 'id_usuario' | 'fecha_registro'>>): Promise<boolean> {
    if (db.isMySQLConnected()) {
      const fields: string[] = [];
      const values: any[] = [];
      
      Object.entries(data).forEach(([key, val]) => {
        if (val !== undefined) {
          fields.push(`${key} = ?`);
          values.push(val);
        }
      });
      
      if (fields.length === 0) return true;
      
      values.push(id);
      const [result] = await db.query(`UPDATE usuarios SET ${fields.join(', ')} WHERE id_usuario = ?`, values);
      return (result as any).affectedRows > 0;
    } else {
      const users = db.getFallbackData().usuarios;
      const user = users.find((u: any) => u.id_usuario === id);
      if (!user) return false;
      
      Object.entries(data).forEach(([key, val]) => {
        if (val !== undefined) {
          user[key] = val;
        }
      });
      
      db.saveFallbackData();
      return true;
    }
  },

  async delete(id: number): Promise<boolean> {
    if (db.isMySQLConnected()) {
      const [result] = await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
      return (result as any).affectedRows > 0;
    } else {
      const users = db.getFallbackData().usuarios;
      const index = users.findIndex((u: any) => u.id_usuario === id);
      if (index === -1) return false;
      
      users.splice(index, 1);
      db.saveFallbackData();
      return true;
    }
  }
};
