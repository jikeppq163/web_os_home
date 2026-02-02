import React from 'react';
import { AppConfig } from '@/types';

interface AppIconProps {
  app: AppConfig;
  size?: 'normal' | 'large';
  onClick?: (app: AppConfig) => void;
}

const AppIcon: React.FC<AppIconProps> = ({ app, size = 'normal', onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(app);
    } else {
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
  };

  const iconSizeClass = size === 'large' ? 'w-20 h-20 md:w-24 md:h-24' : 'w-16 h-16 md:w-20 md:h-20';
  const textSizeClass = size === 'large' ? 'text-sm' : 'text-xs md:text-sm';

  return (
    <button 
      onClick={handleClick}
      className="group flex flex-col items-center gap-2 transition-transform duration-200 active:scale-90 hover:scale-105 focus:outline-none"
    >
      <div 
        className={`${iconSizeClass} rounded-2xl md:rounded-3xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg shadow-black/20 group-hover:shadow-xl group-hover:brightness-110 transition-all duration-300 relative overflow-hidden`}
      >
        {/* Glossy Effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        
        {/* Icon */}
        <div className="relative z-10 drop-shadow-md">
          {app.icon}
        </div>
      </div>
      <span className={`${textSizeClass} font-medium text-white drop-shadow-md tracking-wide`}>
        {app.name}
      </span>
    </button>
  );
};

export default AppIcon;
