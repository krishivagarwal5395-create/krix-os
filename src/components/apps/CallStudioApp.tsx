import React, { useState, useRef, useEffect } from 'react';
import { PhoneCall, Mic, MicOff, Video, VideoOff, PhoneOff, Users, MessageSquare } from 'lucide-react';

export const CallStudioApp: React.FC = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [inCall, setInCall] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (isVideoOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((s) => {
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(() => {});
    } else {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
    }
  }, [isVideoOn]);

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-100 font-sans select-none overflow-hidden relative">
      {/* Video Call Grid */}
      <div className="flex-1 grid grid-cols-2 gap-4 p-4 items-center justify-center">
        {/* Main Peer Feed */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 h-full flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
            ER
          </div>
          <span className="mt-3 text-xs font-semibold text-white">Elena Rostova (Lenovo ThinkPad)</span>
          <span className="text-[10px] text-emerald-400">Connected (HD 1080p 60fps)</span>
        </div>

        {/* Self Camera Feed */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 h-full flex items-center justify-center">
          {isVideoOn ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
          ) : (
            <div className="flex flex-col items-center text-slate-500 text-xs">
              <VideoOff size={32} />
              <span className="mt-2">Camera Disabled</span>
            </div>
          )}
          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg bg-black/60 text-[11px] font-medium text-white backdrop-blur">
            You (ThinkPad X1)
          </span>
        </div>
      </div>

      {/* Floating Call Action Bar */}
      <div className="h-16 px-6 bg-slate-900/90 border-t border-white/10 flex items-center justify-center gap-4 shrink-0">
        <button
          onClick={() => setIsMicOn(!isMicOn)}
          className={`p-3 rounded-2xl transition-colors ${isMicOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-600 text-white'}`}
          title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
        >
          {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
        </button>

        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          className={`p-3 rounded-2xl transition-colors ${isVideoOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-red-600 text-white'}`}
          title={isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
        >
          {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
        </button>

        <button
          onClick={() => setInCall(false)}
          className="p-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white shadow-lg"
          title="End Conference"
        >
          <PhoneOff size={18} />
        </button>
      </div>
    </div>
  );
};
