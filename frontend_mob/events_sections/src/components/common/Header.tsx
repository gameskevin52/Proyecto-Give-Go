import React from 'react';
import { ArrowLeft, Building2 } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackClick,
  rightAction,
}) => {
  return (
    <header id="giveandgo-header" className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-xs px-4 py-3 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              id="header-back-button"
              type="button"
              onClick={onBackClick}
              className="p-2 rounded-xl text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-red-500/20"
              title="Volver"
              aria-label="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600 uppercase tracking-wider">
                <Building2 className="w-3 h-3" /> Give&Go Org
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-gray-500 font-normal mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {rightAction && (
          <div className="flex items-center gap-2">
            {rightAction}
          </div>
        )}
      </div>
    </header>
  );
};
