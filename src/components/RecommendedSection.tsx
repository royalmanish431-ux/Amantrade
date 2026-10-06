import React from 'react';
import { Sparkles, Star, Play, Plus, Minus } from 'lucide-react';
import { Dish } from '../types';
import { AppImage } from './AppImage';

interface RecommendedSectionProps {
  dishes: Dish[];
  cartQuantities: Record<string, number>;
  onAddToCart: (dish: Dish) => void;
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onWatchVideo: (dish: Dish) => void;
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({
  dishes,
  cartQuantities,
  onAddToCart,
  onUpdateQuantity,
  onWatchVideo,
}) => {
  const recommendedList = dishes.filter((d) => d.isRecommended);

  return (
    <div className="py-3">
      {/* Header */}
      <div className="px-4 mb-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <h3 className="text-sm sm:text-base font-bold text-stone-900">
              Recommended For You
            </h3>
          </div>
          <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
            {recommendedList.length} Specials
          </span>
        </div>
        <p className="text-[11px] text-stone-500 font-medium mt-0.5">
          Popular traditional sweets and special chef recipes
        </p>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex items-stretch gap-3 overflow-x-auto px-4 no-scrollbar pb-2">
        {recommendedList.map((dish) => {
          const qty = cartQuantities[dish.id] || 0;

          return (
            <div
              key={dish.id}
              className="w-44 sm:w-48 shrink-0 bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              {/* Image Container with Badges */}
              <div className="relative aspect-4/3 w-full bg-emerald-50/70 border-b border-stone-100 flex items-center justify-center overflow-hidden">
                {dish.imageUrl ? (
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-emerald-700">
                    <span className="text-xs font-mono font-bold">#{dish.billNo || 'Item'}</span>
                    <span className="text-[10px] text-stone-500">{dish.weightOrUnit}</span>
                  </div>
                )}

                {/* Discount Tag */}
                {dish.discountBadge && (
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-red-600 text-white text-[9px] font-extrabold uppercase tracking-wide shadow-xs">
                    {dish.discountBadge}
                  </div>
                )}

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-emerald-700 text-white text-[10px] font-bold shadow-xs">
                  <Star className="w-2.5 h-2.5 fill-white text-white" />
                  <span>{dish.rating}</span>
                </div>

                {/* Pure Veg Icon (Bottom Left) */}
                <div className="absolute bottom-2 left-2 w-4 h-4 rounded-xs border border-emerald-600 bg-white/95 flex items-center justify-center p-0.5 shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                </div>

                {/* Video Play Button (Bottom Right) */}
                {dish.videoUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onWatchVideo(dish);
                    }}
                    className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
                    title="Watch Preparation Video"
                  >
                    <Play className="w-3 h-3 fill-white ml-0.5" />
                  </button>
                )}
              </div>

              {/* Dish Info */}
              <div className="p-2.5 flex flex-col flex-1 justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                    {dish.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-medium truncate">
                    {dish.hindiName}
                  </p>
                </div>

                {/* Price & Action Row */}
                <div className="mt-2.5 flex items-end justify-between gap-1">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs sm:text-sm font-black text-stone-900">
                        ₹{dish.price}
                      </span>
                      {dish.originalPrice && (
                        <span className="text-[10px] text-stone-400 line-through">
                          ₹{dish.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] text-stone-400 font-medium block truncate max-w-[80px]">
                      {dish.weightOrUnit}
                    </span>
                  </div>

                  {/* Add Button or Quantity Selector */}
                  {qty === 0 ? (
                    <button
                      onClick={() => onAddToCart(dish)}
                      className="px-3 py-1 rounded-lg border border-red-600 text-red-600 hover:bg-red-50 active:scale-95 text-xs font-bold transition-all flex items-center gap-0.5 shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>ADD</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-lg bg-red-600 text-white text-xs font-bold shadow-xs">
                      <button
                        onClick={() => onUpdateQuantity(dish.id, -1)}
                        className="w-5 h-5 flex items-center justify-center hover:bg-red-700 rounded active:scale-90"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black min-w-[12px] text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(dish.id, 1)}
                        className="w-5 h-5 flex items-center justify-center hover:bg-red-700 rounded active:scale-90"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
