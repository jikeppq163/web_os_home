import React, { useState, useEffect } from 'react';
import StatusBar from '@/components/StatusBar';
import Dock from '@/components/Dock';
import Background from '@/components/Background';
import Desktop from '@/components/Desktop';
import PasswordModal from '@/components/PasswordModal';
import ProxyBrowser from '@/components/ProxyBrowser';
import Settings from '@/components/Settings';
import { APPS, loadApps } from '@/constants';
import { AppConfig } from '@/types';

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
    // 加载后端配置
    const init = async () => {
      await loadApps();
      // Simulate boot up fade-in
      setTimeout(() => setIsLoaded(true), 100);
    };
    
    init();
  }, []);

  const handleAppClick = (app: AppConfig) => {
    if (app.id === 'settings') {
        // Special handling for settings app
        setActiveApp({...app, url: '#/setting'});
        // Check if the app requires password
        const needsPassword = app.requiresPassword ?? false;
        if (isAuthenticated || !needsPassword) {
            // Already authenticated or app doesn't require password, skip password
            setShowBrowser(true);
        } else {
            // Start auth flow
            setShowPasswordModal(true);
        }
    } else if (app.useVPN) {
        setActiveApp(app);
        // Check if the app requires password
        const needsPassword = app.requiresPassword ?? false;
        if (isAuthenticated || !needsPassword) {
            // Already authenticated or app doesn't require password, skip password
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
    <Background isLoaded={isLoaded}>
      {/* Top Status Bar */}
      <StatusBar />

      {/* Main Desktop Area */}
      <Desktop 
        desktopApps={desktopApps} 
        onAppClick={handleAppClick} 
      />

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
    </Background>
  );
};

export default App;