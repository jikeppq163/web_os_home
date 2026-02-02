import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const ClockWidget: React.FC<{ className?: string }> = ({ className }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

    const getLunarDate = () => {
      // 简化的农历计算函数
      // 这里使用一个简单的算法来计算农历日期
      // 注意：这只是一个简化的实现，可能不够准确
      const year = time.getFullYear();
      const month = time.getMonth() + 1;
      const day = time.getDate();
      
      // 农历月份和日期的映射
      // 这里使用一个简单的映射，实际应用中需要更复杂的算法
      const lunarMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const lunarDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
      
      // 简单的计算：使用公历日期的月份和日期来索引农历月份和日期
      // 注意：这只是一个示例，实际应用中需要更复杂的算法
      const lunarMonth = lunarMonths[(month - 1) % 12];
      const lunarDay = lunarDays[(day - 1) % lunarDays.length];
      
      return `${lunarMonth}月${lunarDay}`;
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