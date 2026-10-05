import React from 'react';
import { Star, Play, Plus, Minus, UserCheck, Instagram, Facebook, Youtube, ExternalLink } from 'lucide-react';
import { Dish } from '../types';
import { AppImage } from './AppImage';

interface DishCardProps {
  dish: Dish;
  cartQuantity: number;
  onAddToCart: (dish: Dish) => void;
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onWatchVideo: (dish: Dish) => void;
  stock?: number;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
  onWatchVideo,
  stock,
}) => {
  const isOutOfStock = stock !== undefined && stock <= 0;

  const handleOpenLink = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (!url) return;
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    const link = document.createElement('a');
    link.href = targetUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden mb-4 transition-all hover:shadow-md">
      {/* Big Dish Image Container */}
      <div className="relative aspect-16/10 sm:aspect-16/9 w-full bg-stone-100 overflow-hidden">
        <AppImage
          src={dish.imageUrl}
          alt={dish.name}
          fallbackFoodType={dish.visualTheme.foodType}
          className="w-full h-full"
          imgClassName="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />

        {/* Top-Left: Veg Marker */}
        <div className="absolute top-3 left-3 w-5 h-5 rounded-xs border-2 border-emerald-600 bg-white flex items-center justify-center p-0.5 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
        </div>

        {/* Top-Right: Star Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-700 text-white text-xs font-bold shadow-sm">
          <Star className="w-3 h-3 fill-white text-white" />
          <span>{dish.rating}</span>
        </div>

        {/* Bottom Social Media Pills Overlay on Image (as shown in Image 1) */}
        {(dish.reelUrl || dish.facebookUrl || dish.youtubeUrl) ? (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1.5 flex-wrap z-10">
            {dish.reelUrl && (
              <a
                href={dish.reelUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleOpenLink(e, dish.reelUrl)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white text-[11px] font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Open Instagram Reel"
              >
                <Instagram className="w-3 h-3" />
                <span>Open Reel</span>
              </a>
            )}
            {dish.facebookUrl && (
              <a
                href={dish.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleOpenLink(e, dish.facebookUrl)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1877F2] text-white text-[11px] font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Open Facebook"
              >
                <Facebook className="w-3 h-3" />
                <span>Open FB</span>
              </a>
            )}
            {dish.youtubeUrl && (
              <a
                href={dish.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleOpenLink(e, dish.youtubeUrl)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E50914] text-white text-[11px] font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Open YouTube"
              >
                <Youtube className="w-3 h-3 fill-white" />
                <span>Open YouTube</span>
              </a>
            )}
          </div>
        ) : dish.videoUrl ? (
          <button
            onClick={() => onWatchVideo(dish)}
            className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black/90 backdrop-blur-xs text-white text-xs font-semibold shadow-md active:scale-95 transition-transform cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-red-500 text-red-500" />
            <span>Recipe Video</span>
          </button>
        ) : null}
      </div>

      {/* Dish Content Area */}
      <div className="p-3.5 sm:p-4">
        {/* Category & By Owner Badges */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-black tracking-wider uppercase text-red-600">
            {dish.category.replace('_', ' ')}
          </span>

          <div className="flex items-center gap-1.5">
            {stock !== undefined && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  stock <= 0
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : stock <= 5
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {stock <= 0 ? 'Out of Stock' : `Stock: ${stock} (Col E)`}
              </span>
            )}

            {dish.byOwnerSpecial && (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                <UserCheck className="w-3 h-3 text-amber-600" />
                <span>By owner</span>
              </div>
            )}
          </div>
        </div>

        {/* Titles */}
        <div className="mb-1">
          <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-tight">
            {dish.name}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 font-medium mt-0.5">
            {dish.hindiName}
          </p>
        </div>

        {/* Social Media Action Buttons (as circled in Image 2, fetched from Columns K, L, M) */}
        {(dish.reelUrl || dish.facebookUrl || dish.youtubeUrl) && (
          <div className="flex items-center gap-2 flex-wrap my-2.5">
            {dish.reelUrl && (
              <a
                href={dish.reelUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleOpenLink(e, dish.reelUrl)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white font-bold text-xs shadow-xs hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                title="Open Instagram Reel"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Open Reel</span>
                <ExternalLink className="w-3 h-3 opacity-90" />
              </a>
            )}

            {dish.facebookUrl && (
              <a
                href={dish.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleOpenLink(e, dish.facebookUrl)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1877F2] text-white font-bold text-xs shadow-xs hover:bg-[#166fe5] active:scale-95 transition-all cursor-pointer"
                title="Open Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Open Facebook</span>
                <ExternalLink className="w-3 h-3 opacity-90" />
              </a>
            )}

            {dish.youtubeUrl && (
              <a
                href={dish.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleOpenLink(e, dish.youtubeUrl)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E50914] text-white font-bold text-xs shadow-xs hover:bg-[#cc0812] active:scale-95 transition-all cursor-pointer"
                title="Open YouTube"
              >
                <Youtube className="w-3.5 h-3.5 fill-white" />
                <span>Open YouTube</span>
                <ExternalLink className="w-3 h-3 opacity-90" />
              </a>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-stone-600 leading-relaxed mb-3 line-clamp-2">
          {dish.description}
        </p>

        {/* Tags Row: Discount & Watch Video Link */}
        <div className="flex items-center gap-3 mb-3 text-xs">
          {dish.discountBadge && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">
              {dish.discountBadge}
            </span>
          )}

          {dish.videoUrl && (
            <button
              onClick={() => onWatchVideo(dish)}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 font-bold cursor-pointer transition-colors"
            >
              <Play className="w-3 h-3 fill-red-600" />
              <span>Watch Video</span>
            </button>
          )}

          <span className="text-[11px] text-stone-400 font-medium ml-auto">
            {dish.weightOrUnit}
          </span>
        </div>

        {/* Bottom Price & Action Row */}
        <div className="flex items-end justify-between pt-2 border-t border-stone-100">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block">
              Price
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-black text-stone-900">
                ₹{dish.price}
              </span>
              {dish.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{dish.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart or Quantity Selector */}
          <div>
            {isOutOfStock ? (
              <button
                disabled
                className="px-3.5 py-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-400 text-xs font-bold cursor-not-allowed"
              >
                Out of Stock
              </button>
            ) : cartQuantity === 0 ? (
              <button
                onClick={() => onAddToCart(dish)}
                className="px-5 py-2 rounded-xl bg-white border border-red-600 text-red-600 hover:bg-red-50 active:scale-95 text-xs sm:text-sm font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>ADD</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-red-600 text-white shadow-sm">
                <button
                  onClick={() => onUpdateQuantity(dish.id, -1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-red-700 rounded-md active:scale-90 transition-colors cursor-pointer"
                  title="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black min-w-[16px] text-center">
                  {cartQuantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(dish.id, 1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-red-700 rounded-md active:scale-90 transition-colors cursor-pointer"
                  title="Increase"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
