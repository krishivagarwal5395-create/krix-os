import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { WindowState } from '../../types/desktop';
import { useDesktop } from '../../context/DesktopContext';
import { AppIcon } from './AppIcon';
import { Minus, Square, X } from 'lucide-react';

interface WindowFrameProps {
  window: WindowState;
  children: ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ window: win, children }) => {
  const { 
    activeWindowId, 
    focusWindow, 
    closeWindow, 
    minimizeWindow, 
    maximizeWindow, 
    updateWindowPosition, 
    updateWindowSize,
    settings 
  } = useDesktop();

  const isFocused = activeWindowId === win.id;
  const isMaximized = win.isMaximized;

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });

  const windowRef = useRef<HTMLDivElement>(null);

  // Dragging logic
  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (isMaximized) return;
    // Don't drag if clicking buttons
    if ((e.target as HTMLElement).closest('button')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - win.position.x,
      y: e.clientY - win.position.y,
    });
    focusWindow(win.id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffset.x));
        const newY = Math.max(28, Math.min(window.innerHeight - 80, e.clientY - dragOffset.y));
        updateWindowPosition(win.id, { x: newX, y: newY });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newW = Math.max(400, Math.min(window.innerWidth - 20, resizeStart.w + deltaX));
        const newH = Math.max(300, Math.min(window.innerHeight - 80, resizeStart.h + deltaY));
        updateWindowSize(win.id, { width: newW, height: newH });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, win.id]);

  // Handle Resize Corner
  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      w: win.size.width,
      h: win.size.height,
    });
    focusWindow(win.id);
  };

  if (win.isMinimized) {
    return null;
  }

  // Position and Dimensions
  const style: React.CSSProperties = isMaximized
    ? {
        position: 'fixed',
        left: 0,
        top: 28, // below menu bar
        width: '100vw',
        height: 'calc(100vh - 28px)',
        zIndex: win.zIndex,
      }
    : {
        position: 'fixed',
        left: `${win.position.x}px`,
        top: `${win.position.y}px`,
        width: `${win.size.width}px`,
        height: `${win.size.height}px`,
        zIndex: win.zIndex,
      };

  return (
    <div
      ref={windowRef}
      style={style}
      onMouseDown={() => focusWindow(win.id)}
      className={`flex flex-col rounded-xl overflow-hidden glass-window border transition-shadow duration-200 ${
        isFocused 
          ? 'border-white/20 shadow-2xl dark:border-white/15' 
          : 'border-white/10 opacity-95 shadow-lg dark:border-white/5'
      } ${isMaximized ? 'rounded-none border-none' : ''}`}
    >
      {/* Title Bar (macOS Header) */}
      <div
        onMouseDown={handleMouseDownHeader}
        onDoubleClick={() => maximizeWindow(win.id)}
        className="h-10 px-3.5 bg-[#f5f5f7]/95 dark:bg-[#2c2c2e]/95 backdrop-blur-2xl border-b border-black/10 dark:border-white/10 flex items-center justify-between select-none cursor-default shrink-0"
      >
        {/* Left: macOS Traffic Light Controls */}
        <div className="flex items-center gap-2 group/lights">
          {/* Close (Red) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(win.id);
            }}
            className="w-3 h-3 rounded-full bg-[#ff5f56] hover:bg-[#ff3b30] flex items-center justify-center transition-colors shadow-sm focus:outline-none"
            aria-label="Close window"
          >
            <X size={8} className="text-black/70 opacity-0 group-hover/lights:opacity-100 transition-opacity" />
          </button>

          {/* Minimize (Yellow) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
            className="w-3 h-3 rounded-full bg-[#ffbd2e] hover:bg-[#ffaa00] flex items-center justify-center transition-colors shadow-sm focus:outline-none"
            aria-label="Minimize window"
          >
            <Minus size={8} className="text-black/70 opacity-0 group-hover/lights:opacity-100 transition-opacity" />
          </button>

          {/* Maximize (Green) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(win.id);
            }}
            className="w-3 h-3 rounded-full bg-[#27c93f] hover:bg-[#1db832] flex items-center justify-center transition-colors shadow-sm focus:outline-none"
            aria-label="Toggle maximize window"
          >
            <Square size={7} className="text-black/70 opacity-0 group-hover/lights:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Center: Window Title and Icon */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[60%] pointer-events-none">
          <AppIcon iconName={win.iconName} size="xs" />
          <span className="truncate">{win.title}</span>
        </div>

        {/* Right placeholder to balance traffic lights */}
        <div className="w-14" />
      </div>

      {/* Window Body */}
      <div className="flex-1 bg-[#fbfbfd]/98 dark:bg-[#1c1c1e]/98 overflow-hidden flex flex-col relative text-slate-900 dark:text-slate-100">
        {children}
      </div>

      {/* Resize Handle at Bottom-Right */}
      {!isMaximized && (
        <div
          onMouseDown={handleMouseDownResize}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-30 flex items-end justify-end p-0.5"
        >
          <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 dark:border-slate-500 opacity-60 hover:opacity-100" />
        </div>
      )}
    </div>
  );
};
