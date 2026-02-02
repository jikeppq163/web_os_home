import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'ouyuan') {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
      // Shake animation reset
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className={`bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 w-full max-w-sm shadow-2xl transform transition-transform duration-200 ${error ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
        style={{ animation: error ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : 'none' }}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
            <Lock className="text-slate-500" size={32} />
          </div>
          
          <div className="text-center">
            <h2 className="text-xl font-bold text-slate-800">Security Check</h2>
            <p className="text-slate-500 text-sm mt-1">Enter password to access VPN</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-center text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400"
              autoFocus
            />
            <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors"
            >
                <ArrowRight size={16} />
            </button>
          </form>
          
          <button 
            onClick={onCancel}
            className="text-slate-400 text-sm hover:text-slate-600 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
      <style>{`
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default PasswordModal;
