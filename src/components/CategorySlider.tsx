import React from 'react';
import { Store, Package } from 'lucide-react';
import { CATEGORIES } from '../data/dishes';
import { CategoryId } from '../types';

interface CategorySliderProps {
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  onSeeAllClick: () => void;
  dishCounts?: { confectionery: number; bakery: number };
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  activeCategory,
  onSelectCategory,
  onSeeAllClick,
  dishCounts,
}) => {
  return (
    <div className="py-2.5 px-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-stone-500 tracking-wider uppercase">
          Store Categories
        </h3>
        <button
          onClick={onSeeAllClick}
          className={`text-xs font-semibold cursor-pointer transition-colors ${
            activeCategory === 'all'
              ? 'text-stone-400 font-normal'
              : 'text-emerald-700 hover:text-emerald-800 underline font-bold'
          }`}
        >
          {activeCategory === 'all' ? 'Showing All' : 'Show All'}
        </button>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id;
          const count = dishCounts ? dishCounts[category.id as 'confectionery' | 'bakery'] : undefined;
          const Icon = category.id === 'confectionery' ? Store : Package;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                isActive
                  ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-1 ring-emerald-500/50'
                  : 'bg-white border-stone-200/90 hover:bg-stone-50/80 shadow-2xs hover:border-stone-300'
              }`}
            >
              {/* Circular Icon Avatar */}
              <div
                className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center transition-transform duration-200 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 border border-stone-200'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Category Info */}
              <div className="min-w-0 flex-1">
                <span
                  className={`text-sm font-bold block truncate leading-tight ${
                    isActive ? 'text-emerald-800 font-extrabold' : 'text-stone-900'
                  }`}
                >
                  {category.name}
                </span>
                <span className="text-[11px] text-stone-500 block truncate font-medium mt-0.5">
                  {category.hindiName}
                </span>
                {count !== undefined && (
                  <span className="text-[10px] text-stone-400 block mt-0.5">
                    {count} item{count === 1 ? '' : 's'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
