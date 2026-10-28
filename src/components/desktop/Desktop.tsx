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

  const getWallpaperBackground = () => {
    switch (settings.wallpaper) {
      case 'sonoma-horizon':
        return 'radial-gradient(ellipse at 18% 78%, rgba(255,104,83,.92) 0%, transparent 37%), radial-gradient(ellipse at 82% 24%, rgba(90,111,255,.95) 0%, transparent 38%), radial-gradient(ellipse at 58% 78%, rgba(139,67,201,.9) 0%, transparent 40%), linear-gradient(135deg,#10152f 0%,#152b55 48%,#080b1c 100%)';
      case 'ventura-wave':
        return 'radial-gradient(ellipse at 16% 20%, rgba(55,133,255,.95) 0%, transparent 38%), radial-gradient(ellipse at 85% 72%, rgba(24,213,207,.78) 0%, transparent 42%), radial-gradient(ellipse at 50% 50%, rgba(105,78,255,.65) 0%, transparent 46%), linear-gradient(135deg,#08152f,#151044 55%,#04131d)';
      case 'dark-nebula':
        return 'radial-gradient(ellipse at 72% 24%, rgba(135,72,255,.7) 0%, transparent 34%), radial-gradient(ellipse at 25% 75%, rgba(18,117,255,.65) 0%, transparent 42%), linear-gradient(145deg,#070b18,#101b38 55%,#03050b)';
      case 'alpine-frost':
        return 'radial-gradient(ellipse at 50% 0%, rgba(183,224,255,.9) 0%, transparent 42%), radial-gradient(ellipse at 10% 85%, rgba(80,130,220,.7) 0%, transparent 42%), linear-gradient(150deg,#14264c,#416d9c 55%,#0a1830)';
      default:
        return 'radial-gradient(ellipse at 12% 88%, rgba(255,110,89,.95) 0%, transparent 38%), radial-gradient(ellipse at 83% 18%, rgba(86,110,255,.95) 0%, transparent 40%), radial-gradient(ellipse at 55% 75%, rgba(172,70,215,.82) 0%, transparent 42%), linear-gradient(135deg,#0a1028 0%,#182e5b 48%,#080b18 100%)';
    }
  };

  return (
    <div className="krix-desktop relative w-screen h-screen overflow-hidden flex flex-col select-none" style={{ background: getWallpaperBackground() }}>
      <div className="krix-wallpaper-orb krix-wallpaper-orb-one" />
      <div className="krix-wallpaper-orb krix-wallpaper-orb-two" />
      <div className="krix-wallpaper-grain" />
      <MenuBar />
      <div className="relative flex-1 w-full overflow-hidden">
        {settings.desktopIcons && (
          <div className="absolute top-5 right-5 flex flex-col gap-4 z-0 select-none">
            <button onDoubleClick={() => openApp('finder')} className="mac-desktop-icon group" aria-label="Open Macintosh HD">
              <div className="mac-desktop-icon-art"><HardDrive size={29} strokeWidth={1.5} /></div>
              <span>Macintosh HD</span>
            </button>
            <button onDoubleClick={() => openApp('finder')} className="mac-desktop-icon group" aria-label="Open Documents">
              <div className="mac-desktop-icon-art folder"><Folder size={30} strokeWidth={1.5} /></div>
              <span>Documents</span>
            </button>
            <button onDoubleClick={() => openApp('systeminfo')} className="mac-desktop-icon group" aria-label="Open System Information">
              <div className="mac-desktop-icon-art info"><Cpu size={29} strokeWidth={1.5} /></div>
              <span>System Information</span>
            </button>
            <button onDoubleClick={() => openApp('trash')} className="mac-desktop-icon group" aria-label="Open Trash">
              <div className="mac-desktop-icon-art trash">
                <Trash2 size={29} strokeWidth={1.5} />
                {trashFiles.length > 0 && <span className="mac-trash-count">{trashFiles.length}</span>}
              </div>
              <span>Trash</span>
            </button>
          </div>
        )}
        {windows.map((win) => (
          <WindowFrame key={win.id} window={win}>
            <AppRenderer appId={win.appId} initialParams={win.initialParams} />
          </WindowFrame>
        ))}
      </div>
      <Dock />
      <Launchpad />
      <Spotlight />
      <ControlCenter />
      <NotificationCenter />
    </div>
  );
};
