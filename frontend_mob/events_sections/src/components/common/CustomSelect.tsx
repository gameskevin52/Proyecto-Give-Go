import React from 'react';
import { AlertCircle, Tag } from 'lucide-react';
import { EventCategory } from '../../types/event';

interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
  error?: string;
  id: string;
  options: { label: string; value: EventCategory | '' }[];
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  required = false,
  error,
  id,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-gray-700">
        {label} {required && <span className="text-red-500 font-bold ml-0.5">*</span>}
      </label>

      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-gray-400 pointer-events-none flex items-center justify-center">
          <Tag className="w-4 h-4" />
        </div>

        <select
          id={id}
          className={`w-full bg-gray-50/80 border text-gray-900 text-sm rounded-xl py-3 pl-10 pr-8 appearance-none transition-all duration-150 focus:bg-white cursor-pointer ${
            error
              ? 'border-red-500 ring-2 ring-red-500/10 focus:ring-red-500/20 focus:border-red-600'
              : 'border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
          } ${className}`}
          {...props}
        >
          <option value="" disabled>
            -- Selecciona una categoría --
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3.5 pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
