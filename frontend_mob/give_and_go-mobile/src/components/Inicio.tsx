import React from 'react';
import { UserPlus, LogIn, HeartHandshake } from 'lucide-react';

interface InicioProps {
  onIrARegistro: () => void;
  onIrAIniciarSesion: () => void;
}

export const Inicio: React.FC<InicioProps> = ({
  onIrARegistro,
  onIrAIniciarSesion,
}) => {
  return (
    <div className="flex-1 bg-white text-slate-800 flex flex-col justify-between p-6 w-full animate-fade-in">
      {/* Header / Logo Give&Go */}
      <div className="pt-8 text-center space-y-3">
        <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-red-600/20 text-white">
          <HeartHandshake className="w-10 h-10" />
        </div>
        
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Give&Go</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Aplicación Móvil</p>
        </div>
      </div>

      {/* Main Actions (2 botones sencillos) */}
      <div className="space-y-4 my-auto py-6">
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
      </div>

      {/* Footer info */}
      <div className="text-center text-[11px] text-slate-400 pb-2">
        Give&Go Mobile App
      </div>
    </div>
  );
};
