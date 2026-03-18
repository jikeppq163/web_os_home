import React from "react";
import {
  Calculator,
  Globe,
  Github,
  Mail,
  Music,
  Image as ImageIcon,
  Settings,
  Terminal,
} from "lucide-react";
import { AppConfig } from "./types";

// 从后端 API 获取应用配置
export const fetchApps = async (): Promise<AppConfig[]> => {
  try {
    const response = await fetch('/ms_os_home/api/apps');
    if (!response.ok) {
      throw new Error('Failed to fetch apps');
    }
    const appsData = await response.json();
    
    // 将后端返回的 icon 字符串转换为实际的 React 组件
    return appsData.map((app: any) => ({
      ...app,
      icon: getIconComponent(app.icon)
    }));
  } catch (error) {
    console.error('Error fetching apps:', error);
    // 返回默认配置作为 fallback
    return getDefaultApps();
  }
};

// 根据 icon 字符串返回对应的 React 组件
const getIconComponent = (iconName: string): React.ReactNode => {
  switch (iconName) {
    case 'calculator':
      return <Calculator color="white" size={32} />;
    case 'globe':
      return <Globe color="white" size={32} />;
    case 'github':
      return <Github color="white" size={32} />;
    case 'music':
      return <Music color="white" size={32} />;
    case 'settings':
      return <Settings color="white" size={32} />;
    default:
      return <Terminal color="white" size={32} />;
  }
};

// 默认应用配置作为 fallback
export const getDefaultApps = (): AppConfig[] => [
  {
    id: "loan-calc",
    name: "贷款规划器",
    url: "https://www.europlay.cn/AILoanCalculator/",
    icon: <Calculator color="white" size={32} />,
    color: "from-orange-400 to-orange-600",
    isDock: false,
    useVPN: true,
    requiresPassword: false,
  },
  {
    id: "open-claw-tools",
    name: "open claw",
    url: "http://lobe.europlay.cn",
    icon: <Calculator color="white" size={32} />,
    color: "from-orange-400 to-orange-600",
    isDock: false,
    useVPN: false,
    requiresPassword: false,
  },
  {
    id: "github",
    name: "GitHub",
    url: "https://github.com",
    icon: <Github color="white" size={32} />,
    color: "from-gray-700 to-gray-900",
    isDock: true,
    useVPN: false,
    requiresPassword: true,
  },
  {
    id: "browser",
    name: "Safari",
    url: "https://google.com",
    icon: <Globe color="white" size={32} />,
    color: "from-blue-400 to-blue-600",
    isDock: true,
    useVPN: true,
    requiresPassword: true,
  },
  {
    id: "music",
    name: "音乐",
    url: "https://music.163.com/#/playlist?id=717848220",
    icon: <Music color="white" size={32} />,
    color: "from-red-400 to-pink-600",
    isDock: false,
    useVPN: true,
    requiresPassword: false,
  },
  {
    id: "settings",
    name: "Settings",
    url: "#",
    icon: <Settings color="white" size={32} />,
    color: "from-gray-400 to-gray-600",
    isDock: true,
    useVPN: true,
    requiresPassword: true,
  }
];

// 初始默认应用配置
export let APPS: AppConfig[] = getDefaultApps();

// 加载应用配置
export const loadApps = async () => {
  APPS = await fetchApps();
};
