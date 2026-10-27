import React, { useState } from 'react';
import { Camera, Download, Copy, Check, Crop } from 'lucide-react';
import { useDesktop } from '../../context/DesktopContext';

export const ScreenshotApp: React.FC = () => {
  const { createFile, addNotification } = useDesktop();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const takeScreenCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1920;
      canvas.height = video.videoHeight || 1080;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImage(dataUrl);

      // Stop tracks
      stream.getTracks().forEach((t) => t.stop());

      // Save to KRIX files
      createFile({
        name: `ThinkPad_Screen_${Date.now()}.png`,
        path: '/Pictures',
        size: '1.4 MB',
        type: 'image',
        url: dataUrl,
      });

      addNotification('Screenshot Captured', 'Saved directly to Pictures folder', 'screenshot');
    } catch {
      // Fallback sample capture if user cancels screen picker
      setCapturedImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80');
    }
  };

  const copyImage = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-100 font-sans select-none overflow-hidden p-6 items-center justify-center space-y-4">
      {capturedImage ? (
        <div className="flex flex-col items-center max-w-xl w-full space-y-3">
          <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-black">
            <img src={capturedImage} alt="Captured Screenshot" className="max-h-72 w-full object-contain" />
          </div>

          <div className="flex gap-2">
            <a
              href={capturedImage}
              download="thinkpad_screenshot.png"
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow"
            >
              <Download size={14} />
              <span>Download PNG</span>
            </a>
            <button
              onClick={takeScreenCapture}
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold"
            >
              Take Another
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-600 flex items-center justify-center text-white shadow-xl">
            <Camera size={32} />
          </div>
          <h2 className="text-base font-bold text-white">KRIX Screenshot Utility</h2>
          <p className="text-xs text-slate-400 max-w-xs">
            Capture display media, windows, or screen sections on Windows 11.
          </p>
          <button
            onClick={takeScreenCapture}
            className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-lg transition-transform active:scale-95"
          >
            Capture Screen (⌘ ⇧ 4)
          </button>
        </div>
      )}
    </div>
  );
};
