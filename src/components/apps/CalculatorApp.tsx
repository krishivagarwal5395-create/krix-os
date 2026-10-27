import React, { useState } from 'react';
import { evaluateExpression, calculateScientificFunction } from '../../utils/calculator';
import { RotateCcw } from 'lucide-react';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [isScientific, setIsScientific] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleDigit = (d: string) => {
    setDisplay((prev) => (prev === '0' || prev === 'Error' ? d : prev + d));
  };

  const handleOperator = (op: string) => {
    setDisplay((prev) => (prev === 'Error' ? '0' : prev + ' ' + op + ' '));
  };

  const handleClear = () => {
    setDisplay('0');
  };

  const handleEqual = () => {
    try {
      const result = evaluateExpression(display);
      setHistory((prev) => [`${display} = ${result}`, ...prev.slice(0, 8)]);
      setDisplay(String(result));
    } catch {
      setDisplay('Error');
    }
  };

  const handleScientific = (func: string) => {
    try {
      const current = parseFloat(display) || 0;
      const res = calculateScientificFunction(func, current);
      setDisplay(String(res));
    } catch {
      setDisplay('Error');
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e24] text-white font-sans select-none p-3.5 justify-between">
      {/* Top Switcher */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
        <span className="font-semibold text-slate-400">KRIX Calculator</span>
        <button
          onClick={() => setIsScientific(!isScientific)}
          className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
            isScientific ? 'bg-red-600 text-white' : 'bg-white/10 text-slate-300'
          }`}
        >
          {isScientific ? 'Scientific' : 'Standard'}
        </button>
      </div>

      {/* Screen Display */}
      <div className="p-3 bg-black/40 rounded-xl text-right flex flex-col justify-end min-h-[70px] border border-white/5 my-2">
        <div className="text-[10px] text-slate-400 font-mono line-clamp-1">
          {history[0] || 'Ready'}
        </div>
        <div className="text-2xl font-bold font-mono tracking-wider tabular-nums overflow-x-auto">
          {display}
        </div>
      </div>

      {/* Scientific row if toggled */}
      {isScientific && (
        <div className="grid grid-cols-4 gap-1.5 mb-2 text-xs">
          {['sin', 'cos', 'tan', 'sqrt', 'ln', 'square', 'cube', 'factorial'].map((fn) => (
            <button
              key={fn}
              onClick={() => handleScientific(fn)}
              className="py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
            >
              {fn}
            </button>
          ))}
        </div>
      )}

      {/* Main Keypad Grid */}
      <div className="grid grid-cols-4 gap-2 text-sm font-semibold">
        <button onClick={handleClear} className="p-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-red-400">C</button>
        <button onClick={() => setDisplay((p) => p.startsWith('-') ? p.slice(1) : '-' + p)} className="p-3 rounded-xl bg-slate-700 hover:bg-slate-600">±</button>
        <button onClick={() => handleOperator('%')} className="p-3 rounded-xl bg-slate-700 hover:bg-slate-600">%</button>
        <button onClick={() => handleOperator('÷')} className="p-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white">÷</button>

        <button onClick={() => handleDigit('7')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700">7</button>
        <button onClick={() => handleDigit('8')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700">8</button>
        <button onClick={() => handleDigit('9')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700">9</button>
        <button onClick={() => handleOperator('×')} className="p-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white">×</button>

        <button onClick={() => handleDigit('4')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700">4</button>
        <button onClick={() => handleDigit('5')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700">5</button>
        <button onClick={() => handleDigit('6')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700">6</button>
        <button onClick={() => handleOperator('-')} className="p-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white">−</button>

        <button onClick={() => handleDigit('1')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700">1</button>
        <button onClick={() => handleDigit('2')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700">2</button>
        <button onClick={() => handleDigit('3')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700">3</button>
        <button onClick={() => handleOperator('+')} className="p-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white">+</button>

        <button onClick={() => handleDigit('0')} className="col-span-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-left pl-6">0</button>
        <button onClick={() => handleDigit('.')} className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700">.</button>
        <button onClick={handleEqual} className="p-3 rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-md">=</button>
      </div>
    </div>
  );
};
