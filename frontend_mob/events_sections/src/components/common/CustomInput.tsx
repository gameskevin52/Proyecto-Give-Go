import React from 'react';
import { AlertCircle } from 'lucide-react';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
  id: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  required = false,
  error,
  icon,
  helperText,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-gray-700 flex items-center justify-between">
        <span>
          {label} {required && <span className="text-red-500 font-bold ml-0.5">*</span>}
        </span>
      </label>

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-gray-400 pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}

        <input
          id={id}
          className={`w-full bg-gray-50/80 border text-gray-900 text-sm rounded-xl py-3 text-left transition-all duration-150 focus:bg-white ${
            icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 ${
            error
              ? 'border-red-500 ring-2 ring-red-500/10 focus:ring-red-500/20 focus:border-red-600'
              : 'border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
          } ${className}`}
          {...props}
        />
      </div>

      {error ? (
        <p id={`${id}-error`} className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-gray-500 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};
