import React from 'react';
import AppIcon from '@/components/AppIcon';
import CalendarWidget from '@/components/Widgets/CalendarWidget';
import WeatherWidget from '@/components/Widgets/WeatherWidget';
import ClockWidget from '@/components/Widgets/ClockWidget';
import { AppConfig } from '@/types';

interface DesktopProps {
  desktopApps: AppConfig[];
  onAppClick: (app: AppConfig) => void;
}

const Desktop: React.FC<DesktopProps> = ({ desktopApps, onAppClick }) => {
  return (
    <main className="absolute top-10 left-0 right-0 bottom-24 md:bottom-28 p-4 md:p-10 overflow-y-auto no-scrollbar touch-pan-y">
      <div className="max-w-6xl mx-auto pb-8">
          {/* Grid Container */}
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 md:gap-y-8 md:gap-x-10 auto-rows-max">
              
              {/* Widgets Section */}
              <div className="col-span-2 row-span-2 aspect-square">
                  <ClockWidget className="w-full h-full" />
              </div>
               <div className="col-span-2 row-span-2 aspect-square">
                  <CalendarWidget className="w-full h-full" />
              </div>
               <div className="col-span-4 md:col-span-2 row-span-1 aspect-[4/1] md:aspect-[2/1]">
                  <WeatherWidget className="w-full h-full" />
              </div>
              <div className="hidden md:block col-span-2" />

              {/* Desktop Apps */}
              {desktopApps.map((app) => (
                  <div key={app.id} className="flex justify-center items-start pt-2">
                      <AppIcon app={app} onClick={onAppClick} />
                  </div>
              ))}
          </div>
      </div>
    </main>
  );
};

export default Desktop;