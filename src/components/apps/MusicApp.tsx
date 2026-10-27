import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, ListMusic, Shuffle, Repeat } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  freq: number;
}

const PLAYLIST: Track[] = [
  { id: '1', title: 'ThinkPad Focus Flow', artist: 'KRIX Ambient Studio', duration: '3:45', freq: 432 },
  { id: '2', title: 'Carbon Waveform', artist: 'Silicon Echoes', duration: '4:12', freq: 528 },
  { id: '3', title: 'Late Night Engineering', artist: 'Lofi Terminal', duration: '2:58', freq: 396 },
  { id: '4', title: 'OLED Horizon Melody', artist: 'KRIX Soundscapes', duration: '3:30', freq: 639 },
];

export const MusicApp: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(25);
  const [volume, setVolume] = useState(70);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Start sound synthesis on play
  const startTone = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(currentTrack.freq, ctx.currentTime);

      gain.gain.setValueAtTime((volume / 100) * 0.08, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
    } catch (e) {
      console.log(e);
    }
  };

  const stopTone = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch (e) {}
      oscRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopTone();
      setIsPlaying(false);
    } else {
      startTone();
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    stopTone();
    setCurrentTrackIndex((i) => (i + 1) % PLAYLIST.length);
    if (isPlaying) {
      setTimeout(startTone, 100);
    }
  };

  const prevTrack = () => {
    stopTone();
    setCurrentTrackIndex((i) => (i - 1 + PLAYLIST.length) % PLAYLIST.length);
    if (isPlaying) {
      setTimeout(startTone, 100);
    }
  };

  useEffect(() => {
    return () => {
      stopTone();
    };
  }, []);

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden">
      {/* Sidebar Playlist */}
      <div className="w-60 bg-slate-950/80 border-r border-white/10 p-3 flex flex-col shrink-0">
        <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs font-bold text-white uppercase tracking-wider">
          <ListMusic size={15} className="text-rose-500" />
          <span>ThinkPad Playlist</span>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-white/5 mt-2">
          {PLAYLIST.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => {
                stopTone();
                setCurrentTrackIndex(idx);
                if (isPlaying) setTimeout(startTone, 100);
              }}
              className={`w-full text-left p-2 rounded-xl transition-colors ${
                currentTrackIndex === idx ? 'bg-rose-600/20 text-rose-400 font-semibold' : 'hover:bg-white/5 text-slate-300'
              }`}
            >
              <div className="text-xs truncate">{t.title}</div>
              <div className="text-[10px] text-slate-400 flex justify-between mt-0.5">
                <span>{t.artist}</span>
                <span className="font-mono">{t.duration}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Player Screen */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900 space-y-6">
        {/* Album Art with ThinkPad Glow */}
        <div className="relative w-44 h-44 rounded-3xl bg-gradient-to-tr from-rose-600 to-indigo-800 p-6 flex flex-col items-center justify-center text-white shadow-2xl border border-white/15">
          <Music size={48} className="drop-shadow-lg" />
          {/* Animated Frequency Bars */}
          <div className="flex items-end gap-1 h-6 mt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full bg-white transition-all duration-150 ${isPlaying ? 'animate-pulse' : 'opacity-40'}`}
                style={{ height: isPlaying ? `${Math.floor(6 + Math.random() * 20)}px` : '4px' }}
              />
            ))}
          </div>
        </div>

        {/* Track Title & Artist */}
        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-white">{currentTrack.title}</h3>
          <p className="text-xs text-slate-400">{currentTrack.artist}</p>
        </div>

        {/* Timeline Slider */}
        <div className="w-full max-w-xs space-y-1">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full accent-rose-500 h-1 bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>1:14</span>
            <span>{currentTrack.duration}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-6">
          <button onClick={prevTrack} className="p-2 text-slate-400 hover:text-white transition-colors">
            <SkipBack size={20} />
          </button>
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl transition-transform active:scale-95"
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} fill="currentColor" />}
          </button>
          <button onClick={nextTrack} className="p-2 text-slate-400 hover:text-white transition-colors">
            <SkipForward size={20} />
          </button>
        </div>

        {/* Volume slider */}
        <div className="flex items-center gap-2 text-slate-400 text-xs">
          <Volume2 size={15} />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-24 accent-rose-500 h-1 bg-slate-700 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
