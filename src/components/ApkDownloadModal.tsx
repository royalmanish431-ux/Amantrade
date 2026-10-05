import React, { useState } from 'react';
import { X, Download, CheckCircle, ShieldCheck, Smartphone, Zap } from 'lucide-react';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const handleStartDownload = () => {
    setDownloadProgress(10);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return 10;
        if (prev >= 100) {
          clearInterval(interval);
          setIsCompleted(true);
          return 100;
        }
        return prev + 25;
      });
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-red-700 to-orange-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-amber-300" />
            <h3 className="text-base font-bold">Aman Traders App</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3.5 text-xs text-stone-600">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 font-black text-sm">
              APK
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">aman-traders-v2.4.apk</h4>
              <p className="text-[11px] text-stone-500">14.2 MB · Verified Clean & Safe</p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px] block">
              App Features
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Lightning fast ordering with 1-click reorder</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Real-time delivery partner tracking on live map</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Exclusive app coupons with up to 50% discount</span>
              </div>
            </div>
          </div>

          {/* Progress / Status */}
          {downloadProgress !== null && !isCompleted && (
            <div className="space-y-1.5 py-1">
              <div className="flex justify-between text-[11px] font-bold text-stone-700">
                <span>Downloading APK...</span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                <div
                  className="h-full bg-red-600 transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Download Complete! Tap on your notification to install.</span>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2">
            {!isCompleted && downloadProgress === null ? (
              <button
                onClick={handleStartDownload}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download APK (14.2 MB)</span>
              </button>
            ) : isCompleted ? (
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold cursor-pointer"
              >
                Done
              </button>
            ) : (
              <button
                disabled
                className="w-full py-2.5 rounded-xl bg-stone-200 text-stone-500 font-bold"
              >
                Downloading...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
