import React from 'react';
import { Bike, Sparkles } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#ea580c] via-[#f97316] to-[#dc2626] px-4 sm:px-6 py-4 sm:py-5 text-white shadow-xs">
        {/* Subtle decorative background sweets silhouette / mandala motif */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none flex items-center justify-center">
          <svg className="w-48 h-48 -mr-10 text-white" viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="50" cy="50" r="16" />
            <circle cx="50" cy="18" r="8" />
            <circle cx="50" cy="82" r="8" />
            <circle cx="18" cy="50" r="8" />
            <circle cx="82" cy="50" r="8" />
          </svg>
        </div>

        {/* Top Tag */}
        <div className="flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-amber-200 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Special Deals Everyday</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-1.5 drop-shadow-sm">
          FREE DELIVERY <span className="text-amber-200">above ₹199</span>
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-amber-50/95 font-medium leading-relaxed max-w-sm mb-3.5">
          Fresh confectionery and bakery delights from Aman Traders delivered straight to your door!
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 backdrop-blur-xs border border-white/20 text-xs font-semibold">
            <Bike className="w-4 h-4 text-amber-300" />
            <div>
              <span className="text-[9px] uppercase tracking-wider block text-amber-200 leading-none">Fast Delivery</span>
              <span className="text-white text-xs font-bold leading-tight">30-45 mins</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-stone-900 shadow-sm text-xs font-extrabold uppercase tracking-wide">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
            <span className="text-stone-900 font-black">100% PURE VEG</span>
          </div>
        </div>
      </div>
    </div>
  );
};
