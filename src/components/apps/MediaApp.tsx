import React, { useState, useRef } from 'react';
import { Film, Play, Pause, Volume2, Maximize, Subtitles, FastForward } from 'lucide-react';

export const MediaApp: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [subtitles, setSubtitles] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const changeSpeed = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length];
    setSpeed(next);
    if (videoRef.current) videoRef.current.playbackRate = next;
  };

  return (
    <div className="flex flex-col h-full w-full bg-black text-white font-sans select-none overflow-hidden relative">
      {/* Video display */}
      <div className="flex-1 flex items-center justify-center relative bg-black">
        <video
          ref={videoRef}
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          className="max-h-full max-w-full object-contain"
          onEnded={() => setIsPlaying(false)}
        />
        {subtitles && isPlaying && (
          <div className="absolute bottom-16 bg-black/75 px-4 py-1.5 rounded-xl text-xs text-yellow-300 font-medium">
            [Narrator]: Welcome to the KRIX High-Definition Media Player on Windows 11.
          </div>
        )}
      </div>

      {/* Control Bar Overlay */}
      <div className="h-14 px-6 bg-slate-950/80 backdrop-blur-md border-t border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="p-2 rounded-full bg-red-600 hover:bg-red-500 text-white transition-transform active:scale-95"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
          </button>
          <div className="text-xs text-slate-300 font-mono">01:24 / 09:56</div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={changeSpeed}
            className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 font-mono"
            title="Playback Speed"
          >
            {speed}x
          </button>
          <button
            onClick={() => setSubtitles(!subtitles)}
            className={`p-1.5 rounded-lg ${subtitles ? 'bg-red-600/30 text-red-400' : 'text-slate-400'}`}
            title="Subtitles"
          >
            <Subtitles size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
