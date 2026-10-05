import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Tag,
  Check,
  Bike,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  RefreshCw,
} from 'lucide-react';
import { CartItem, Dish, Order, UserProfile } from '../types';
import { AVAILABLE_COUPONS } from '../data/dishes';
import { AppImage } from './AppImage';
import { StockDeductionConfirmModal } from './StockDeductionConfirmModal';
import { deductStockViaAppsScript } from '../services/appsScriptService';

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentUser?: UserProfile | null;
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onRemoveItem: (dishId: string) => void;
  onClearCart: () => void;
  currentAddress: string;
  onOpenAddressModal: () => void;
  onOrderPlaced: (order: Order) => void;
  isGoogleConnected?: boolean;
  onGoogleSignIn?: () => void;
  onDeductSheetStock?: (
    orderItems: { dishId: string; dishName: string; quantity: number }[]
  ) => Promise<boolean>;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentUser,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentAddress,
  onOpenAddressModal,
  onOrderPlaced,
  isGoogleConnected = false,
  onGoogleSignIn,
  onDeductSheetStock,
}) => {
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('AMAN50');
  const [cookingNotes, setCookingNotes] = useState('');
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Manish');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '9876543210');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeductingStock, setIsDeductingStock] = useState(false);
  const [showConfirmDeductionModal, setShowConfirmDeductionModal] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.phone) setCustomerPhone(currentUser.phone);
    }
  }, [currentUser]);

  if (!isOpen) return null;

  // Financial calculations
  const itemTotal = cartItems.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0
  );

  const freeDeliveryThreshold = 199;
  const isFreeDelivery = itemTotal >= freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : 30;
  const packagingAndTaxes = itemTotal > 0 ? 15 : 0;

  // Coupon calculations
  let couponDiscount = 0;
  if (appliedCoupon === 'AMAN50' && itemTotal >= 99) {
    couponDiscount = Math.min(Math.round(itemTotal * 0.5), 80);
  } else if (appliedCoupon === 'FREEDEL' && itemTotal >= 150) {
    couponDiscount = 30;
  } else if (appliedCoupon === 'FESTIVE20' && itemTotal >= 99) {
    couponDiscount = 20;
  }

  const grandTotal = Math.max(0, itemTotal + deliveryFee + packagingAndTaxes - couponDiscount);
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - itemTotal);

  const handleApplyCoupon = (code: string) => {
    if (appliedCoupon === code) {
      setAppliedCoupon(null);
    } else {
      setAppliedCoupon(code);
    }
  };

  const executeOrderCreation = () => {
    setIsSubmitting(true);
    const orderId = `AT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      items: [...cartItems],
      itemTotal,
      deliveryFee,
      taxes: packagingAndTaxes,
      couponDiscount,
      grandTotal,
      deliveryAddress: currentAddress,
      customerName: customerName || 'Valued Customer',
      customerPhone: customerPhone || '9876543210',
      paymentMethod,
      status: 'received',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDeliveryTime: '30-40 mins',
      cookingInstructions: cookingNotes,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmDeductionModal(false);
      onClearCart();
      onClose();
      onOrderPlaced(newOrder);
    }, 400);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    if (isGoogleConnected && onDeductSheetStock) {
      // Require explicit confirmation before mutating spreadsheet data (mandatory per SKILL.md)
      setShowConfirmDeductionModal(true);
    } else {
      executeOrderCreation();
    }
  };

  const handleConfirmStockDeduction = async () => {
    setIsDeductingStock(true);
    try {
      const itemsToDeduct = cartItems.map((ci) => ({
        dishId: ci.dish.id,
        dishName: ci.dish.name,
        quantity: ci.quantity,
      }));

      // Deduct via connected Google Apps Script URL by matching item name
      try {
        await deductStockViaAppsScript({
          order_id: `AT-${Math.floor(1000 + Math.random() * 9000)}`,
          customer_name: customerName || 'Valued Customer',
          customer_phone: customerPhone || '9876543210',
          total_amount: grandTotal,
          delivery_address: currentAddress,
          items: itemsToDeduct.map((ci) => ({
            name: ci.dishName,
            item_name: ci.dishName,
            qty: ci.quantity,
          })),
        });
      } catch (scriptErr) {
        console.warn('Apps Script direct deduct notice:', scriptErr);
      }

      if (onDeductSheetStock) {
        await onDeductSheetStock(itemsToDeduct);
      }
    } catch (err) {
      console.error('Failed to deduct stock from Google Sheets:', err);
    } finally {
      setIsDeductingStock(false);
      executeOrderCreation();
    }
  };

  /**
   * WhatsApp Order Trigger:
   * As soon as this button is clicked, stock deducts from Sheet 2 (Column E)
   * matching the item name from amantraders, and opens WhatsApp with the order!
   */
  const handleWhatsAppOrder = async () => {
    if (cartItems.length === 0 || isSubmitting || isDeductingStock) return;

    setIsSubmitting(true);
    setIsDeductingStock(true);

    const orderId = `AT-${Math.floor(1000 + Math.random() * 9000)}`;
    const itemsToDeduct = cartItems.map((ci) => ({
      dishId: ci.dish.id,
      dishName: ci.dish.name,
      quantity: ci.quantity,
    }));

    // 1. Deduct stock via Google Apps Script web app (matches item name and deducts stock on spreadsheet)
    try {
      await deductStockViaAppsScript({
        order_id: orderId,
        customer_name: customerName || 'Valued Customer',
        customer_phone: customerPhone || '9876543210',
        total_amount: grandTotal,
        delivery_address: currentAddress,
        items: itemsToDeduct.map((ci) => ({
          name: ci.dishName,
          item_name: ci.dishName,
          qty: ci.quantity,
        })),
      });
    } catch (scriptErr) {
      console.warn('Apps Script direct deduct notice:', scriptErr);
    }

    // Also trigger stock deduction on Sheet 2 (Column E) if connected
    if (onDeductSheetStock) {
      try {
        await onDeductSheetStock(itemsToDeduct);
      } catch (err) {
        console.warn('Stock deduction error on WhatsApp order click:', err);
      }
    }

    // 2. Format WhatsApp order message
    const orderItemsSummary = cartItems
      .map(
        (ci) =>
          `• *${ci.dish.name}* (${ci.dish.hindiName || ''}) x ${ci.quantity} = ₹${
            ci.dish.price * ci.quantity
          }`
      )
      .join('\n');

    const whatsappMessage = `🛍️ *NEW ORDER - AMAN TRADERS*
📋 *Order ID:* #${orderId}
👤 *Customer:* ${customerName || 'Valued Customer'} (${customerPhone || 'N/A'})
📍 *Delivery Address:* ${currentAddress}

🍽️ *ORDERED ITEMS:*
${orderItemsSummary}

💵 *Item Total:* ₹${itemTotal}
🛵 *Delivery Fee:* ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
${couponDiscount > 0 ? `🎟️ *Coupon (${appliedCoupon}):* -₹${couponDiscount}\n` : ''}💰 *GRAND TOTAL:* ₹${grandTotal}
💳 *Payment Mode:* ${
      paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI' : 'Card'
    }
${cookingNotes ? `📝 *Cooking Notes:* ${cookingNotes}\n` : ''}
✅ *Stock Status:* Auto-deducted from Sheet 2 (Column E)
⏰ *Time:* ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    // 3. Open WhatsApp link directly
    const whatsappNumber =
      localStorage.getItem('aman_traders_whatsapp_number') || '919876543210';
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 4. Create in-app order record and reset cart
    const newOrder: Order = {
      id: orderId,
      items: [...cartItems],
      itemTotal,
      deliveryFee,
      taxes: packagingAndTaxes,
      couponDiscount,
      grandTotal,
      deliveryAddress: currentAddress,
      customerName: customerName || 'Valued Customer',
      customerPhone: customerPhone || '9876543210',
      paymentMethod,
      status: 'received',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDeliveryTime: '30-40 mins',
      cookingInstructions: cookingNotes,
    };

    setIsDeductingStock(false);
    setIsSubmitting(false);
    onClearCart();
    onClose();
    onOrderPlaced(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-stone-50 h-full flex flex-col shadow-2xl overflow-hidden animate-slide-left">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-white border-b border-stone-200">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-stone-900">Your Cart</h3>
            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Free Delivery Meter */}
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-bold text-stone-800 mb-1.5">
              <div className="flex items-center gap-1.5 text-amber-900">
                <Bike className="w-4 h-4 text-orange-600" />
                <span>
                  {isFreeDelivery
                    ? '🎉 You unlocked FREE DELIVERY!'
                    : `Add ₹${remainingForFreeDelivery} more for FREE Delivery`}
                </span>
              </div>
              <span className="text-[11px] text-stone-500 font-semibold">₹199 Target</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                style={{
                  width: `${Math.min(100, (itemTotal / freeDeliveryThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
                <Bike className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-stone-800">Your cart is empty</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                Add fresh mouth-watering confectionery & bakery delights from Aman Traders!
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-sm hover:bg-red-700 cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Selected Items
                </span>
                <button
                  onClick={onClearCart}
                  className="text-[11px] font-semibold text-stone-400 hover:text-red-600 cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              {cartItems.map(({ dish, quantity }) => (
                <div
                  key={dish.id}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-stone-200 shadow-2xs"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-stone-100 border border-stone-100">
                    <AppImage
                      src={dish.imageUrl}
                      alt={dish.name}
                      fallbackFoodType={dish.visualTheme.foodType}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0"></span>
                      <h5 className="text-xs font-bold text-stone-900 truncate">
                        {dish.name}
                      </h5>
                    </div>
                    <span className="text-[10px] text-stone-500 block truncate">
                      {dish.hindiName} · {dish.weightOrUnit}
                    </span>
                    <span className="text-xs font-bold text-stone-900 mt-0.5 block">
                      ₹{dish.price * quantity}
                    </span>
                  </div>

                  {/* Quantity Counter */}
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-stone-100 border border-stone-200">
                    <button
                      onClick={() => onUpdateQuantity(dish.id, -1)}
                      className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-black min-w-[14px] text-center text-stone-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(dish.id, 1)}
                      className="w-5 h-5 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(dish.id)}
                    className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {cartItems.length > 0 && (
            <>
              {/* Cooking Notes */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200 space-y-1.5 shadow-2xs">
                <label className="text-xs font-bold text-stone-700 block">
                  Cooking / Delivery Instructions
                </label>
                <input
                  type="text"
                  value={cookingNotes}
                  onChange={(e) => setCookingNotes(e.target.value)}
                  placeholder="e.g. Extra green chutney, less sweet, pack nicely"
                  className="w-full px-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* Coupons Section */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200 space-y-2 shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
                  <Tag className="w-3.5 h-3.5 text-red-600" />
                  <span>Available Coupons</span>
                </div>

                <div className="space-y-1.5">
                  {AVAILABLE_COUPONS.map((coupon) => {
                    const isSelected = appliedCoupon === coupon.code;
                    return (
                      <div
                        key={coupon.code}
                        onClick={() => handleApplyCoupon(coupon.code)}
                        className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-red-50/60 border-red-500'
                            : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black tracking-wide text-red-700">
                              {coupon.code}
                            </span>
                            {isSelected && (
                              <span className="flex items-center text-[10px] font-bold text-emerald-700">
                                <Check className="w-3 h-3 mr-0.5" /> Applied
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-500">{coupon.description}</p>
                        </div>
                        <button
                          className={`text-xs font-bold px-2 py-1 rounded-lg ${
                            isSelected
                              ? 'bg-red-600 text-white'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {isSelected ? 'Remove' : 'Apply'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Address Preview */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200 flex items-center justify-between shadow-2xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Delivering to
                  </span>
                  <span className="text-xs font-bold text-stone-800 truncate block max-w-[240px]">
                    {currentAddress}
                  </span>
                </div>
                <button
                  onClick={onOpenAddressModal}
                  className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
                >
                  Change
                </button>
              </div>

              {/* Bill Details */}
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 space-y-2 shadow-2xs text-xs">
                <h5 className="font-bold text-stone-800 text-xs">Bill Details</h5>

                <div className="flex justify-between text-stone-600">
                  <span>Item Total</span>
                  <span className="font-medium">₹{itemTotal}</span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span className="flex items-center gap-1">
                    Delivery Partner Fee
                    {isFreeDelivery && (
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 rounded">
                        FREE
                      </span>
                    )}
                  </span>
                  <span className={`font-medium ${isFreeDelivery ? 'line-through text-stone-400' : ''}`}>
                    ₹30
                  </span>
                </div>

                <div className="flex justify-between text-stone-600">
                  <span>Taxes & Restaurant Packaging</span>
                  <span className="font-medium">₹{packagingAndTaxes}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Savings ({appliedCoupon})</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm font-black text-stone-900">
                  <span>To Pay</span>
                  <span className="text-base text-red-700">₹{grandTotal}</span>
                </div>
              </div>

              {/* Google Sheets Inventory Auto-Deduct Info Banner */}
              <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 text-xs shadow-2xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Google Sheets Inventory Sync</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Sheet 2 · Col E
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {isGoogleConnected ? (
                    <span className="text-emerald-800 font-medium">
                      ✓ Connected to <strong>amantraders</strong>. Item quantities will be deducted from Column E in Sheet 2 upon order confirmation.
                    </span>
                  ) : (
                    <span>
                      Connect your Google Account to automatically update & deduct stock in your <strong>amantraders</strong> spreadsheet.
                    </span>
                  )}
                </p>
                {!isGoogleConnected && onGoogleSignIn && (
                  <button
                    onClick={onGoogleSignIn}
                    className="mt-1 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-[11px] hover:bg-stone-50 cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
                  >
                    <span>Connect Google Sheets</span>
                  </button>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white p-3 rounded-2xl border border-stone-200 space-y-2 shadow-2xs">
                <span className="text-xs font-bold text-stone-800 block">
                  Select Payment Method
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-start transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-red-600 bg-red-50/50 text-red-700'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span>UPI / QR Code</span>
                    <span className="text-[10px] text-stone-400 font-normal">GPay, PhonePe, Paytm</span>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-start transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-red-600 bg-red-50/50 text-red-700'
                        : 'border-stone-200 bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span>Cash on Delivery</span>
                    <span className="text-[10px] text-stone-400 font-normal">Pay cash at doorstep</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Fixed Checkout Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-white border-t border-stone-200 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-stone-500 font-medium">Total Amount:</span>
                <span className="text-base font-black text-stone-900 ml-1.5">₹{grandTotal}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Safe Delivery</span>
              </div>
            </div>

            {/* Primary Action: WhatsApp Order Button with Instant Stock Deduction */}
            <button
              onClick={handleWhatsAppOrder}
              disabled={isSubmitting || isDeductingStock}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-98 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-between gap-2 cursor-pointer disabled:opacity-75"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <WhatsAppIcon className="w-5 h-5 fill-white" />
                </div>
                <div className="text-left">
                  <span className="block leading-tight font-black text-sm sm:text-base">
                    {isDeductingStock ? 'Deducting Stock & Opening...' : 'Order via WhatsApp'}
                  </span>
                  <span className="text-[10px] text-emerald-100 font-medium block">
                    ⚡ Auto-deducts from Sheet 2 (Column E)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 font-black text-base bg-black/15 px-3 py-1.5 rounded-xl shrink-0">
                {isDeductingStock ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>₹{grandTotal}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </div>
            </button>

            {/* Secondary Option: Direct Place Order */}
            <button
              onClick={handleCheckout}
              disabled={isSubmitting || isDeductingStock}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
            >
              <span>Or Place Direct In-App Order (₹{grandTotal})</span>
            </button>
          </div>
        )}
      </div>

      {/* Mandatory User Confirmation Dialog before mutating Spreadsheet data */}
      <StockDeductionConfirmModal
        isOpen={showConfirmDeductionModal}
        onClose={() => setShowConfirmDeductionModal(false)}
        onConfirm={handleConfirmStockDeduction}
        orderItems={cartItems.map((ci) => ({
          name: `${ci.dish.name} (${ci.dish.hindiName})`,
          quantity: ci.quantity,
          price: ci.dish.price,
        }))}
        isDeducting={isDeductingStock}
      />
    </div>
  );
};
