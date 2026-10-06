import React from 'react';
import { Home, ShoppingBag, User } from 'lucide-react';

export type NavTab = 'home' | 'cart' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  cartItemCount: number;
  cartTotal: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  cartItemCount,
  cartTotal,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
      <div className="w-full max-w-md md:max-w-xl mx-auto grid grid-cols-3 items-center h-16 px-4">
        {/* Home Tab */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'home' ? 'text-red-600' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[11px] font-bold mt-1 tracking-tight">Home</span>
        </button>

        {/* Cart Tab */}
        <button
          onClick={() => onSelectTab('cart')}
          className={`relative flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'cart' ? 'text-red-600' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${activeTab === 'cart' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-4.5 h-4.5 px-1 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-bounce">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold mt-1 tracking-tight">
            {cartTotal > 0 ? `Cart · ₹${cartTotal}` : 'Cart'}
          </span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-red-600' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className="text-[11px] font-bold mt-1 tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
};
