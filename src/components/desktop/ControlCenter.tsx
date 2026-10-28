import React from 'react';
import { 
  Wifi, 
  Bluetooth, 
  Moon, 
  Sun, 
  Volume2, 
  Keyboard, 
  Share2, 
  Sliders 
} from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

export const ControlCenter: React.FC = () => {
  const { isControlCenterOpen, toggleControlCenter, settings, updateSettings, openApp } = useDesktop();

  if (!isControlCenterOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 select-none pointer-events-auto"
      onClick={() => toggleControlCenter(false)}
    >
      <div 
        className="absolute top-9 right-3 w-80 rounded-2xl bg-white/88 dark:bg-[#242426]/92 border border-black/10 dark:border-white/10 p-4 shadow-2xl backdrop-blur-2xl text-slate-800 dark:text-slate-100 space-y-3.5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-1 border-b border-white/10">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Control Center</span>
          <button 
            onClick={() => {
              openApp('settings');
              toggleControlCenter(false);
            }}
            className="text-xs text-blue-600 dark:text-blue-400 hover:opacity-80 transition-colors"
          >
            Preferences
          </button>
        </div>

        {/* Top 2x2 Grid of Quick Toggles */}
        <div className="grid grid-cols-2 gap-2">
          {/* Wi-Fi */}
          <div className="p-2.5 rounded-xl bg-white/10 flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-blue-500 text-white">
              <Wifi size={16} />
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-white truncate">Wi-Fi</div>
              <div className="text-[10px] text-slate-400 truncate">Network status unavailable</div>
            </div>
          </div>

          {/* Bluetooth */}
          <div className="p-2.5 rounded-xl bg-white/10 flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-blue-600 text-white">
              <Bluetooth size={16} />
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-white truncate">Bluetooth</div>
              <div className="text-[10px] text-slate-400 truncate">Device-managed</div>
            </div>
          </div>

          {/* QuickShare / AirDrop */}
          <div className="p-2.5 rounded-xl bg-white/10 flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-indigo-500 text-white">
              <Share2 size={16} />
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-white truncate">QuickShare</div>
              <div className="text-[10px] text-slate-400 truncate">KRIX interface</div>
            </div>
          </div>

          {/* Dark Mode */}
          <button
            onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 flex items-center gap-2.5 text-left transition-colors"
          >
            <div className="p-2 rounded-full bg-purple-500 text-white">
              <Moon size={16} />
            </div>
            <div className="truncate">
              <div className="text-xs font-medium text-white truncate">Appearance</div>
              <div className="text-[10px] text-slate-400 capitalize">{settings.theme}</div>
            </div>
          </button>
        </div>

        {/* Display Brightness Slider */}
        <div className="p-3 rounded-xl bg-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Sun size={14} />
              <span>Display brightness</span>
            </div>
            <span className="font-mono text-slate-400">{settings.displayBrightness}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={settings.displayBrightness}
            onChange={(e) => updateSettings({ displayBrightness: Number(e.target.value) })}
            className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
        </div>

        {/* Master Sound Volume Slider */}
        <div className="p-3 rounded-xl bg-white/10 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Volume2 size={14} />
              <span>Sound Output</span>
            </div>
            <span className="font-mono text-slate-400">{settings.masterVolume}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={settings.masterVolume}
            onChange={(e) => updateSettings({ masterVolume: Number(e.target.value) })}
            className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
        </div>

        <div className="rounded-xl border border-black/5 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.05] p-3">
          <div className="text-xs font-semibold mb-1">KRIX quick settings</div>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">These controls adjust the KRIX desktop interface only. Wi-Fi, Bluetooth, physical display brightness, speaker volume and battery settings remain managed by your device.</p>
        </div>
        </div>
      </div>
    </div>
  );
};
