import React, { useState, useEffect } from 'react';
import StatusBar from './components/StatusBar';
import Dock from './components/Dock';
import AppIcon from './components/AppIcon';
import CalendarWidget from './components/Widgets/CalendarWidget';
import WeatherWidget from './components/Widgets/WeatherWidget';
import ClockWidget from './components/Widgets/ClockWidget';
import PasswordModal from './components/PasswordModal';
import ProxyBrowser from './components/ProxyBrowser';
import { APPS, WALLPAPER_URL } from './constants';
import { AppConfig } from './types';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeApp, setActiveApp] = useState<AppConfig | null>(null);
  
  // Auth State - Lazy initialization from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('vpn_authorized') === 'true';
  });
  
  // UI States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBrowser, setShowBrowser] = useState(false);

  useEffect(() => {
    // Simulate boot up fade-in
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleAppClick = (app: AppConfig) => {
    if (app.useVPN) {
        setActiveApp(app);
        if (isAuthenticated) {
            // Already authenticated, skip password
            setShowBrowser(true);
        } else {
            // Start auth flow
            setShowPasswordModal(true);
        }
    } else {
        // Standard app, open in new tab
        window.open(app.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePasswordSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('vpn_authorized', 'true'); // Cache the auth state
    setShowPasswordModal(false);
    setShowBrowser(true);
  };

  const handleCloseBrowser = () => {
    setShowBrowser(false);
    setActiveApp(null);
  };

  const dockApps = APPS.filter(app => app.isDock);
  const desktopApps = APPS.filter(app => !app.isDock);

  return (
    <div 
      className="relative w-screen h-screen bg-cover bg-center overflow-hidden transition-opacity duration-1000 ease-in-out"
      style={{ 
        backgroundImage: `url(${WALLPAPER_URL})`,
        opacity: isLoaded ? 1 : 0
      }}
    >
      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Top Status Bar */}
      <StatusBar />

      {/* Main Desktop Area */}
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
                        <AppIcon app={app} onClick={handleAppClick} />
                    </div>
                ))}
            </div>
        </div>
      </main>

      {/* Bottom Dock */}
      <Dock apps={dockApps} onAppClick={handleAppClick} />
      
      {/* Home Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-50 pointer-events-none" />

      {/* ICP License */}
      <div className="absolute bottom-0 left-0 right-0 text-center text-white/60 text-xs z-50">
        备案号:<a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">粤ICP备2024264292号</a>
      </div>

      {/* Modals */}
      <PasswordModal 
        isOpen={showPasswordModal} 
        onSuccess={handlePasswordSuccess}
        onCancel={() => {
            setShowPasswordModal(false);
            setActiveApp(null);
        }}
      />

      <ProxyBrowser 
        isOpen={showBrowser}
        app={activeApp}
        onClose={handleCloseBrowser}
      />
    </div>
  );
};

export default App;