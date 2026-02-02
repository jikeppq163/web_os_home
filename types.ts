import { ReactNode } from 'react';

export interface AppConfig {
  id: string;
  name: string;
  url: string;
  icon: ReactNode;
  color: string;
  isDock?: boolean;
  useVPN?: boolean;
  requiresPassword?: boolean;
}

export interface WidgetProps {
  className?: string;
}
