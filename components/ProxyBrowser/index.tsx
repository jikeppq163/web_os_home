import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ShieldCheck, RotateCw, Globe, Smartphone, Maximize, ExternalLink, ArrowLeft, ArrowRight, RefreshCw, Lock } from 'lucide-react';
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
  const [url, setUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Build proxy URL from target
  const buildProxyUrl = useCallback((target: string): string => {
    if (!target) return '';
    // Already a proxy URL
    if (target.startsWith('/api/proxy/')) return target;
    // Same-origin static app (deployed via os-home-mcp) — no proxy needed
    if (target.startsWith('/static_apps/')) return target;
    // Build proxy URL
    return `/api/proxy/${encodeURIComponent(target)}`;
  }, []);

  // Navigate to a URL through the proxy
  const navigate = useCallback((target: string) => {
    if (!target) return;
    setError(null);
    setIsLoading(true);

    let resolvedUrl = target;
    // Resolve local:PORT shorthand
    if (target.startsWith('local:')) {
      const rest = target.slice(6);
      resolvedUrl = `http://127.0.0.1/${rest}`;
    } else if (target.startsWith('/static_apps/')) {
      // Same-origin static app — load directly
      resolvedUrl = target;
    } else if (!target.startsWith('http://') && !target.startsWith('https://') && !target.startsWith('/api/')) {
      resolvedUrl = `https://${target}`;
    }

    const proxyUrl = buildProxyUrl(resolvedUrl);
    setUrl(proxyUrl);
    setInputUrl(resolvedUrl);

    // Update history
    setHistory(prev => {
      const newHistory = [...prev.slice(0, historyIndex + 1), resolvedUrl];
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [buildProxyUrl, historyIndex]);

  // Initialize URL when app changes
  useEffect(() => {
    if (app && app.url && app.url !== '#/setting' && app.url !== '#/note') {
      navigate(app.url);
    }
    if (app && (app.url === '#/setting' || app.url === '#/note')) {
      setIsLoading(false);
    }
  }, [app, navigate]);

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Handle iframe error
  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load content. The target server may be unreachable.');
  };

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
    const rawUrl = inputUrl || app.url;
    if (rawUrl && rawUrl.startsWith('http')) {
      window.open(rawUrl, '_blank', 'width=1024,height=768');
    }
  };

  const handleGoBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      navigate(history[newIndex]);
    }
  };

  const handleGoForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      navigate(history[newIndex]);
    }
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      navigate(inputUrl.trim());
    }
  };

  const isInternalApp = app.url === '#/setting' || app.url === '#/note';

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

      {/* URL Address Bar */}
      {!isInternalApp && (
        <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2">
          {/* Navigation Controls */}
          <button
            onClick={handleGoBack}
            disabled={historyIndex <= 0}
            className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="后退"
          >
            <ArrowLeft size={16} className="text-slate-600" />
          </button>
          <button
            onClick={handleGoForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="前进"
          >
            <ArrowRight size={16} className="text-slate-600" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-md hover:bg-slate-100 transition-colors"
            title="刷新"
          >
            <RefreshCw size={16} className={`text-slate-600 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* URL Input */}
          <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center">
            <div className="flex-1 flex items-center bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-colors">
              <Lock size={12} className="text-green-500 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="输入网址或 local:端口/路径"
              />
            </div>
          </form>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 relative bg-white overflow-hidden" ref={contentRef}>
        {/* Loading State */}
        {isLoading && !isInternalApp && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium animate-pulse">正在通过代理加载...</p>
            <p className="text-slate-400 text-xs mt-2">Loading through proxy...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isInternalApp && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10">
            <Globe size={48} className="text-slate-300 mb-4" />
            <p className="text-slate-600 font-medium">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              重试 / Retry
            </button>
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
            <iframe
              ref={iframeRef}
              src={url}
              className="w-full h-full border-0"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              title="Proxy Content"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProxyBrowser;
