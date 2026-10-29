import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, registerAuthErrorListener } from '../../config/api';
import { ENV } from '../../config/env';
import { User, AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadStoredSession();

    const unsubscribe = registerAuthErrorListener(() => {
      setToken(null);
      setUser(null);
    });

    return unsubscribe;
  }, []);

  const loadStoredSession = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(ENV.STORAGE_KEYS.TOKEN);
      const storedUser = await AsyncStorage.getItem(ENV.STORAGE_KEYS.USER);

      if (storedToken && storedUser) {
        // Verificar activamente con el backend si el token sigue siendo válido
        try {
          const res = await apiClient.get('/users/profile', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          if (res.data?.success && res.data?.data) {
            setToken(storedToken);
            setUser(res.data.data);
            await AsyncStorage.setItem(ENV.STORAGE_KEYS.USER, JSON.stringify(res.data.data));
            return;
          }
        } catch (verifErr: any) {
          const status = verifErr?.response?.status;
          const msg = (verifErr?.response?.data?.message || '').toLowerCase();
          // Si el servidor rechaza el token por expiración o invalidez, limpiar sesión vieja
          if (
            status === 401 ||
            status === 403 ||
            msg.includes('expirado') ||
            msg.includes('inválido') ||
            msg.includes('token')
          ) {
            console.warn('⚠️ Sesión local expirada o token no reconocido por el servidor. Limpiando almacenamiento.');
            await AsyncStorage.removeItem(ENV.STORAGE_KEYS.TOKEN);
            await AsyncStorage.removeItem(ENV.STORAGE_KEYS.USER);
            setToken(null);
            setUser(null);
            return;
          }
        }

        // Si el backend no respondió por red o modo offline, mantener sesión local
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn('Error al recuperar sesión de AsyncStorage:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (correo: string, password: string) => {
    try {
      const res = await apiClient.post('/users/login', { correo, password });
      if (res.data.success && res.data.data?.token) {
        const authToken = res.data.data.token;
        const authUser = res.data.data.usuario || res.data.data.user;

        setToken(authToken);
        setUser(authUser);

        await AsyncStorage.setItem(ENV.STORAGE_KEYS.TOKEN, authToken);
        await AsyncStorage.setItem(ENV.STORAGE_KEYS.USER, JSON.stringify(authUser));

        return { success: true };
      }
      return { success: false, message: res.data.message || 'Error en credenciales' };
    } catch (err: any) {
      const msg = err.response?.data?.message || (err.response?.data?.errors && err.response.data.errors[0]?.mensaje) || err.message || 'Error al conectar con el servidor';
      return {
        success: false,
        message: msg,
      };
    }
  };

  const register = async (userData: any, password: string) => {
    try {
      const res = await apiClient.post('/users/register', { ...userData, password });
      if (res.data.success && res.data.data?.token) {
        const authToken = res.data.data.token;
        const authUser = res.data.data.user || res.data.data.usuario;

        setToken(authToken);
        setUser(authUser);

        await AsyncStorage.setItem(ENV.STORAGE_KEYS.TOKEN, authToken);
        await AsyncStorage.setItem(ENV.STORAGE_KEYS.USER, JSON.stringify(authUser));

        return { success: true };
      }
      return { success: false, message: res.data.message || 'Error en registro' };
    } catch (err: any) {
      const msg = err.response?.data?.message || (err.response?.data?.errors && err.response.data.errors[0]?.mensaje) || err.message || 'Error al conectar con el servidor';
      return {
        success: false,
        message: msg,
      };
    }
  };

  const registerOrganization = async (orgData: any) => {
    try {
      // 1. Create organization via POST /organizations
      const res = await apiClient.post('/organizations', orgData);
      if (!res.data.success) {
        return { success: false, message: res.data.message || 'Error al registrar organización' };
      }

      // 2. Automatically log in with credentials
      const loginRes = await login(orgData.correo, orgData.password);
      return loginRes;
    } catch (err: any) {
      const msg = err.response?.data?.message || (err.response?.data?.errors && err.response.data.errors[0]?.mensaje) || err.message || 'Error al registrar organización';
      return {
        success: false,
        message: msg,
      };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(ENV.STORAGE_KEYS.TOKEN);
      await AsyncStorage.removeItem(ENV.STORAGE_KEYS.USER);
    } catch (e) {
      console.warn('Error al cerrar sesión:', e);
    } finally {
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    AsyncStorage.setItem(ENV.STORAGE_KEYS.USER, JSON.stringify(updatedUser)).catch(console.warn);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        registerOrganization,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
