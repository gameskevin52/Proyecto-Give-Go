import { Usuario, Organizacion, Evento, Categoria, Solicitud, Donacion, DonacionMonetaria, DonacionObjeto } from '../types';

export const INITIAL_USERS: Usuario[] = [
  {
    id: 'user_admin',
    rol: 'admin',
    nombre1: 'Administrador',
    nombre2: 'Global',
    apellido1: 'Give',
    apellido2: 'Go',
    telefono: '+34600123456',
    correo: 'admin@giveandgo.com',
    password: 'Admin123*',
    estado: 'activo'
  },
  {
    id: 'user_vol_1',
    rol: 'voluntario',
    nombre1: 'Carlos',
    nombre2: 'Andrés',
    apellido1: 'Mendoza',
    apellido2: 'Castro',
    telefono: '+34611222333',
    correo: 'carlos@volunteer.com',
    password: 'User123*',
    estado: 'activo'
  },
  {
    id: 'user_vol_2',
    rol: 'voluntario',
    nombre1: 'Sofía',
    apellido1: 'Pérez',
    telefono: '+34622333444',
    correo: 'sofia@volunteer.com',
    password: 'User123*',
    estado: 'activo'
  },
  {
    id: 'user_ben_1',
    rol: 'beneficiario',
    nombre1: 'Juan',
    apellido1: 'Gómez',
    telefono: '+34633444555',
    correo: 'juan@beneficiary.com',
    password: 'User123*',
    estado: 'activo'
  },
  {
    id: 'user_ben_2',
    rol: 'beneficiario',
    nombre1: 'María',
    apellido1: 'Rodríguez',
    telefono: '+34644555666',
    correo: 'maria@beneficiary.com',
    password: 'User123*',
    estado: 'activo'
  }
];

export const INITIAL_ORGANIZATIONS: Organizacion[] = [
  {
    id: 'org_1',
    nombre: 'Fundación Esperanza',
    direccion: 'Calle de la Solidaridad 45, Madrid',
    correo: 'contacto@esperanza.org',
    password: 'Org123*'
  },
  {
    id: 'org_2',
    nombre: 'Cáritas Local',
    direccion: 'Avenida del Bien Común 12, Barcelona',
    correo: 'info@caritaslocal.org',
    password: 'Org123*'
  },
  {
    id: 'org_3',
    nombre: 'Planeta Verde',
    direccion: 'Paseo de la Sostenibilidad 8, Valencia',
    correo: 'hola@planetaverde.org',
    password: 'Org123*'
  }
];

// Ensure they also exist in Users list with 'organizacion' role to support unified login if needed
export const INITIAL_ORG_USERS: Usuario[] = INITIAL_ORGANIZATIONS.map(org => ({
  id: org.id,
  rol: 'organizacion',
  nombre1: org.nombre,
  apellido1: 'Organización',
  telefono: '+34600000000',
  correo: org.correo,
  password: org.password,
  estado: 'activo'
}));

export const INITIAL_CATEGORIES: Categoria[] = [
  {
    id: 'cat_1',
    nombre: 'Alimentos',
    descripcion: 'Campañas de recogida y distribución de alimentos no perecederos',
    estado: 'activo'
  },
  {
    id: 'cat_2',
    nombre: 'Educación',
    descripcion: 'Apoyo escolar, donación de material educativo y tutorías',
    estado: 'activo'
  },
  {
    id: 'cat_3',
    nombre: 'Salud',
    descripcion: 'Asistencia médica elemental, donación de medicamentos e higiene',
    estado: 'activo'
  },
  {
    id: 'cat_4',
    nombre: 'Medio Ambiente',
    descripcion: 'Actividades de reforestación, limpieza de entornos y reciclaje',
    estado: 'activo'
  },
  {
    id: 'cat_5',
    nombre: 'Económico',
    descripcion: 'Aportaciones monetarias para el mantenimiento de refugios y proyectos sociales',
    estado: 'activo'
  }
];

export const INITIAL_EVENTS: Evento[] = [
  {
    id: 'evt_1',
    nombre: 'Gran Recogida de Alimentos Primavera',
    categoria: 'Alimentos',
    descripcion: 'Ayúdanos a clasificar y empaquetar alimentos recibidos en nuestro almacén central para familias vulnerables.',
    fecha: '2026-07-15',
    estado: 'activo',
    organizacionId: 'org_1'
  },
  {
    id: 'evt_2',
    nombre: 'Tutorías de Matemáticas para Niños',
    categoria: 'Educación',
    descripcion: 'Buscamos voluntarios para impartir clases de apoyo los fines de semana a niños de primaria.',
    fecha: '2026-07-20',
    estado: 'activo',
    organizacionId: 'org_1'
  },
  {
    id: 'evt_3',
    nombre: 'Jornada de Reforestación Urbana',
    categoria: 'Medio Ambiente',
    descripcion: 'Plantación de árboles autóctonos en el cinturón verde metropolitano. Trae calzado cómodo.',
    fecha: '2026-08-05',
    estado: 'activo',
    organizacionId: 'org_3'
  },
  {
    id: 'evt_4',
    nombre: 'Campaña Sanitaria Comunitaria',
    categoria: 'Salud',
    descripcion: 'Charlas preventivas e higiene infantil en centros de acogida locales.',
    fecha: '2026-06-30',
    estado: 'activo',
    organizacionId: 'org_2'
  }
];

export const INITIAL_REQUESTS: Solicitud[] = [
  {
    id: 'sol_1',
    beneficiarioId: 'user_ben_1',
    titulo: 'Caja de alimentos familiares',
    descripcion: 'Solicito apoyo de alimentos básicos no perecederos para mi núcleo familiar de 4 personas.',
    estado: 'pendiente',
    fecha: '2026-06-20'
  },
  {
    id: 'sol_2',
    beneficiarioId: 'user_ben_2',
    titulo: 'Libros de texto primaria',
    descripcion: 'Necesito libros de matemáticas y lengua de 5º de primaria para mis dos hijos.',
    estado: 'aprobada',
    fecha: '2026-06-18'
  },
  {
    id: 'sol_3',
    beneficiarioId: 'user_ben_1',
    titulo: 'Apoyo para pago de servicios',
    descripcion: 'Solicitud de ayuda económica puntual para abonar el recibo de la luz acumulado.',
    estado: 'rechazada',
    fecha: '2026-06-10'
  }
];

export const INITIAL_DONATIONS: Donacion[] = [
  {
    id: 'don_1',
    categoria: 'Económico',
    tipo: 'monetaria',
    fecha: '2026-06-22',
    usuarioId: 'user_vol_1',
    organizacionId: 'org_1'
  },
  {
    id: 'don_2',
    categoria: 'Alimentos',
    tipo: 'objeto',
    fecha: '2026-06-24',
    usuarioId: 'user_vol_2',
    organizacionId: 'org_2'
  }
];

export const INITIAL_DONATIONS_MONETARY: DonacionMonetaria[] = [
  {
    id: 'dm_1',
    metodo: 'tarjeta',
    cuenta: '**** **** **** 4321',
    valor: 50,
    donacionId: 'don_1'
  }
];

export const INITIAL_DONATIONS_OBJECTS: DonacionObjeto[] = [
  {
    id: 'do_1',
    categoria: 'Alimentos',
    descripcion: '10 kg de arroz, 5 kg de legumbres y aceite de oliva',
    cantidad: 15,
    donacionId: 'don_2'
  }
];
