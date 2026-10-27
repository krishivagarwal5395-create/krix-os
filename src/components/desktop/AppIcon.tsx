import React from 'react';
import * as Icons from 'lucide-react';

interface AppIconProps {
  iconName: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({
  iconName,
  color = 'bg-blue-600',
  size = 'md',
  className = '',
}) => {
  // Safe lookup for lucide icons
  const LucideIcon = (Icons as any)[iconName] || Icons.AppWindow;

  const sizeClasses = {
    xs: 'w-6 h-6 rounded-md p-1',
    sm: 'w-9 h-9 rounded-xl p-1.5',
    md: 'w-12 h-12 rounded-2xl p-2.5',
    lg: 'w-16 h-16 rounded-[18px] p-3.5',
    xl: 'w-20 h-20 rounded-[22px] p-4',
  };

  const iconSizes = {
    xs: 14,
    sm: 20,
    md: 26,
    lg: 34,
    xl: 42,
  };

  return (
    <div
      className={`relative flex items-center justify-center text-white shadow-md transition-transform duration-150 select-none ${color} ${sizeClasses[size]} ${className}`}
      style={{
        boxShadow: '0 4px 14px -1px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.18) inset',
      }}
    >
      <LucideIcon size={iconSizes[size]} strokeWidth={2.2} />
    </div>
  );
};
