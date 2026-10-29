import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { ENV } from './env';

// Detect base URL based on runtime (Expo Go, Physical Device, Emulator, Web)
export const resolveBaseUrl = (): string => {
  // 1. Variable de entorno explícita (Expo SDK 49+)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Navegador Web / AI Studio Preview
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return `${window.location.origin}/api`;
  }

  // 3. Detección automática de IP en Expo Go (Dispositivo Físico conectado por WiFi a la PC)
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).manifest?.debuggerHost || (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:3000/api`;
    }
  }

  // 4. Emuladores nativos
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api'; // Loopback del emulador Android hacia la máquina anfitrión
  }

  // 5. Simulador iOS o por defecto
  return 'http://localhost:3000/api';
};

export const getBaseUrl = (): string => {
  try {
    return resolveBaseUrl();
  } catch {
    return 'http://localhost:3000/api';
  }
};

export const BASE_URL = getBaseUrl();

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT Bearer Token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(ENV.STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Error reading auth token in mobile interceptor:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

type AuthErrorCallback = () => void;
let authErrorCallbacks: AuthErrorCallback[] = [];

export const registerAuthErrorListener = (callback: AuthErrorCallback) => {
  authErrorCallbacks.push(callback);
  return () => {
    authErrorCallbacks = authErrorCallbacks.filter((cb) => cb !== callback);
  };
};

export const triggerAuthError = () => {
  authErrorCallbacks.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.warn('Error executing auth callback:', e);
    }
  });
};

// Interceptor to detect expired/invalid tokens and clean local storage
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      const msg = (data?.message || '').toLowerCase();
      const code = data?.code;

      // 401 (Unauthorized) or 403 (Invalid/Expired token)
      if (
        status === 401 ||
        code === 'TOKEN_EXPIRED' ||
        (status === 403 && (msg.includes('token') || msg.includes('expirado') || msg.includes('inválido')))
      ) {
        console.warn('⚠️ Sesión expirada o token inválido detectado por el cliente. Limpiando almacenamiento...');
        try {
          await AsyncStorage.removeItem(ENV.STORAGE_KEYS.TOKEN);
          await AsyncStorage.removeItem(ENV.STORAGE_KEYS.USER);
        } catch (storageErr) {
          console.warn('Error limpiando AsyncStorage:', storageErr);
        }
        triggerAuthError();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
