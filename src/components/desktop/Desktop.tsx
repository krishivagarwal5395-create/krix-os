import React from 'react';
import { useDesktop } from '../../context/DesktopContext';
import { MenuBar } from './MenuBar';
import { Dock } from './Dock';
import { WindowFrame } from './WindowFrame';
import { Launchpad } from './Launchpad';
import { Spotlight } from './Spotlight';
import { ControlCenter } from './ControlCenter';
import { NotificationCenter } from './NotificationCenter';
import { AppRenderer } from '../apps/AppRenderer';
import { Folder, HardDrive, Trash2, Cpu } from 'lucide-react';

export const Desktop: React.FC = () => {
  const { windows, settings, openApp, trashFiles } = useDesktop();

  // Curated wallpapers
  const getWallpaperBackground = () => {
    switch (settings.wallpaper) {
      case 'thinkpad-carbon':
        return 'radial-gradient(ellipse at 50% 40%, #1e1e24 0%, #0d0d11 60%, #050507 100%)';
      case 'sonoma-horizon':
        return 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 30%, #f97316 75%, #ea580c 100%)';
      case 'ventura-wave':
        return 'linear-gradient(135deg, #312e81 0%, #4338ca 40%, #0284c7 70%, #06b6d4 100%)';
      case 'dark-nebula':
        return 'radial-gradient(circle at 60% 30%, #2e1065 0%, #0f172a 50%, #020617 100%)';
      case 'alpine-frost':
        return 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #334155 100%)';
      default:
        return 'radial-gradient(ellipse at 50% 40%, #1e1e24 0%, #0d0d11 60%, #050507 100%)';
    }
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden flex flex-col select-none"
      style={{
        background: getWallpaperBackground(),
      }}
    >
      {/* ThinkPad Signature Subtle Texture Accent (Carbon Weave Grid & Red Illumination) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
      {/* Subtle Lenovo ThinkPad Red Atmospheric Glow in the top right */}
      <div 
        className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" 
      />

      {/* Top Menu Bar */}
      <MenuBar />

      {/* Desktop Workspace (contains desktop icons & window manager) */}
      <div className="relative flex-1 w-full overflow-hidden">
        {/* Desktop Icons */}
        {settings.desktopIcons && (
          <div className="absolute top-4 right-4 flex flex-col gap-5 z-0 select-none">
            {/* Macintosh HD / ThinkPad C: Drive */}
            <button
              onDoubleClick={() => openApp('finder')}
              className="flex flex-col items-center gap-1 w-20 p-1.5 rounded-xl hover:bg-white/10 group focus:outline-none focus:ring-1 focus:ring-red-400"
            >
              <div className="p-2.5 rounded-2xl bg-slate-800/80 border border-white/20 text-slate-300 group-hover:text-white shadow-lg backdrop-blur-md">
                <HardDrive size={28} />
              </div>
              <span className="text-[11px] font-medium text-white text-center drop-shadow leading-tight">
                ThinkPad C:
              </span>
            </button>

            {/* Documents */}
            <button
              onDoubleClick={() => openApp('finder')}
              className="flex flex-col items-center gap-1 w-20 p-1.5 rounded-xl hover:bg-white/10 group focus:outline-none focus:ring-1 focus:ring-red-400"
            >
              <div className="p-2.5 rounded-2xl bg-blue-600/80 border border-white/20 text-white shadow-lg backdrop-blur-md">
                <Folder size={28} />
              </div>
              <span className="text-[11px] font-medium text-white text-center drop-shadow leading-tight">
                Documents
              </span>
            </button>

            {/* ThinkPad Hardware Info */}
            <button
              onDoubleClick={() => openApp('systeminfo')}
              className="flex flex-col items-center gap-1 w-20 p-1.5 rounded-xl hover:bg-white/10 group focus:outline-none focus:ring-1 focus:ring-red-400"
            >
              <div className="p-2.5 rounded-2xl bg-red-600/80 border border-white/20 text-white shadow-lg backdrop-blur-md">
                <Cpu size={28} />
              </div>
              <span className="text-[11px] font-medium text-white text-center drop-shadow leading-tight">
                ThinkPad OS
              </span>
            </button>

            {/* Trash */}
            <button
              onDoubleClick={() => openApp('trash')}
              className="flex flex-col items-center gap-1 w-20 p-1.5 rounded-xl hover:bg-white/10 group focus:outline-none focus:ring-1 focus:ring-red-400"
            >
              <div className="p-2.5 rounded-2xl bg-zinc-800/80 border border-white/20 text-slate-300 group-hover:text-white shadow-lg backdrop-blur-md relative">
                <Trash2 size={28} />
                {trashFiles.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded-full">
                    {trashFiles.length}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-medium text-white text-center drop-shadow leading-tight">
                Trash
              </span>
            </button>
          </div>
        )}

        {/* Windows Rendering */}
        {windows.map((win) => (
          <WindowFrame key={win.id} window={win}>
            <AppRenderer appId={win.appId} initialParams={win.initialParams} />
          </WindowFrame>
        ))}
      </div>

      {/* macOS Dock */}
      <Dock />

      {/* System Overlays */}
      <Launchpad />
      <Spotlight />
      <ControlCenter />
      <NotificationCenter />
    </div>
  );
};
