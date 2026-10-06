/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { AppDownloadBanner } from './components/AppDownloadBanner';
import { CategorySlider } from './components/CategorySlider';
import { RecommendedSection } from './components/RecommendedSection';
import { FilterBar, FilterType } from './components/FilterBar';
import { DishCard } from './components/DishCard';
import { BottomNav, NavTab } from './components/BottomNav';
import { VideoModal } from './components/VideoModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { OwnerPortalModal } from './components/OwnerPortalModal';
import { AddressModal } from './components/AddressModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { ProfileView } from './components/ProfileView';
import { GoogleSheetsBanner } from './components/GoogleSheetsBanner';

import { INITIAL_DISHES } from './data/dishes';
import { CategoryId, Dish, CartItem, Order, SheetRowItem, DeliverySettings } from './types';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { fetchGoogleSheetData, setStockLocally } from './services/googleSheetsService';

export default function App() {
  // Catalog State
  const [dishes, setDishes] = useState<Dish[]>(INITIAL_DISHES);
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  // Delivery Settings State (Live from Column P & Column Q)
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    charge: 20,
    description: 'if you till 50 rupees product you can take free delivery 🚚',
    freeThreshold: 50,
  });

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Location State
  const [currentAddress, setCurrentAddress] = useState('Civil Lines, Near Clock Tower, House 42');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Modals
  const [selectedVideoDish, setSelectedVideoDish] = useState<Dish | null>(null);
  const [isOwnerPortalOpen, setIsOwnerPortalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // Google Sheet Connected State (1CRsQmQNNOUj7bbyRJYLhcUpxi8LyfQ0jOTVZG8a_x9w)
  const [sheetRows, setSheetRows] = useState<SheetRowItem[]>([]);
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const [sheetLastSynced, setSheetLastSynced] = useState('');
  const [sheetError, setSheetError] = useState<string | null>(null);

  const loadGoogleSheet = async () => {
    try {
      setIsSyncingSheet(true);
      setSheetError(null);
      const res = await fetchGoogleSheetData();
      setSheetRows(res.rawRows);
      setSheetLastSynced(res.lastUpdated);

      if (res.dishes.length > 0) {
        setDishes(res.dishes);
      } else {
        setDishes([]);
      }

      if (res.deliverySettings) {
        setDeliverySettings(res.deliverySettings);
      }
    } catch (err: any) {
      console.error('Error fetching Google Sheet:', err);
      setSheetError(err?.message || 'Failed to sync with Google Sheet');
    } finally {
      setIsSyncingSheet(false);
    }
  };

  useEffect(() => {
    loadGoogleSheet();
  }, []);

  const handleUpdateSheetStock = (billNo: string, newStock: number) => {
    setStockLocally(billNo, newStock);
    setSheetRows((prev) =>
      prev.map((r) => (r.billNo === billNo ? { ...r, stock: newStock } : r))
    );
    setDishes((prev) =>
      prev.map((d) =>
        d.billNo === billNo
          ? { ...d, stock: newStock, isAvailable: newStock > 0 }
          : d
      )
    );
  };

  const handleStockDeducted = (dishId: string, newStock: number) => {
    setDishes((prev) =>
      prev.map((d) =>
        d.id === dishId
          ? { ...d, stock: newStock, isAvailable: newStock > 0 }
          : d
      )
    );
    setSheetRows((prev) =>
      prev.map((r) =>
        dishId.includes(r.billNo) || r.billNo === dishId
          ? { ...r, stock: newStock }
          : r
      )
    );
  };

  // Cart helpers
  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((item) => {
      map[item.dish.id] = item.quantity;
    });
    return map;
  }, [cartItems]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, i) => acc + i.dish.price * i.quantity, 0);
  }, [cartItems]);

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((acc, i) => acc + i.quantity, 0);
  }, [cartItems]);

  const handleAddToCart = (dish: Dish) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.dish.id === dish.id);
      if (existing) {
        return prev.map((i) =>
          i.dish.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { dish, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (dishId: string, delta: number) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.dish.id === dishId);
      if (!existing) return prev;

      const newQty = existing.quantity + delta;
      if (newQty <= 0) {
        return prev.filter((i) => i.dish.id !== dishId);
      }
      return prev.map((i) =>
        i.dish.id === dishId ? { ...i, quantity: newQty } : i
      );
    });
  };

  const handleRemoveFromCart = (dishId: string) => {
    setCartItems((prev) => prev.filter((i) => i.dish.id !== dishId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingOrder(newOrder);
  };

  // Owner Portal Operations
  const handleToggleAvailability = (dishId: string) => {
    setDishes((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, isAvailable: !d.isAvailable } : d))
    );
  };

  const handleUpdatePrice = (dishId: string, newPrice: number) => {
    setDishes((prev) =>
      prev.map((d) => (d.id === dishId ? { ...d, price: newPrice } : d))
    );
  };

  const handleAddNewDish = (newDish: Dish) => {
    setDishes((prev) => [newDish, ...prev]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
      setActiveTrackingOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Category counts computation
  const dishCounts = useMemo(() => {
    return {
      confectionery: dishes.filter((d) => d.category === 'confectionery').length,
      bakery: dishes.filter((d) => d.category === 'bakery').length,
    };
  }, [dishes]);

  // Filtered Dishes Computation
  const videoDishesCount = useMemo(() => {
    return dishes.filter((d) => Boolean(d.videoUrl)).length;
  }, [dishes]);

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = dish.name.toLowerCase().includes(query);
        const matchesHindi = dish.hindiName.toLowerCase().includes(query);
        const matchesDesc = dish.description.toLowerCase().includes(query);
        const matchesCategory = dish.category.toLowerCase().includes(query);
        if (!matchesName && !matchesHindi && !matchesDesc && !matchesCategory) {
          return false;
        }
      }

      // Category filter (Confectionery or Bakery)
      if (activeCategory !== 'all') {
        if (dish.category !== activeCategory) return false;
      }

      // Filter chips
      if (activeFilter === 'offers' && !dish.discountBadge) return false;
      if (activeFilter === 'under100' && dish.price >= 100) return false;
      if (activeFilter === 'video' && !dish.videoUrl) return false;
      if (activeFilter === 'top_rated' && dish.rating < 4.5) return false;
      if (activeFilter === 'special' && !dish.isSpecial) return false;

      return true;
    });
  }, [dishes, searchQuery, activeCategory, activeFilter]);

  return (
    <div className="min-h-screen bg-stone-50 w-full flex flex-col">
      {/* Responsive Shell Container: 100% full width on mobile, max-w-5xl on tablet/laptop */}
      <div className="w-full max-w-5xl mx-auto bg-stone-50 min-h-screen flex flex-col relative shadow-sm">
        {/* Main Content Area */}
        {activeTab === 'home' && (
          <div className="flex-1 pb-24">
            {/* Header */}
            <Header
              currentAddress={currentAddress}
              onOpenAddressModal={() => setIsAddressModalOpen(true)}
              onOpenOwnerPortal={() => setIsOwnerPortalOpen(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectPopularTag={(tag) => setSearchQuery(tag)}
            />

            {/* Offline Alert if store closed */}
            {!isStoreOpen && (
              <div className="bg-amber-600 text-white text-xs font-bold px-4 py-2 text-center">
                Aman Traders is currently offline for today. Pre-orders accepted.
              </div>
            )}

            {/* Hero Banner (matches Screenshot 1) */}
            <HeroBanner />

            {/* App Download APK Banner (matches Screenshot 1) */}
            <AppDownloadBanner
              onOpenDownloadModal={() => setIsApkModalOpen(true)}
            />

            {/* Category Slider: Exactly 2 categories (Confectionery and Bakery) */}
            <CategorySlider
              activeCategory={activeCategory}
              onSelectCategory={(id) => {
                setActiveCategory((prev) => (prev === id ? 'all' : id));
              }}
              onSeeAllClick={() => {
                setActiveCategory('all');
              }}
              dishCounts={dishCounts}
            />

            {/* Recommended For You Section - only if multiple items exist */}
            {!searchQuery && dishes.length > 2 && (activeCategory === 'all' || activeCategory === 'confectionery') && (
              <RecommendedSection
                dishes={activeCategory === 'confectionery' ? dishes.filter((d) => d.category === 'confectionery') : dishes}
                cartQuantities={cartQuantities}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
                onWatchVideo={(dish) => setSelectedVideoDish(dish)}
              />
            )}

            {/* Filter Bar Chips */}
            {dishes.length > 3 && (
              <FilterBar
                activeFilter={activeFilter}
                onSelectFilter={(f) => {
                  setActiveFilter(f);
                  if (f === 'all') {
                    setActiveCategory('all');
                  }
                }}
                videoCount={videoDishesCount}
              />
            )}

            {/* All Items Section */}
            <div className="px-4 pt-3 pb-2">
              <div className="mb-3">
                <h3 className="text-base font-black text-stone-900 leading-tight">
                  All Items From Live Google Sheet
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Showing {filteredDishes.length} live item{filteredDishes.length === 1 ? '' : 's'} linked with spreadsheet
                </p>
              </div>

              {/* List of Dishes */}
              {isSyncingSheet && dishes.length === 0 ? (
                <div className="py-12 text-center bg-white rounded-2xl border border-stone-200 p-6">
                  <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-xs font-bold text-stone-700">Connecting to Google Sheet & loading live items...</p>
                </div>
              ) : filteredDishes.length === 0 ? (
                <div className="py-12 text-center bg-white rounded-2xl border border-stone-200 p-6">
                  <p className="text-sm font-bold text-stone-700">No items found</p>
                  <p className="text-xs text-stone-400 mt-1">
                    Add rows in your Google Sheet (ID: 1CRsQmQNNOUj7bbyRJYLhcUpxi8LyfQ0jOTVZG8a_x9w) to display them live.
                  </p>
                  <button
                    onClick={loadGoogleSheet}
                    className="mt-3 px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Refresh Sheet
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredDishes.map((dish) => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      cartQuantity={cartQuantities[dish.id] || 0}
                      onAddToCart={handleAddToCart}
                      onUpdateQuantity={handleUpdateQuantity}
                      onWatchVideo={(dish) => setSelectedVideoDish(dish)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <ProfileView
            orders={orders}
            onOpenOwnerPortal={() => setIsOwnerPortalOpen(true)}
            onOpenAddressModal={() => setIsAddressModalOpen(true)}
            currentAddress={currentAddress}
            onReorder={(order) => {
              order.items.forEach((item) => {
                for (let k = 0; k < item.quantity; k++) {
                  handleAddToCart(item.dish);
                }
              });
              setIsCartOpen(true);
            }}
          />
        )}

        {/* Floating Cart Pill Bar when items > 0 */}
        {cartItemCount > 0 && activeTab === 'home' && (
          <div className="fixed bottom-18 left-0 right-0 z-30 px-4 pointer-events-none">
            <div className="w-full max-w-md md:max-w-xl mx-auto pointer-events-auto">
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-xl shadow-red-900/25 flex items-center justify-between active:scale-98 transition-transform cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-black tracking-wide block uppercase">
                      {cartItemCount} {cartItemCount === 1 ? 'ITEM' : 'ITEMS'} ADDED
                    </span>
                    <span className="text-[11px] text-amber-200 font-semibold block">
                      100% Free Doorstep Delivery
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-black">₹{cartTotal}</span>
                  <div className="flex items-center gap-0.5 text-xs font-bold pl-1.5 border-l border-white/20">
                    <span>View Cart</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Fixed Bottom Navigation (Home, Cart, Profile) */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'cart') {
              setIsCartOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          cartItemCount={cartItemCount}
          cartTotal={cartTotal}
        />

        {/* Modals */}
        <VideoModal
          dish={selectedVideoDish}
          isOpen={Boolean(selectedVideoDish)}
          onClose={() => setSelectedVideoDish(null)}
          onAddToCart={handleAddToCart}
        />

        <CartDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveFromCart}
          onClearCart={handleClearCart}
          currentAddress={currentAddress}
          onOpenAddressModal={() => {
            setIsCartOpen(false);
            setIsAddressModalOpen(true);
          }}
          onOrderPlaced={handleOrderPlaced}
          onStockDeducted={handleStockDeducted}
          deliverySettings={deliverySettings}
        />

        <OrderTrackingModal
          order={activeTrackingOrder}
          isOpen={Boolean(activeTrackingOrder)}
          onClose={() => setActiveTrackingOrder(null)}
        />

        <OwnerPortalModal
          isOpen={isOwnerPortalOpen}
          onClose={() => setIsOwnerPortalOpen(false)}
          dishes={dishes}
          onToggleAvailability={handleToggleAvailability}
          onUpdatePrice={handleUpdatePrice}
          onAddNewDish={handleAddNewDish}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          isStoreOpen={isStoreOpen}
          onToggleStoreStatus={() => setIsStoreOpen((prev) => !prev)}
          sheetRows={sheetRows}
          onRefreshSheet={loadGoogleSheet}
          isSyncingSheet={isSyncingSheet}
          onUpdateSheetStock={handleUpdateSheetStock}
          sheetLastSynced={sheetLastSynced}
        />

        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          currentAddress={currentAddress}
          onSelectAddress={setCurrentAddress}
        />

        <ApkDownloadModal
          isOpen={isApkModalOpen}
          onClose={() => setIsApkModalOpen(false)}
        />
      </div>
    </div>
  );
}
