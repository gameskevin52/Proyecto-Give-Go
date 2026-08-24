import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.DB_NAME || 'giveandgo_v2';
const dbPort = parseInt(process.env.DB_PORT || '3306', 10);

console.log(`[MySQL Config] Intentando conectar a MySQL en ${dbHost}:${dbPort}, Base de datos: ${dbName}, Usuario: ${dbUser}`);

// Crear Pool de Conexiones MySQL con reconexión automática
export const db = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPassword,
  database: dbName,
  port: dbPort,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 5000,
  timezone: '-05:00', // Zona horaria de Colombia
});

let isConnected = false;
let connectionError: string | null = null;

export async function testConnection(): Promise<{ connected: boolean; error: string | null }> {
  try {
    const connection = await db.getConnection();
    await connection.ping();
    connection.release();
    isConnected = true;
    connectionError = null;
    console.log(`[MySQL Success] ¡Conexión a MySQL con éxito! Base de datos '${dbName}' lista.`);
    return { connected: true, error: null };
  } catch (err: any) {
    isConnected = false;
    connectionError = err.message || 'Error desconocido al conectar a MySQL';
    console.warn(`[MySQL Warning] No se pudo conectar con la base de datos MySQL (${connectionError}). Verifique que XAMPP esté activo con la BD '${dbName}'.`);
    return { connected: false, error: connectionError };
  }
}

export function getDbStatus() {
  return {
    connected: isConnected,
    error: connectionError,
    config: {
      host: dbHost,
      port: dbPort,
      database: dbName,
      user: dbUser,
    },
  };
}

// Ejecutar prueba de conexión al arrancar
testConnection();
