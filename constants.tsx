import React from 'react';
import { 
  Calculator, 
  Globe, 
  Github, 
  Mail, 
  Music, 
  Image as ImageIcon, 
  Settings, 
  Terminal,
  Youtube,
  Twitter
} from 'lucide-react';
import { AppConfig } from './types';

// The specific app requested by the user
const LOAN_CALCULATOR: AppConfig = {
  id: 'loan-calc',
  name: '贷款计算器',
  url: 'https://www.europlay.cn/AILoanCalculator/',
  icon: <Calculator color="white" size={32} />,
  color: 'from-orange-400 to-orange-600',
  isDock: false,
};

export const WALLPAPER_URL = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop";

export const APPS: AppConfig[] = [
  LOAN_CALCULATOR,
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com',
    icon: <Github color="white" size={32} />,
    color: 'from-gray-700 to-gray-900',
    isDock: true,
    useVPN: true
  },
  {
    id: 'browser',
    name: 'Safari',
    url: 'https://google.com',
    icon: <Globe color="white" size={32} />,
    color: 'from-blue-400 to-blue-600',
    isDock: true
  },
  {
    id: 'mail',
    name: 'Mail',
    url: 'mailto:',
    icon: <Mail color="white" size={32} />,
    color: 'from-blue-500 to-cyan-500',
    isDock: true
  },
  {
    id: 'photos',
    name: 'Photos',
    url: 'https://unsplash.com',
    icon: <ImageIcon color="white" size={32} />,
    color: 'from-purple-400 to-pink-500',
    isDock: false
  },
  {
    id: 'music',
    name: 'Music',
    url: 'https://spotify.com',
    icon: <Music color="white" size={32} />,
    color: 'from-red-400 to-pink-600',
    isDock: true
  },
  {
    id: 'settings',
    name: 'Settings',
    url: '#',
    icon: <Settings color="white" size={32} />,
    color: 'from-gray-400 to-gray-600',
    isDock: false
  },
  {
    id: 'blog',
    name: 'Blog',
    url: '#',
    icon: <Terminal color="white" size={32} />,
    color: 'from-emerald-400 to-emerald-600',
    isDock: false
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://youtube.com',
    icon: <Youtube color="white" size={32} />,
    color: 'from-red-500 to-red-700',
    isDock: false,
    useVPN: true
  },
   {
    id: 'twitter',
    name: 'X',
    url: 'https://twitter.com',
    icon: <Twitter color="white" size={32} />,
    color: 'from-black to-slate-800',
    isDock: false,
    useVPN: true
  }
];
