import React from 'react';
import { AppConfig } from '@/types';
import AppIcon from '@/components/AppIcon';

interface DockProps {
  apps: AppConfig[];
  onAppClick: (app: AppConfig) => void;
}

const Dock: React.FC<DockProps> = ({ apps, onAppClick }) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-auto max-w-[95%] md:max-w-[90%] z-40">
        <div className="bg-white/20 backdrop-blur-2xl border border-white/20 px-3 py-3 md:px-6 md:py-4 rounded-[1.5rem] md:rounded-[2rem] flex items-end gap-3 md:gap-6 shadow-2xl transition-all hover:bg-white/30 overflow-x-auto no-scrollbar">
            {apps.map((app) => (
                <div key={app.id} className="relative group shrink-0">
                     {/* Bounce effect wrapper */}
                    <AppIcon app={app} size="normal" onClick={onAppClick} />
                    {/* Active Indicator Dot (Cosmetic) */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            ))}
        </div>
    </div>
  );
};

export default Dock;
