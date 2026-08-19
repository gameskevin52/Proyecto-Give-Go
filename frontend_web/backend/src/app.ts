//PUNTO DE ENTRADA PRINCIPAL CONFIGURA TODA LA APP ES DONDE SE CONFIGURA TODO EL SERVIDOR EXPRESS
//importe de librerias y frameworks
import express from 'express';// Es el framework para crear el servidor web y manejar rutas
import cors from 'cors';//Permite o restringe que aplicaciones externas  puedan consumir tu API.
import helmet from 'helmet';//Añade cabeceras HTTP de seguridad
import morgan from 'morgan';//Un registrador  que muestra en la consola cada petición que llega al servidor
import cookieParser from 'cookie-parser';//Sirve para leer y procesar las cookies que vienen en las peticiones del cliente.

// Importar rutas
import userRoutes from './routes/userRoutes';
import organizationRoutes from './routes/organizationRoutes';
import categoryRoutes from './routes/categoryRoutes';
import eventRoutes from './routes/eventRoutes';
import requestRoutes from './routes/requestRoutes';
import donationRoutes from './routes/donationRoutes';
import auditRoutes from './routes/auditRoutes';
import postulacionRoutes from './routes/postulacionRoutes';
import verificationRoutes from './routes/verificationRoutes';

// Importar middleware de error
import { errorHandler } from './middlewares/errorMiddleware';//Se encarga de capturar cualquier error inesperado en la aplicación

const app = express();

// Middlewares de seguridad y utilidades. Aqui se prepara la aplicación para procesar la información de entrada de las peticiones HTTP
app.use(helmet({contentSecurityPolicy: false, }));//Aplica reglas de seguridad
app.use(cors({origin: true,credentials: true}));//Configura el servidor para aceptar peticiones de cualquier origen enviando credenciales
app.use(express.json());//Permite que el servidor entienda y procese datos que vienen en formato JSON
app.use(express.urlencoded({ extended: true }));
//Activan la lectura de cookies y los logs detallados en la consola en modo desarrollo.
app.use(cookieParser());
app.use(morgan('dev'));

// Montar rutas de la API REST. Vincula los módulos de rutas con un prefijo URL
app.use('/api/users', userRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/postulaciones', postulacionRoutes);
app.use('/api/verifications', verificationRoutes);

// Ruta de estado de la API devolviendo un mensaje de exito, cuanto lleva encendido el server y la hora actual con el Uptime
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Give&Go Backend API está operando correctamente.',
    data: {
      uptime: process.uptime(),
      time: new Date()
    }
  });
});

/* Manejador centralizado de errores
*  y lo que hace es :
*  Si alguna ruta falla y arroja un error sin capturar, 
*  pasará directamente a este middleware.
*/
app.use(errorHandler);

export default app;
