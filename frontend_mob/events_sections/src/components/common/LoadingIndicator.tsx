import React from 'react';
import { Loader2, HeartHandshake } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Procesando en Give&Go...',
}) => {
  return (
    <div id="loading-overlay" className="fixed inset-0 bg-white/80 backdrop-blur-xs z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col items-center max-w-xs w-full text-center animate-scaleUp">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
            <HeartHandshake className="w-8 h-8 animate-pulse" />
          </div>
          <Loader2 className="w-20 h-20 text-red-600 animate-spin absolute -top-2 -left-2 opacity-80" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mt-2">{message}</h3>
        <p className="text-xs text-gray-500 mt-1">Conectando con el servidor...</p>
      </div>
    </div>
  );
};
