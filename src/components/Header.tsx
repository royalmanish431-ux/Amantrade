import React from 'react';
import { MapPin, ChevronDown, Lock, Search, X, FileSpreadsheet } from 'lucide-react';
import { Dish } from '../types';

interface HeaderProps {
  currentAddress: string;
  onOpenAddressModal: () => void;
  onOpenOwnerPortal: () => void;
  onOpenSheetsPortal?: () => void;
  isGoogleConnected?: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectPopularTag: (tag: string) => void;
  dishes?: Dish[];
}

export const Header: React.FC<HeaderProps> = ({
  currentAddress,
  onOpenAddressModal,
  onOpenOwnerPortal,
  onOpenSheetsPortal,
  isGoogleConnected = false,
  searchQuery,
  onSearchChange,
  onSelectPopularTag,
  dishes = [],
}) => {
  const popularKeywords = dishes.map((d) => d.name).filter(Boolean).slice(0, 5);

  return (
    <header className="bg-gradient-to-b from-[#831828] via-[#8c182a] to-[#73121f] text-white pt-3 pb-3.5 px-4 shadow-lg sticky top-0 z-30">
      {/* Top Row: Location & Actions */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {/* Location / Brand lockup */}
        <button
          onClick={onOpenAddressModal}
          className="flex items-center gap-2.5 text-left group focus:outline-none min-w-0"
          title="Change delivery location"
        >
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-300 group-hover:scale-105 transition-transform">
            <MapPin className="w-4 h-4 fill-amber-400 text-amber-500" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-200 tracking-wide uppercase">
              <span>HOME</span>
              <ChevronDown className="w-3 h-3 text-amber-300" />
            </div>
            <div className="text-base font-bold text-white tracking-tight truncate max-w-[150px] sm:max-w-[200px]">
              Aman Traders
            </div>
          </div>
        </button>

        {/* Action Button: By Owner */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenOwnerPortal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-stone-900 text-xs font-semibold shadow-sm hover:bg-stone-100 active:scale-95 transition-all border border-stone-200 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-stone-700" />
            <span>By owner</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-2.5">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
          <Search className="w-4 h-4 text-red-600" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder='Search items in Aman Traders catalog...'
          className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white text-stone-900 text-xs sm:text-sm placeholder-stone-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400 border border-transparent transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Popular Search Keywords */}
      {popularKeywords.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs text-stone-100 whitespace-nowrap pt-0.5">
          <span className="text-[11px] font-medium text-stone-200/80 mr-0.5">Popular:</span>
          {popularKeywords.map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectPopularTag(tag)}
              className="px-2.5 py-1 rounded-full bg-black/25 hover:bg-black/40 active:scale-95 text-[11px] font-medium text-stone-100 border border-white/10 transition-colors shrink-0"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
