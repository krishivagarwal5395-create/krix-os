import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Eraser, Download, Trash2, Palette } from 'lucide-react';

export const DrawingStudioApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ef4444');
  const [brushSize, setBrushSize] = useState(4);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = isEraser ? '#0f172a' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const exportDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `thinkpad_drawing_${Date.now()}.png`;
    a.click();
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Controls Toolbar */}
      <div className="h-12 px-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-950/70">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEraser(false)}
            className={`p-1.5 rounded-lg ${!isEraser ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Brush Pen"
          >
            <PenTool size={16} />
          </button>
          <button
            onClick={() => setIsEraser(true)}
            className={`p-1.5 rounded-lg ${isEraser ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Eraser"
          >
            <Eraser size={16} />
          </button>

          {/* Color palette */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
            {['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ffffff'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setIsEraser(false);
                }}
                className={`w-5 h-5 rounded-full border border-white/20 transition-transform ${color === c && !isEraser ? 'scale-125 ring-2 ring-white' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Brush size */}
          <input
            type="range"
            min="1"
            max="30"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-20 accent-red-600 ml-2"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400"
            title="Clear Canvas"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={exportDrawing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow"
          >
            <Download size={14} />
            <span>Export PNG</span>
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 flex items-center justify-center p-4 bg-slate-950 overflow-auto">
        <canvas
          ref={canvasRef}
          width={860}
          height={520}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border border-white/10 rounded-2xl shadow-2xl cursor-crosshair max-w-full"
        />
      </div>
    </div>
  );
};
