import React from 'react';
import { Download, ExternalLink } from 'lucide-react';

interface AppDownloadBannerProps {
  onOpenDownloadModal: () => void;
}

export const AppDownloadBanner: React.FC<AppDownloadBannerProps> = ({ onOpenDownloadModal }) => {
  return (
    <div className="w-full border-b border-amber-200/70 bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-amber-50/90 px-4 py-2.5 shadow-2xs">
      <div className="flex items-center justify-between gap-3">
        {/* Left Icon + Text */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shrink-0 shadow-sm text-white">
            <Download className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                Download Aman Traders App
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-[10px] font-extrabold text-white tracking-wide leading-none">
                APK
              </span>
            </div>
            <p className="text-[11px] text-stone-600 truncate mt-0.5 font-medium">
              Phone me APK install karein & fast delivery ka aanand lein
            </p>
          </div>
        </div>

        {/* Right Download Button */}
        <button
          onClick={onOpenDownloadModal}
          className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <span>Download</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
