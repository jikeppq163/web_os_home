import React from 'react';
import { AppConfig } from '@/types';

interface AppIconProps {
  app: AppConfig;
  size?: 'normal' | 'large';
  onClick?: (app: AppConfig) => void;
}

// 预定义的颜色映射表 - 确保 Tailwind 能检测到这些类名
const validColors = [
  'from-gray-700 to-gray-900',
  'from-blue-400 to-blue-600',
  'from-red-400 to-pink-600',
  'from-gray-400 to-gray-600',
  'from-green-400 to-green-600',
  'from-orange-400 to-orange-600',
  'from-purple-400 to-purple-600',
  'from-yellow-400 to-yellow-600',
  'from-pink-400 to-pink-600',
  'from-cyan-400 to-cyan-600',
  'from-indigo-400 to-indigo-600',
  'from-teal-400 to-teal-600',
] as const;

// 默认颜色
const DEFAULT_COLOR = 'from-gray-400 to-gray-600';

/**
 * 获取有效的颜色类名
 * 如果传入的颜色不在预定义列表中，则返回默认颜色
 */
const getValidColor = (color: string): string => {
  // 检查颜色是否在有效列表中
  if (validColors.includes(color as typeof validColors[number])) {
    return color;
  }
  
  // 尝试匹配部分颜色（兼容旧数据）
  const matchedColor = validColors.find(validColor => 
    color.includes(validColor.split(' ')[0].replace('from-', ''))
  );
  
  if (matchedColor) {
    return matchedColor;
  }
  
  // 返回默认颜色
  console.warn(`[AppIcon] 未知的颜色: "${color}"，使用默认颜色`);
  return DEFAULT_COLOR;
};

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
  
  // 获取有效的颜色类名
  const colorClass = getValidColor(app.color);

  return (
    <button 
      onClick={handleClick}
      className="group flex flex-col items-center gap-2 transition-transform duration-200 active:scale-90 hover:scale-105 focus:outline-none"
    >
      <div 
        className={`${iconSizeClass} rounded-2xl md:rounded-3xl bg-linear-to-br ${colorClass} flex items-center justify-center shadow-lg shadow-black/20 group-hover:shadow-xl group-hover:brightness-110 transition-all duration-300 relative overflow-hidden`}
      >
        {/* Glossy Effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-linear-to-b from-white/20 to-transparent pointer-events-none" />
        
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
export { validColors, DEFAULT_COLOR, getValidColor };
