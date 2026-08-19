import React from 'react';
import { MyColors } from '../theme/AppTheme';

interface RoundedButtonProps {
  text: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  color?: string;
}

export const RoundedButton: React.FC<RoundedButtonProps> = ({
  text,
  onPress,
  loading = false,
  disabled = false,
  color = MyColors.primary
}) => {
  return (
    <button
      onClick={() => onPress()}
      disabled={disabled || loading}
      style={{ backgroundColor: disabled ? '#94A3B8' : color }}
      className="w-full h-11 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
};
