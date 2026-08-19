/**
 * Cliente API de Give & Go Mobile
 *
 * React Native + Expo + TypeScript
 *
 * Android Studio Emulator:
 *     10.0.2.2 = localhost del computador
 *
 * Backend:
 *     http://localhost:3000
 *
 * API:
 *     http://10.0.2.2:3000/api
 */

import { Platform } from 'react-native';

/**
 * ============================================================
 * CONFIGURACIÓN DEL BACKEND
 * ============================================================
 *
 * Android Studio Emulator:
 *     http://10.0.2.2:3000/api
 *
 * Expo Go en celular físico:
 *     Debes cambiar esta dirección por la IP de tu PC.
 *
 * Ejemplo:
 *     http://192.168.1.9:3000/api
 *
 * Por ahora dejamos Android Studio como prioridad.
 */

const ANDROID_EMULATOR_API = 'http://10.0.2.2:3000/api';

const IOS_API = 'http://localhost:3000/api';

export const API_BASE_URL =
  Platform.OS === 'android'
    ? ANDROID_EMULATOR_API
    : IOS_API;

/**
 * ============================================================
 * PETICIONES HTTP
 * ============================================================
 */

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  /**
   * Evitamos problemas de / duplicado.
   *
   * Ejemplo:
   *
   * API_BASE_URL:
   * http://10.0.2.2:3000/api
   *
   * endpoint:
   * /events/
   *
   * Resultado:
   * http://10.0.2.2:3000/api/events/
   */
  const url = `${API_BASE_URL}${endpoint}`;

  console.log('====================================');
  console.log('GIVE & GO API REQUEST');
  console.log('URL:', url);
  console.log('METHOD:', options.method || 'GET');
  console.log('====================================');

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',

    /**
     * Si posteriormente conectamos el login,
     * aquí agregaremos:
     *
     * Authorization: `Bearer ${token}`
     */
  };

  const config: RequestInit = {
    ...options,

    headers: {
      ...headers,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, config);

    /**
     * Intentamos obtener la respuesta JSON.
     */
    const data = await response.json().catch(() => null);

    console.log('====================================');
    console.log('GIVE & GO API RESPONSE');
    console.log('STATUS:', response.status);
    console.log('DATA:', data);
    console.log('====================================');

    /**
     * Si el backend devuelve 400, 401, 403, 404, 500, etc.
     */
    if (!response.ok) {
  const validationErrors = Array.isArray(data?.errors)
    ? data.errors
        .map((error: any) => error.msg || error.message || String(error))
        .join('\n')
    : '';

  const errorMessage =
    validationErrors ||
    data?.message ||
    data?.error ||
    `Error del servidor (${response.status})`;

  throw new Error(errorMessage);
}

    /**
     * El backend actualmente devuelve:
     *
     * {
     *   success: true,
     *   message: "...",
     *   data: ...
     * }
     */
    return data as T;
  } catch (error: any) {
    console.error('====================================');
    console.error('GIVE & GO API ERROR');
    console.error(error);
    console.error('====================================');

    /**
     * Error típico cuando Android no puede
     * conectarse con el backend.
     */
    if (
      error?.name === 'TypeError' ||
      error?.message?.includes('Network request failed')
    ) {
      throw new Error(
        `No fue posible conectar con el backend.

URL utilizada:
${url}

Verifica que:
1. El backend esté ejecutándose.
2. El backend esté en el puerto 3000.
3. Android Studio esté ejecutando el emulador.
4. El backend acepte conexiones desde el emulador.`
      );
    }

    throw error;
  }
}