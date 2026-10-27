import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, RefreshCw, Download, Sparkles } from 'lucide-react';

export const CameraApp: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((s) => {
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => {
        console.log('Camera permission prompt');
      });

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const takePhoto = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c === 1) {
          clearInterval(interval);
          triggerSnap();
          return null;
        }
        return c ? c - 1 : null;
      });
    }, 1000);
  };

  const triggerSnap = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 200);

    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    setCapturedPhoto(canvas.toDataURL('image/png'));
  };

  return (
    <div className="flex flex-col h-full w-full bg-black text-white font-sans select-none overflow-hidden relative items-center justify-center p-6">
      {/* Flash overlay */}
      {flash && <div className="absolute inset-0 bg-white z-50 pointer-events-none" />}

      {/* Countdown overlay */}
      {countdown && (
        <div className="absolute z-40 text-7xl font-bold font-mono text-white drop-shadow-2xl animate-ping">
          {countdown}
        </div>
      )}

      {capturedPhoto ? (
        <div className="flex flex-col items-center space-y-4">
          <img src={capturedPhoto} alt="Captured" className="rounded-2xl max-h-80 border border-white/20 shadow-2xl" />
          <div className="flex gap-2">
            <a
              href={capturedPhoto}
              download="thinkpad_photo.png"
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <Download size={14} />
              <span>Save Photo</span>
            </a>
            <button
              onClick={() => setCapturedPhoto(null)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold"
            >
              Take Another
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-2xl overflow-hidden border border-white/20 bg-slate-900 shadow-2xl relative w-[540px] h-[360px] flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover -scale-x-100" />
            {!stream && (
              <div className="text-xs text-slate-400">Waiting for camera access...</div>
            )}
          </div>

          <button
            onClick={takePhoto}
            disabled={!stream}
            className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-red-600 hover:bg-red-500 shadow-xl transition-transform active:scale-95 disabled:opacity-50"
          >
            <Camera size={26} />
          </button>
        </div>
      )}
    </div>
  );
};
