import AsyncStorage from '@react-native-async-storage/async-storage';
import { Organizacion } from '../types';

const ORGS_STORAGE_KEY = '@give_and_go_organizaciones';

export const INITIAL_ORGANIZACIONES: Organizacion[] = [
  {
    idOrganizacion: 101,
    nombre: 'Fundación Manos Unidas Kennedy',
    nit: '901.458.789-2',
    direccion: 'Calle 38C Sur # 78-45',
    correo: 'contacto@manosunidaskennedy.org',
    password: 'password123',
    pinSeguridad: '2026',
    localidad: 'Kennedy',
    telefono: '+57 312 456 7890',
    representanteLegal: 'Carolina Gómez Morales',
    categoria: 'Alimentos y Bienestar Social',
    mision: 'Brindar apoyo alimentario y psicosocial a familias vulnerables de la localidad de Kennedy.',
    vision: 'Ser la red solidaria líder en seguridad alimentaria comunitaria en Bogotá para 2028.',
    sitioWeb: 'https://manosunidaskennedy.org',
    redesSociales: '@fundacionkennedy_oficial',
    barrio: 'Kennedy Central',
    ciudad: 'Bogotá',
    departamento: 'Bogotá D.C.',
    pais: 'Colombia',
    fechaRegistro: Date.now() - 86400000 * 30,
    estadoVerificacion: 'verificado',
    verificada: 1,
  },
  {
    idOrganizacion: 102,
    nombre: 'Asociación Semillas de Esperanza',
    nit: '900.874.123-5',
    direccion: 'Carrera 79 # 42A-18 Sur',
    correo: 'directiva@semillasesperanza.org',
    password: 'admin2026',
    pinSeguridad: '7890',
    localidad: 'Kennedy',
    telefono: '+57 301 789 6543',
    representanteLegal: 'Jorge Eliécer Castro',
    categoria: 'Educación y Talleres',
    mision: 'Formación artística y académica para niños y jóvenes en barrios del suroccidente de Bogotá.',
    vision: 'Consolidar centros comunitarios de aprendizaje transformador en cada sector de Kennedy.',
    sitioWeb: 'https://semillasesperanza.org',
    redesSociales: '@semillas_esperanza_bog',
    barrio: 'Castilla',
    ciudad: 'Bogotá',
    departamento: 'Bogotá D.C.',
    pais: 'Colombia',
    fechaRegistro: Date.now() - 86400000 * 15,
    estadoVerificacion: 'verificado',
    verificada: 1,
  },
];

export const saveOrganizacion = async (nuevaOrg: Organizacion): Promise<Organizacion[]> => {
  try {
    const existing = await getOrganizaciones();
    const updated = [nuevaOrg, ...existing];
    await AsyncStorage.setItem(ORGS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error guardando organización en AsyncStorage:', error);
    return [];
  }
};

export const updateOrganizacionInStorage = async (updatedOrg: Organizacion): Promise<Organizacion[]> => {
  try {
    const existing = await getOrganizaciones();
    const updated = existing.map((o) =>
      o.idOrganizacion === updatedOrg.idOrganizacion ? updatedOrg : o
    );
    await AsyncStorage.setItem(ORGS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error actualizando organización en AsyncStorage:', error);
    return [];
  }
};

export const getOrganizaciones = async (): Promise<Organizacion[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(ORGS_STORAGE_KEY);
    if (jsonValue != null) {
      const parsed = JSON.parse(jsonValue);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Inicializar con organizaciones predeterminadas si no hay nada guardado
    await AsyncStorage.setItem(ORGS_STORAGE_KEY, JSON.stringify(INITIAL_ORGANIZACIONES));
    return INITIAL_ORGANIZACIONES;
  } catch (error) {
    console.error('Error obteniendo organizaciones de AsyncStorage:', error);
    return INITIAL_ORGANIZACIONES;
  }
};

export const authenticateOrganizacion = async (
  correo: string,
  password: string,
  pinSeguridad: string
): Promise<{ success: boolean; org?: Organizacion; error?: string }> => {
  const orgs = await getOrganizaciones();
  const cleanCorreo = correo.trim().toLowerCase();

  const foundOrg = orgs.find((org) => {
    const orgCorreoClean = org.correo.trim().toLowerCase();
    return orgCorreoClean === cleanCorreo;
  });

  if (!foundOrg) {
    return {
      success: false,
      error: 'No se encontró ninguna organización registrada con ese correo institucional.',
    };
  }

  if (foundOrg.password && foundOrg.password !== password) {
    return {
      success: false,
      error: 'La contraseña institucional ingresada es incorrecta.',
    };
  }

  if (foundOrg.pinSeguridad && foundOrg.pinSeguridad !== pinSeguridad.trim()) {
    return {
      success: false,
      error: 'El PIN de seguridad institucional / token de 4 dígitos no coincide con el registrado.',
    };
  }

  return { success: true, org: foundOrg };
};

export const clearOrganizaciones = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ORGS_STORAGE_KEY);
  } catch (error) {
    console.error('Error limpiando AsyncStorage:', error);
  }
};
