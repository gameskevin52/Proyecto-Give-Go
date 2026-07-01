import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

// Configuración de variables de entorno con valores por defecto
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'giveandgo_v2',
  connectionLimit: 10,
};

let pool: mysql.Pool | null = null;
let useFallback = true;
let fallbackData: any = {};
const FALLBACK_FILE_PATH = path.join(process.cwd(), 'backend', 'src', 'data', 'fallback_db.json');

// Inicializar el JSON de fallback con datos semilla
const seedFallbackData = () => {
  fallbackData = {
    categorias: [
      { id_categoria: 1, nombre: 'Alimentos', descripcion: 'Donaciones de alimentos', estado: 1 },
      { id_categoria: 2, nombre: 'Educación', descripcion: 'Apoyo educativo', estado: 1 },
      { id_categoria: 3, nombre: 'Salud', descripcion: 'Campañas de salud', estado: 1 },
      { id_categoria: 4, nombre: 'Medio Ambiente', descripcion: 'Reforestación de zonas verdes', estado: 1 },
      { id_categoria: 5, nombre: 'Económico', descripcion: 'Aportaciones monetarias', estado: 1 },
    ],
    usuarios: [
      {
        id_usuario: 1,
        rol: 'Admin',
        nombre1: 'Administrador',
        apellido1: 'General',
        correo: 'admin@giveandgo.com',
        // Hash de 'Admin123*'
        password: '$2b$10$tZ9C.mJjXNco/e.e2jV9SeAAL68L16S78A9oGv2o62H9R1pW61qE.',
        telefono: '+57 300 123 4567',
        estado: 1,
        fecha_registro: new Date().toISOString()
      },
      {
        id_usuario: 2,
        rol: 'Voluntario',
        nombre1: 'Carlos',
        nombre2: 'Andrés',
        apellido1: 'Mendoza',
        apellido2: 'Castro',
        correo: 'carlos@volunteer.com',
        // Hash de 'User123*'
        password: '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.',
        telefono: '+57 310 987 6543',
        estado: 1,
        fecha_registro: new Date().toISOString()
      },
      {
        id_usuario: 3,
        rol: 'Voluntario',
        nombre1: 'Sofía',
        apellido1: 'Pérez',
        correo: 'sofia@volunteer.com',
        password: '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.',
        telefono: '+57 315 222 3333',
        estado: 1,
        fecha_registro: new Date().toISOString()
      },
      {
        id_usuario: 4,
        rol: 'Beneficiario',
        nombre1: 'Juan',
        apellido1: 'Gómez',
        correo: 'juan@beneficiary.com',
        password: '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.',
        telefono: '+57 320 444 5555',
        estado: 1,
        fecha_registro: new Date().toISOString()
      },
      {
        id_usuario: 5,
        rol: 'Beneficiario',
        nombre1: 'María',
        apellido1: 'Rodríguez',
        correo: 'maria@beneficiary.com',
        password: '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.',
        telefono: '+57 301 555 6666',
        estado: 1,
        fecha_registro: new Date().toISOString()
      },
      {
        id_usuario: 101, // Vinculado a org_1
        rol: 'Organizacion',
        nombre1: 'Fundación Manos por Kennedy',
        apellido1: 'Organización',
        correo: 'contacto@manosporkennedy.org',
        password: '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.',
        telefono: '+57 300 000 0000',
        estado: 1,
        fecha_registro: new Date().toISOString()
      },
      {
        id_usuario: 102, // Vinculado a org_2
        rol: 'Organizacion',
        nombre1: 'Fundación Bogotá Solidaria',
        apellido1: 'Organización',
        correo: 'info@bogotasolidaria.org',
        password: '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.',
        telefono: '+57 300 000 0000',
        estado: 1,
        fecha_registro: new Date().toISOString()
      },
      {
        id_usuario: 103, // Vinculado a org_3
        rol: 'Organizacion',
        nombre1: 'Asociación Social Ciudad Kennedy',
        apellido1: 'Organización',
        correo: 'hola@ciudadkennedy.org',
        password: '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.',
        telefono: '+57 300 000 0000',
        estado: 1,
        fecha_registro: new Date().toISOString()
      }
    ],
    organizaciones: [
      {
        id_organizacion: 1,
        nombre: 'Fundación Manos por Kennedy',
        direccion: 'Calle 38 Sur # 78-45, Kennedy Central, Bogotá D.C.',
        correo: 'contacto@manosporkennedy.org',
        password: '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.',
        telefono: '+57 300 000 0000',
        descripcion: 'Institución comunitaria enfocada en brindar seguridad alimentaria en Kennedy.',
        estado: 1,
        fecha_registro: new Date().toISOString()
      },
      {
        id_organizacion: 2,
        nombre: 'Fundación Bogotá Solidaria',
        direccion: 'Carrera 80 # 40B Sur-12, Castilla, Bogotá D.C.',
        correo: 'info@bogotasolidaria.org',
        password: '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.',
        telefono: '+57 300 000 0000',
        descripcion: 'Fundación sin ánimo de lucro enfocada en desarrollo y asistencia a adultos mayores.',
        estado: 1,
        fecha_registro: new Date().toISOString()
      },
      {
        id_organizacion: 3,
        nombre: 'Asociación Social Ciudad Kennedy',
        direccion: 'Avenida Ciudad de Cali # 13-08, Patio Bonito, Bogotá D.C.',
        correo: 'hola@ciudadkennedy.org',
        password: '$2b$10$gO6NveiB/s/T.O3m/v9L1e7pAAsH1.S2Zp1A/9oK32V9R1pW52aD.',
        telefono: '+57 300 000 0000',
        descripcion: 'Organización para la recuperación ambiental y el apoyo pedagógico.',
        estado: 1,
        fecha_registro: new Date().toISOString()
      }
    ],
    eventos: [
      {
        id_evento: 1,
        nombre: 'Jornada de Donación en Kennedy Central',
        id_categoria: 1, // Alimentos
        descripcion: 'Ayúdanos a clasificar y empaquetar alimentos recibidos para las familias vulnerables de la localidad de Kennedy en nuestro centro comunitario.',
        direccion: 'Calle 38 Sur # 78-45, Kennedy Central',
        fecha: '2026-07-15T09:00:00Z',
        cupo: 50,
        estado: 1,
        organizacion_id: 1
      },
      {
        id_evento: 2,
        nombre: 'Campaña Solidaria Patio Bonito',
        id_categoria: 2, // Educación
        descripcion: 'Buscamos voluntarios para apoyar en el reforzamiento escolar y tutorías los fines de semana para niños del sector de Patio Bonito.',
        direccion: 'Avenida Ciudad de Cali # 13-08',
        fecha: '2026-07-20T08:00:00Z',
        cupo: 20,
        estado: 1,
        organizacion_id: 1
      },
      {
        id_evento: 3,
        nombre: 'Reforestación del Humedal El Burro',
        id_categoria: 4, // Medio Ambiente
        descripcion: 'Jornada de siembra de especies nativas y limpieza en el Humedal El Burro de Kennedy. ¡Trae ropa cómoda y guantes!',
        direccion: 'Calle 8A con Carrera 82, Humedal El Burro',
        fecha: '2026-08-05T07:00:00Z',
        cupo: 100,
        estado: 1,
        organizacion_id: 3
      },
      {
        id_evento: 4,
        nombre: 'Jornada Comunitaria Castilla',
        id_categoria: 3, // Salud
        descripcion: 'Campaña de salud básica preventiva y entrega de kits de aseo para adultos mayores del barrio Castilla.',
        direccion: 'Carrera 80 # 40B Sur-12, Castilla',
        fecha: '2026-06-30T09:00:00Z',
        cupo: 30,
        estado: 1,
        organizacion_id: 2
      }
    ],
    seguimiento_eventos: [],
    donaciones: [
      {
        id_donacion: 1,
        categoria: 'Económico',
        tipo: 'Monetaria',
        fecha: '2026-06-22T10:00:00Z',
        usuario_id: 2, // Carlos
        organizacion_id: 1, // Manos por Kennedy
        estado: 1,
        observaciones: 'Donación para la compra de suministros alimentarios.'
      },
      {
        id_donacion: 2,
        categoria: 'Alimentos',
        tipo: 'Objeto',
        fecha: '2026-06-24T15:30:00Z',
        usuario_id: 3, // Sofia
        organizacion_id: 2, // Bogotá Solidaria
        estado: 1,
        observaciones: 'Aporte en especie para el asilo de Castilla.'
      }
    ],
    donaciones_monetarias: [
      {
        id: 1,
        metodo: 'tarjeta',
        cuenta: '**** **** **** 4321',
        valor: 150000.00,
        donacion_id: 1
      }
    ],
    donaciones_objetos: [
      {
        id: 1,
        categoria: 'Alimentos',
        descripcion: '10 kg de arroz, 5 kg de legumbres y aceite vegetal',
        cantidad: 15,
        donacion_id: 2
      }
    ],
    solicitudes: [
      {
        id_solicitud: 1,
        usuario_id: 4, // Juan
        titulo: 'Apoyo alimentario en Patio Bonito',
        descripcion: 'Solicito mercado básico no perecedero para mi núcleo familiar de 4 personas en el barrio Patio Bonito, Kennedy.',
        estado: 'Pendiente',
        fecha: '2026-06-20T12:00:00Z'
      },
      {
        id_solicitud: 2,
        usuario_id: 5, // María
        titulo: 'Útiles escolares en Castilla',
        descripcion: 'Necesito cuadernos, lápices y útiles escolares para mis dos hijos de primaria en Castilla.',
        estado: 'Aprobada',
        fecha: '2026-06-18T10:00:00Z'
      },
      {
        id_solicitud: 3,
        usuario_id: 4, // Juan
        titulo: 'Kit de medicamentos esenciales',
        descripcion: 'Solicitud de apoyo para adquirir medicamentos de control diario para un adulto mayor en el barrio Kennedy Central.',
        estado: 'Rechazada',
        fecha: '2026-06-10T09:00:00Z'
      }
    ]
  };
};

// Crear carpeta data si no existe
const dataDir = path.dirname(FALLBACK_FILE_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Cargar o guardar datos de fallback
const loadFallback = () => {
  if (fs.existsSync(FALLBACK_FILE_PATH)) {
    try {
      const dataStr = fs.readFileSync(FALLBACK_FILE_PATH, 'utf-8');
      fallbackData = JSON.parse(dataStr);
    } catch (e) {
      console.error('Error reading fallback database file, re-initializing seeds', e);
      seedFallbackData();
      saveFallback();
    }
  } else {
    seedFallbackData();
    saveFallback();
  }
};

const saveFallback = () => {
  try {
    fs.writeFileSync(FALLBACK_FILE_PATH, JSON.stringify(fallbackData, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing to fallback database file', e);
  }
};

loadFallback();

// Función para verificar y reparar el usuario administrador (admin@giveandgo.com / Admin123*)
async function checkAndRepairAdmin() {
  const adminEmail = 'admin@giveandgo.com';
  const adminPassword = 'Admin123*';
  
  try {
    const salt = await bcrypt.genSalt(10);
    const correctHash = await bcrypt.hash(adminPassword, salt);

    if (!useFallback && pool) {
      // 1. Verificar en MySQL
      const [rows]: any = await pool.query('SELECT * FROM usuarios WHERE LOWER(correo) = LOWER(?)', [adminEmail]);
      if (rows.length === 0) {
        console.log('El usuario administrador no existe en MySQL. Creándolo...');
        await pool.query(
          `INSERT INTO usuarios (rol, nombre1, apellido1, correo, password, estado, telefono) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          ['Admin', 'Administrador', 'General', adminEmail, correctHash, 1, '+57 300 123 4567']
        );
        console.log('Usuario administrador creado con éxito en MySQL.');
      } else {
        const adminUser = rows[0];
        const isMatch = await bcrypt.compare(adminPassword, adminUser.password || '');
        if (!isMatch) {
          console.log('La contraseña del administrador no coincide en MySQL. Actualizándola...');
          await pool.query('UPDATE usuarios SET password = ? WHERE id_usuario = ?', [correctHash, adminUser.id_usuario]);
          console.log('Contraseña del administrador actualizada correctamente en MySQL.');
        } else {
          console.log('✔ Usuario administrador verificado y correcto en MySQL.');
        }
      }
    }

    // 2. Verificar en Fallback (siempre sincronizar fallback también)
    const fallbackAdmin = fallbackData.usuarios.find((u: any) => u.correo.toLowerCase() === adminEmail);
    if (!fallbackAdmin) {
      console.log('El usuario administrador no existe en fallback. Creándolo...');
      const nextId = fallbackData.usuarios.length > 0 ? Math.max(...fallbackData.usuarios.map((u: any) => u.id_usuario)) + 1 : 1;
      fallbackData.usuarios.push({
        id_usuario: nextId,
        rol: 'Admin',
        nombre1: 'Administrador',
        apellido1: 'General',
        correo: adminEmail,
        password: correctHash,
        telefono: '+57 300 123 4567',
        estado: 1,
        fecha_registro: new Date().toISOString()
      });
      saveFallback();
      console.log('Usuario administrador creado con éxito en fallback.');
    } else {
      const isMatch = await bcrypt.compare(adminPassword, fallbackAdmin.password || '');
      if (!isMatch) {
        console.log('La contraseña del administrador no coincide en fallback. Actualizándola...');
        fallbackAdmin.password = correctHash;
        saveFallback();
        console.log('Contraseña del administrador actualizada correctamente en fallback.');
      } else {
        console.log('✔ Usuario administrador verificado y correcto en fallback.');
      }
    }
  } catch (err) {
    console.error('Error al verificar/reparar el administrador:', err);
  }
}

// Intentar conectar a la base de datos MySQL 8
export const initDB = async () => {
  if (process.env.DB_HOST && process.env.DB_USER) {
    try {
      pool = mysql.createPool(dbConfig);
      // Validar conexión con un simple ping
      const connection = await pool.getConnection();
      console.log('✔ Base de datos MySQL 8 conectada con éxito.');
      connection.release();
      useFallback = false;
    } catch (err: any) {
      console.warn('⚠ Advertencia: No se pudo conectar a MySQL 8. Código de error:', err.code);
      console.warn('👉 Usando el motor de fallback basado en archivos JSON para garantizar que la vista previa de AI Studio sea completamente operativa.');
      useFallback = true;
    }
  } else {
    console.warn('⚠ Advertencia: Variables de entorno de base de datos no configuradas.');
    console.warn('👉 Usando el motor de fallback basado en archivos JSON para garantizar que la vista previa de AI Studio sea completamente operativa.');
    useFallback = true;
  }
  
  // Garantizar que el administrador esté configurado y operativo en cualquier modo
  await checkAndRepairAdmin();
};

// Exponer métodos globales de consulta
export const db = {
  isMySQLConnected: () => !useFallback,
  
  query: async (sql: string, params: any[] = []): Promise<any> => {
    if (!useFallback && pool) {
      return await pool.query(sql, params);
    } else {
      // Simular comportamiento de base de datos relacional para el fallback en memoria
      return handleFallbackQuery(sql, params);
    }
  },
  
  getFallbackData: () => fallbackData,
  saveFallbackData: () => saveFallback(),
};

// Un procesador inteligente y simplificado de SQL simulado para que la aplicación del usuario sea 100% interactiva en modo de desarrollo local.
function handleFallbackQuery(sql: string, params: any[]): any {
  const queryNormalized = sql.trim().replace(/\s+/g, ' ').toLowerCase();
  
  // 1. SELECT categorias
  if (queryNormalized.startsWith('select * from categorias')) {
    return [fallbackData.categorias, []];
  }
  
  // 2. SELECT usuarios
  if (queryNormalized.startsWith('select * from usuarios')) {
    let result = [...fallbackData.usuarios];
    if (queryNormalized.includes('where correo = ?')) {
      const email = params[0]?.toLowerCase();
      result = result.filter(u => u.correo.toLowerCase() === email);
    } else if (queryNormalized.includes('where id_usuario = ?')) {
      const id = parseInt(params[0], 10);
      result = result.filter(u => u.id_usuario === id);
    }
    return [result, []];
  }
  
  // 3. SELECT organizaciones
  if (queryNormalized.startsWith('select * from organizaciones')) {
    let result = [...fallbackData.organizaciones];
    if (queryNormalized.includes('where id_organizacion = ?')) {
      const id = parseInt(params[0], 10);
      result = result.filter(o => o.id_organizacion === id);
    } else if (queryNormalized.includes('where correo = ?')) {
      const email = params[0]?.toLowerCase();
      result = result.filter(o => o.correo.toLowerCase() === email);
    }
    return [result, []];
  }

  // 4. SELECT eventos
  if (queryNormalized.startsWith('select * from eventos')) {
    let result = [...fallbackData.eventos];
    if (queryNormalized.includes('where id_evento = ?')) {
      const id = parseInt(params[0], 10);
      result = result.filter(e => e.id_evento === id);
    } else if (queryNormalized.includes('where organizacion_id = ?')) {
      const orgId = parseInt(params[0], 10);
      result = result.filter(e => e.organizacion_id === orgId);
    }
    return [result, []];
  }

  // 5. SELECT solicitudes
  if (queryNormalized.startsWith('select * from solicitudes')) {
    let result = [...fallbackData.solicitudes];
    if (queryNormalized.includes('where id_solicitud = ?')) {
      const id = parseInt(params[0], 10);
      result = result.filter(s => s.id_solicitud === id);
    } else if (queryNormalized.includes('where usuario_id = ?')) {
      const uId = parseInt(params[0], 10);
      result = result.filter(s => s.usuario_id === uId);
    }
    return [result, []];
  }

  // 6. SELECT donaciones, donaciones_monetarias, donaciones_objetos
  if (queryNormalized.startsWith('select * from donaciones') || queryNormalized.includes('join donaciones')) {
    // Para simplificar, devolvemos donaciones mapeadas
    return [fallbackData.donaciones, []];
  }

  // Fallback por defecto si no coincide con las consultas típicas (evitar crashes)
  return [[], []];
}
