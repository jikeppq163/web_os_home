import React, { useState } from 'react';
import { X, ShieldCheck, RotateCw, Globe } from 'lucide-react';
import { AppConfig } from '../types';

interface ProxyBrowserProps {
  isOpen: boolean;
  app: AppConfig | null;
  onClose: () => void;
}

const ProxyBrowser: React.FC<ProxyBrowserProps> = ({ isOpen, app, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen || !app) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-50">
      {/* MAC Style Window Title Bar */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center shadow-sm pt-safe-top">
        {/* MAC Window Controls */}
        <div className="flex items-center gap-2 mr-4">
          <button 
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors"
          >
          </button>
          <div className="w-3 h-3 rounded-full bg-yellow-400" >
          </div>
          <div className="w-3 h-3 rounded-full bg-green-400" />
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
      <div className="flex-1 relative bg-white overflow-hidden">
        {/* Loading / Placeholder State (Simulating Proxy) */}
        {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10 pointer-events-none">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium animate-pulse">Establishing Secure Tunnel...</p>
            </div>
        )}
        
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
      </div>
    </div>
  );
};

export default ProxyBrowser;
