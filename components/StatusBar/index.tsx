import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const StatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-8 px-4 md:px-6 flex justify-between items-center text-white text-sm font-medium z-50 select-none backdrop-blur-sm bg-black/10 fixed top-0 left-0 right-0">
      <div className="flex items-center gap-4">
        <span>{format(time, 'yyyy年MM月dd日 EEEE', { locale: zhCN })}</span>
        <span>{format(time, 'h:mm a')}</span>
      </div>
      <div className="flex items-center gap-3">
        <Signal size={16} />
        <Wifi size={16} />
        <Battery size={20} />
      </div>
    </div>
  );
};

export default StatusBar;