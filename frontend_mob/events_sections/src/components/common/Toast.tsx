import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
  autoHideDuration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  toast,
  onClose,
  autoHideDuration = 5000,
}) => {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [toast, autoHideDuration, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      id="toast-notification"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md animate-slideDown"
    >
      <div
        className={`rounded-2xl p-4 shadow-xl border flex items-start justify-between gap-3 ${
          isSuccess
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : 'bg-red-50 border-red-200 text-red-950'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${
              isSuccess ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-tight">{toast.title}</h4>
            {toast.message && (
              <p className="text-xs opacity-90 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-700 p-1 rounded-lg transition-colors"
          title="Cerrar notificación"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
