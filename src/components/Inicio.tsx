import React from 'react';
import { UserPlus, LogIn, HeartHandshake, LogOut, User, Sparkles } from 'lucide-react';
import { UsuarioDB } from '../types';

interface InicioProps {
  currentUser: UsuarioDB | null;
  onIrARegistro: () => void;
  onIrAIniciarSesion: () => void;
  onIrACerrarSesion: () => void;
}

export const Inicio: React.FC<InicioProps> = ({
  currentUser,
  onIrARegistro,
  onIrAIniciarSesion,
  onIrACerrarSesion,
}) => {
  return (
    <div className="flex-1 bg-white text-slate-800 flex flex-col justify-between p-6 w-full animate-fade-in font-sans">
      {/* Header / Logo Give&Go */}
      <div className="pt-8 text-center space-y-3">
        <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-red-600/20 text-white">
          <HeartHandshake className="w-10 h-10" />
        </div>
        
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Give&Go</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Aplicación Móvil • React Native / Expo</p>
        </div>

        {currentUser && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-[11px] font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Sesión activa: {currentUser.nombre1} ({currentUser.rol})</span>
          </div>
        )}
      </div>

      {/* Main Actions */}
      <div className="space-y-3.5 my-auto py-4">
        {!currentUser ? (
          <>
            <button
              onClick={onIrARegistro}
              className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-3 active:scale-98 cursor-pointer"
            >
              <UserPlus className="w-5 h-5" />
              <span>Registrarse</span>
            </button>

            <button
              onClick={onIrAIniciarSesion}
              className="w-full py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base transition-all flex items-center justify-center gap-3 active:scale-98 cursor-pointer"
            >
              <LogIn className="w-5 h-5 text-slate-600" />
              <span>Iniciar Sesión</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onIrAIniciarSesion}
              className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-base shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-3 active:scale-98 cursor-pointer"
            >
              <User className="w-5 h-5" />
              <span>Ver Mi Perfil</span>
            </button>

            <button
              onClick={onIrACerrarSesion}
              className="w-full py-4 px-6 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-base transition-all flex items-center justify-center gap-3 active:scale-98 cursor-pointer"
            >
              <LogOut className="w-5 h-5 text-red-600" />
              <span>Cerrar Sesión</span>
            </button>
          </>
        )}
      </div>

      {/* Footer info */}
      <div className="text-center text-[11px] text-slate-400 pb-2">
        Give&Go Mobile App • Expo Go Ready
      </div>
    </div>
  );
};
