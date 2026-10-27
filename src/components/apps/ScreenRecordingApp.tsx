import React, { useState, useRef } from 'react';
import { Disc, Square, Download, Video } from 'lucide-react';

export const ScreenRecordingApp: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const startScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setVideoUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.start();
      setIsRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch {
      alert('Screen capture cancelled or unavailable.');
    }
  };

  const stopScreenRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden items-center justify-center p-6 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-red-700 flex items-center justify-center text-white shadow-xl">
        <Disc size={32} className={isRecording ? 'animate-spin' : ''} />
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-base font-bold text-white">ThinkPad Screen Recorder</h2>
        <p className="text-xs text-slate-400">Capture desktop workflows, presentations, and tutorials</p>
      </div>

      <div className="font-mono text-3xl font-bold text-white tabular-nums">
        00:{String(seconds).padStart(2, '0')}
      </div>

      <div className="flex gap-3">
        {isRecording ? (
          <button
            onClick={stopScreenRecording}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg"
          >
            <Square size={16} fill="currentColor" />
            <span>Stop Recording</span>
          </button>
        ) : (
          <button
            onClick={startScreenRecording}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg"
          >
            <Disc size={16} />
            <span>Start Screen Recording</span>
          </button>
        )}
      </div>

      {videoUrl && (
        <div className="pt-4 flex flex-col items-center gap-2">
          <a
            href={videoUrl}
            download="thinkpad_recording.webm"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow"
          >
            <Download size={14} />
            <span>Download Recording (.webm)</span>
          </a>
        </div>
      )}
    </div>
  );
};
