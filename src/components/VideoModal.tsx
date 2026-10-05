import React from 'react';
import { X, Plus, Sparkles, ChefHat } from 'lucide-react';
import { Dish } from '../types';
import { AppImage } from './AppImage';

interface VideoModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (dish: Dish) => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  dish,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  if (!isOpen || !dish) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-800 text-white flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-800 bg-stone-900/90">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-red-400">
              Aman Traders Live Kitchen
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Screen / Realistic Presentation */}
        <div className="relative aspect-16/10 w-full bg-black overflow-hidden flex items-center justify-center group">
          {/* High-fidelity food visual */}
          <AppImage
            src={dish.imageUrl}
            alt={dish.name}
            fallbackFoodType={dish.visualTheme.foodType}
            className="w-full h-full scale-105"
            imgClassName="w-full h-full object-cover scale-105"
          />

          {/* Video Overlay Info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 flex flex-col justify-between p-4 pointer-events-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-black tracking-wide">
                <span>RECIPE & PREPARATION</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 text-stone-200 text-xs font-mono">
                <span>4K ULTRA HD</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                <ChefHat className="w-4 h-4" />
                <span>Prepared with Pure Desi Ghee & Fresh Mawa</span>
              </div>
              <h3 className="text-lg font-black text-white leading-tight">
                {dish.videoTitle || `${dish.name} (${dish.hindiName}) Live Kitchen Recipe`}
              </h3>
            </div>
          </div>
        </div>

        {/* Video Details & Cooking Notes */}
        <div className="p-4 overflow-y-auto space-y-3.5 bg-stone-900">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-white">{dish.name}</h4>
              <p className="text-xs text-stone-400">{dish.hindiName} · {dish.weightOrUnit}</p>
            </div>
            <div className="text-right">
              <span className="text-xl font-black text-amber-400">₹{dish.price}</span>
              {dish.originalPrice && (
                <span className="text-xs text-stone-500 line-through block">₹{dish.originalPrice}</span>
              )}
            </div>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed bg-stone-800/60 p-3 rounded-xl border border-stone-700/50">
            {dish.description}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-stone-800/40 border border-stone-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-stone-300 text-[11px]">100% Traditional Recipe</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-800/40 border border-stone-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span className="text-stone-300 text-[11px]">Hygienically Packed</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={() => {
                onAddToCart(dish);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 active:scale-98 text-white font-bold text-sm shadow-lg shadow-red-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Cart (₹{dish.price})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
