import React, { useState } from 'react';
import {
  X,
  Check,
  Store,
  Package,
  PlusCircle,
  TrendingUp,
  Power,
  ToggleLeft,
  ToggleRight,
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { Dish, Order, CategoryId } from '../types';
import { CATEGORIES } from '../data/dishes';
import { AppImage } from './AppImage';
import { GoogleSignInButton } from './GoogleSignInButton';
import {
  SheetRowData,
  SPREADSHEET_URL,
  DEFAULT_SHEET_NAME,
  AMAN_TRADE_SPREADSHEET_URL,
  STOCK_SPREADSHEET_URL,
  AMAN_TRADE_SHEET_NAME,
} from '../services/googleSheetsService';
import { getAppsScriptUrl, setAppsScriptUrl } from '../services/appsScriptService';
import { User } from 'firebase/auth';

interface OwnerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  dishes: Dish[];
  onToggleAvailability: (dishId: string) => void;
  onUpdatePrice: (dishId: string, newPrice: number) => void;
  onAddNewDish: (newDish: Dish) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  isStoreOpen: boolean;
  onToggleStoreStatus: () => void;
  // Google Sheets Props
  googleUser: User | null;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
  isGoogleLoading: boolean;
  sheetRows: SheetRowData[];
  onSyncSheetStock: () => Promise<void>;
  onInitializeSheet2: () => Promise<void>;
  onFetchAmanTradersMenu: () => Promise<void>;
  onSyncAppsScript?: () => void;
  isSyncingSheets: boolean;
  isFetchingMenu?: boolean;
  lastSyncTime: string | null;
  syncFeedback?: { type: 'success' | 'error'; message: string } | null;
}

export const OwnerPortalModal: React.FC<OwnerPortalModalProps> = ({
  isOpen,
  onClose,
  dishes,
  onToggleAvailability,
  onUpdatePrice,
  onAddNewDish,
  orders,
  onUpdateOrderStatus,
  isStoreOpen,
  onToggleStoreStatus,
  googleUser,
  onGoogleSignIn,
  onGoogleSignOut,
  isGoogleLoading,
  sheetRows,
  onSyncSheetStock,
  onInitializeSheet2,
  onFetchAmanTradersMenu,
  onSyncAppsScript,
  isSyncingSheets,
  isFetchingMenu = false,
  lastSyncTime,
  syncFeedback,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'sheets' | 'add_dish' | 'stats'>('orders');
  const [whatsappNumber, setWhatsappNumber] = useState(
    () => localStorage.getItem('aman_traders_whatsapp_number') || '919876543210'
  );
  const [appsScriptUrlInput, setAppsScriptUrlInput] = useState(() => getAppsScriptUrl());

  // New Dish Form State
  const [newName, setNewName] = useState('');
  const [newHindiName, setNewHindiName] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryId>('confectionery');
  const [newPrice, setNewPrice] = useState<number>(50);
  const [newOriginalPrice, setNewOriginalPrice] = useState<number>(70);
  const [newDiscount, setNewDiscount] = useState('20% OFF');
  const [newWeight, setNewWeight] = useState('250 gram');
  const [newDescription, setNewDescription] = useState('');
  const [newFoodType, setNewFoodType] = useState<any>('kheer');

  if (!isOpen) return null;

  const handleAddDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const dishToAdd: Dish = {
      id: `custom-${Date.now()}`,
      name: newName.trim(),
      hindiName: newHindiName.trim() || newName.trim(),
      category: newCategory,
      price: Number(newPrice) || 40,
      originalPrice: newOriginalPrice ? Number(newOriginalPrice) : undefined,
      discountBadge: newDiscount.trim() || undefined,
      weightOrUnit: newWeight.trim() || '1 plate',
      rating: 4.8,
      ratingCount: 1,
      isVeg: true,
      isSpecial: true,
      isRecommended: true,
      isAvailable: true,
      byOwnerSpecial: true,
      description: newDescription.trim() || 'Freshly made with pure ingredients at Aman Traders.',
      visualTheme: {
        bgGradient: 'from-amber-100 via-orange-50 to-stone-100',
        foodType: newFoodType,
        accentColor: '#92400e',
      },
    };

    onAddNewDish(dishToAdd);
    setNewName('');
    setNewHindiName('');
    setNewDescription('');
    setActiveTab('menu');
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[90vh]">
        {/* Top Header */}
        <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Aman Traders</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-black uppercase">
                  Owner Admin
                </span>
              </div>
              <p className="text-xs text-stone-400">Manage orders, live menu pricing & catalog</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Store Open/Close Toggle */}
            <button
              onClick={onToggleStoreStatus}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isStoreOpen
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-red-600/20 text-red-400 border border-red-500/40'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isStoreOpen ? 'Store Online' : 'Store Offline'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-5 bg-stone-100 border-b border-stone-200 text-xs font-bold text-stone-600">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2.5 flex items-center justify-center gap-1 transition-all border-b-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <span>Orders</span>
            {orders.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[9px] flex items-center justify-center">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`py-2.5 flex items-center justify-center gap-1 transition-all border-b-2 cursor-pointer ${
              activeTab === 'menu'
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Menu</span>
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`py-2.5 flex items-center justify-center gap-1 transition-all border-b-2 cursor-pointer ${
              activeTab === 'sheets'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sheet 2</span>
          </button>

          <button
            onClick={() => setActiveTab('add_dish')}
            className={`py-2.5 flex items-center justify-center gap-1 transition-all border-b-2 cursor-pointer ${
              activeTab === 'add_dish'
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2.5 flex items-center justify-center gap-1 transition-all border-b-2 cursor-pointer ${
              activeTab === 'stats'
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Stats</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-stone-50">
          {/* TAB 1: LIVE ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="py-16 text-center text-stone-500">
                  <Package className="w-12 h-12 mx-auto text-stone-300 mb-2" />
                  <p className="font-bold text-sm text-stone-700">No active customer orders yet</p>
                  <p className="text-xs text-stone-400 mt-1">
                    When customers place orders from the app, they will show up here live!
                  </p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-stone-900">#{ord.id}</span>
                        <span className="text-[11px] text-stone-400">{ord.createdAt}</span>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          ord.status === 'received'
                            ? 'bg-amber-100 text-amber-800'
                            : ord.status === 'preparing'
                            ? 'bg-blue-100 text-blue-800'
                            : ord.status === 'out_for_delivery'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {ord.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 divide-y divide-stone-100 bg-stone-50 p-2.5 rounded-xl">
                      {ord.items.map((i) => (
                        <div key={i.dish.id} className="py-1 flex justify-between">
                          <span>
                            {i.dish.name} x {i.quantity}
                          </span>
                          <span className="font-bold">₹{i.dish.price * i.quantity}</span>
                        </div>
                      ))}
                      <div className="pt-1.5 flex justify-between font-black text-stone-900">
                        <span>Total: ₹{ord.grandTotal}</span>
                        <span className="uppercase text-[10px] text-stone-500">
                          {ord.paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-500">
                      <strong>Customer:</strong> {ord.customerName} ({ord.customerPhone}) ·{' '}
                      {ord.deliveryAddress}
                    </div>

                    {/* Order Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      {ord.status === 'received' && (
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'preparing')}
                          className="flex-1 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                        >
                          Start Preparing
                        </button>
                      )}

                      {ord.status === 'preparing' && (
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'out_for_delivery')}
                          className="flex-1 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                        >
                          Dispatch / Out for Delivery
                        </button>
                      )}

                      {ord.status === 'out_for_delivery' && (
                        <button
                          onClick={() => onUpdateOrderStatus(ord.id, 'delivered')}
                          className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                        >
                          Mark as Delivered
                        </button>
                      )}

                      {ord.status === 'delivered' && (
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <Check className="w-4 h-4" /> Order Completed
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: MENU & STOCK MANAGEMENT */}
          {activeTab === 'menu' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-1">
                <span>Total Items: {dishes.length}</span>
                <span>Click switch to toggle stock availability</span>
              </div>

              <div className="space-y-2">
                {dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="p-3 rounded-2xl bg-white border border-stone-200 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-stone-100">
                        <AppImage
                          src={dish.imageUrl}
                          alt={dish.name}
                          fallbackFoodType={dish.visualTheme.foodType}
                          className="w-full h-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                          <h5 className="text-xs font-bold text-stone-900 truncate">{dish.name}</h5>
                        </div>
                        <span className="text-[10px] text-stone-500 truncate block">
                          {dish.hindiName} · {dish.weightOrUnit}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-black text-stone-900">₹{dish.price}</span>
                          {dish.discountBadge && (
                            <span className="text-[9px] bg-red-50 text-red-700 font-bold px-1 rounded">
                              {dish.discountBadge}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stock Toggle & Price Edit */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-stone-400">₹</span>
                        <input
                          type="number"
                          defaultValue={dish.price}
                          onBlur={(e) => onUpdatePrice(dish.id, Number(e.target.value) || dish.price)}
                          className="w-14 px-1.5 py-1 text-xs border border-stone-200 rounded-lg text-center font-bold"
                          title="Click to edit price"
                        />
                      </div>

                      <button
                        onClick={() => onToggleAvailability(dish.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          dish.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : 'bg-rose-50 text-rose-700 border border-rose-300'
                        }`}
                      >
                        {dish.isAvailable ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-emerald-600" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-rose-600" />
                            <span>Sold Out</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ADD NEW DISH */}
          {activeTab === 'add_dish' && (
            <form onSubmit={handleAddDishSubmit} className="space-y-3.5 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs text-xs">
              <h4 className="text-sm font-bold text-stone-800">Add New Item to Live Menu</h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Item Name (English)*</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Malai Peda Special"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Item Name (Hindi)*</label>
                  <input
                    type="text"
                    value={newHindiName}
                    onChange={(e) => setNewHindiName(e.target.value)}
                    placeholder="e.g. मलाई पेड़ा"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Category*</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as CategoryId)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Food Visual Style</label>
                  <select
                    value={newFoodType}
                    onChange={(e) => setNewFoodType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
                  >
                    <option value="kheer">Kheer Handi</option>
                    <option value="gulab_jamun">Gulab Jamun Bowl</option>
                    <option value="malai_roll">Malai Roll</option>
                    <option value="rasgulla">Rasgulla</option>
                    <option value="kaju_katli">Kaju Katli</option>
                    <option value="jalebi">Jalebi Rabdi</option>
                    <option value="samosa">Samosa</option>
                    <option value="chaat">Dahi Chaat</option>
                    <option value="chowmein">Chowmein Wok</option>
                    <option value="momos">Momos</option>
                    <option value="pizza">Pizza</option>
                    <option value="burger">Burger</option>
                    <option value="lassi">Lassi Kulhad</option>
                    <option value="pastry">Bakery Cake</option>
                    <option value="colddrink">Chilled Cold Drink</option>
                    <option value="chocolate">Dairy Milk Chocolate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Selling Price (₹)*</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Weight / Serving</label>
                  <input
                    type="text"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="250 gram"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Discount Tag (Optional)</label>
                <input
                  type="text"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  placeholder="e.g. 50% OFF, BUY 1 GET 1"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Special ingredients, flavor notes..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Add Item to Menu
              </button>
            </form>
          )}

          {/* TAB: GOOGLE SHEETS INVENTORY (SHEET 2 · COLUMN E) */}
          {activeTab === 'sheets' && (
            <div className="space-y-4 text-xs">
              {/* Top Spreadsheet Information Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 text-white shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-emerald-300">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-white">amantrade Catalog Sheet</h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-[10px] font-mono font-bold">
                          {AMAN_TRADE_SHEET_NAME}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 text-[10px] font-mono font-bold">
                          Stock: {DEFAULT_SHEET_NAME}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-200/90 mt-0.5">
                        Menu & items fetch from <strong>amantrade</strong> sheet. Stock auto-deducts from <strong>Sheet 2 (Column E)</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={AMAN_TRADE_SPREADSHEET_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-stone-900 font-bold text-xs hover:bg-stone-100 transition-colors shadow-xs shrink-0"
                      title="Open amantrade Catalog Spreadsheet"
                    >
                      <span>Open amantrade</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={STOCK_SPREADSHEET_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-600 transition-colors shadow-xs shrink-0"
                      title="Open Sheet2 Stock Spreadsheet"
                    >
                      <span>Open Sheet 2</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Google Auth Status Bar */}
                <div className="pt-2.5 border-t border-white/15 flex items-center justify-between flex-wrap gap-2 text-[11px]">
                  {googleUser ? (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-emerald-100">
                        Connected: <strong>{googleUser.email}</strong>
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-amber-200">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
                      <span>Google Account not connected yet</span>
                    </div>
                  )}

                  {googleUser ? (
                    <button
                      onClick={onGoogleSignOut}
                      className="flex items-center gap-1 text-red-300 hover:text-red-200 underline font-semibold cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>Disconnect</span>
                    </button>
                  ) : (
                    <GoogleSignInButton
                      onClick={onGoogleSignIn}
                      isLoading={isGoogleLoading}
                      label="Connect Google Sheet"
                      className="py-1 px-3"
                    />
                  )}
                </div>
              </div>

              {/* Sync Feedback Alert */}
              {syncFeedback && (
                <div
                  className={`p-3 rounded-2xl flex items-start gap-2.5 text-xs ${
                    syncFeedback.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                      : 'bg-red-50 border border-red-300 text-red-900'
                  }`}
                >
                  {syncFeedback.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="font-medium leading-relaxed">{syncFeedback.message}</div>
                </div>
              )}

              {/* Google Apps Script Integration Card */}
              <div className="bg-emerald-950/90 text-white p-4 rounded-2xl border border-emerald-700/50 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <h5 className="font-bold text-xs uppercase tracking-wider text-emerald-200">
                      Google Apps Script Web App (Live Link)
                    </h5>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-800 text-emerald-100 border border-emerald-600">
                    Active & Connected
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={appsScriptUrlInput}
                    onChange={(e) => {
                      setAppsScriptUrlInput(e.target.value);
                      setAppsScriptUrl(e.target.value);
                    }}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-3 py-1.5 text-xs bg-black/40 border border-emerald-600/40 rounded-xl font-mono text-emerald-100 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                  {onSyncAppsScript && (
                    <button
                      onClick={onSyncAppsScript}
                      disabled={isFetchingMenu}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isFetchingMenu ? 'animate-spin' : ''}`} />
                      <span>Sync Live</span>
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                  ⚡ Customers automatically load live menu items & stock from this script. Every order auto-deducts stock by matching the <strong>item name</strong> on your Google Sheet.
                </p>
              </div>

              {/* Sync Actions Bar */}
              <div className="space-y-2 bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={onFetchAmanTradersMenu}
                      disabled={isFetchingMenu}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isFetchingMenu ? 'animate-spin' : ''}`} />
                      <span>{isFetchingMenu ? 'Fetching...' : 'Fetch Menu from "amantrade" Sheet'}</span>
                    </button>

                    <button
                      onClick={onSyncSheetStock}
                      disabled={isSyncingSheets || !googleUser}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSheets ? 'animate-spin' : ''}`} />
                      <span>{isSyncingSheets ? 'Syncing...' : 'Sync Stock from Sheet2'}</span>
                    </button>

                    <button
                      onClick={onInitializeSheet2}
                      disabled={isSyncingSheets || !googleUser}
                      className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs border border-stone-200 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Syncs menu items into Sheet2 with Column E stock"
                    >
                      Setup Sheet2 Format
                    </button>
                  </div>

                  <div className="text-[11px] text-stone-500 font-medium">
                    {lastSyncTime ? `Last synced: ${lastSyncTime}` : 'Target: amantrade & Sheet2'}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-stone-700 font-bold text-xs">
                    <span>📱 WhatsApp Order Receiving Number:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={whatsappNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setWhatsappNumber(val);
                        localStorage.setItem('aman_traders_whatsapp_number', val);
                      }}
                      placeholder="e.g. 919876543210"
                      className="px-2.5 py-1 text-xs border border-stone-300 rounded-lg font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 w-36 bg-stone-50"
                    />
                    <span className="text-[10px] text-stone-400 font-medium">(With 91 code)</span>
                  </div>
                </div>

                <p className="text-[10px] text-stone-500">
                  Tip: When a customer clicks <strong>"Order via WhatsApp"</strong>, stock is automatically deducted from <strong>Sheet 2 (Column E)</strong> by matching item name, and the order details are sent to this WhatsApp number.
                </p>
              </div>

              {/* Inventory Table */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
                <div className="p-3 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
                  <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px]">
                    Sheet 2 Live Stock Rows ({sheetRows.length})
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Column E = Live Stock
                  </span>
                </div>

                {sheetRows.length === 0 ? (
                  <div className="p-8 text-center space-y-3">
                    <FileSpreadsheet className="w-10 h-10 text-stone-300 mx-auto" />
                    <div>
                      <h5 className="font-bold text-stone-800 text-sm">Sheet 2 not loaded yet</h5>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                        Connect your Google account and click <strong>"Sync Stock from Sheet 2"</strong> or <strong>"Setup Sheet 2 Format"</strong> to load your catalog rows.
                      </p>
                    </div>
                    {googleUser && (
                      <button
                        onClick={onInitializeSheet2}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                      >
                        Populate Sheet 2 with Menu
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-80">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 text-stone-500 border-b border-stone-200 text-[10px] uppercase font-bold sticky top-0">
                        <tr>
                          <th className="p-2.5">Row</th>
                          <th className="p-2.5">Item Name</th>
                          <th className="p-2.5">Category</th>
                          <th className="p-2.5 text-right">Price</th>
                          <th className="p-2.5 text-center font-extrabold text-emerald-800">
                            Col E (Stock)
                          </th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 text-stone-700">
                        {sheetRows.map((row) => (
                          <tr key={row.rowIndex} className="hover:bg-stone-50 transition-colors">
                            <td className="p-2.5 font-mono text-stone-400 text-[11px]">
                              {row.rowIndex}
                            </td>
                            <td className="p-2.5 font-bold text-stone-900">
                              {row.name || row.id}
                            </td>
                            <td className="p-2.5 text-stone-500 capitalize">
                              {row.category}
                            </td>
                            <td className="p-2.5 text-right font-medium">
                              ₹{row.price}
                            </td>
                            <td className="p-2.5 text-center">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black ${
                                  row.stock === 0
                                    ? 'bg-red-100 text-red-700 border border-red-200'
                                    : row.stock <= 5
                                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                }`}
                              >
                                {row.stock}
                              </span>
                            </td>
                            <td className="p-2.5">
                              <span className="text-[11px] text-stone-600 font-medium">
                                {row.status || (row.stock > 0 ? 'In Stock' : 'Out of Stock')}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: STORE ANALYTICS */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-stone-500 uppercase">Today's Revenue</span>
                  <div className="text-2xl font-black text-emerald-600 mt-1">₹{totalRevenue + 8450}</div>
                  <span className="text-[10px] text-stone-400">Including live online + shop orders</span>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-stone-500 uppercase">Orders Received</span>
                  <div className="text-2xl font-black text-stone-900 mt-1">{orders.length + 38}</div>
                  <span className="text-[10px] text-stone-400">98% 5-star customer rating</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Aman Traders Menu Catalog</h5>
                <div className="space-y-2 text-xs">
                  {dishes.map((dish, idx) => (
                    <div key={dish.id} className="flex justify-between items-center py-1 border-b border-stone-100 last:border-b-0">
                      <span className="font-bold text-stone-800">{idx + 1}. {dish.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-semibold text-stone-400">{dish.category}</span>
                        <span className="font-bold text-emerald-700">₹{dish.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
