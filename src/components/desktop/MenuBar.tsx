import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  BatteryCharging, 
  Battery, 
  Search, 
  Sliders, 
  Sparkles, 
  Lock, 
  RotateCw, 
  Info, 
  Settings, 
  Grid 
} from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';
import { APP_REGISTRY } from '../../data/apps';

export const MenuBar: React.FC = () => {
  const { 
    windows, 
    activeWindowId, 
    openApp, 
    closeWindow, 
    toggleSpotlight, 
    toggleControlCenter, 
    toggleNotificationCenter,
    toggleLaunchpad,
    settings 
  } = useDesktop();

  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false);
  const [isBatteryMenuOpen, setIsBatteryMenuOpen] = useState(false);
  const [activeMenuDropdown, setActiveMenuDropdown] = useState<string | null>(null);

  // Active window info
  const activeWindow = windows.find((w) => w.id === activeWindowId && !w.isMinimized);
  const activeApp = activeWindow ? APP_REGISTRY[activeWindow.appId] : null;
  const activeAppName = activeApp ? activeApp.name : 'Finder';

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
      setDateStr(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClick = () => {
      setIsAppleMenuOpen(false);
      setIsBatteryMenuOpen(false);
      setActiveMenuDropdown(null);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <header className="relative z-50 h-7 w-full bg-slate-900/75 dark:bg-slate-950/80 backdrop-blur-md border-b border-white/10 text-white text-[13px] px-3 flex items-center justify-between select-none">
      {/* Left zone: Brand logo + Active App Menus */}
      <div className="flex items-center gap-4">
        {/* KRIX ThinkPad Apple-style logo button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAppleMenuOpen(!isAppleMenuOpen);
              setIsBatteryMenuOpen(false);
              setActiveMenuDropdown(null);
            }}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/15 transition-colors focus-visible:outline-none"
            aria-label="KRIX System Menu"
          >
            {/* Custom stylized KRIX Monogram with red ThinkPad dot */}
            <div className="relative flex items-center justify-center font-bold tracking-tighter text-xs">
              <span className="text-white font-mono">KR</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block mx-0.5 shadow-sm"></span>
              <span className="text-white font-mono">IX</span>
            </div>
          </button>

          {/* KRIX System Menu Dropdown */}
          {isAppleMenuOpen && (
            <div 
              className="absolute left-0 top-7 w-60 rounded-xl bg-slate-900/95 dark:bg-slate-950/95 border border-white/15 shadow-2xl py-1 backdrop-blur-xl text-slate-200 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  openApp('systeminfo');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white flex items-center gap-2 rounded-lg mx-1"
              >
                <Info size={14} />
                <span>About This ThinkPad</span>
              </button>
              <button
                onClick={() => {
                  openApp('settings');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white flex items-center gap-2 rounded-lg mx-1"
              >
                <Settings size={14} />
                <span>System Settings...</span>
              </button>
              <button
                onClick={() => {
                  openApp('applibrary');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white flex items-center gap-2 rounded-lg mx-1"
              >
                <Grid size={14} />
                <span>App Library & Windows 11</span>
              </button>
              
              <div className="h-px bg-white/10 my-1 mx-2" />

              <button
                onClick={() => {
                  toggleLaunchpad(true);
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white flex items-center justify-between rounded-lg mx-1"
              >
                <span>Launchpad</span>
                <span className="text-[11px] text-slate-400">F4</span>
              </button>
              <button
                onClick={() => {
                  toggleSpotlight(true);
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white flex items-center justify-between rounded-lg mx-1"
              >
                <span>Spotlight Search</span>
                <span className="text-[11px] text-slate-400">⌘ Space</span>
              </button>

              <div className="h-px bg-white/10 my-1 mx-2" />

              <button
                onClick={() => {
                  if (activeWindowId) closeWindow(activeWindowId);
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white flex items-center justify-between rounded-lg mx-1"
              >
                <span>Close Active Window</span>
                <span className="text-[11px] text-slate-400">⌘ W</span>
              </button>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white flex items-center gap-2 rounded-lg mx-1"
              >
                <RotateCw size={14} />
                <span>Restart KRIX Desktop</span>
              </button>
              <button
                onClick={() => {
                  alert('ThinkPad Session Protected: Windows 11 Lock Screen active');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white flex items-center gap-2 rounded-lg mx-1"
              >
                <Lock size={14} />
                <span>Lock Screen (Win + L)</span>
              </button>
            </div>
          )}
        </div>

        {/* Current App Name (Bold) */}
        <span className="font-semibold tracking-tight text-white/95">
          {activeAppName}
        </span>

        {/* Standard macOS Menus: File, Edit, View, Window, Help */}
        <div className="hidden sm:flex items-center gap-1 text-white/80 font-normal">
          {['File', 'Edit', 'View', 'Window', 'Help'].map((menu) => (
            <div key={menu} className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuDropdown(activeMenuDropdown === menu ? null : menu);
                  setIsAppleMenuOpen(false);
                }}
                className={`px-2 py-0.5 rounded hover:bg-white/15 transition-colors ${
                  activeMenuDropdown === menu ? 'bg-white/20 text-white' : ''
                }`}
              >
                {menu}
              </button>

              {activeMenuDropdown === menu && (
                <div 
                  className="absolute left-0 top-7 w-48 rounded-xl bg-slate-900/95 dark:bg-slate-950/95 border border-white/15 shadow-2xl py-1 backdrop-blur-xl text-slate-200 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  {menu === 'File' && (
                    <>
                      <button
                        onClick={() => {
                          if (activeApp?.id === 'notes') openApp('notes');
                          else if (activeApp?.id === 'journal') openApp('journal');
                          else openApp('finder');
                          setActiveMenuDropdown(null);
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white flex items-center justify-between rounded-lg mx-1"
                      >
                        <span>New Item</span>
                        <span className="text-[11px] text-slate-400">⌘ N</span>
                      </button>
                      <button
                        onClick={() => {
                          if (activeWindowId) closeWindow(activeWindowId);
                          setActiveMenuDropdown(null);
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white flex items-center justify-between rounded-lg mx-1"
                      >
                        <span>Close Window</span>
                        <span className="text-[11px] text-slate-400">⌘ W</span>
                      </button>
                    </>
                  )}
                  {menu === 'Edit' && (
                    <>
                      <button
                        onClick={() => setActiveMenuDropdown(null)}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white rounded-lg mx-1"
                      >
                        Undo (⌘ Z)
                      </button>
                      <button
                        onClick={() => setActiveMenuDropdown(null)}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white rounded-lg mx-1"
                      >
                        Redo (⌘ ⇧ Z)
                      </button>
                      <button
                        onClick={() => setActiveMenuDropdown(null)}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white rounded-lg mx-1"
                      >
                        Select All (⌘ A)
                      </button>
                    </>
                  )}
                  {menu === 'View' && (
                    <>
                      <button
                        onClick={() => {
                          toggleNotificationCenter();
                          setActiveMenuDropdown(null);
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white rounded-lg mx-1"
                      >
                        Toggle Widgets Panel
                      </button>
                      <button
                        onClick={() => {
                          toggleLaunchpad();
                          setActiveMenuDropdown(null);
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white rounded-lg mx-1"
                      >
                        Open Launchpad (F4)
                      </button>
                    </>
                  )}
                  {menu === 'Window' && (
                    <>
                      <button
                        onClick={() => {
                          if (activeWindowId) closeWindow(activeWindowId);
                          setActiveMenuDropdown(null);
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white rounded-lg mx-1"
                      >
                        Minimize
                      </button>
                      <button
                        onClick={() => {
                          openApp('activitymonitor');
                          setActiveMenuDropdown(null);
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white rounded-lg mx-1"
                      >
                        Activity Monitor
                      </button>
                    </>
                  )}
                  {menu === 'Help' && (
                    <>
                      <button
                        onClick={() => {
                          openApp('intelligence', { prompt: `How do I use ${activeAppName}?` });
                          setActiveMenuDropdown(null);
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white rounded-lg mx-1"
                      >
                        Ask KRIX Intelligence
                      </button>
                      <button
                        onClick={() => {
                          openApp('systeminfo');
                          setActiveMenuDropdown(null);
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-red-600 hover:text-white rounded-lg mx-1"
                      >
                        ThinkPad System Diagnostics
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right zone: System Status Toggles & Clock */}
      <div className="flex items-center gap-3">
        {/* ThinkPad Battery & RapidCharge Indicator */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsBatteryMenuOpen(!isBatteryMenuOpen);
              setIsAppleMenuOpen(false);
              setActiveMenuDropdown(null);
            }}
            className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-white/15 transition-colors focus-visible:outline-none"
            title="Lenovo ThinkPad Battery: 88% RapidCharge Active"
          >
            <span className="text-[11px] font-mono tabular-nums text-slate-200">88%</span>
            <BatteryCharging size={16} className="text-emerald-400" />
          </button>

          {isBatteryMenuOpen && (
            <div 
              className="absolute right-0 top-7 w-64 rounded-xl bg-slate-900/95 dark:bg-slate-950/95 border border-white/15 shadow-2xl p-3.5 backdrop-blur-xl text-slate-200 z-50 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10 font-medium">
                <span>ThinkPad Power Status</span>
                <span className="text-emerald-400 font-semibold">88% Charged</span>
              </div>
              <div className="mt-2.5 space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span>Power Source:</span>
                  <span className="text-white font-medium">65W AC Adapter</span>
                </div>
                <div className="flex justify-between">
                  <span>Lenovo RapidCharge:</span>
                  <span className="text-red-400 font-semibold">Active (80% in 60m)</span>
                </div>
                <div className="flex justify-between">
                  <span>Battery Health:</span>
                  <span className="text-emerald-400 font-medium">98% (42 cycles)</span>
                </div>
                <div className="flex justify-between">
                  <span>Time to Full:</span>
                  <span className="text-white font-medium">Approx 18 minutes</span>
                </div>
              </div>
              <button
                onClick={() => {
                  openApp('settings');
                  setIsBatteryMenuOpen(false);
                }}
                className="mt-3 w-full py-1 text-center bg-white/10 hover:bg-white/15 rounded-lg text-white font-medium transition-colors"
              >
                Battery Preferences...
              </button>
            </div>
          )}
        </div>

        {/* Wi-Fi Indicator */}
        <button
          onClick={() => openApp('settings')}
          className="p-1 rounded hover:bg-white/15 transition-colors focus-visible:outline-none"
          title="Wi-Fi 6E: Connected to ThinkPad-UltraFast"
        >
          <Wifi size={14} className="text-white/90" />
        </button>

        {/* KRIX Intelligence Sparkles */}
        <button
          onClick={() => openApp('intelligence')}
          className="p-1 rounded hover:bg-white/15 transition-colors text-purple-300 hover:text-purple-200 focus-visible:outline-none"
          title="KRIX Intelligence (Gemini AI)"
        >
          <Sparkles size={14} />
        </button>

        {/* Spotlight Search */}
        <button
          onClick={() => toggleSpotlight()}
          className="p-1 rounded hover:bg-white/15 transition-colors focus-visible:outline-none"
          title="Spotlight Search (⌘ Space)"
        >
          <Search size={14} className="text-white/90" />
        </button>

        {/* Control Center Toggle */}
        <button
          onClick={() => toggleControlCenter()}
          className="p-1 rounded hover:bg-white/15 transition-colors focus-visible:outline-none"
          title="Control Center"
        >
          <Sliders size={14} className="text-white/90" />
        </button>

        {/* Clock & Date (opens Notification Center / Widgets) */}
        <button
          onClick={() => toggleNotificationCenter()}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-white/15 transition-colors font-medium focus-visible:outline-none"
          title="Click to toggle Notification Center & Widgets"
        >
          <span className="text-slate-300 text-[12px]">{dateStr}</span>
          <span className="tabular-nums text-white text-[12px]">{timeStr}</span>
        </button>
      </div>
    </header>
  );
};
