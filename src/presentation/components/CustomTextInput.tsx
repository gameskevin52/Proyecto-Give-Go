import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CustomTextInputProps {
  icon?: LucideIcon;
  image?: string;
  placeholder: string;
  value: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  secureTextEntry?: boolean;
  property: string;
  onChangeText: (property: string, value: string) => void;
  required?: boolean;
}

export const CustomTextInput: React.FC<CustomTextInputProps> = ({
  icon: Icon,
  placeholder,
  value,
  keyboardType = 'default',
  secureTextEntry = false,
  property,
  onChangeText,
  required = false
}) => {
  return (
    <div className="flex flex-col space-y-1 my-2">
      <div className="flex items-center border-b border-slate-300 focus-within:border-red-600 transition-colors pb-1.5 pt-1">
        {Icon && <Icon className="w-5 h-5 text-slate-400 mr-2 shrink-0" />}
        <input
          type={secureTextEntry ? 'password' : keyboardType === 'email-address' ? 'email' : keyboardType === 'numeric' || keyboardType === 'phone-pad' ? 'tel' : 'text'}
          placeholder={placeholder + (required ? ' *' : '')}
          value={value}
          onChange={(e) => onChangeText(property, e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-slate-800 text-xs placeholder:text-slate-400 px-1 py-1 font-sans"
        />
      </div>
    </div>
  );
};
