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
    <header className="relative z-50 h-7 w-full bg-white/72 dark:bg-black/45 backdrop-blur-2xl border-b border-black/10 dark:border-white/10 text-slate-900 dark:text-white text-[13px] shadow-sm px-3 flex items-center justify-between select-none">
      {/* Left zone: Brand logo + Active App Menus */}
      <div className="flex items-center gap-4">
        {/* KRIX macOS-inspired KRIX menu button */}
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
            {/* Custom stylized KRIX Monogram with blue KRIX accent */}
            <div className="relative flex items-center justify-center font-bold tracking-tighter text-xs">
              <span className="text-white font-mono">KR</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block mx-0.5 shadow-sm"></span>
              <span className="text-white font-mono">IX</span>
            </div>
          </button>

          {/* KRIX System Menu Dropdown */}
          {isAppleMenuOpen && (
            <div 
              className="absolute left-0 top-7 w-60 rounded-xl bg-white/90 dark:bg-[#242426]/92 border border-black/10 dark:border-white/10 shadow-2xl py-1 backdrop-blur-2xl text-slate-800 dark:text-slate-100 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  openApp('systeminfo');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white flex items-center gap-2 rounded-lg mx-1"
              >
                <Info size={14} />
                <span>About This Mac</span>
              </button>
              <button
                onClick={() => {
                  openApp('settings');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white flex items-center gap-2 rounded-lg mx-1"
              >
                <Settings size={14} />
                <span>System Settings...</span>
              </button>
              <button
                onClick={() => {
                  openApp('applibrary');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white flex items-center gap-2 rounded-lg mx-1"
              >
                <Grid size={14} />
                <span>App Library</span>
              </button>
              
              <div className="h-px bg-white/10 my-1 mx-2" />

              <button
                onClick={() => {
                  toggleLaunchpad(true);
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white flex items-center justify-between rounded-lg mx-1"
              >
                <span>Launchpad</span>
                <span className="text-[11px] text-slate-400">F4</span>
              </button>
              <button
                onClick={() => {
                  toggleSpotlight(true);
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white flex items-center justify-between rounded-lg mx-1"
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
                className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white flex items-center justify-between rounded-lg mx-1"
              >
                <span>Close Active Window</span>
                <span className="text-[11px] text-slate-400">⌘ W</span>
              </button>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white flex items-center gap-2 rounded-lg mx-1"
              >
                <RotateCw size={14} />
                <span>Restart KRIX Desktop</span>
              </button>
              <button
                onClick={() => {
                  alert('KRIX session locked (simulated in this web app).');
                  setIsAppleMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white flex items-center gap-2 rounded-lg mx-1"
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
                        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white flex items-center justify-between rounded-lg mx-1"
                      >
                        <span>New Item</span>
                        <span className="text-[11px] text-slate-400">⌘ N</span>
                      </button>
                      <button
                        onClick={() => {
                          if (activeWindowId) closeWindow(activeWindowId);
                          setActiveMenuDropdown(null);
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white flex items-center justify-between rounded-lg mx-1"
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
                        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-lg mx-1"
                      >
                        Undo (⌘ Z)
                      </button>
                      <button
                        onClick={() => setActiveMenuDropdown(null)}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-lg mx-1"
                      >
                        Redo (⌘ ⇧ Z)
                      </button>
                      <button
                        onClick={() => setActiveMenuDropdown(null)}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-lg mx-1"
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
                        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-lg mx-1"
                      >
                        Toggle Widgets Panel
                      </button>
                      <button
                        onClick={() => {
                          toggleLaunchpad();
                          setActiveMenuDropdown(null);
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-lg mx-1"
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
                        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-lg mx-1"
                      >
                        Minimize
                      </button>
                      <button
                        onClick={() => {
                          openApp('activitymonitor');
                          setActiveMenuDropdown(null);
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-lg mx-1"
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
                        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-lg mx-1"
                      >
                        Ask KRIX Intelligence
                      </button>
                      <button
                        onClick={() => {
                          openApp('systeminfo');
                          setActiveMenuDropdown(null);
                        }}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-blue-600 hover:text-white rounded-lg mx-1"
                      >
                        KRIX System Information
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
        {/* Power menu — live hardware readings are not exposed by this web build */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsBatteryMenuOpen(!isBatteryMenuOpen);
              setIsAppleMenuOpen(false);
              setActiveMenuDropdown(null);
            }}
            className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-white/15 transition-colors focus-visible:outline-none"
            title="Lenovo KRIX battery status is unavailable in this browser build"
          >
            <Battery size={16} className="text-slate-700 dark:text-slate-200" />
          </button>

          {isBatteryMenuOpen && (
            <div 
              className="absolute right-0 top-7 w-64 rounded-xl bg-white/90 dark:bg-[#242426]/95 border border-black/10 dark:border-white/10 shadow-2xl p-3.5 backdrop-blur-2xl text-slate-800 dark:text-slate-100 z-50 text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-semibold text-slate-800 dark:text-slate-100">Power information</div>
              <p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-300">KRIX runs in your browser and cannot read your Mac or PC battery level, charging state, or battery health. Check your device's system settings for live readings.</p>
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
          title="Network status is provided by your browser"
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
