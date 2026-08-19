import React, { useState } from 'react';
import { 
  LogOut, 
  ArrowLeft, 
  ShieldAlert, 
  CheckCircle2, 
  Loader2, 
  User, 
  Mail, 
  Key, 
  Clock, 
  Smartphone,
  AlertTriangle
} from 'lucide-react';
import { UsuarioDB } from '../types';

interface CerrarSesionProps {
  currentUser: UsuarioDB | null;
  sessionToken?: string | null;
  onConfirmarLogout: () => void;
  onCancelar: () => void;
}

export const CerrarSesion: React.FC<CerrarSesionProps> = ({
  currentUser,
  sessionToken,
  onConfirmarLogout,
  onCancelar
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loggedOutSuccess, setLoggedOutSuccess] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Llamada real al backend para invalidar token en el servidor
      await fetch('/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: sessionToken,
          id_usuario: currentUser?.id_usuario
        })
      });
    } catch (err) {
      console.warn('Logout offline o error al contactar backend:', err);
    } finally {
      setIsLoggingOut(false);
      setLoggedOutSuccess(true);
      setTimeout(() => {
        onConfirmarLogout();
      }, 1200);
    }
  };

  if (loggedOutSuccess) {
    return (
      <div className="flex-1 bg-white text-slate-800 flex flex-col items-center justify-center p-6 text-center animate-fade-in font-sans">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-1">¡Sesión Cerrada!</h2>
        <p className="text-xs text-slate-500 max-w-xs mb-4">
          Has salido de tu cuenta de Give&Go de forma segura. Redirigiendo...
        </p>
        <Loader2 className="w-5 h-5 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white text-slate-800 flex flex-col justify-between p-5 animate-fade-in font-sans">
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-1">
          <button
            onClick={onCancelar}
            className="p-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Cerrar Sesión</span>
        </div>

        {/* Banner de Salida */}
        <div className="text-center pt-2 space-y-1">
          <div className="w-14 h-14 bg-red-50 text-red-600 border border-red-200/80 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <LogOut className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Apartado de Cierre de Sesión</h1>
          <p className="text-xs text-slate-500">
            ¿Deseas finalizar tu sesión actual en este dispositivo?
          </p>
        </div>

        {/* Resumen de la Sesión Activa */}
        {currentUser ? (
          <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Información de la Cuenta Activa</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Usuario:
                </span>
                <span className="font-bold text-slate-800">
                  {currentUser.nombre1} {currentUser.apellido1}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Correo:
                </span>
                <span className="font-medium text-slate-700">{currentUser.correo}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                  Rol / Perfil:
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                  {currentUser.rol}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Estado BD:
                </span>
                <span className="text-emerald-600 font-bold text-[11px]">Conectado (#ID: {currentUser.id_usuario})</span>
              </div>
            </div>

            {sessionToken && (
              <div className="pt-2 border-t border-slate-200/80">
                <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-1">
                  <Key className="w-3 h-3 text-slate-400" />
                  Token de Sesión Activo:
                </span>
                <p className="font-mono bg-white p-1.5 rounded-lg text-[9px] text-slate-600 truncate border border-slate-200">
                  {sessionToken}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>No hay ninguna sesión de usuario autenticada en este momento.</span>
          </div>
        )}

        {/* Advertencia de Seguridad */}
        <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
          <p className="font-semibold text-slate-700">Nota de seguridad:</p>
          <p>Al cerrar sesión se destruirá la clave de autenticación local y tendrás que volver a introducir tus credenciales para acceder.</p>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="space-y-2 pt-4">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut || !currentUser}
          className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 cursor-pointer"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Cerrando sesión en servidor...</span>
            </>
          ) : (
            <>
              <LogOut className="w-4 h-4" />
              <span>Confirmar y Cerrar Sesión</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onCancelar}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
        >
          Cancelar y Permanecer Conectado
        </button>
      </div>
    </div>
  );
};
