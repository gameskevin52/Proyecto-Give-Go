import React from 'react';
import { UserPlus, LogIn, HeartHandshake } from 'lucide-react';

interface MobileWrapperProps {
  currentScreen: 'inicio' | 'registro' | 'login';
  setCurrentScreen: (screen: 'inicio' | 'registro' | 'login') => void;
  children: React.ReactNode;
}

export const MobileWrapper: React.FC<MobileWrapperProps> = ({
  currentScreen,
  setCurrentScreen,
  children
}) => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-800 flex items-center justify-center p-2 sm:p-6 font-sans">
      {/* Container de teléfono móvil */}
      <div className="w-full max-w-[410px] h-[780px] bg-white rounded-[44px] shadow-2xl border-[10px] border-slate-800 overflow-hidden relative flex flex-col justify-between my-auto">
        
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
        <nav className="bg-white border-t border-slate-200/90 px-6 py-2.5 flex items-center justify-around z-30 flex-shrink-0 shadow-lg">
          <button
            onClick={() => setCurrentScreen('inicio')}
            className={`flex flex-col items-center gap-0.5 transition-all ${
              currentScreen === 'inicio' ? 'text-red-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <HeartHandshake className="w-5 h-5" />
            <span className="text-[10px]">Inicio</span>
          </button>

          <button
            onClick={() => setCurrentScreen('registro')}
            className={`flex flex-col items-center gap-0.5 transition-all ${
              currentScreen === 'registro' ? 'text-red-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span className="text-[10px]">Registrarse</span>
          </button>

          <button
            onClick={() => setCurrentScreen('login')}
            className={`flex flex-col items-center gap-0.5 transition-all ${
              currentScreen === 'login' ? 'text-red-600 font-bold scale-105' : 'text-slate-400 hover:text-slate-600 font-medium'
            }`}
          >
            <LogIn className="w-5 h-5" />
            <span className="text-[10px]">Iniciar Sesión</span>
          </button>
        </nav>
      </div>
    </div>
  );
};
