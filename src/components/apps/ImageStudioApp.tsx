import React, { useState } from 'react';
import { Wand2, Sparkles, Image as ImageIcon, Download, Copy, Check } from 'lucide-react';

export const ImageStudioApp: React.FC = () => {
  const [prompt, setPrompt] = useState('Minimalist matte black Lenovo ThinkPad X1 on granite architectural desk, dramatic soft studio side rim light, 8k commercial photography.');
  const [stylePreset, setStylePreset] = useState('Photorealistic');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [generatedImage, setGeneratedImage] = useState<string>('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');

  const enhancePrompt = () => {
    setPrompt((prev) => `${prev.trim()}, masterpiece quality, ultra-detailed textures, subtle ThinkPad red accent reflections.`);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-y-auto p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-fuchsia-600 text-white shadow">
            <Wand2 size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">KRIX Image Studio</h2>
            <p className="text-[11px] text-slate-400">Creative prompt formulation and visual concept studio</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">Prompt Formulation</label>
          <button
            onClick={enhancePrompt}
            className="flex items-center gap-1 text-[11px] text-fuchsia-400 hover:text-fuchsia-300"
          >
            <Sparkles size={12} />
            <span>Enhance with Gemini</span>
          </button>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-24 bg-slate-800 border border-white/10 rounded-2xl p-3 text-xs text-white resize-none leading-relaxed"
        />

        {/* Presets */}
        <div className="flex flex-wrap gap-2 text-xs">
          {['Photorealistic', 'Cinematic 3D', 'ThinkPad Industrial', 'Minimalist Architecture', 'Anime Vector'].map((st) => (
            <button
              key={st}
              onClick={() => setStylePreset(st)}
              className={`px-3 py-1 rounded-xl border transition-colors ${
                stylePreset === st ? 'bg-fuchsia-600 text-white border-fuchsia-500 font-semibold' : 'border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Generated Canvas Showcase */}
      <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl relative group bg-black max-h-80 flex items-center justify-center">
        <img src={generatedImage} alt="Generated visual" className="w-full h-auto object-cover max-h-80" />
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/75 rounded-xl text-[11px] text-white backdrop-blur">
          {stylePreset} · {aspectRatio}
        </div>
      </div>
    </div>
  );
};
