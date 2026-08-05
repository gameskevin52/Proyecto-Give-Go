import React from 'react';
import { LogIn, ArrowLeft } from 'lucide-react';

interface PaginaEnBlancoProps {
  onVolverInicio: () => void;
}

export const PaginaEnBlanco: React.FC<PaginaEnBlancoProps> = ({ onVolverInicio }) => {
  return (
    <div className="flex-1 bg-white text-slate-800 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mb-4 shadow-sm">
        <LogIn className="w-8 h-8" />
      </div>
      
      <h2 className="text-xl font-extrabold text-slate-900 mb-2">Iniciar Sesión</h2>
      <p className="text-xs text-slate-500 max-w-xs mb-8">
        Página en blanco reservada para el desarrollo futuro del módulo de Inicio de Sesión de Give&Go.
      </p>

      <button
        onClick={onVolverInicio}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors shadow-md shadow-red-600/20 active:scale-95 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver al Inicio</span>
      </button>
    </div>
  );
};
