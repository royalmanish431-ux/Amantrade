import React from 'react';
import { Percent, IndianRupee, Play, Sparkles, Star } from 'lucide-react';

export type FilterType = 'all' | 'offers' | 'under100' | 'video' | 'special' | 'top_rated';

interface FilterBarProps {
  activeFilter: FilterType;
  onSelectFilter: (filter: FilterType) => void;
  videoCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeFilter,
  onSelectFilter,
  videoCount,
}) => {
  const filters: { id: FilterType; label: string; icon?: React.ReactNode; badge?: string | number }[] = [
    { id: 'all', label: 'All Dishes' },
    { id: 'offers', label: 'Special Offers', icon: <Percent className="w-3 h-3 text-red-500" /> },
    { id: 'under100', label: 'Under 100', icon: <IndianRupee className="w-3 h-3" /> },
    { id: 'video', label: 'YouTube Video', icon: <Play className="w-3 h-3 fill-red-600 text-red-600" />, badge: videoCount },
    { id: 'top_rated', label: 'Top Rated 4.5+', icon: <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> },
    { id: 'special', label: 'Chef Specials', icon: <Sparkles className="w-3 h-3 text-amber-500" /> },
  ];

  return (
    <div className="px-4 py-2 border-t border-b border-stone-200/60 bg-white">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {filters.map((f) => {
          const isActive = activeFilter === f.id;

          return (
            <button
              key={f.id}
              onClick={() => onSelectFilter(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 border border-stone-200/60'
              }`}
            >
              {f.icon}
              <span>{f.label}</span>
              {f.badge !== undefined && (
                <span
                  className={`ml-0.5 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
                  }`}
                >
                  {f.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
