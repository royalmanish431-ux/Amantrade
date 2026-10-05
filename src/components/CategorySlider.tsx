import React from 'react';
import { CATEGORIES } from '../data/dishes';
import { CategoryId } from '../types';
import { AppImage } from './AppImage';

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
  const getCategoryVisualType = (catId: CategoryId) => {
    switch (catId) {
      case 'confectionery':
        return 'colddrink';
      case 'bakery':
        return 'chocolate';
      default:
        return 'colddrink';
    }
  };

  return (
    <div className="py-2.5 px-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-stone-500 tracking-wider uppercase">
          Eat What Makes You Happy
        </h3>
        <button
          onClick={onSeeAllClick}
          className={`text-xs font-semibold cursor-pointer transition-colors ${
            activeCategory === 'all'
              ? 'text-stone-400 font-normal'
              : 'text-red-600 hover:text-red-700 underline font-bold'
          }`}
        >
          {activeCategory === 'all' ? 'Showing All' : 'Show All'}
        </button>
      </div>

      {/* Exactly 2 Categories: Confectionery & Bakery */}
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id;
          const visualType = getCategoryVisualType(category.id);
          const count = dishCounts ? dishCounts[category.id as 'confectionery' | 'bakery'] : undefined;

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                isActive
                  ? 'bg-red-50/80 border-red-500 shadow-sm ring-1 ring-red-500/50'
                  : 'bg-white border-stone-200/90 hover:bg-stone-50/80 shadow-2xs hover:border-stone-300'
              }`}
            >
              {/* Circular Avatar */}
              <div
                className={`relative w-14 h-14 rounded-full p-0.5 shrink-0 transition-transform duration-200 ${
                  isActive ? 'ring-2 ring-red-600 ring-offset-2 scale-105' : 'border border-stone-200'
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden shadow-xs bg-stone-100">
                  <AppImage
                    src={category.imageUrl}
                    alt={category.name}
                    fallbackFoodType={visualType}
                    className="w-full h-full rounded-full"
                    imgClassName="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>

              {/* Category Info */}
              <div className="min-w-0 flex-1">
                <span
                  className={`text-sm font-bold block truncate leading-tight ${
                    isActive ? 'text-red-700 font-extrabold' : 'text-stone-900'
                  }`}
                >
                  {category.name}
                </span>
                <span className="text-[11px] text-stone-500 block truncate font-medium mt-0.5">
                  {category.hindiName}
                </span>
                {count !== undefined && (
                  <span
                    className={`inline-block text-[10px] font-semibold mt-1 px-1.5 py-0.2 rounded-md ${
                      isActive ? 'bg-red-200/60 text-red-800' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {count} items
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
