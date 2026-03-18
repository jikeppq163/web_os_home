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
  const [showSettings, setShowSettings] = useState(false);

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
        setShowSettings(true);
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

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">设置</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Settings />
          </div>
        </div>
      )}
    </Background>
  );
};

export default App;