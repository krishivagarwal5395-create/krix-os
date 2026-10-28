import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Grid } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';
import { APP_REGISTRY, CATEGORIES_LIST } from '../../data/apps';
import { AppIcon } from './AppIcon';
import { AppCategory } from '../../types/desktop';

export const Launchpad: React.FC = () => {
  const { isLaunchpadOpen, toggleLaunchpad, openApp, isAppRunning } = useDesktop();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<AppCategory | 'all'>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isLaunchpadOpen) {
      setSearchQuery('');
      setActiveCategory('all');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isLaunchpadOpen]);

  // Filter apps
  const filteredApps = useMemo(() => {
    return Object.values(APP_REGISTRY).filter((app) => {
      const matchCategory = activeCategory === 'all' || app.category === activeCategory;
      const matchSearch =
        searchQuery === '' ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [searchQuery, activeCategory]);

  // Keyboard navigation
  useEffect(() => {
    if (!isLaunchpadOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        toggleLaunchpad(false);
      } else if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) => Math.min(filteredApps.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown') {
        setSelectedIndex((prev) => Math.min(filteredApps.length - 1, prev + 6));
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex((prev) => Math.max(0, prev - 6));
      } else if (e.key === 'Enter') {
        if (filteredApps[selectedIndex]) {
          openApp(filteredApps[selectedIndex].id);
          toggleLaunchpad(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLaunchpadOpen, filteredApps, selectedIndex, openApp, toggleLaunchpad]);

  if (!isLaunchpadOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-3xl flex flex-col items-center select-none pt-12 pb-16 px-6 animate-fade-in overflow-y-auto"
      onClick={() => toggleLaunchpad(false)}
    >
      {/* Top Header: Search Bar & Close */}
      <div 
        className="w-full max-w-2xl flex flex-col items-center gap-5 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search KRIX Applications..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-white/14 dark:bg-white/10 border border-white/20 rounded-2xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 backdrop-blur-md shadow-xl transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-slate-900/60 rounded-xl border border-white/10 backdrop-blur-md">
          {CATEGORIES_LIST.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Applications */}
      <div 
        className="w-full max-w-5xl mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-y-7 gap-x-4 justify-items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {filteredApps.map((app, index) => {
          const isSelected = index === selectedIndex;
          const isRunning = isAppRunning(app.id);

          return (
            <button
              key={app.id}
              onClick={() => {
                openApp(app.id);
                toggleLaunchpad(false);
              }}
              className={`group flex flex-col items-center text-center p-2 rounded-2xl transition-all duration-150 relative ${
                isSelected ? 'ring-2 ring-blue-400/80 bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="relative transform transition-transform group-hover:scale-110 duration-200">
                <AppIcon iconName={app.iconName} color={app.color} size="lg" />
                {isRunning && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-md" />
                )}
              </div>
              <span className="mt-2 text-xs font-medium text-slate-200 group-hover:text-white line-clamp-1 max-w-[90px] drop-shadow-sm">
                {app.name.replace('KRIX ', '')}
              </span>
            </button>
          );
        })}
      </div>

      {filteredApps.length === 0 && (
        <div className="mt-16 text-center text-slate-400">
          <p className="text-base font-medium text-slate-300">No applications found</p>
          <p className="text-xs mt-1">Try searching with a different keyword</p>
        </div>
      )}
    </div>
  );
};
