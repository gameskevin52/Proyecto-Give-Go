import React, { createContext, useState, useEffect, useContext } from 'react';
import { Usuario, UserRole } from '../types';
import { UserService, OrganizationService } from '../services/db';

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  login: (correo: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (userData: Omit<Usuario, 'id' | 'estado'>) => Promise<{ success: boolean; error?: string }>;
  registerOrg: (nombre: string, direccion: string, correo: string, password: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updatedData: Partial<Usuario>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Restaurar sesión desde sessionStorage
    const storedSession = sessionStorage.getItem('gg_session');
    if (storedSession) {
      try {
        const parsed = JSON.parse(storedSession);
        setUser(parsed);
      } catch (e) {
        console.error('Error restaurando sesión', e);
        sessionStorage.removeItem('gg_session');
      }
    }
    setLoading(false);
  }, []);

  const login = async (correo: string, password: string) => {
    try {
      setLoading(true);
      const matchedUser = await UserService.getByEmail(correo);

      if (!matchedUser) {
        return { success: false, error: 'El correo electrónico no está registrado.' };
      }

      if (matchedUser.password !== password) {
        return { success: false, error: 'La contraseña es incorrecta.' };
      }

      if (matchedUser.estado === 'inactivo') {
        return { success: false, error: 'Su cuenta está inactiva. Contacte al administrador.' };
      }

      // Guardar sesión en sessionStorage
      sessionStorage.setItem('gg_session', JSON.stringify(matchedUser));
      setUser(matchedUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al iniciar sesión' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('gg_session');
    setUser(null);
  };

  const register = async (userData: Omit<Usuario, 'id' | 'estado'>) => {
    try {
      setLoading(true);
      const existing = await UserService.getByEmail(userData.correo);
      if (existing) {
        return { success: false, error: 'El correo ya está registrado por otro usuario.' };
      }

      const newUser = await UserService.create({
        ...userData,
        estado: 'activo'
      });

      // Iniciar sesión automáticamente
      sessionStorage.setItem('gg_session', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al registrarse' };
    } finally {
      setLoading(false);
    }
  };

  const registerOrg = async (nombre: string, direccion: string, correo: string, password: string) => {
    try {
      setLoading(true);
      const existing = await UserService.getByEmail(correo);
      if (existing) {
        return { success: false, error: 'El correo ya está registrado por otra cuenta.' };
      }

      // Crear organización y usuario asociado
      const newOrg = await OrganizationService.create({
        nombre,
        direccion,
        correo,
        password
      });

      // Obtener el usuario que se acaba de crear automáticamente por detrás
      const matchedUser = await UserService.getByEmail(correo);
      if (matchedUser) {
        sessionStorage.setItem('gg_session', JSON.stringify(matchedUser));
        setUser(matchedUser);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al registrar organización' };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData: Partial<Usuario>) => {
    if (!user) return { success: false, error: 'No hay sesión activa.' };
    try {
      setLoading(true);
      
      // Si cambia de correo, validar que no exista duplicado
      if (updatedData.correo && updatedData.correo.toLowerCase() !== user.correo.toLowerCase()) {
        const existing = await UserService.getByEmail(updatedData.correo);
        if (existing) {
          return { success: false, error: 'El correo ya está registrado por otra cuenta.' };
        }
      }

      const updated = await UserService.update(user.id, updatedData);
      
      // Actualizar también la sesión activa
      sessionStorage.setItem('gg_session', JSON.stringify(updated));
      setUser(updated);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error al actualizar perfil' };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, registerOrg, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
