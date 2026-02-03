import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { getLunar } from 'chinese-lunar-calendar';

const ClockWidget: React.FC<{ className?: string }> = ({ className }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

    const getLunarDate = () => {
      const lunar = getLunar(time.getFullYear(), time.getMonth() + 1, time.getDate());
      return lunar.dateStr;
    };

    return (
        <div className={`bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-6 shadow-lg flex flex-col justify-center items-center text-white relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 ${className}`}>
             <span className="text-4xl md:text-5xl lg:text-6xl font-thin tracking-wider tabular-nums">
                {format(time, 'HH:mm')}
             </span>
             <span className="text-base md:text-lg lg:text-xl font-light opacity-80 mt-2">
                {format(time, 'MMMM do', { locale: zhCN })}
             </span>
             <span className="text-sm md:text-base font-light opacity-60 mt-1">
                {getLunarDate()}
             </span>
        </div>
    );
};

export default ClockWidget;