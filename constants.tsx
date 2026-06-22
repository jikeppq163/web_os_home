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
  FileText,
  Camera,
  Video,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Cloud,
  Download,
  Upload,
  Search,
  Home,
  User,
  Users,
  Heart,
  Star,
  Bookmark,
  Tag,
  Lock,
  Unlock,
  Key,
  Shield,
  Zap,
  Activity,
  BarChart,
  PieChart,
  Code,
  Database,
  Server,
  Wifi,
  Bluetooth,
  Battery,
  Monitor,
  Smartphone,
  Tablet,
  Watch,
  Printer,
  HardDrive,
  Cpu,
  Gamepad,
  Headphones,
  Speaker,
  Mic,
  Volume2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Radio,
  Tv,
  Film,
  BookOpen,
  Library,
  GraduationCap,
  Briefcase,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  DollarSign,
  TrendingUp,
  Coffee,
  Utensils,
  Plane,
  Car,
  Bike,
  Bus,
  Train,
  Anchor,
  Compass,
  Navigation,
  Flag,
  Award,
  Gift,
  PartyPopper,
  Smile,
  ThumbsUp,
} from "lucide-react";
import { AppConfig } from "./types";

// 可用图标列表
export const AVAILABLE_ICONS = [
  { name: 'calculator', label: '计算器', component: Calculator },
  { name: 'globe', label: '地球', component: Globe },
  { name: 'github', label: 'GitHub', component: Github },
  { name: 'music', label: '音乐', component: Music },
  { name: 'settings', label: '设置', component: Settings },
  { name: 'file-text', label: '文件', component: FileText },
  { name: 'terminal', label: '终端', component: Terminal },
  { name: 'mail', label: '邮件', component: Mail },
  { name: 'image', label: '图片', component: ImageIcon },
  { name: 'camera', label: '相机', component: Camera },
  { name: 'video', label: '视频', component: Video },
  { name: 'phone', label: '电话', component: Phone },
  { name: 'map-pin', label: '地图', component: MapPin },
  { name: 'clock', label: '时钟', component: Clock },
  { name: 'calendar', label: '日历', component: Calendar },
  { name: 'cloud', label: '云', component: Cloud },
  { name: 'download', label: '下载', component: Download },
  { name: 'upload', label: '上传', component: Upload },
  { name: 'search', label: '搜索', component: Search },
  { name: 'home', label: '首页', component: Home },
  { name: 'user', label: '用户', component: User },
  { name: 'users', label: '用户组', component: Users },
  { name: 'heart', label: '爱心', component: Heart },
  { name: 'star', label: '星星', component: Star },
  { name: 'bookmark', label: '书签', component: Bookmark },
  { name: 'tag', label: '标签', component: Tag },
  { name: 'lock', label: '锁定', component: Lock },
  { name: 'unlock', label: '解锁', component: Unlock },
  { name: 'key', label: '钥匙', component: Key },
  { name: 'shield', label: '盾牌', component: Shield },
  { name: 'zap', label: '闪电', component: Zap },
  { name: 'activity', label: '活动', component: Activity },
  { name: 'bar-chart', label: '柱状图', component: BarChart },
  { name: 'pie-chart', label: '饼图', component: PieChart },
  { name: 'code', label: '代码', component: Code },
  { name: 'database', label: '数据库', component: Database },
  { name: 'server', label: '服务器', component: Server },
  { name: 'wifi', label: 'WiFi', component: Wifi },
  { name: 'bluetooth', label: '蓝牙', component: Bluetooth },
  { name: 'battery', label: '电池', component: Battery },
  { name: 'monitor', label: '显示器', component: Monitor },
  { name: 'smartphone', label: '手机', component: Smartphone },
  { name: 'tablet', label: '平板', component: Tablet },
  { name: 'watch', label: '手表', component: Watch },
  { name: 'printer', label: '打印机', component: Printer },
  { name: 'hard-drive', label: '硬盘', component: HardDrive },
  { name: 'cpu', label: '处理器', component: Cpu },
  { name: 'gamepad', label: '游戏', component: Gamepad },
  { name: 'headphones', label: '耳机', component: Headphones },
  { name: 'speaker', label: '音箱', component: Speaker },
  { name: 'mic', label: '麦克风', component: Mic },
  { name: 'volume', label: '音量', component: Volume2 },
  { name: 'play', label: '播放', component: Play },
  { name: 'pause', label: '暂停', component: Pause },
  { name: 'skip-forward', label: '下一首', component: SkipForward },
  { name: 'skip-back', label: '上一首', component: SkipBack },
  { name: 'radio', label: '收音机', component: Radio },
  { name: 'tv', label: '电视', component: Tv },
  { name: 'film', label: '电影', component: Film },
  { name: 'book-open', label: '书本', component: BookOpen },
  { name: 'library', label: '图书馆', component: Library },
  { name: 'graduation-cap', label: '毕业帽', component: GraduationCap },
  { name: 'briefcase', label: '公文包', component: Briefcase },
  { name: 'shopping-bag', label: '购物袋', component: ShoppingBag },
  { name: 'shopping-cart', label: '购物车', component: ShoppingCart },
  { name: 'credit-card', label: '信用卡', component: CreditCard },
  { name: 'dollar', label: '美元', component: DollarSign },
  { name: 'trending-up', label: '趋势', component: TrendingUp },
  { name: 'coffee', label: '咖啡', component: Coffee },
  { name: 'utensils', label: '餐具', component: Utensils },
  { name: 'plane', label: '飞机', component: Plane },
  { name: 'car', label: '汽车', component: Car },
  { name: 'bike', label: '自行车', component: Bike },
  { name: 'bus', label: '公交车', component: Bus },
  { name: 'train', label: '火车', component: Train },
  { name: 'anchor', label: '锚', component: Anchor },
  { name: 'compass', label: '指南针', component: Compass },
  { name: 'navigation', label: '导航', component: Navigation },
  { name: 'flag', label: '旗帜', component: Flag },
  { name: 'award', label: '奖章', component: Award },
  { name: 'gift', label: '礼物', component: Gift },
  { name: 'party-popper', label: '庆祝', component: PartyPopper },
  { name: 'smile', label: '笑脸', component: Smile },
  { name: 'thumbs-up', label: '点赞', component: ThumbsUp },
];

// 从后端 API 获取应用配置
export const fetchApps = async (): Promise<AppConfig[]> => {
  try {
    const response = await fetch('/api/apps');
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
export const getIconComponent = (iconName: string, size: number = 32, color: string = 'white'): React.ReactNode => {
  const iconItem = AVAILABLE_ICONS.find(icon => icon.name === iconName);
  if (iconItem) {
    const IconComponent = iconItem.component;
    return <IconComponent color={color} size={size} />;
  }
  // 默认返回 Terminal
  return <Terminal color={color} size={size} />;
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
    name: "openclaw",
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
