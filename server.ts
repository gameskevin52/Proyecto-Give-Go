import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { getDbStatus, testConnection } from './src/server/db';
import { loginUser, registerUser, getMe } from './src/server/controllers/authController';
import {
  createMonetaryDonation,
  createObjectDonation,
  getDonations,
} from './src/server/controllers/donationsController';
import {
  getOrganizations,
  requestVerification,
} from './src/server/controllers/organizationsController';
import { getEvents, applyToEvent } from './src/server/controllers/eventsController';
import { getRequests, createRequest } from './src/server/controllers/requestsController';
import { getAudits, createAudit } from './src/server/controllers/auditController';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares globales
  app.use(cors({ origin: '*', credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Middleware de registro de peticiones
  app.use((req, res, next) => {
    console.log(`[API ${req.method}] ${req.url}`);
    next();
  });

  // --- RUTAS DE LA API ---

  // 1. Estado del Servidor y la Base de Datos MySQL
  app.get('/api/health', async (req, res) => {
    const status = await testConnection();
    const dbInfo = getDbStatus();
    return res.json({
      status: 'ok',
      service: 'GiveAndGo Backend API',
      timestamp: new Date().toISOString(),
      database: {
        connected: status.connected,
        host: dbInfo.config.host,
        port: dbInfo.config.port,
        databaseName: dbInfo.config.database,
        error: status.error,
      },
      instructions: status.connected
        ? 'Base de datos MySQL conectada y lista.'
        : 'Para pruebas locales con XAMPP: Asegúrate de que Apache y MySQL estén INICIADOS en el panel de XAMPP y que la base de datos "giveandgo_v2" esté importada.',
    });
  });

  // 2. Autenticación y Usuarios
  app.post('/api/auth/login', loginUser);
  app.post('/api/auth/register', registerUser);
  app.get('/api/auth/me', getMe);

  // 3. Donaciones (Transacciones Monetarias y Objetos)
  app.post('/api/donaciones/monetaria', createMonetaryDonation);
  app.post('/api/donaciones/objeto', createObjectDonation);
  app.get('/api/donaciones', getDonations);

  // 4. Organizaciones y Verificación
  app.get('/api/organizaciones', getOrganizations);
  app.post('/api/organizaciones/verificacion', requestVerification);

  // 5. Eventos y Postulaciones
  app.get('/api/eventos', getEvents);
  app.post('/api/eventos/postulacion', applyToEvent);

  // 6. Solicitudes de Beneficiarios
  app.get('/api/solicitudes', getRequests);
  app.post('/api/solicitudes', createRequest);

  // 7. Auditoría
  app.get('/api/auditorias', getAudits);
  app.post('/api/auditorias', createAudit);

  // --- INTEGRACIÓN VITE / PRODUCCIÓN ---
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Server] Modo Desarrollo - Habilitando Vite Middleware');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('[Server] Modo Producción - Sirviendo archivos estáticos desde dist');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===========================================================`);
    console.log(`🚀 Servidor GiveAndGo Backend iniciado exitosamente`);
    console.log(`🌐 Escuchando en: http://0.0.0.0:${PORT}`);
    console.log(`📱 Acceso móvil local (Expo Go / Celular): http://192.168.1.X:${PORT}`);
    console.log(`🤖 Acceso Emulador Android Studio: http://10.0.2.2:${PORT}`);
    console.log(`===========================================================`);
  });
}

startServer().catch((err) => {
  console.error('[Fatal Error] No se pudo iniciar el servidor backend:', err);
});
