import React from 'react';
import { AlertCircle } from 'lucide-react';

interface CustomTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  error?: string;
  id: string;
  minChars?: number;
}

export const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  label,
  required = false,
  error,
  id,
  minChars = 20,
  value,
  className = '',
  ...props
}) => {
  const currentLength = typeof value === 'string' ? value.length : 0;
  const isBelowMin = minChars > 0 && currentLength < minChars && currentLength > 0;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-gray-700">
          {label} {required && <span className="text-red-500 font-bold ml-0.5">*</span>}
        </label>
        {minChars > 0 && (
          <span className={`text-[11px] font-mono ${isBelowMin ? 'text-amber-600 font-semibold' : 'text-gray-400'}`}>
            {currentLength} / {minChars} mín.
          </span>
        )}
      </div>

      <textarea
        id={id}
        value={value}
        rows={4}
        className={`w-full bg-gray-50/80 border text-gray-900 text-sm rounded-xl p-3.5 transition-all duration-150 focus:bg-white resize-y min-h-[110px] ${
          error
            ? 'border-red-500 ring-2 ring-red-500/10 focus:ring-red-500/20 focus:border-red-600'
            : 'border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
        } ${className}`}
        {...props}
      />

      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
