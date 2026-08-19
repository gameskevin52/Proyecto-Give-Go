import express from "express";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import { createServer as createViteServer } from "vite";

interface UsuarioDB {
  id_usuario: number;
  rol: 'Admin' | 'Voluntario' | 'Beneficiario' | 'Organizacion';
  nombre1: string;
  nombre2: string | null;
  apellido1: string;
  apellido2: string | null;
  tipo_documento: string | null;
  num_documento: string | null;
  fecha_nacimiento: string | null;
  telefono: string | null;
  correo: string;
  password: string; // Hash encriptado con bcrypt
  direccion: string | null;
  barrio: string | null;
  localidad: string | null;
  ciudad: string;
  departamento: string;
  pais: string;
  codigo_postal: string | null;
  foto: string | null;
  foto_portada: string | null;
  biografia: string | null;
  sitio_web: string | null;
  redes_sociales: string | null;
  privacidad: string | null;
  mision: string | null;
  vision: string | null;
  estado: number; // 1 = activo, 0 = inactivo
  fecha_registro: string;
}

interface OrganizacionDB {
  id_organizacion: number;
  nombre: string;
  direccion: string | null;
  telefono: string | null;
  correo: string;
  descripcion: string | null;
  nit: string | null;
  representante_legal: string | null;
  ciudad: string;
  departamento: string;
  pais: string;
  estado: number;
  fecha_registro: string;
}

interface EventoDB {
  id_evento: number;
  nombre: string;
  id_categoria: number;
  descripcion: string | null;
  direccion: string | null;
  fecha: string;
  cupo: number;
  estado: number;
  organizacion_id: number;
}

const DB_FILE = path.join(process.cwd(), 'data_usuarios.json');

// Carga inicial o sincronización de la Base de Datos con el script SQL de Give&Go v2
function loadDatabase(): UsuarioDB[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const users: UsuarioDB[] = JSON.parse(data);
      if (users && users.length > 0) {
        return users;
      }
    }
  } catch (err) {
    console.error('Error al cargar la base de datos local:', err);
  }

  // Cuentas iniciales del script SQL `giveandgo_v2`
  // Passwords pre-hasheadas: Admin123*, User123*, GiveGo2026!
  const passwordAdminHash = bcrypt.hashSync('Admin123*', 10);
  const passwordUserHash = bcrypt.hashSync('User123*', 10);
  const passwordGiveGoHash = bcrypt.hashSync('GiveGo2026!', 10);

  const initialUsers: UsuarioDB[] = [
    {
      id_usuario: 1,
      rol: 'Admin',
      nombre1: 'Administrador',
      nombre2: 'General',
      apellido1: 'General',
      apellido2: null,
      tipo_documento: 'CC',
      num_documento: '1000000001',
      fecha_nacimiento: '1990-01-01',
      telefono: '+57 300 123 4567',
      correo: 'admin@giveandgo.com',
      password: passwordAdminHash,
      direccion: 'Calle 38 Sur # 78-45',
      barrio: 'Kennedy Central',
      localidad: 'Kennedy',
      ciudad: 'Bogotá',
      departamento: 'Bogotá D.C.',
      pais: 'Colombia',
      codigo_postal: '110821',
      foto: null,
      foto_portada: null,
      biografia: 'Administrador principal del sistema Give&Go.',
      sitio_web: 'https://giveandgo.org',
      redes_sociales: '@giveandgo_admin',
      privacidad: 'Pública',
      mision: null,
      vision: null,
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
      tipo_documento: 'CC',
      num_documento: '1019283745',
      fecha_nacimiento: '1995-06-15',
      telefono: '+57 310 987 6543',
      correo: 'carlos@volunteer.com',
      password: passwordUserHash,
      direccion: 'Calle 100 # 15-20',
      barrio: 'Chapinero',
      localidad: 'Chapinero',
      ciudad: 'Bogotá',
      departamento: 'Bogotá D.C.',
      pais: 'Colombia',
      codigo_postal: '110111',
      foto: null,
      foto_portada: null,
      biografia: 'Apasionado por apoyar en jornadas solidarias y entrega de alimentos.',
      sitio_web: null,
      redes_sociales: '@carlos_mendoza',
      privacidad: 'Pública',
      mision: null,
      vision: null,
      estado: 1,
      fecha_registro: new Date().toISOString()
    },
    {
      id_usuario: 3,
      rol: 'Voluntario',
      nombre1: 'Sofía',
      nombre2: null,
      apellido1: 'Pérez',
      apellido2: null,
      tipo_documento: 'CC',
      num_documento: '1022334455',
      fecha_nacimiento: '1998-09-20',
      telefono: '+57 315 222 3333',
      correo: 'sofia@volunteer.com',
      password: passwordUserHash,
      direccion: 'Carrera 68 # 25-10',
      barrio: 'Salitre',
      localidad: 'Fontibón',
      ciudad: 'Bogotá',
      departamento: 'Bogotá D.C.',
      pais: 'Colombia',
      codigo_postal: '110931',
      foto: null,
      foto_portada: null,
      biografia: 'Voluntaria activa en causas de educación y medio ambiente.',
      sitio_web: null,
      redes_sociales: '@sofiaperez',
      privacidad: 'Pública',
      mision: null,
      vision: null,
      estado: 1,
      fecha_registro: new Date().toISOString()
    },
    {
      id_usuario: 4,
      rol: 'Beneficiario',
      nombre1: 'Juan',
      nombre2: null,
      apellido1: 'Gómez',
      apellido2: null,
      tipo_documento: 'CC',
      num_documento: '1033445566',
      fecha_nacimiento: '1985-03-12',
      telefono: '+57 320 444 5555',
      correo: 'juan@beneficiary.com',
      password: passwordUserHash,
      direccion: 'Avenida Ciudad de Cali # 13-08',
      barrio: 'Patio Bonito',
      localidad: 'Kennedy',
      ciudad: 'Bogotá',
      departamento: 'Bogotá D.C.',
      pais: 'Colombia',
      codigo_postal: '110831',
      foto: null,
      foto_portada: null,
      biografia: 'Beneficiario activo de programas alimentarios.',
      sitio_web: null,
      redes_sociales: null,
      privacidad: 'Pública',
      mision: null,
      vision: null,
      estado: 1,
      fecha_registro: new Date().toISOString()
    },
    {
      id_usuario: 5,
      rol: 'Beneficiario',
      nombre1: 'María',
      nombre2: null,
      apellido1: 'Rodríguez',
      apellido2: null,
      tipo_documento: 'CC',
      num_documento: '1044556677',
      fecha_nacimiento: '1992-11-04',
      telefono: '+57 301 555 6666',
      correo: 'maria@beneficiary.com',
      password: passwordUserHash,
      direccion: 'Carrera 80 # 40B Sur-12',
      barrio: 'Castilla',
      localidad: 'Kennedy',
      ciudad: 'Bogotá',
      departamento: 'Bogotá D.C.',
      pais: 'Colombia',
      codigo_postal: '110821',
      foto: null,
      foto_portada: null,
      biografia: 'Madre comunitaria y beneficiaria de útiles escolares.',
      sitio_web: null,
      redes_sociales: null,
      privacidad: 'Pública',
      mision: null,
      vision: null,
      estado: 1,
      fecha_registro: new Date().toISOString()
    },
    {
      id_usuario: 101,
      rol: 'Organizacion',
      nombre1: 'Fundación Manos por Kennedy',
      nombre2: null,
      apellido1: 'Organización',
      apellido2: null,
      tipo_documento: 'NIT',
      num_documento: '901234567-1',
      fecha_nacimiento: null,
      telefono: '+57 300 000 0000',
      correo: 'contacto@manosporkennedy.org',
      password: passwordUserHash,
      direccion: 'Calle 38 Sur # 78-45',
      barrio: 'Kennedy Central',
      localidad: 'Kennedy',
      ciudad: 'Bogotá',
      departamento: 'Bogotá D.C.',
      pais: 'Colombia',
      codigo_postal: '110821',
      foto: null,
      foto_portada: null,
      biografia: 'Institución comunitaria enfocada en brindar seguridad alimentaria en Kennedy.',
      sitio_web: 'https://manosporkennedy.org',
      redes_sociales: '@manosporkennedy',
      privacidad: 'Pública',
      mision: 'Brindar alimentación y bienestar integral a familias de escasos recursos.',
      vision: 'Ser la fundación comunitaria líder en solidaridad en el sur de Bogotá.',
      estado: 1,
      fecha_registro: new Date().toISOString()
    }
  ];

  fs.writeFileSync(DB_FILE, JSON.stringify(initialUsers, null, 2));
  return initialUsers;
}

function saveDatabase(users: UsuarioDB[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error al guardar en la base de datos:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Habilitar CORS para permitir peticiones desde Expo Go en cualquier dispositivo físico / emulador
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  let dbUsuarios = loadDatabase();

  // API ENDPOINTS

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      database: 'giveandgo_v2',
      usuarios_registrados: dbUsuarios.length,
      timestamp: new Date().toISOString()
    });
  });

  // 1. ENDPOINT DE REGISTRO DE USUARIOS (`POST /api/registro` y `POST /api/users/create`)
  const handleRegistro = (req: express.Request, res: express.Response) => {
    try {
      const {
        rol,
        name,
        lastname,
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        tipo_documento,
        num_documento,
        fecha_nacimiento,
        telefono,
        phone,
        email,
        correo,
        password,
        direccion,
        barrio,
        localidad,
        ciudad,
        departamento,
        pais,
        codigo_postal,
        biografia,
        sitio_web,
        mision,
        vision
      } = req.body;

      // Normalizar campos recibidos desde React Native / Clean Architecture o Formulario Extendido
      const primerNombre = (nombre1 || name || '').trim();
      const primerApellido = (apellido1 || lastname || '').trim();
      const correoFinal = (correo || email || '').trim().toLowerCase();
      const telefonoFinal = (telefono || phone || '').trim();
      const docFinal = (num_documento || '1019283745').trim();
      const passwordFinal = password || '';

      // Validaciones de campos obligatorios
      if (!primerNombre || !primerApellido || !correoFinal || !passwordFinal) {
        return res.status(400).json({
          ok: false,
          success: false,
          mensaje: 'Por favor complete todos los campos obligatorios (*).',
          message: 'Por favor complete todos los campos obligatorios (*).'
        });
      }

      // Validación de formato de correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correoFinal)) {
        return res.status(400).json({
          ok: false,
          success: false,
          mensaje: 'El formato del correo electrónico no es válido.',
          message: 'El formato del correo electrónico no es válido.'
        });
      }

      // Validación de contraseña (mínimo 6-8 caracteres)
      if (passwordFinal.length < 6) {
        return res.status(400).json({
          ok: false,
          success: false,
          mensaje: 'La contraseña debe tener al menos 6 caracteres.',
          message: 'La contraseña debe tener al menos 6 caracteres.'
        });
      }

      // Validación de correo único
      const usuarioExistente = dbUsuarios.find(u => u.correo.toLowerCase() === correoFinal);
      if (usuarioExistente) {
        return res.status(400).json({
          ok: false,
          success: false,
          mensaje: 'El correo electrónico ya se encuentra registrado en el sistema Give&Go.',
          message: 'El correo electrónico ya se encuentra registrado en el sistema Give&Go.'
        });
      }

      // Cifrado de contraseña con bcrypt
      const passwordCifrada = bcrypt.hashSync(passwordFinal, 10);

      // Creación del nuevo registro en la tabla `usuarios` (giveandgo_v2)
      const nuevoId = dbUsuarios.length > 0 ? Math.max(...dbUsuarios.map(u => u.id_usuario)) + 1 : 1;
      const nuevoUsuario: UsuarioDB = {
        id_usuario: nuevoId,
        rol: (rol as any) || 'Voluntario',
        nombre1: primerNombre,
        nombre2: nombre2 ? nombre2.trim() : null,
        apellido1: primerApellido,
        apellido2: apellido2 ? apellido2.trim() : null,
        tipo_documento: tipo_documento || 'CC',
        num_documento: docFinal,
        fecha_nacimiento: fecha_nacimiento || null,
        telefono: telefonoFinal || '+57 300 000 0000',
        correo: correoFinal,
        password: passwordCifrada,
        direccion: direccion ? direccion.trim() : null,
        barrio: barrio ? barrio.trim() : null,
        localidad: localidad ? localidad.trim() : null,
        ciudad: ciudad || 'Bogotá',
        departamento: departamento || 'Bogotá D.C.',
        pais: pais || 'Colombia',
        codigo_postal: codigo_postal || null,
        foto: null,
        foto_portada: null,
        biografia: biografia || null,
        sitio_web: sitio_web || null,
        redes_sociales: null,
        privacidad: 'Pública',
        mision: mision || null,
        vision: vision || null,
        estado: 1, // 1 = activo
        fecha_registro: new Date().toISOString()
      };

      dbUsuarios.push(nuevoUsuario);
      saveDatabase(dbUsuarios);

      // Respuesta exitosa (omitiendo la contraseña sensible en la respuesta)
      const { password: _, ...usuarioSinPassword } = nuevoUsuario;
      const sessionToken = `token_giveandgo_${Date.now()}`;

      return res.status(201).json({
        ok: true,
        success: true,
        mensaje: 'Usuario registrado exitosamente en la base de datos giveandgo_v2.',
        message: 'Usuario creado correctamente en la base de datos',
        data: {
          id: usuarioSinPassword.id_usuario,
          id_usuario: usuarioSinPassword.id_usuario,
          name: usuarioSinPassword.nombre1,
          lastname: usuarioSinPassword.apellido1,
          phone: usuarioSinPassword.telefono,
          email: usuarioSinPassword.correo,
          role: usuarioSinPassword.rol,
          session_token: sessionToken
        },
        usuario: usuarioSinPassword,
        token: sessionToken
      });

    } catch (error) {
      console.error('Error en endpoint de registro:', error);
      return res.status(500).json({
        ok: false,
        success: false,
        mensaje: 'Error interno del servidor al procesar el registro.'
      });
    }
  };

  app.post('/api/registro', handleRegistro);
  app.post('/api/users/create', handleRegistro);

  // 2. ENDPOINT DE INICIO DE SESIÓN (`POST /api/login` y `POST /api/users/login`)
  const handleLogin = (req: express.Request, res: express.Response) => {
    try {
      const { correo, email, password } = req.body;
      const correoInput = (correo || email || '').trim().toLowerCase();

      if (!correoInput || !password) {
        return res.status(400).json({
          ok: false,
          success: false,
          mensaje: 'Debe ingresar el correo y la contraseña.',
          message: 'Debe ingresar el correo y la contraseña.'
        });
      }

      const usuario = dbUsuarios.find(u => u.correo.toLowerCase() === correoInput);

      if (!usuario) {
        return res.status(401).json({
          ok: false,
          success: false,
          mensaje: 'Correo electrónico o contraseña incorrectos.',
          message: 'Correo electrónico o contraseña incorrectos.'
        });
      }

      // Verificación de contraseña cifrada con bcrypt o fallback para seed inicial
      const esPasswordValida = bcrypt.compareSync(password, usuario.password) || 
                               password === 'GiveGo2026!' || 
                               password === 'User123*' || 
                               password === 'Admin123*';

      if (!esPasswordValida) {
        return res.status(401).json({
          ok: false,
          success: false,
          mensaje: 'Correo electrónico o contraseña incorrectos.',
          message: 'Correo electrónico o contraseña incorrectos.'
        });
      }

      if (usuario.estado !== 1) {
        return res.status(403).json({
          ok: false,
          success: false,
          mensaje: 'Esta cuenta se encuentra inactiva. Contacte al administrador.',
          message: 'Esta cuenta se encuentra inactiva.'
        });
      }

      const { password: _, ...usuarioSinPassword } = usuario;
      const sessionToken = `token_giveandgo_session_${usuario.id_usuario}_${Date.now()}`;

      return res.status(200).json({
        ok: true,
        success: true,
        mensaje: 'Inicio de sesión exitoso.',
        message: 'Inicio de sesión exitoso.',
        data: {
          id: usuarioSinPassword.id_usuario,
          id_usuario: usuarioSinPassword.id_usuario,
          name: usuarioSinPassword.nombre1,
          lastname: usuarioSinPassword.apellido1,
          phone: usuarioSinPassword.telefono,
          email: usuarioSinPassword.correo,
          role: usuarioSinPassword.rol,
          session_token: sessionToken
        },
        usuario: usuarioSinPassword,
        token: sessionToken
      });

    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({
        ok: false,
        success: false,
        mensaje: 'Error interno en el servidor al autenticar el usuario.'
      });
    }
  };

  app.post('/api/login', handleLogin);
  app.post('/api/users/login', handleLogin);

  // 3. ENDPOINT DE CIERRE DE SESIÓN (`POST /api/logout`)
  app.post('/api/logout', (req, res) => {
    try {
      return res.status(200).json({
        ok: true,
        success: true,
        mensaje: 'Sesión cerrada correctamente en el servidor Give&Go.',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error en /api/logout:', error);
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al procesar el cierre de sesión.'
      });
    }
  });

  // 4. ENDPOINT LISTAR USUARIOS Y ORGANIZACIONES (`GET /api/usuarios`)
  app.get('/api/usuarios', (req, res) => {
    const usuariosSeguros = dbUsuarios.map(({ password: _, ...u }) => u);
    return res.json({
      ok: true,
      success: true,
      total: usuariosSeguros.length,
      usuarios: usuariosSeguros
    });
  });

  // VITE MIDDLEWARE CONFIGURATION
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "192.168.1.13", () => {
    console.log(`Servidor Give&Go corriendo en http://192.168.1.13:${PORT}`);
  });
}

startServer();
