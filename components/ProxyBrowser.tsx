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
      {/* Browser Toolbar */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between shadow-sm pt-safe-top">
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X size={24} className="text-slate-600" />
        </button>

        {/* Address Bar */}
        <div className="flex-1 max-w-xl mx-4 bg-white rounded-xl h-10 flex items-center px-3 gap-2 shadow-sm border border-slate-200">
          <ShieldCheck size={14} className="text-green-500" />
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">VPN PROXY</span>
          <div className="h-4 w-[1px] bg-slate-200 mx-1" />
          <span className="text-sm text-slate-600 truncate flex-1">{app.url}</span>
          <RotateCw 
            size={14} 
            className={`text-slate-400 ${isLoading ? 'animate-spin' : ''}`} 
          />
        </div>

        <div className="w-10" /> {/* Spacer for balance */}
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
