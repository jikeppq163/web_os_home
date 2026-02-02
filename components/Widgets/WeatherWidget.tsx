import React from 'react';
import { CloudSun, MapPin } from 'lucide-react';

const WeatherWidget: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-4 md:p-5 shadow-lg flex flex-col justify-between text-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 ${className}`}>
        <div className="flex justify-between items-start z-10">
            <div className="flex flex-col">
                <span className="text-base md:text-lg font-semibold flex items-center gap-1">
                    <MapPin size={14} className="opacity-80"/> Beijing
                </span>
                <span className="text-xs md:text-sm opacity-80">Sunny</span>
            </div>
            <CloudSun className="text-yellow-300 animate-pulse w-6 h-6 md:w-8 md:h-8" />
        </div>

        <div className="z-10">
            <span className="text-4xl md:text-5xl font-light">24°</span>
            <div className="text-xs opacity-70 mt-1">H: 28° L: 19°</div>
        </div>

         {/* Decorative elements */}
         <div className="absolute top-[-20%] left-[-10%] w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
    </div>
  );
};

export default WeatherWidget;