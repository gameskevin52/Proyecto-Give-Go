import { db } from '../config/db';

export interface UsuarioDB {
  id_usuario: number;
  id_rol?: number;
  rol: 'Admin' | 'Voluntario' | 'Beneficiario' | 'Organizacion';
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  fecha_nacimiento?: string;
  telefono?: string;
  correo: string;
  password?: string;
  id_barrio?: number;
  direccion?: string;
  barrio?: string;
  foto?: string;
  biografia?: string;
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
        `INSERT INTO usuarios (
          rol, nombre1, nombre2, apellido1, apellido2, telefono, correo, password, estado,
          fecha_nacimiento, direccion, barrio, foto, biografia
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.rol, data.nombre1, data.nombre2 || null, data.apellido1, data.apellido2 || null,
          data.telefono || null, data.correo, data.password, estado,
          data.fecha_nacimiento || null, data.direccion || null, data.barrio || null,
          data.foto || null, data.biografia || null
        ]
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
        fecha_registro: new Date().toISOString(),
        fecha_nacimiento: data.fecha_nacimiento || '',
        direccion: data.direccion || '',
        barrio: data.barrio || 'Kennedy Central',
        foto: data.foto || '',
        biografia: data.biografia || ''
      };
      users.push(newUser);
      db.saveFallbackData();
      return nextId;
    }
  },

  async update(id: number, data: Partial<Omit<UsuarioDB, 'id_usuario' | 'fecha_registro'>>): Promise<boolean> {
    const allowedColumns = [
      'rol', 'nombre1', 'nombre2', 'apellido1', 'apellido2', 'fecha_nacimiento',
      'telefono', 'correo', 'password', 'id_barrio', 'direccion', 'barrio',
      'foto', 'biografia', 'estado', 'id_rol'
    ];

    if (db.isMySQLConnected()) {
      const fields: string[] = [];
      const values: any[] = [];
      
      Object.entries(data).forEach(([key, val]) => {
        if (val !== undefined && allowedColumns.includes(key)) {
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
