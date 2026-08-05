import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface TimePickerProps {
  label: string;
  required?: boolean;
  error?: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  helperText?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  required = false,
  error,
  id,
  value,
  onChange,
  helperText,
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-gray-700">
        {label} {required && <span className="text-red-500 font-bold ml-0.5">*</span>}
      </label>

      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-gray-400 pointer-events-none flex items-center justify-center">
          <Clock className="w-4 h-4" />
        </div>

        <input
          type="time"
          id={id}
          value={value}
          onChange={onChange}
          className={`w-full bg-gray-50/80 border text-gray-900 text-sm rounded-xl py-3 pl-10 pr-3.5 transition-all duration-150 focus:bg-white cursor-pointer ${
            error
              ? 'border-red-500 ring-2 ring-red-500/10 focus:ring-red-500/20 focus:border-red-600'
              : 'border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
          }`}
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
