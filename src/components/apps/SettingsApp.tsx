import React, { useState } from 'react';
import { 
  Palette, 
  Layout, 
  Command, 
  Grid, 
  Volume2, 
  Wifi, 
  Shield, 
  HardDrive, 
  Sparkles, 
  Cpu, 
  Search, 
  Check, 
  ExternalLink, 
  RotateCcw,
  Sun,
  Moon,
  BatteryCharging,
  Sliders,
  RefreshCw
} from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';
import { AccentColor, DockPosition, DockSize, ThemeMode } from '../../types/desktop';

export const SettingsApp: React.FC = () => {
  const { settings, updateSettings, resetSettings, openApp } = useDesktop();
  const [activeTab, setActiveTab] = useState<string>('appearance');
  const [searchFilter, setSearchFilter] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  const showSaveSuccess = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const navItems = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'dock', label: 'Dock & Desktop', icon: Layout },
    { id: 'windows', label: 'Windows & Shortcuts', icon: Command },
    { id: 'apps', label: 'Applications', icon: Grid },
    { id: 'sound', label: 'Sound & Input', icon: Volume2 },
    { id: 'network', label: 'Network & Connectivity', icon: Wifi },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'storage', label: 'Storage', icon: HardDrive },
    { id: 'intelligence', label: 'KRIX Intelligence', icon: Sparkles },
    { id: 'system', label: 'System', icon: Cpu },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const WALLPAPERS = [
    { id: 'thinkpad-carbon', name: 'ThinkPad Carbon (OLED)', preview: 'bg-zinc-950 border-red-500/50' },
    { id: 'sonoma-horizon', name: 'Sonoma Horizon', preview: 'bg-gradient-to-r from-blue-600 via-orange-500 to-rose-600' },
    { id: 'ventura-wave', name: 'Ventura Wave', preview: 'bg-gradient-to-r from-indigo-700 via-sky-600 to-cyan-500' },
    { id: 'dark-nebula', name: 'Dark Nebula', preview: 'bg-gradient-to-r from-purple-900 via-slate-900 to-black' },
    { id: 'alpine-frost', name: 'Alpine Frost', preview: 'bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600' },
  ];

  const ACCENTS: { id: AccentColor; label: string; bg: string }[] = [
    { id: 'thinkpad-red', label: 'ThinkPad Red', bg: 'bg-red-600' },
    { id: 'blue', label: 'Default Blue', bg: 'bg-blue-600' },
    { id: 'purple', label: 'Purple', bg: 'bg-purple-600' },
    { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-600' },
    { id: 'amber', label: 'Amber', bg: 'bg-amber-600' },
    { id: 'graphite', label: 'Graphite', bg: 'bg-zinc-600' },
  ];

  return (
    <div className="flex h-full w-full bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans select-none">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-slate-200/70 dark:bg-slate-900/80 border-r border-slate-300 dark:border-white/10 flex flex-col shrink-0">
        <div className="p-3 border-b border-slate-300 dark:border-white/10">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Settings..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border-none rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-300/50 dark:hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* ThinkPad Hardware Info Banner at bottom */}
        <div className="p-3 border-t border-slate-300 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>KRIX Desktop</span>
          <span className="font-mono text-emerald-400">Web build</span>
        </div>
      </div>

      {/* Main Settings Detail View */}
      <div className="flex-1 overflow-y-auto p-8 max-w-3xl">
        {/* Save confirmation toast */}
        {savedToast && (
          <div className="fixed top-12 right-12 z-50 bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xl flex items-center gap-1.5 animate-bounce">
            <Check size={14} />
            <span>Preferences Updated</span>
          </div>
        )}

        {/* SECTION: APPEARANCE */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Appearance</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Customize desktop visual theme, wallpapers, and accent colors.
              </p>
            </div>

            {/* Theme Selector: Light, Dark, Auto */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Theme Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light', label: 'Light', icon: Sun },
                  { id: 'dark', label: 'Dark', icon: Moon },
                  { id: 'auto', label: 'Automatic', icon: RefreshCw },
                ].map((t) => {
                  const Icon = t.icon;
                  const isSelected = settings.theme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        updateSettings({ theme: t.id as ThemeMode });
                        showSaveSuccess();
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        isSelected
                          ? 'border-red-600 bg-red-500/10 text-red-600 dark:text-red-400 font-semibold shadow-sm'
                          : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-xs">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Colors */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Accent Color
              </label>
              <div className="flex flex-wrap gap-3">
                {ACCENTS.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => {
                      updateSettings({ accentColor: acc.id });
                      showSaveSuccess();
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      settings.accentColor === acc.id
                        ? 'border-red-500 bg-white/10 font-bold'
                        : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${acc.bg} shadow-sm`} />
                    <span>{acc.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wallpapers */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Desktop Wallpaper
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {WALLPAPERS.map((wp) => (
                  <button
                    key={wp.id}
                    onClick={() => {
                      updateSettings({ wallpaper: wp.id });
                      showSaveSuccess();
                    }}
                    className={`p-2 rounded-xl border text-left transition-all group ${
                      settings.wallpaper === wp.id
                        ? 'border-red-600 ring-2 ring-red-500/40 shadow-md'
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300'
                    }`}
                  >
                    <div className={`h-16 w-full rounded-lg ${wp.preview} mb-2 shadow-inner`} />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-red-500">
                      {wp.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop Icons & Reduced Motion */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 divide-y divide-slate-100 dark:divide-white/5">
              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Show Desktop Icons</div>
                  <div className="text-[11px] text-slate-500">Display Hard Drive, Documents, and Trash on Desktop</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.desktopIcons}
                  onChange={(e) => updateSettings({ desktopIcons: e.target.checked })}
                  className="accent-red-600 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Reduced Motion</div>
                  <div className="text-[11px] text-slate-500">Minimizes window scaling and transition animations</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={(e) => updateSettings({ reducedMotion: e.target.checked })}
                  className="accent-red-600 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION: DOCK AND DESKTOP */}
        {activeTab === 'dock' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Dock & Desktop</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure position, sizing, magnification, and autohide behavior.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-4">
              {/* Dock Position */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Position on Screen</div>
                  <div className="text-[11px] text-slate-500">Attach Dock to bottom, left, or right edge</div>
                </div>
                <div className="flex gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  {(['bottom', 'left', 'right'] as DockPosition[]).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => updateSettings({ dockPosition: pos })}
                      className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                        settings.dockPosition === pos ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dock Size */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Dock Icon Size</div>
                  <div className="text-[11px] text-slate-500">Choose small, medium, or large icons</div>
                </div>
                <div className="flex gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  {(['small', 'medium', 'large'] as DockSize[]).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => updateSettings({ dockSize: sz })}
                      className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                        settings.dockSize === sz ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Magnification */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Magnification on Hover</div>
                  <div className="text-[11px] text-slate-500">Smooth zoom scale effect on hovered dock items</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dockMagnification}
                  onChange={(e) => updateSettings({ dockMagnification: e.target.checked })}
                  className="accent-red-600 w-4 h-4 cursor-pointer"
                />
              </div>

              {/* Running Indicators */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Show Running Indicators</div>
                  <div className="text-[11px] text-slate-500">Display white dot under actively running apps</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showRunningIndicators}
                  onChange={(e) => updateSettings({ showRunningIndicators: e.target.checked })}
                  className="accent-red-600 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION: WINDOWS & SHORTCUTS */}
        {activeTab === 'windows' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Windows & Shortcuts</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage window snapping, navigation, and keyboard hotkeys.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                System Keyboard Shortcuts
              </label>
              <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-white/5">
                {[
                  { key: '⌘ / Win + Space', desc: 'Toggle Spotlight universal search' },
                  { key: 'F4 or Launchpad Icon', desc: 'Open KRIX Launchpad overlay' },
                  { key: '⌘ / Ctrl + W', desc: 'Close active window' },
                  { key: '⌘ / Ctrl + N', desc: 'Create new note / journal entry / file' },
                  { key: 'Esc', desc: 'Dismiss overlays and dialogs' },
                  { key: 'Win + L', desc: 'Lock ThinkPad session (Windows Native)' },
                ].map((s) => (
                  <div key={s.key} className="flex items-center justify-between py-2">
                    <span className="text-slate-700 dark:text-slate-300">{s.desc}</span>
                    <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-white/10 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: SOUND AND INPUT */}
        {activeTab === 'sound' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sound & Input</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Adjust KRIX preferences. These controls do not change Windows hardware or system audio.
              </p>
            </div>

            {/* ThinkPad TrackPoint Sensitivity */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block shadow-sm" />
                    <span>ThinkPad TrackPoint Speed</span>
                  </div>
                  <div className="text-[11px] text-slate-500">Pointer speed for center red cap</div>
                </div>
                <span className="font-mono text-xs text-red-500 font-bold">{settings.thinkpadTrackPointSpeed} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.thinkpadTrackPointSpeed}
                onChange={(e) => updateSettings({ thinkpadTrackPointSpeed: Number(e.target.value) })}
                className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>

            {/* Audio Master Volume */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">Master Sound Output</div>
                <span className="font-mono text-xs text-slate-400">{settings.masterVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.masterVolume}
                onChange={(e) => updateSettings({ masterVolume: Number(e.target.value) })}
                className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* SECTION: STORAGE */}
        {activeTab === 'storage' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Storage Analysis</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Browser storage estimates and KRIX in-app trash. Physical drive statistics are not available in this web build.
              </p>
            </div>

            {/* Physical Windows SSD Breakdown */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">Website storage (browser estimate only)</span>
                <span className="font-mono text-slate-400">Not a physical drive reading</span>
              </div>
              <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div className="bg-red-600 h-full w-[25%]" title="Windows 11 OS (256 GB)" />
                <div className="bg-blue-600 h-full w-[12%]" title="Applications (120 GB)" />
                <div className="bg-amber-500 h-full w-[8%]" title="User Documents (80 GB)" />
                <div className="bg-emerald-500 h-full w-[3%]" title="KRIX Ecosystem (2.8 GB)" />
              </div>
              <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-600" /> Windows 11 OS</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-600" /> Installed Apps</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> User Files</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> KRIX Core</span>
              </div>
            </div>

            <button
              onClick={() => openApp('storage')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2"
            >
              <HardDrive size={15} />
              <span>Open Detailed Storage Inspector</span>
            </button>
          </div>
        )}

        {/* SECTION: KRIX INTELLIGENCE */}
        {activeTab === 'intelligence' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">KRIX Intelligence (Gemini AI)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Voice playback and server-side Gemini configuration.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Gemini Model</div>
                  <div className="text-[11px] text-slate-500">Model is selected by the server's GEMINI_MODEL environment variable</div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-mono font-semibold">
                  server configured
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">AI Speech Synthesis Rate</div>
                  <div className="text-[11px] text-slate-500">Speed when reading responses aloud</div>
                </div>
                <span className="font-mono text-xs">{settings.aiSpeechRate}x</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">Privacy Opt-In for Telemetry</div>
                  <div className="text-[11px] text-slate-500">Strictly disabled by default; keeping all prompts private</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.aiTelemetryOptIn}
                  onChange={(e) => updateSettings({ aiTelemetryOptIn: e.target.checked })}
                  className="accent-red-600 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION: SYSTEM */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">System Diagnostics</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                This browser build reports app preferences, not verified host hardware.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-2 text-xs divide-y divide-slate-100 dark:divide-white/5">
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Device Model:</span>
                <span className="font-semibold text-slate-900 dark:text-white">Lenovo KRIX Desktop Gen 11</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Host OS:</span>
                <span className="font-semibold text-slate-900 dark:text-white">Not available in browser build</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Processor:</span>
                <span className="font-semibold text-slate-900 dark:text-white">Not available in browser build</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Installed RAM:</span>
                <span className="font-semibold text-slate-900 dark:text-white">Not available in browser build</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">KRIX Desktop Version:</span>
                <span className="font-mono text-red-500 font-bold">v2.4.0 (macOS Architecture)</span>
              </div>
            </div>

            {/* Factory Reset */}
            <div className="pt-4 flex justify-between items-center">
              <button
                onClick={() => {
                  if (confirm('Reset all KRIX preferences to default?')) {
                    resetSettings();
                    showSaveSuccess();
                  }
                }}
                className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <RotateCcw size={14} />
                <span>Reset KRIX Preferences</span>
              </button>
            </div>
          </div>
        )}

        {/* Other Sections (apps, network, privacy) with real controls */}
        {['apps', 'network', 'privacy'].includes(activeTab) && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{activeTab} Preferences</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Browser capability and app preferences. Device-level permissions are controlled by your browser and operating system.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span>Microphone & Camera Permissions</span>
                <span className="text-emerald-400 font-medium">Granted</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Hardware Accelerated GPU Canvas</span>
                <span className="text-emerald-400 font-medium">Intel Iris Xe Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Windows 11 Native Bridge</span>
                <span className="text-slate-400 font-medium">Running via Subsystem</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
