// Cliente HTTP para comunicación entre la Aplicación Móvil / Web y la API Backend + MySQL

const DEFAULT_PORT = '3000';

export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const savedUrl = window.localStorage.getItem('GIVEANDGO_API_URL');
    if (savedUrl) return savedUrl;
  }

  // Priorizar variable de entorno API_BASE_URL o EXPO_PUBLIC_API_BASE_URL
  const envUrl = process.env.API_BASE_URL || process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envUrl) return envUrl;

  // Si estamos en entorno de navegador web, usar el origen actual
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin;
  }

  return `http://localhost:${DEFAULT_PORT}`;
};

export const setApiBaseUrl = (newUrl: string): string => {
  let formatted = newUrl.trim();
  if (!formatted.startsWith('http://') && !formatted.startsWith('https://')) {
    formatted = `http://${formatted}`;
  }
  // Eliminar barra final si la tiene
  formatted = formatted.replace(/\/+$/, '');
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('GIVEANDGO_API_URL', formatted);
  }
  return formatted;
};

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  let data: any;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = { text: await response.text() };
  }

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const apiService = {
  // 1. Verificación de Salud y Diagnóstico de MySQL
  checkHealth: async () => {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<any>(res);
  },

  // 2. Autenticación
  login: async (correo: string, password: string) => {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password }),
    });
    return handleResponse<any>(res);
  },

  register: async (userData: any) => {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse<any>(res);
  },

  // 3. Donaciones Monetarias y Objetos (Efectúa la Transacción en MySQL)
  createMonetaryDonation: async (data: {
    usuario_id?: number;
    organizacion_id?: number | string;
    categoria?: string;
    metodo?: string;
    cuenta?: string;
    valor: number;
    observaciones?: string;
  }) => {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/donaciones/monetaria`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  createObjectDonation: async (data: {
    usuario_id?: number;
    organizacion_id?: number | string;
    categoria: string;
    descripcion: string;
    cantidad: number;
    observaciones?: string;
  }) => {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/donaciones/objeto`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  fetchDonations: async () => {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/donaciones`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<any>(res);
  },

  // 4. Organizaciones
  fetchOrganizations: async () => {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/organizaciones`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<any>(res);
  },

  requestVerification: async (data: any) => {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/organizaciones/verificacion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  // 5. Eventos y Postulaciones
  fetchEvents: async () => {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/eventos`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<any>(res);
  },

  applyToEvent: async (data: {
    id_evento: number;
    id_usuario: number;
    tipo_postulacion: 'voluntario' | 'beneficiario';
    observaciones?: string;
  }) => {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/eventos/postulacion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  // 6. Solicitudes
  fetchRequests: async () => {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/solicitudes`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<any>(res);
  },

  createRequest: async (data: { usuario_id: number; titulo: string; descripcion: string }) => {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/solicitudes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  // 7. Auditorías
  fetchAudits: async () => {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/auditorias`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse<any>(res);
  },
};
