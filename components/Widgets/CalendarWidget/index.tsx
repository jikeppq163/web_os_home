import React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

const CalendarWidget: React.FC<{ className?: string }> = ({ className }) => {
  const today = new Date();

  return (
    <div className={`bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-lg flex flex-col items-start justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 ${className}`}>
      <div className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs md:text-sm">
        <CalendarIcon size={16} />
        <span>{format(today, 'EEEE')}</span>
      </div>
      <div className="flex flex-col items-center self-center">
        <span className="text-5xl md:text-6xl font-light text-slate-800 tracking-tighter">
            {format(today, 'd')}
        </span>
      </div>
      <div className="w-full text-right text-slate-500 text-xs md:text-sm font-medium">
        No events today
      </div>
      
      {/* Decorative Circle */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-red-100/50 rounded-full blur-xl pointer-events-none"></div>
    </div>
  );
};

export default CalendarWidget;