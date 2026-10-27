import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Download } from 'lucide-react';

interface MemoItem {
  id: string;
  title: string;
  duration: string;
  blobUrl: string;
  date: string;
}

export const VoiceMemosApp: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [memos, setMemos] = useState<MemoItem[]>([]);
  const [activeMemo, setActiveMemo] = useState<MemoItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        const newMemo: MemoItem = {
          id: `memo-${Date.now()}`,
          title: `ThinkPad Recording ${memos.length + 1}`,
          duration: `${recordingSeconds}s`,
          blobUrl: url,
          date: 'Just now',
        };
        setMemos((prev) => [newMemo, ...prev]);
        setActiveMemo(newMemo);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch (err: any) {
      alert('Microphone permission required for audio recording.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const togglePlay = () => {
    if (!audioPlayerRef.current || !activeMemo) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden">
      {/* Left List of Memos */}
      <div className="w-64 bg-slate-950/80 border-r border-white/10 p-3 flex flex-col shrink-0">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 pb-2 border-b border-white/10">
          Voice Recordings
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-white/5 mt-2">
          {memos.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">No recordings yet</div>
          ) : (
            memos.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setActiveMemo(m);
                  setIsPlaying(false);
                }}
                className={`w-full text-left p-2.5 rounded-xl transition-colors ${
                  activeMemo?.id === m.id ? 'bg-red-600/20 text-red-400 font-semibold' : 'hover:bg-white/5 text-slate-300'
                }`}
              >
                <div className="text-xs truncate">{m.title}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{m.duration} · {m.date}</div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Recording Studio */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-900 space-y-6">
        {/* Animated Sound Wave Graphic */}
        <div className="flex items-center gap-1.5 h-20 w-64 justify-center">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 rounded-full transition-all duration-150 ${
                isRecording ? 'bg-red-500' : 'bg-slate-700'
              }`}
              style={{
                height: isRecording ? `${Math.floor(20 + Math.random() * 60)}px` : '12px',
              }}
            />
          ))}
        </div>

        {/* Timer Display */}
        <div className="text-2xl font-mono font-bold text-white tabular-nums">
          00:{String(recordingSeconds).padStart(2, '0')}
        </div>

        {/* Record / Stop Button */}
        <div className="flex items-center gap-4">
          {isRecording ? (
            <button
              onClick={stopRecording}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl transition-transform active:scale-95"
            >
              <Square size={24} fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl transition-transform active:scale-95 animate-pulse"
            >
              <Mic size={26} />
            </button>
          )}
        </div>

        {/* Active playback controls if a memo is selected */}
        {activeMemo && (
          <div className="w-full max-w-sm p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <button
              onClick={togglePlay}
              className="p-3 rounded-full bg-red-600 hover:bg-red-500 text-white"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} fill="currentColor" />}
            </button>
            <span className="text-xs font-medium text-white truncate px-3">{activeMemo.title}</span>
            <a
              href={activeMemo.blobUrl}
              download={`${activeMemo.title}.webm`}
              className="p-2 rounded-lg bg-white/10 text-slate-300 hover:text-white"
              title="Download recording"
            >
              <Download size={15} />
            </a>
            <audio
              ref={audioPlayerRef}
              src={activeMemo.blobUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  );
};
