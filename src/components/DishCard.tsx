import React from 'react';
import { Star, Play, Plus, Minus, Package, Video, Instagram, Facebook, Tag } from 'lucide-react';
import { Dish } from '../types';

interface DishCardProps {
  dish: Dish;
  cartQuantity: number;
  onAddToCart: (dish: Dish) => void;
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onWatchVideo: (dish: Dish) => void;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  cartQuantity,
  onAddToCart,
  onUpdateQuantity,
  onWatchVideo,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden mb-3.5 transition-all hover:shadow-md">
      {/* Top Media Row (Only if real image exists from Column O or YouTube video available) */}
      {dish.imageUrl ? (
        <div className="relative aspect-16/10 sm:aspect-16/9 w-full bg-slate-50 overflow-hidden border-b border-stone-100">
          <img
            src={dish.imageUrl}
            alt={dish.name}
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {dish.discountBadge && (
            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-black uppercase tracking-wide shadow-xs">
              {dish.discountBadge}
            </div>
          )}
          {dish.videoUrl && (
            <button
              onClick={() => onWatchVideo(dish)}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-xs font-semibold shadow-md cursor-pointer active:scale-95 transition-transform"
            >
              <Play className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              <span>Video</span>
            </button>
          )}
        </div>
      ) : dish.videoUrl ? (
        <div className="p-3 bg-gradient-to-r from-red-50 to-amber-50 border-b border-red-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-stone-800">YouTube Demo Available</span>
          </div>
          <button
            onClick={() => onWatchVideo(dish)}
            className="px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Play</span>
          </button>
        </div>
      ) : null}

      {/* Main Content Area */}
      <div className="p-4 space-y-3">
        {/* Top Badges: Barcode, Sheet Link, Stock */}
        <div className="flex items-center justify-between gap-2 flex-wrap text-[11px]">
          <div className="flex items-center gap-1.5 flex-wrap">
            {dish.billNo ? (
              <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-mono font-bold text-[10px] border border-stone-200">
                #{dish.billNo}
              </span>
            ) : (
              <span className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Package className="w-3.5 h-3.5" />
              </span>
            )}

            <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
              📊 Google Sheet
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {dish.stock !== undefined && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  dish.stock > 10
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : dish.stock > 0
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {dish.stock > 0 ? `${dish.stock} in stock` : 'Sold Out'}
              </span>
            )}

            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-700 font-bold text-[10px]">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              <span>{dish.rating || 4.8}</span>
            </div>
          </div>
        </div>

        {/* Product Title */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
            {dish.name}
          </h3>
          {dish.hindiName && dish.hindiName !== dish.name && (
            <p className="text-xs text-stone-400 font-medium mt-0.5">
              {dish.hindiName}
            </p>
          )}
        </div>

        {/* Attributes / Columns Info */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] text-stone-500">
          <span className="bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200">
            Unit: <strong className="text-stone-700">{dish.weightOrUnit}</strong>
          </span>

          {dish.gst !== undefined && (
            <span className="bg-stone-50 px-2 py-0.5 rounded-md border border-stone-200">
              GST: <strong className="text-stone-700">{dish.gst}%</strong>
            </span>
          )}

          {dish.dateAdded && (
            <span className="text-[10px] text-stone-400">
              Date: {dish.dateAdded}
            </span>
          )}
        </div>

        {/* Offers & Social Links */}
        {(dish.discountBadge || dish.offersText || dish.instagramUrl || dish.facebookUrl) && (
          <div className="flex items-center gap-2 flex-wrap pt-0.5">
            {dish.discountBadge && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">
                <Tag className="w-3 h-3" />
                {dish.discountBadge}
              </span>
            )}

            {dish.offersText && (
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200 text-[11px]">
                {dish.offersText}
              </span>
            )}

            {dish.instagramUrl && (
              <a
                href={dish.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-md bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors"
                title="Instagram Link"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            )}

            {dish.facebookUrl && (
              <a
                href={dish.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                title="Facebook Link"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Bottom Price & Add Action */}
        <div className="flex items-center justify-between pt-2.5 border-t border-stone-100">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block">
              Price
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-stone-900">
                ₹{dish.price}
              </span>
              {dish.originalPrice && dish.originalPrice > dish.price && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{dish.originalPrice}
                </span>
              )}
              <span className="text-[10px] text-stone-400">/{dish.weightOrUnit}</span>
            </div>
          </div>

          <div>
            {dish.stock !== undefined && dish.stock <= 0 ? (
              <span className="px-4 py-2 rounded-xl bg-stone-100 text-stone-400 text-xs font-bold border border-stone-200 inline-block">
                Sold Out
              </span>
            ) : cartQuantity === 0 ? (
              <button
                onClick={() => onAddToCart(dish)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>ADD TO CART</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-emerald-600 text-white shadow-xs">
                <button
                  onClick={() => onUpdateQuantity(dish.id, -1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-emerald-700 rounded-md active:scale-90 transition-colors cursor-pointer"
                  title="Decrease"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black min-w-[16px] text-center">
                  {cartQuantity}
                </span>
                <button
                  onClick={() => onUpdateQuantity(dish.id, 1)}
                  className="w-6 h-6 flex items-center justify-center hover:bg-emerald-700 rounded-md active:scale-90 transition-colors cursor-pointer"
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
