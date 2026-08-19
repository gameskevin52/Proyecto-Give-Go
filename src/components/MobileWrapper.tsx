import React from 'react';
import { UserPlus, LogIn, HeartHandshake, LogOut, QrCode, Terminal, UserCheck } from 'lucide-react';
import { UsuarioDB } from '../types';

interface MobileWrapperProps {
  currentScreen: 'inicio' | 'registro' | 'login' | 'cerrarSesion';
  setCurrentScreen: (screen: 'inicio' | 'registro' | 'login' | 'cerrarSesion') => void;
  currentUser: UsuarioDB | null;
  onOpenExpoModal: () => void;
  children: React.ReactNode;
}

export const MobileWrapper: React.FC<MobileWrapperProps> = ({
  currentScreen,
  setCurrentScreen,
  currentUser,
  onOpenExpoModal,
  children
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-800 flex flex-col items-center justify-center p-2 sm:p-6 font-sans">
      
      {/* Top Floating Bar: Expo Go Emulator & Terminal Trigger */}
      <div className="w-full max-w-[410px] mb-2 flex items-center justify-between px-2">
        <button
          onClick={onOpenExpoModal}
          className="px-3 py-1.5 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold flex items-center gap-1.5 shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5 text-red-400" />
          <span>Expo Go QR / Terminal</span>
        </button>

        {currentUser ? (
          <button
            onClick={() => setCurrentScreen('cerrarSesion')}
            className="px-2.5 py-1.5 rounded-full bg-red-950/80 hover:bg-red-900/90 text-red-300 border border-red-800/80 text-[11px] font-semibold flex items-center gap-1 shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span className="truncate max-w-[120px]">{currentUser.nombre1}</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>BD: Online</span>
          </div>
        )}
      </div>

      {/* Container de teléfono móvil */}
      <div className="w-full max-w-[410px] h-[780px] bg-white rounded-[44px] shadow-2xl border-[10px] border-slate-800 overflow-hidden relative flex flex-col justify-between">
        
        {/* Barra de estado superior del móvil */}
        <div className="w-full bg-red-600 text-white px-7 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold select-none z-30 flex-shrink-0">
          <span>9:41</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto -mt-1 opacity-90"></div>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="w-5 h-2.5 border border-white rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-white"></div>
            </div>
          </div>
        </div>

        {/* Contenido dinámico de la pantalla */}
        <div className="flex-1 overflow-y-auto bg-white flex flex-col">
          {children}
        </div>

        {/* Barra inferior de navegación estilo App Móvil */}
        <nav className="bg-white border-t border-slate-200/90 px-4 py-2 flex items-center justify-around z-30 flex-shrink-0 shadow-lg">
          <button
            onClick={() => setCurrentScreen('inicio')}
            className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
              currentScreen === 'inicio' ? 'text-red-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <HeartHandshake className="w-5 h-5" />
            <span className="text-[10px]">Inicio</span>
          </button>

          <button
            onClick={() => setCurrentScreen('registro')}
            className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
              currentScreen === 'registro' ? 'text-red-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span className="text-[10px]">Registrarse</span>
          </button>

          <button
            onClick={() => setCurrentScreen('login')}
            className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
              currentScreen === 'login' ? 'text-red-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <LogIn className="w-5 h-5" />
            <span className="text-[10px]">{currentUser ? 'Perfil' : 'Ingresar'}</span>
          </button>

          {currentUser && (
            <button
              onClick={() => setCurrentScreen('cerrarSesion')}
              className={`flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                currentScreen === 'cerrarSesion' ? 'text-red-600 font-bold scale-105' : 'text-red-500/80 hover:text-red-600 font-medium'
              }`}
            >
              <LogOut className="w-5 h-5" />
              <span className="text-[10px]">Cerrar Sesión</span>
            </button>
          )}
        </nav>
      </div>
    </div>
  );
};
