import React, { useState, useRef } from 'react';
import { Layers, StickyNote, Type, Square, Circle, Download, Trash2, ZoomIn, ZoomOut } from 'lucide-react';

interface CanvasItem {
  id: string;
  type: 'note' | 'text' | 'shape';
  x: number;
  y: number;
  content: string;
  color?: string;
  shapeType?: 'rect' | 'circle';
}

export const FreeformApp: React.FC = () => {
  const [items, setItems] = useState<CanvasItem[]>([
    { id: '1', type: 'note', x: 80, y: 80, content: 'KRIX Desktop\nInfinite Canvas Idea Board', color: 'bg-amber-400' },
    { id: '2', type: 'note', x: 300, y: 120, content: 'Lenovo ThinkPad X1\nWindows 11 Integration', color: 'bg-emerald-400' },
  ]);
  const [scale, setScale] = useState(1);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const addNote = (color: string) => {
    const newItem: CanvasItem = {
      id: `note-${Date.now()}`,
      type: 'note',
      x: 150 + Math.random() * 80,
      y: 150 + Math.random() * 80,
      content: 'New Sticky Note...',
      color,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const addShape = (shapeType: 'rect' | 'circle') => {
    const newItem: CanvasItem = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      x: 200,
      y: 200,
      content: '',
      shapeType,
      color: 'border-red-500',
    };
    setItems((prev) => [...prev, newItem]);
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden relative">
      {/* Top Floating Palette */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 border border-white/15 backdrop-blur-xl shadow-2xl">
        <button
          onClick={() => addNote('bg-amber-400')}
          className="p-2 rounded-xl hover:bg-white/10 text-amber-400"
          title="Yellow Sticky"
        >
          <StickyNote size={18} />
        </button>
        <button
          onClick={() => addNote('bg-emerald-400')}
          className="p-2 rounded-xl hover:bg-white/10 text-emerald-400"
          title="Green Sticky"
        >
          <StickyNote size={18} />
        </button>
        <button
          onClick={() => addNote('bg-sky-400')}
          className="p-2 rounded-xl hover:bg-white/10 text-sky-400"
          title="Blue Sticky"
        >
          <StickyNote size={18} />
        </button>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <button
          onClick={() => addShape('rect')}
          className="p-2 rounded-xl hover:bg-white/10 text-slate-300"
          title="Rectangle"
        >
          <Square size={18} />
        </button>
        <button
          onClick={() => addShape('circle')}
          className="p-2 rounded-xl hover:bg-white/10 text-slate-300"
          title="Circle"
        >
          <Circle size={18} />
        </button>
        <div className="w-px h-5 bg-white/10 mx-1" />
        <button
          onClick={() => setScale((s) => Math.min(2, s + 0.1))}
          className="p-2 rounded-xl hover:bg-white/10 text-slate-300"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
          className="p-2 rounded-xl hover:bg-white/10 text-slate-300"
        >
          <ZoomOut size={18} />
        </button>
      </div>

      {/* Infinite Canvas Viewport */}
      <div
        className="flex-1 w-full h-full overflow-auto relative cursor-grab active:cursor-grabbing p-12"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div
          className="relative min-w-[2000px] min-h-[2000px]"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              style={{ left: item.x, top: item.y }}
              className={`absolute group shadow-xl ${
                item.type === 'note'
                  ? `${item.color} text-slate-900 w-48 min-h-36 p-3 rounded-2xl flex flex-col justify-between`
                  : item.shapeType === 'circle'
                  ? 'w-32 h-32 rounded-full border-4 border-red-500 bg-red-500/10'
                  : 'w-40 h-28 rounded-2xl border-4 border-red-500 bg-red-500/10'
              }`}
            >
              {item.type === 'note' && (
                <>
                  <textarea
                    value={item.content}
                    onChange={(e) => {
                      const val = e.target.value;
                      setItems((prev) =>
                        prev.map((i) => (i.id === item.id ? { ...i, content: val } : i))
                      );
                    }}
                    className="w-full h-24 bg-transparent font-medium text-xs resize-none focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(item.id);
                      }}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-black/10 text-slate-700"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </>
              )}

              {item.type === 'shape' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(item.id);
                  }}
                  className="absolute top-1 right-1 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/20 text-white"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
