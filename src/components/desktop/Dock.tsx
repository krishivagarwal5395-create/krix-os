import React, { useState } from 'react';
import { 
  Rocket, 
  Folder, 
  FileText, 
  BookOpen, 
  Settings, 
  Sparkles, 
  Compass, 
  Image, 
  Music, 
  Terminal, 
  Trash2,
  Calendar
} from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';
import { APP_REGISTRY } from '../../data/apps';
import { AppIcon } from './AppIcon';

export const Dock: React.FC = () => {
  const { 
    windows, 
    openApp, 
    toggleLaunchpad, 
    isAppRunning, 
    settings, 
    trashFiles, 
    trashFile,
    isLaunchpadOpen 
  } = useDesktop();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipApp, setTooltipApp] = useState<string | null>(null);

  // Default pinned dock apps
  const pinnedAppIds = [
    'finder',
    'notes',
    'journal',
    'calendar',
    'browser',
    'photos',
    'music',
    'terminal',
    'settings',
    'intelligence',
  ];

  // Also include running apps that are not pinned
  const runningUnpinned = windows
    .filter((w) => !pinnedAppIds.includes(w.appId))
    .map((w) => w.appId)
    .filter((val, idx, arr) => arr.indexOf(val) === idx);

  const dockApps = [...pinnedAppIds, ...runningUnpinned];

  // Scale based on distance from hovered item
  const getScale = (index: number) => {
    if (!settings.dockMagnification || hoveredIndex === null) return 1;
    const distance = Math.abs(hoveredIndex - index);
    if (distance === 0) return 1.35;
    if (distance === 1) return 1.18;
    if (distance === 2) return 1.06;
    return 1;
  };

  const dockSizeClass = {
    small: 'h-12 py-1 px-2.5',
    medium: 'h-16 py-1.5 px-3',
    large: 'h-20 py-2 px-4',
  }[settings.dockSize || 'medium'];

  const iconSizeProp = {
    small: 'sm' as const,
    medium: 'md' as const,
    large: 'lg' as const,
  }[settings.dockSize || 'medium'];

  return (
    <div 
      className={`fixed z-40 transition-all duration-200 pointer-events-auto select-none ${
        settings.dockPosition === 'left'
          ? 'left-3 top-1/2 -translate-y-1/2 flex-col'
          : settings.dockPosition === 'right'
          ? 'right-3 top-1/2 -translate-y-1/2 flex-col'
          : 'bottom-2 left-1/2 -translate-x-1/2 flex-row'
      }`}
    >
      <div 
        className={`glass-dock flex items-end gap-2 rounded-2xl ${dockSizeClass}`}
        onMouseLeave={() => {
          setHoveredIndex(null);
          setTooltipApp(null);
        }}
      >
        {/* Launchpad Button */}
        <div className="relative group">
          <button
            onClick={() => toggleLaunchpad()}
            onMouseEnter={() => {
              setHoveredIndex(0);
              setTooltipApp('Launchpad');
            }}
            className="flex flex-col items-center justify-center p-1 rounded-xl transition-transform duration-150 focus-visible:outline-none"
            style={{ transform: `scale(${getScale(0)})` }}
            aria-label="Launchpad"
          >
            <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-slate-800 text-white shadow-lg ${
              settings.dockSize === 'small' ? 'w-9 h-9 p-1.5' : settings.dockSize === 'large' ? 'w-14 h-14 p-3' : 'w-11 h-11 p-2'
            }`}>
              <Rocket size={22} className="text-white drop-shadow" />
            </div>
            {isLaunchpadOpen && (
              <span className="w-1 h-1 rounded-full bg-white mt-1"></span>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-7 bg-white/20 self-center mx-0.5" />

        {/* Regular Dock Apps */}
        {dockApps.map((appId, index) => {
          const app = APP_REGISTRY[appId];
          if (!app) return null;
          const adjustedIndex = index + 1;
          const isRunning = isAppRunning(appId);
          const scale = getScale(adjustedIndex);

          return (
            <div key={appId} className="relative group">
              <button
                onClick={() => openApp(appId)}
                onMouseEnter={() => {
                  setHoveredIndex(adjustedIndex);
                  setTooltipApp(app.name);
                }}
                className="flex flex-col items-center justify-center p-1 rounded-xl transition-transform duration-150 focus-visible:outline-none"
                style={{ transform: `scale(${scale})` }}
                aria-label={app.name}
              >
                <AppIcon 
                  iconName={app.iconName} 
                  color={app.color} 
                  size={iconSizeProp} 
                />
                
                {/* Active running dot */}
                <div className="h-1.5 flex items-center justify-center mt-0.5">
                  {isRunning && (
                    <span className="w-1 h-1 rounded-full bg-white/90 shadow-sm" />
                  )}
                </div>
              </button>
            </div>
          );
        })}

        {/* Divider */}
        <div className="w-px h-7 bg-white/20 self-center mx-0.5" />

        {/* Trash Can */}
        <div className="relative group">
          <button
            onClick={() => openApp('trash')}
            onMouseEnter={() => {
              setHoveredIndex(dockApps.length + 2);
              setTooltipApp(`Trash (${trashFiles.length} items)`);
            }}
            className="flex flex-col items-center justify-center p-1 rounded-xl transition-transform duration-150 focus-visible:outline-none"
            style={{ transform: `scale(${getScale(dockApps.length + 2)})` }}
            aria-label="Trash"
          >
            <div className={`relative flex items-center justify-center rounded-2xl bg-zinc-800 text-slate-300 shadow-md ${
              settings.dockSize === 'small' ? 'w-9 h-9 p-1.5' : settings.dockSize === 'large' ? 'w-14 h-14 p-3' : 'w-11 h-11 p-2'
            }`}>
              <Trash2 size={20} className={trashFiles.length > 0 ? 'text-amber-400' : 'text-slate-300'} />
              {trashFiles.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded-full">
                  {trashFiles.length}
                </span>
              )}
            </div>
            {isAppRunning('trash') && (
              <span className="w-1 h-1 rounded-full bg-white/90 mt-1"></span>
            )}
          </button>
        </div>
      </div>

      {/* Floating Tooltip above dock */}
      {tooltipApp && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-slate-900/90 text-white text-xs font-medium border border-white/10 shadow-lg pointer-events-none whitespace-nowrap backdrop-blur-md">
          {tooltipApp}
        </div>
      )}
    </div>
  );
};
