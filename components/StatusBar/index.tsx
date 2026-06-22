import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, SignalHigh, SignalLow, SignalZero, Lock, LockOpen } from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface StatusBarProps {
  isAuthenticated?: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ isAuthenticated = false }) => {
  const [time, setTime] = useState(new Date());
  const [isServerConnected, setIsServerConnected] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showLockTooltip, setShowLockTooltip] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const response = await fetch('/api/apps', {
          method: 'HEAD',
          signal: AbortSignal.timeout(5000)
        });
        setIsServerConnected(response.ok);
      } catch {
        setIsServerConnected(false);
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const SignalIcon = isServerConnected ? SignalHigh : SignalZero;

  return (
    <div className="w-full h-8 px-4 md:px-6 flex justify-between items-center text-white text-sm font-medium z-50 select-none backdrop-blur-sm bg-black/10 fixed top-0 left-0 right-0">
      <div className="flex items-center gap-4">
        <span>{format(time, 'yyyy年MM月dd日 EEEE', { locale: zhCN })}</span>
        <span>{format(time, 'h:mm a')}</span>
      </div>
      <div className="flex items-center gap-3">
        {/* Password Lock Status */}
        <div
          className="relative"
          onMouseEnter={() => setShowLockTooltip(true)}
          onMouseLeave={() => setShowLockTooltip(false)}
        >
          {isAuthenticated ? (
            <LockOpen size={15} className="text-green-300" />
          ) : (
            <Lock size={15} className="text-yellow-300" />
          )}
          {showLockTooltip && (
            <div className="absolute right-0 top-full mt-2 px-3 py-1.5 bg-black/70 text-white text-xs rounded-md whitespace-nowrap shadow-lg z-50">
              {isAuthenticated ? '已解锁' : '已锁定'}
              <div className="absolute -top-1 right-2 w-2 h-2 bg-black/70 rotate-45"></div>
            </div>
          )}
        </div>

        {/* Server Connection Status */}
        <div
          className="relative"
          onMouseEnter={() => !isServerConnected && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <SignalIcon
            size={16}
            className={isServerConnected ? 'text-white' : 'text-red-400'}
          />
          {showTooltip && !isServerConnected && (
            <div className="absolute right-0 top-full mt-2 px-3 py-1.5 bg-red-500 text-white text-xs rounded-md whitespace-nowrap shadow-lg">
              服务器失联
              <div className="absolute -top-1 right-2 w-2 h-2 bg-red-500 rotate-45"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusBar;