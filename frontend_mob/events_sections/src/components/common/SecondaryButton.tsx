import React from 'react';

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  id?: string;
  variant?: 'outline' | 'ghost';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  icon,
  fullWidth = true,
  id = 'secondary-button',
  variant = 'outline',
  className = '',
  ...props
}) => {
  const baseStyles = variant === 'outline'
    ? 'bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold'
    : 'bg-transparent hover:bg-gray-100 text-gray-600 font-medium';

  return (
    <button
      id={id}
      className={`inline-flex items-center justify-center gap-2 text-sm sm:text-base py-3 px-5 rounded-xl transition-all duration-200 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-gray-300 ${baseStyles} ${
        fullWidth ? 'w-full' : 'w-auto'
      } ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
