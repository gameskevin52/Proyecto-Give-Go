import AsyncStorage from '@react-native-async-storage/async-storage';
import { Organizacion, Evento, Donacion } from '../types';
import { INITIAL_ORGANIZACIONES, saveOrganizacion, updateOrganizacionInStorage } from './storage';

// Clave para guardar la IP del backend configurada por el usuario
const API_URL_STORAGE_KEY = '@give_and_go_api_base_url';

// URL por defecto para el backend de Node.js Express montado en /api
export const DEFAULT_API_BASE_URL = 'http://10.0.2.2:3000/api';

/**
 * Obtiene la URL base configurada del Backend Node.js / Express
 */
export const getApiBaseUrl = async (): Promise<string> => {
  try {
    const savedUrl = await AsyncStorage.getItem(API_URL_STORAGE_KEY);
    return savedUrl || DEFAULT_API_BASE_URL;
  } catch {
    return DEFAULT_API_BASE_URL;
  }
};

/**
 * Guarda una nueva URL base del Backend (que es ingresada en la parte superior en el login 
 */
export const setApiBaseUrl = async (url: string): Promise<void> => {
  try {
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `http://${cleanUrl}`;
    }
    if (!cleanUrl.endsWith('/api') && !cleanUrl.includes('/api/')) {
      cleanUrl = cleanUrl.endsWith('/') ? `${cleanUrl}api` : `${cleanUrl}/api`;
    }
    await AsyncStorage.setItem(API_URL_STORAGE_KEY, cleanUrl);
  } catch (error) {
    console.error('Error guardando API URL:', error);
  }
};

/**
 * Mapea un registro de la tabla 'organizaciones' de MySQL / Backend (mapOrgToFrontend)
 * a la interfaz TypeScript del frontend móvil
 */
export const mapDbToOrganizacion = (dbOrg: any): Organizacion => {
  let numericId = Date.now();
  if (typeof dbOrg.id === 'string' && dbOrg.id.startsWith('org_')) {
    numericId = parseInt(dbOrg.id.replace('org_', ''), 10) || Date.now();
  } else if (dbOrg.id_organizacion || dbOrg.idOrganizacion) {
    numericId = Number(dbOrg.id_organizacion || dbOrg.idOrganizacion);
  }

  return {
    idOrganizacion: numericId,
    nombre: String(dbOrg.nombre || ''),
    nit: String(dbOrg.nit || ''),
    direccion: String(dbOrg.direccion || ''),
    correo: String(dbOrg.correo || ''),
    password: dbOrg.password,
    pinSeguridad: String(dbOrg.pin_seguridad || dbOrg.pinSeguridad || ''),
    descripcion: String(dbOrg.descripcion || ''),
    logo: String(dbOrg.logo || '🏢'),
    localidad: String(dbOrg.localidad || 'Kennedy'),
    telefono: String(dbOrg.telefono || ''),
    representanteLegal: String(dbOrg.representante_legal || dbOrg.representanteLegal || ''),
    categoria: String(dbOrg.categoria || 'Alimentos y Bienestar Social'),
    mision: String(dbOrg.mision || ''),
    vision: String(dbOrg.vision || ''),
    sitioWeb: String(dbOrg.sitio_web || dbOrg.sitioWeb || ''),
    redesSociales: String(dbOrg.redes_sociales || dbOrg.redesSociales || ''),
    barrio: String(dbOrg.barrio || 'Kennedy Central'),
    ciudad: String(dbOrg.ciudad || 'Bogotá'),
    departamento: String(dbOrg.departamento || 'Bogotá D.C.'),
    pais: String(dbOrg.pais || 'Colombia'),
    fechaRegistro: dbOrg.fecha_registro ? new Date(dbOrg.fecha_registro).getTime() : Date.now(),
    estadoVerificacion: (dbOrg.estado_verificacion as any) || (dbOrg.estadoVerificacion as any) || 'verificado',
    verificada: typeof dbOrg.verificada === 'boolean' ? (dbOrg.verificada ? 1 : 0) : Number(dbOrg.verificada ?? 1),
  };
};

/**
 * Mapea la interfaz del frontend al formato que espera el Backend MySQL 
 */
export const mapOrganizacionToDb = (org: Organizacion): any => {
  return {
    id_organizacion: org.idOrganizacion,
    nombre: org.nombre,
    nit: org.nit,
    direccion: org.direccion,
    correo: org.correo,
    password: org.password,
    pin_seguridad: org.pinSeguridad,
    descripcion: org.descripcion,
    logo: org.logo,
    localidad: org.localidad,
    telefono: org.telefono,
    representante_legal: org.representanteLegal,
    categoria: org.categoria,
    mision: org.mision,
    vision: org.vision,
    sitio_web: org.sitioWeb,
    redes_sociales: org.redesSociales,
    barrio: org.barrio,
    ciudad: org.ciudad,
    departamento: org.departamento,
    pais: org.pais,
    estado_verificacion: org.estadoVerificacion,
    verificada: org.verificada,
  };
};

/**
 * Iniciar sesión consumiendo el Backend Node.js Express con correo y password
 */
export const loginOrganizacionApi = async (
  correo: string,
  password: string
): Promise<{ success: boolean; org?: Organizacion; error?: string; source: 'backend' | 'local' }> => {
  const baseUrl = await getApiBaseUrl();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5 seg timeout

    // 1. Primer intento: Auth general de usuarios / organizaciones en el backend
    let response = await fetch(`${baseUrl}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        correo: correo.trim().toLowerCase(),
        password: password,
      }),
      signal: controller.signal,
    }).catch(() => null);

    // 2. Si la ruta /users/login no responde 200, consultar el listado de organizaciones
    if (!response || !response.ok) {
      const orgListResponse = await fetch(`${baseUrl}/organizations`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      }).catch(() => null);

      if (orgListResponse && orgListResponse.ok) {
        const orgListData = await orgListResponse.json();
        const rawList = Array.isArray(orgListData) ? orgListData : (orgListData.data || []);
        
        const cleanCorreo = correo.trim().toLowerCase();

        const match = rawList.find((item: any) => {
          const itemCorreo = String(item.correo || '').trim().toLowerCase();
          return itemCorreo === cleanCorreo;
        });
     /**si hay coincidencia cancela temporizador de error, traduce los datos al formato correcto,
      * guarda informacion en el almacenamiento local y retorna la respuests de exito
      */
     if (match) { 
          clearTimeout(timeoutId);
          const mapped = mapDbToOrganizacion(match);
          await saveOrganizacion(mapped);
          return {
            success: true,
            org: mapped,
            source: 'backend',
          };
        }
      }
    }

    clearTimeout(timeoutId);

  /*Si la petición inicial sí respondió biencancela el temporizador y extrae 
  el objeto de la organización probando distintas propiedades
  */
    if (response && response.ok) {
      const data = await response.json();
      const rawOrg = data.data || data.organizacion || data.user || data;
      const mappedOrg = mapDbToOrganizacion(rawOrg);

      // Guardar copia local en caché
      await saveOrganizacion(mappedOrg);

      return {
        success: true,
        org: mappedOrg,
        source: 'backend',
      };
    }
  } catch (backendError) {
    console.log('Backend no disponible o timeout, validando en base local:', backendError);
  }

  // Fallback transparente: autenticación con base de datos local
  const cleanCorreo = correo.trim().toLowerCase();

  const foundOrg = INITIAL_ORGANIZACIONES.find((org) => {
    const orgCorreoClean = org.correo.trim().toLowerCase();
    return orgCorreoClean === cleanCorreo;
  });
/*Si no existe nadie con ese correo en los datos locales, 
devuelve un error indicando que no se encontró la organización
 */
  if (!foundOrg) {
    return {
      success: false,
      error: 'No se encontró la organización con ese correo institucional.',
      source: 'local',
    };
  }
  /* Si la organización existe pero la clave ingresada no coincide, devuelve el error 
  "Contraseña institucional incorrecta."
  */

  if (foundOrg.password && foundOrg.password !== password) {
    return {
      success: false,
      error: 'Contraseña institucional incorrecta.',
      source: 'local',
    };
  }
//Si el correo y la contraseña son correctos, da el acceso indicado qur la fuente fue la base de datos
  return {
    success: true,
    org: foundOrg,
    source: 'local',//osea aqui
  };
};

/**
 * Obtener listado de organizaciones desde el Backend Node.js Express (/api/organizations)
 */
export const getOrganizacionesApi = async (): Promise<Organizacion[]> => {
  const baseUrl = await getApiBaseUrl();//Busca la URL base del servidor a donde va enviar la peticion
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
  //peticion al backend
    const response = await fetch(`${baseUrl}/organizations`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const list = Array.isArray(data) ? data : data.data || [];
      return list.map(mapDbToOrganizacion);
    }
  } catch (err) {
    console.log('Error obteniendo organizaciones del backend (/api/organizations):', err);
  }
  return INITIAL_ORGANIZACIONES;
};

// Actualizar perfil de la organización en el Backend MySQL 
 
 
export const updateOrganizacionApi = async (
  org: Organizacion
): Promise<{ success: boolean; source: 'backend' | 'local'; message?: string }> => {
  const baseUrl = await getApiBaseUrl();
  const payload = mapOrganizacionToDb(org);

  try {
    const controller = new AbortController();
    // Timeout estricto de 1.8 segundos 
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const response = await fetch(`${baseUrl}/organizations/${org.idOrganizacion}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    }).catch(() => null);

    clearTimeout(timeoutId);

    if (response && (response.ok || response.status === 200)) {
      // Guardar también en almacenamiento local para consistencia offline
      await updateOrganizacionInStorage(org);
      return {
        success: true,
        source: 'backend',
        message: 'Datos guardados correctamente en la base de datos MySQL.',
      };
    }
  } catch (err) {
    console.log('Fallo actualización remota inmediata, aplicando persistencia local:', err);
  }

  // Persistir de forma segura en local storage
  await updateOrganizacionInStorage(org);
  return {
    success: true,
    source: 'local',
    message: 'Datos guardados en el almacenamiento local seguro del dispositivo.',
  };
};
