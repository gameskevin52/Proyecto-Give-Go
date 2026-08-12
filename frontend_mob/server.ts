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
  password: string; // Hash encriptado
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

const DB_FILE = path.join(process.cwd(), 'data_usuarios.json');

// Carga inicial o creación de la Base de Datos persistente
function loadDatabase(): UsuarioDB[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error al cargar la base de datos local:', err);
  }

  // Usuarios iniciales de prueba (con contraseñas cifradas)
  const defaultPasswordHash = bcrypt.hashSync('GiveGo2026!', 10);
  const initialUsers: UsuarioDB[] = [
    {
      id_usuario: 1,
      rol: 'Voluntario',
      nombre1: 'Carlos',
      nombre2: 'Andrés',
      apellido1: 'Pérez',
      apellido2: 'Gómez',
      tipo_documento: 'CC',
      num_documento: '1019283745',
      fecha_nacimiento: '1995-06-15',
      telefono: '3001234567',
      correo: 'voluntario@giveandgo.org',
      password: defaultPasswordHash,
      direccion: 'Calle 100 # 15-20',
      barrio: 'Chapinero',
      localidad: 'Chapinero',
      ciudad: 'Bogotá',
      departamento: 'Bogotá D.C.',
      pais: 'Colombia',
      codigo_postal: '110111',
      foto: null,
      foto_portada: null,
      biografia: 'Apasionado por ayudar en causas comunitarias y proyectos sociales.',
      sitio_web: null,
      redes_sociales: null,
      privacidad: 'Pública',
      mision: null,
      vision: null,
      estado: 1,
      fecha_registro: new Date().toISOString()
    },
    {
      id_usuario: 2,
      rol: 'Organizacion',
      nombre1: 'Fundación',
      nombre2: null,
      apellido1: 'Esperanza',
      apellido2: 'Viva',
      tipo_documento: 'NIT',
      num_documento: '900123456-1',
      fecha_nacimiento: null,
      telefono: '6017654321',
      correo: 'contacto@fundacion.org',
      password: defaultPasswordHash,
      direccion: 'Carrera 7 # 45-10',
      barrio: 'Teusaquillo',
      localidad: 'Teusaquillo',
      ciudad: 'Bogotá',
      departamento: 'Bogotá D.C.',
      pais: 'Colombia',
      codigo_postal: '110221',
      foto: null,
      foto_portada: null,
      biografia: 'Organización dedicada al desarrollo social y entrega de recursos.',
      sitio_web: 'https://fundacionesperanza.org',
      redes_sociales: '@fundacionesperanzaviva',
      privacidad: 'Pública',
      mision: 'Apoyar a comunidades en situación de vulnerabilidad.',
      vision: 'Ser referente nacional en gestión de ayudas humanas.',
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

  let dbUsuarios = loadDatabase();

  // API ENDPOINTS

  // 1. ENDPOINT DE REGISTRO DE USUARIOS (`POST /api/registro`)
  app.post('/api/registro', (req, res) => {
    try {
      const {
        rol,
        nombre1,
        nombre2,
        apellido1,
        apellido2,
        tipo_documento,
        num_documento,
        fecha_nacimiento,
        telefono,
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

      // Validaciones de campos obligatorios
      if (!nombre1 || !apellido1 || !num_documento || !telefono || !correo || !password) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Por favor complete todos los campos obligatorios (*).'
        });
      }

      // Validación de formato de correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo)) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El formato del correo electrónico no es válido.'
        });
      }

      // Validación de contraseña (mínimo 8 caracteres, mayúscula, número y símbolo)
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          ok: false,
          mensaje: 'La contraseña debe tener mínimo 8 caracteres, al menos una mayúscula, un número y un símbolo.'
        });
      }

      // Validación de correo único
      const correoNormalizado = correo.trim().toLowerCase();
      const usuarioExistente = dbUsuarios.find(u => u.correo.toLowerCase() === correoNormalizado);
      if (usuarioExistente) {
        return res.status(400).json({
          ok: false,
          mensaje: 'El correo electrónico ya se encuentra registrado en el sistema.'
        });
      }

      // Cifrado de contraseña con bcrypt
      const passwordCifrada = bcrypt.hashSync(password, 10);

      // Creación del nuevo registro en la tabla `usuarios`
      const nuevoUsuario: UsuarioDB = {
        id_usuario: dbUsuarios.length > 0 ? Math.max(...dbUsuarios.map(u => u.id_usuario)) + 1 : 1,
        rol: rol || 'Voluntario',
        nombre1: nombre1.trim(),
        nombre2: nombre2 ? nombre2.trim() : null,
        apellido1: apellido1.trim(),
        apellido2: apellido2 ? apellido2.trim() : null,
        tipo_documento: tipo_documento || 'CC',
        num_documento: num_documento.trim(),
        fecha_nacimiento: fecha_nacimiento || null,
        telefono: telefono.trim(),
        correo: correoNormalizado,
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

      return res.status(201).json({
        ok: true,
        mensaje: 'Usuario registrado exitosamente en el sistema.',
        usuario: usuarioSinPassword,
        token: `token_giveandgo_${Date.now()}`
      });

    } catch (error) {
      console.error('Error en /api/registro:', error);
      return res.status(500).json({
        ok: false,
        mensaje: 'Error interno del servidor al procesar el registro.'
      });
    }
  });

  // 2. ENDPOINT DE INICIO DE SESIÓN (`POST /api/login`)
  app.post('/api/login', (req, res) => {
    try {
      const { correo, password } = req.body;

      if (!correo || !password) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Debe ingresar el correo y la contraseña.'
        });
      }

      const correoNormalizado = correo.trim().toLowerCase();
      const usuario = dbUsuarios.find(u => u.correo.toLowerCase() === correoNormalizado);

      if (!usuario) {
        return res.status(401).json({
          ok: false,
          mensaje: 'Correo electrónico o contraseña incorrectos.'
        });
      }

      // Verificación de contraseña cifrada
      const esPasswordValida = bcrypt.compareSync(password, usuario.password);
      if (!esPasswordValida) {
        return res.status(401).json({
          ok: false,
          mensaje: 'Correo electrónico o contraseña incorrectos.'
        });
      }

      if (usuario.estado !== 1) {
        return res.status(403).json({
          ok: false,
          mensaje: 'Esta cuenta se encuentra inactiva. Contacte al administrador.'
        });
      }

      const { password: _, ...usuarioSinPassword } = usuario;

      return res.status(200).json({
        ok: true,
        mensaje: 'Inicio de sesión exitoso.',
        usuario: usuarioSinPassword,
        token: `token_giveandgo_session_${usuario.id_usuario}_${Date.now()}`
      });

    } catch (error) {
      console.error('Error en /api/login:', error);
      return res.status(500).json({
        ok: false,
        mensaje: 'Error interno en el servidor al autenticar el usuario.'
      });
    }
  });

  // 3. ENDPOINT LISTAR USUARIOS PARA VERIFICACIÓN DE BASE DE DATOS (`GET /api/usuarios`)
  app.get('/api/usuarios', (req, res) => {
    const usuariosSeguros = dbUsuarios.map(({ password: _, ...u }) => u);
    return res.json({
      ok: true,
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

  app.listen(PORT, "10.1.196.12", () => {
    console.log(`Servidor Give&Go corriendo en http://10.1.196.12:${PORT}`);
  });
}

startServer().catch(error => {
  console.error('Error al iniciar el servidor:', error);
  process.exit(1);
});
