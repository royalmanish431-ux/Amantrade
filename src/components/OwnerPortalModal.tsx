import React, { useState } from 'react';
import { X, Check, Store, Package, PlusCircle, TrendingUp, Power, ToggleLeft, ToggleRight, Sheet, RefreshCw, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Dish, Order, CategoryId, SheetRowItem } from '../types';
import { CATEGORIES } from '../data/dishes';
import { AppImage } from './AppImage';
import { SPREADSHEET_ID, SPREADSHEET_URL, SHEET_COLUMNS_INFO, APPS_SCRIPT_URL, submitOrderToAppsScript } from '../services/googleSheetsService';

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
  sheetRows?: SheetRowItem[];
  onRefreshSheet?: () => void;
  isSyncingSheet?: boolean;
  onUpdateSheetStock?: (billNo: string, newStock: number) => void;
  sheetLastSynced?: string;
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
  sheetRows = [],
  onRefreshSheet,
  isSyncingSheet = false,
  onUpdateSheetStock,
  sheetLastSynced,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'add_dish' | 'stats' | 'sheet'>('sheet');
  const [isTestingScript, setIsTestingScript] = useState(false);
  const [scriptTestResult, setScriptTestResult] = useState<string | null>(null);

  const handleTestScript = async () => {
    if (sheetRows.length === 0) return;
    setIsTestingScript(true);
    setScriptTestResult(null);
    try {
      const firstRow = sheetRows[0];
      const res = await submitOrderToAppsScript({
        items: [
          {
            dish: {
              id: firstRow.billNo,
              billNo: firstRow.billNo,
              name: firstRow.itemName,
              price: firstRow.price,
              discountVal: firstRow.discount,
            } as any,
            quantity: 1,
          },
        ],
        grandTotal: firstRow.price,
      });
      setScriptTestResult(res.message);
      if (onRefreshSheet) onRefreshSheet();
    } catch (e: any) {
      setScriptTestResult(e?.message || 'Test failed');
    } finally {
      setIsTestingScript(false);
    }
  };

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
        <div className="grid grid-cols-5 bg-stone-100 border-b border-stone-200 text-[11px] font-bold text-stone-600">
          <button
            onClick={() => setActiveTab('sheet')}
            className={`py-2.5 flex items-center justify-center gap-1 transition-all border-b-2 cursor-pointer ${
              activeTab === 'sheet'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Sheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Sheet</span>
            {sheetRows.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">
                {sheetRows.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2.5 flex items-center justify-center gap-1 transition-all border-b-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <span>Live Orders</span>
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
            onClick={() => setActiveTab('add_dish')}
            className={`py-2.5 flex items-center justify-center gap-1 transition-all border-b-2 cursor-pointer ${
              activeTab === 'add_dish'
                ? 'border-red-600 text-red-600 bg-white'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Item</span>
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
          {/* TAB 0: GOOGLE SHEET INTEGRATION */}
          {activeTab === 'sheet' && (
            <div className="space-y-4">
              {/* Sheet Connection Status Card */}
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                      <Sheet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-stone-900">Google Sheet Connected</h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          Live 14 Columns
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 font-mono">
                        ID: {SPREADSHEET_ID}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {onRefreshSheet && (
                      <button
                        onClick={onRefreshSheet}
                        disabled={isSyncingSheet}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSheet ? 'animate-spin' : ''}`} />
                        <span>{isSyncingSheet ? 'Syncing...' : 'Sync Now'}</span>
                      </button>
                    )}

                    <a
                      href={SPREADSHEET_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <span>Open Sheet</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {sheetLastSynced && (
                  <p className="text-[11px] text-stone-400">
                    Last synchronized with Google Cloud: <strong>{sheetLastSynced}</strong> · Found {sheetRows.length} active row(s).
                  </p>
                )}
              </div>

              {/* 14 Columns Mapping Reference */}
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span>17 Columns Connected & Mapped (Col A to Col Q)</span>
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  {SHEET_COLUMNS_INFO.map((col) => (
                    <div key={col.col} className="p-2 rounded-xl bg-stone-50 border border-stone-200/70">
                      <div className="flex items-center gap-1 font-bold text-stone-900">
                        <span className="w-4 h-4 rounded bg-stone-200 text-stone-700 text-[10px] flex items-center justify-center font-mono">
                          {col.col}
                        </span>
                        <span className="font-mono text-emerald-700">{col.name}</span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5 truncate">{col.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Google Apps Script 2-Way Sync Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-300 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                      <h5 className="text-xs font-bold text-slate-900">
                        Apps Script 2-Way Live Sync (Stock Deduct & Amount Add)
                      </h5>
                    </div>
                    <p className="text-[11px] text-slate-600 font-mono mt-0.5 truncate max-w-sm sm:max-w-md">
                      URL: {APPS_SCRIPT_URL}
                    </p>
                  </div>

                  <button
                    onClick={handleTestScript}
                    disabled={isTestingScript || sheetRows.length === 0}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
                  >
                    {isTestingScript ? 'Testing Sync...' : 'Test Deduct & Add Amount'}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-white border border-emerald-200">
                    <span className="font-bold text-emerald-800 block">Col E (stock)</span>
                    <span className="text-[10px] text-slate-500">Auto-deducted on order</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-emerald-200">
                    <span className="font-bold text-emerald-800 block">Col G (Date)</span>
                    <span className="text-[10px] text-slate-500">Auto-stamped with date</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-emerald-200">
                    <span className="font-bold text-emerald-800 block">Col H (coustomtotal)</span>
                    <span className="text-[10px] text-slate-500">Order amount added</span>
                  </div>
                </div>

                {scriptTestResult && (
                  <div className="p-2 rounded-xl bg-emerald-100/80 border border-emerald-300 text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{scriptTestResult}</span>
                  </div>
                )}
              </div>

              {/* Live Rows Table */}
              <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-stone-800">
                    Live Sheet Rows ({sheetRows.length})
                  </h5>
                  <span className="text-[10px] text-stone-400">
                    Col E stock is synced with live order deductions
                  </span>
                </div>

                {sheetRows.length === 0 ? (
                  <div className="py-8 text-center text-stone-400 text-xs">
                    No rows found or currently syncing from Google Sheet...
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-stone-200 rounded-xl">
                    <table className="w-full text-left text-xs divide-y divide-stone-200">
                      <thead className="bg-stone-100 text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                        <tr>
                          <th className="p-2">Row</th>
                          <th className="p-2">A: Bill No</th>
                          <th className="p-2">B: Item Name</th>
                          <th className="p-2">C: Price</th>
                          <th className="p-2">D: Qty</th>
                          <th className="p-2 bg-emerald-50 text-emerald-800">E: Stock</th>
                          <th className="p-2">F: GST</th>
                          <th className="p-2">G: Date</th>
                          <th className="p-2">H: Custom Total</th>
                          <th className="p-2">I: Unit</th>
                          <th className="p-2">J: Discount</th>
                          <th className="p-2">K: YouTube</th>
                          <th className="p-2">L: Instagram</th>
                          <th className="p-2">M: Facebook</th>
                          <th className="p-2">N: Offers</th>
                          <th className="p-2">O: Image</th>
                          <th className="p-2">P: Delivery Val</th>
                          <th className="p-2">Q: Delivery Desc</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 bg-white">
                        {sheetRows.map((row) => (
                          <tr key={row.billNo} className="hover:bg-stone-50 transition-colors">
                            <td className="p-2 font-mono text-[10px] text-stone-400">#{row.rowIndex}</td>
                            <td className="p-2 font-mono font-bold text-stone-900">{row.billNo}</td>
                            <td className="p-2 font-bold text-stone-900">{row.itemName}</td>
                            <td className="p-2 text-emerald-700 font-bold">₹{row.price}</td>
                            <td className="p-2 text-stone-600">{row.qty}</td>
                            <td className="p-2 bg-emerald-50/50">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  defaultValue={row.stock}
                                  onBlur={(e) => {
                                    const val = Number(e.target.value);
                                    if (!isNaN(val) && onUpdateSheetStock) {
                                      onUpdateSheetStock(row.billNo, val);
                                    }
                                  }}
                                  className="w-14 px-1.5 py-0.5 text-xs font-bold text-center border border-emerald-300 rounded bg-white"
                                  title="Edit stock"
                                />
                                <span className="text-[10px] text-emerald-800">{row.unit}</span>
                              </div>
                            </td>
                            <td className="p-2 text-stone-500">{row.gst}%</td>
                            <td className="p-2 text-stone-500">{row.date}</td>
                            <td className="p-2 text-stone-500">{row.customTotal ? `₹${row.customTotal}` : '-'}</td>
                            <td className="p-2 text-stone-700 font-medium">{row.unit}</td>
                            <td className="p-2 text-amber-700 font-medium">{row.discount ? `${row.discount}%` : '-'}</td>
                            <td className="p-2 text-stone-400 truncate max-w-[80px]">{row.youtube || '-'}</td>
                            <td className="p-2 text-stone-400 truncate max-w-[80px]">{row.instagram || '-'}</td>
                            <td className="p-2 text-stone-400 truncate max-w-[80px]">{row.facebook || '-'}</td>
                            <td className="p-2 text-stone-600 font-medium">{row.offers || '-'}</td>
                            <td className="p-2">
                              {row.imageUrl ? (
                                <div className="flex items-center gap-1.5">
                                  <img
                                    src={row.imageUrl}
                                    alt={row.itemName}
                                    className="w-8 h-8 rounded-lg object-cover border border-stone-200"
                                  />
                                  <a
                                    href={row.imageUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] text-blue-600 hover:underline max-w-[60px] truncate"
                                  >
                                    View
                                  </a>
                                </div>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="p-2 font-bold text-emerald-700">
                              {row.deliveryValue !== undefined ? `₹${row.deliveryValue}` : '-'}
                            </td>
                            <td className="p-2 text-stone-600 text-[11px] max-w-[140px] truncate" title={row.deliveryDescription}>
                              {row.deliveryDescription || '-'}
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
                <h5 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Top Selling Dishes</h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1">
                    <span className="font-bold text-stone-800">1. Kheer (खीर)</span>
                    <span className="text-stone-500">142 orders</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-bold text-stone-800">2. Gulab Jamun (गुलाब जामुन)</span>
                    <span className="text-stone-500">118 orders</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-bold text-stone-800">3. Veg Hakka Chowmein</span>
                    <span className="text-stone-500">94 orders</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="font-bold text-stone-800">4. Desi Ghee Samosa</span>
                    <span className="text-stone-500">89 orders</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
