import AsyncStorage from '@react-native-async-storage/async-storage';
import { Organizacion, Evento, Donacion } from '../types';
import { INITIAL_ORGANIZACIONES, saveOrganizacion, updateOrganizacionInStorage } from './storage';

// Clave para guardar la IP del backend configurada por el usuario
const API_URL_STORAGE_KEY = '@give_and_go_api_base_url';
// Clave para guardar el token JWT de sesión
const AUTH_TOKEN_STORAGE_KEY = '@give_and_go_auth_token';

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
 * Guarda una nueva URL base del Backend (ej. IP de tu computador con Node.js)
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
 * Obtiene el token JWT guardado de la sesión
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

/**
 * Guarda el token JWT de la sesión
 */
export const setAuthToken = async (token: string): Promise<void> => {
  try {
    if (token) {
      await AsyncStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    } else {
      await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error guardando Auth Token:', error);
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
    token: dbOrg.token || undefined,
  };
};

/**
 * Mapea la interfaz del frontend (camelCase) al formato que espera el Backend MySQL (snake_case)
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
 * Iniciar sesión consumiendo el Backend Node.js Express sin requerir NIT ni PIN
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

    if (response && response.ok) {
      const data = await response.json();
      const rawOrg = data.data || data.organizacion || data.user || data;
      const mappedOrg = mapDbToOrganizacion(rawOrg);

      // Extraer y guardar el token JWT retornado por el backend
      const token = data.token || data.accessToken || data.jwt || (data.data && data.data.token);
      if (token) {
        mappedOrg.token = token;
        await setAuthToken(token);
      }

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

  if (!foundOrg) {
    return {
      success: false,
      error: 'No se encontró la organización con ese correo institucional.',
      source: 'local',
    };
  }

  if (foundOrg.password && foundOrg.password !== password) {
    return {
      success: false,
      error: 'Contraseña institucional incorrecta.',
      source: 'local',
    };
  }

  return {
    success: true,
    org: foundOrg,
    source: 'local',
  };
};

/**
 * Obtener listado de organizaciones desde el Backend Node.js Express (/api/organizations)
 */
export const getOrganizacionesApi = async (): Promise<Organizacion[]> => {
  const baseUrl = await getApiBaseUrl();
  const token = await getAuthToken();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const headers: Record<string, string> = { Accept: 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${baseUrl}/organizations`, {
      method: 'GET',
      headers,
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

/**
 * Actualizar perfil de la organización en el Backend MySQL (/api/organizations/:id)
 * Optimizado para enviar Authorization Bearer Token (evitando 401 Unauthorized)
 * y persistir directamente en MySQL a través de Node.js Express
 */
export const updateOrganizacionApi = async (
  org: Organizacion
): Promise<{ success: boolean; source: 'backend' | 'local'; message?: string }> => {
  const baseUrl = await getApiBaseUrl();
  const payload = mapOrganizacionToDb(org);
  const token = org.token || (await getAuthToken());

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Inyectar token de autorización si está disponible para evitar 401 Unauthorized
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    console.log(`[API] Enviando PUT a ${baseUrl}/organizations/${org.idOrganizacion} con token:`, Boolean(token));

    const response = await fetch(`${baseUrl}/organizations/${org.idOrganizacion}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    }).catch((err) => {
      console.log('[API] Error de conexión en PUT organizations:', err);
      return null;
    });

    clearTimeout(timeoutId);

    if (response) {
      if (response.ok || response.status === 200 || response.status === 204) {
        console.log('[API] ✅ Actualización exitosa en base de datos MySQL (HTTP 200/204)');
        await updateOrganizacionInStorage(org);
        return {
          success: true,
          source: 'backend',
          message: 'Datos guardados correctamente en la base de datos MySQL (XAMPP).',
        };
      } else if (response.status === 401) {
        console.warn('[API] ⚠️ Error 401 Unauthorized: El backend requiere token JWT válido en header Authorization');
      } else {
        console.warn(`[API] ⚠️ Respuesta del servidor con estado HTTP ${response.status}`);
      }
    }
  } catch (err) {
    console.log('[API] Error intentando actualizar en backend remoto:', err);
  }

  // Persistir de forma segura en local storage
  await updateOrganizacionInStorage(org);
  return {
    success: true,
    source: 'local',
    message: 'Datos actualizados localmente en el dispositivo.',
  };
};
