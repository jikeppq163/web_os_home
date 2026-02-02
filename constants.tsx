import React from 'react';
import { 
  Calculator, 
  Globe, 
  Github, 
  Mail, 
  Music, 
  Image as ImageIcon, 
  Settings, 
  Terminal
} from 'lucide-react';
import { AppConfig } from './types';

// The specific app requested by the user
const LOAN_CALCULATOR: AppConfig = {
  id: 'loan-calc',
  name: '贷款规划器',
  url: 'https://www.europlay.cn/AILoanCalculator/',
  icon: <Calculator color="white" size={32} />,
  color: 'from-orange-400 to-orange-600',
  isDock: false,
  useVPN: true,
  requiresPassword: false
};

export const APPS: AppConfig[] = [
  LOAN_CALCULATOR,
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com',
    icon: <Github color="white" size={32} />,
    color: 'from-gray-700 to-gray-900',
    isDock: true,
    useVPN: true,
    requiresPassword: true
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
    name: '音乐',
    url: 'https://music.163.com/#/playlist?id=717848220',
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
  }
];
