import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, RotateCw, Globe, Smartphone, Maximize, ExternalLink } from 'lucide-react';
import { AppConfig } from '@/types';
import Settings from '@/components/Settings';
import NoteApp from '@/components/NoteApp';

interface ProxyBrowserProps {
  isOpen: boolean;
  app: AppConfig | null;
  onClose: () => void;
}

const ProxyBrowser: React.FC<ProxyBrowserProps> = ({ isOpen, app, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMode, setIsMobileMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 当应用是设置或记事本时，立即设置为加载完成
    if (app && (app.url === '#/setting' || app.url === '#/note')) {
      setIsLoading(false);
    }
  }, [app]);

  if (!isOpen || !app) return null;

  const handleMobileMode = () => {
    setIsMobileMode(!isMobileMode);
    setIsFullscreen(false);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setIsMobileMode(false);
  };

  const handleNewWindow = () => {
    if (app.url && app.url.startsWith('http')) {
      window.open(app.url, '_blank', 'width=1024,height=768');
    }
  };

  return (
    <div className={`mt-8 fixed inset-0 z-[60] flex flex-col bg-slate-50 ${isFullscreen ? '!mt-0' : ''}`}>
      {/* MAC Style Window Title Bar */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center shadow-sm pt-safe-top">
        {/* Window Controls */}
        <div className="flex items-center gap-3 mr-4">
          <button 
            onClick={onClose}
            className="p-1 rounded-md hover:bg-slate-200 transition-colors"
            title="关闭"
          >
            <X size={16} className="text-red-500" />
          </button>
          <button 
            onClick={handleMobileMode}
            className={`p-1 rounded-md transition-colors ${isMobileMode ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
            title="手机尺寸模式"
          >
            <Smartphone size={16} className="text-blue-500" />
          </button>
          <button 
            onClick={handleFullscreen}
            className={`p-1 rounded-md transition-colors ${isFullscreen ? 'bg-slate-200' : 'hover:bg-slate-200'}`}
            title="全屏模式"
          >
            <Maximize size={16} className="text-green-500" />
          </button>
          <button 
            onClick={handleNewWindow}
            className="p-1 rounded-md hover:bg-slate-200 transition-colors"
            title="在新窗口打开"
          >
            <ExternalLink size={16} className="text-purple-500" />
          </button>
        </div>

        {/* Window Title */}
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-green-500" />
            <span className="text-sm font-semibold text-slate-700 truncate">{app.name}</span>
            {isLoading && (
              <RotateCw 
                size={14} 
                className="text-slate-400 animate-spin ml-2" 
              />
            )}
          </div>
        </div>

        <div className="w-16" /> {/* Spacer for balance */}
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-white overflow-hidden" ref={contentRef}>
        {/* Loading / Placeholder State (Simulating Proxy) */}
        {isLoading && app.url !== '#/setting' && app.url !== '#/note' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 pointer-events-none">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium animate-pulse">Establishing Secure Tunnel...</p>
            </div>
        )}
        
        {/* Content Container */}
        <div className={`w-full h-full transition-all duration-300 ${isMobileMode ? 'max-w-md mx-auto border border-slate-200 rounded-lg shadow-lg overflow-hidden' : ''}`}>
            {/* Settings Page */}
            {app.url === '#/setting' ? (
                <div className="h-full overflow-y-auto">
                    <Settings />
                </div>
            ) : app.url === '#/note' ? (
                <NoteApp />
            ) : (
                <>
                    {/* 
                       NOTE: Many major sites (GitHub, Google, Twitter) have X-Frame-Options: DENY headers.
                       They will refuse to connect in a real iframe. 
                       Since this is a frontend demo, we attempt to load it, but if it fails, it's expected behavior for a mock.
                       For a real app, you would need a server-side proxy to rewrite headers.
                    */}
                    <iframe 
                        src={app.url}
                        className="w-full h-full border-0"
                        onLoad={() => setIsLoading(false)}
                        sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
                        title="Proxy Content"
                    />

                    {/* Fallback visual if iframe refuses to connect (Common in demos) */}
                    <div className="absolute inset-0 -z-10 flex flex-col items-center justify-center text-slate-300">
                        <Globe size={64} className="mb-4 opacity-20" />
                        <p>Content Loading...</p>
                    </div>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProxyBrowser;
