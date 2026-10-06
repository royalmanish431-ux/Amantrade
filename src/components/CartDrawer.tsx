import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, Tag, Check, ArrowRight, User, MessageCircle, Sparkles, Sheet } from 'lucide-react';
import { CartItem, Order, DeliverySettings } from '../types';
import { AVAILABLE_COUPONS } from '../data/dishes';
import { deductStockLocally, submitOrderToAppsScript } from '../services/googleSheetsService';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onRemoveItem: (dishId: string) => void;
  onClearCart: () => void;
  currentAddress: string;
  onOpenAddressModal: () => void;
  onOrderPlaced: (order: Order) => void;
  onStockDeducted?: (dishId: string, newStock: number) => void;
  deliverySettings?: DeliverySettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentAddress,
  onOpenAddressModal,
  onOrderPlaced,
  onStockDeducted,
  deliverySettings,
}) => {
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [cookingNotes, setCookingNotes] = useState('');
  const [customerName] = useState('Manish');
  const [customerPhone] = useState('9876543210');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Total quantity of items in cart
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Financial calculations
  const itemTotal = cartItems.reduce(
    (sum, item) => sum + item.dish.price * item.quantity,
    0
  );

  // Delivery settings from Column P (charge) and Column Q (description & threshold)
  const baseDeliveryCharge = deliverySettings?.charge ?? 20;
  const deliveryDescription = deliverySettings?.description ?? '';
  const freeThreshold = deliverySettings?.freeThreshold;

  const isFreeDelivery = freeThreshold !== undefined
    ? itemTotal >= freeThreshold
    : baseDeliveryCharge === 0;
  const deliveryFee = isFreeDelivery || itemTotal === 0 ? 0 : baseDeliveryCharge;
  const remainingForFreeDelivery = freeThreshold !== undefined ? Math.max(0, freeThreshold - itemTotal) : 0;

  // Coupon calculations
  let couponDiscount = 0;
  if (appliedCoupon === 'AMAN50') {
    if (itemTotal >= 99) {
      couponDiscount = Math.min(Math.round(itemTotal * 0.5), 80);
    }
  } else if (appliedCoupon === 'AMANTRADERS' || appliedCoupon === 'FESTIVE20') {
    if (itemTotal >= 99) {
      couponDiscount = 20;
    }
  }

  const grandTotal = Math.max(0, itemTotal + deliveryFee - couponDiscount);

  const handleApplyCoupon = (code: string) => {
    if (appliedCoupon === code) {
      setAppliedCoupon(null);
    } else {
      setAppliedCoupon(code);
    }
  };

  const createOrderObject = (method: 'whatsapp' | 'in_app'): Order => {
    const orderId = `SC-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      id: orderId,
      items: [...cartItems],
      itemTotal,
      deliveryFee,
      taxes: 0,
      couponDiscount,
      grandTotal,
      deliveryAddress: currentAddress || 'Civil Lines, Near Clock Tower, House 42',
      customerName: customerName || 'Valued Customer',
      customerPhone: customerPhone || '9876543210',
      paymentMethod: method === 'whatsapp' ? 'cod' : 'upi',
      status: 'received',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDeliveryTime: '25-35 mins',
      cookingInstructions: cookingNotes,
    };
  };

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);

    const newOrder = createOrderObject('whatsapp');

    // Auto-deduct stock for each ordered item
    cartItems.forEach((item) => {
      const key = item.dish.billNo || item.dish.id;
      const updated = deductStockLocally(key, item.quantity);
      if (onStockDeducted) {
        onStockDeducted(item.dish.id, updated);
      }
    });

    // Fire live stock deduction (Col E) & amount addition (Col H) to Google Apps Script Web App
    submitOrderToAppsScript({
      items: cartItems,
      grandTotal,
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone,
    }).catch((err) => console.error('Apps Script sync background error:', err));

    // Build WhatsApp message
    const itemsList = cartItems
      .map((item) => `• ${item.quantity}x ${item.dish.name} (${item.dish.weightOrUnit || 'piece'}) - ₹${item.dish.price * item.quantity}${item.dish.billNo ? ` [Barcode: ${item.dish.billNo}]` : ''}`)
      .join('\n');

    const couponLine = couponDiscount > 0 ? `\n*Coupon (${appliedCoupon}):* -₹${couponDiscount}` : '';
    const notesLine = cookingNotes.trim() ? `\n*Instructions:* ${cookingNotes}` : '';

    const message = 
`*New Order from Aman Traders App!* 🛍️
-----------------------------------
*Items:*
${itemsList}

*Items Total:* ₹${itemTotal}
*Estimated Delivery:* ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}${couponLine}
*Total Amount:* ₹${grandTotal}
-----------------------------------
*Deliver To:* ${newOrder.deliveryAddress}
*Customer:* ${newOrder.customerName} (${newOrder.customerPhone})${notesLine}
-----------------------------------
*Google Sheet Inventory:* Auto-deducted from Col E (Stock)
Spreadsheet ID: 1CRsQmQNNOUj7bbyRJYLhcUpxi8LyfQ0jOTVZG8a_x9w
-----------------------------------
Please confirm my order & share estimated delivery time! 🙏`;

    const ownerPhone = '917017373371';
    const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      setIsSubmitting(false);
      onOrderPlaced(newOrder);
      onClose();
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }, 400);
  };

  const handleDirectInAppOrder = () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);

    // Auto-deduct stock for each ordered item
    cartItems.forEach((item) => {
      const key = item.dish.billNo || item.dish.id;
      const updated = deductStockLocally(key, item.quantity);
      if (onStockDeducted) {
        onStockDeducted(item.dish.id, updated);
      }
    });

    // Fire live stock deduction (Col E) & amount addition (Col H) to Google Apps Script Web App
    submitOrderToAppsScript({
      items: cartItems,
      grandTotal,
    }).catch((err) => console.error('Apps Script in-app sync error:', err));

    setTimeout(() => {
      const newOrder = createOrderObject('in_app');
      setIsSubmitting(false);
      onClearCart();
      onClose();
      onOrderPlaced(newOrder);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#f8fafc] h-full flex flex-col shadow-2xl overflow-hidden animate-slide-left">
        {/* Top Header (Matches Image 1) */}
        <div className="pt-5 pb-3 px-5 bg-[#f8fafc] flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
              Your Cart
            </h2>
            <p className="text-xs text-slate-500 font-normal mt-1.5">
              {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} selected
            </p>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl px-3 py-1.5 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-100/80 active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Clear Cart</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              title="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3.5">
          {/* Address Alert Banner (Matches Image 1) */}
          <button
            onClick={onOpenAddressModal}
            className="w-full text-left bg-[#fffbeb] border border-[#fde68a] rounded-2xl px-4 py-3 flex items-center justify-between shadow-2xs hover:bg-[#fef9c3] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <User className="w-5 h-5 text-amber-700 shrink-0" />
              <p className="text-xs text-amber-950 font-normal truncate">
                {currentAddress ? (
                  <>
                    Deliver to <strong className="font-bold text-amber-950">{currentAddress}</strong>
                  </>
                ) : (
                  <>
                    Add delivery address in <strong className="font-bold text-amber-950">Profile</strong> for faster checkout
                  </>
                )}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-700 shrink-0" />
          </button>

          {/* Cart Items List */}
          {cartItems.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-slate-100 p-8 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Your cart is empty</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Explore delicious Gulab Jamun, Kheer, Rasgulla & bakery snacks from Aman Traders!
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#00897b] text-white text-xs font-bold shadow-sm hover:bg-[#00796b] cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map(({ dish, quantity }) => (
                <div
                  key={dish.id}
                  className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center justify-between gap-3"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {dish.imageUrl && (
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 shrink-0 border border-slate-200">
                        <img
                          src={dish.imageUrl}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900 leading-tight truncate">
                          {dish.name}
                        </h4>
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-1.5 py-0.5 rounded-md leading-normal">
                          {dish.weightOrUnit || 'Pcs'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 mt-0.5 font-normal truncate">
                        {dish.hindiName}
                      </p>

                      <div className="mt-1 flex items-baseline">
                        <span className="text-sm font-bold text-[#0f766e]">
                          ₹{dish.price}
                        </span>
                        <span className="text-[11px] text-slate-500 font-normal ml-0.5">
                          /{dish.weightOrUnit || 'piece'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Stepper, Item Total, Trash */}
                  <div className="flex items-center shrink-0">
                    {/* Stepper pill */}
                    <div className="border border-slate-200 rounded-xl px-2.5 py-1 flex items-center gap-3 bg-white shadow-2xs">
                      <button
                        onClick={() => onUpdateQuantity(dish.id, -1)}
                        className="text-slate-600 hover:text-slate-950 p-0.5 transition-colors cursor-pointer"
                        title="Decrease"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-semibold text-slate-900 min-w-[14px] text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(dish.id, 1)}
                        className="text-slate-600 hover:text-slate-950 p-0.5 transition-colors cursor-pointer"
                        title="Increase"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total for this dish */}
                    <span className="text-base font-bold text-slate-900 ml-4 min-w-[32px] text-right">
                      ₹{dish.price * quantity}
                    </span>

                    {/* Trash remove icon */}
                    <button
                      onClick={() => onRemoveItem(dish.id)}
                      className="ml-3 text-slate-300 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {cartItems.length > 0 && (
            <>
              {/* Cooking / Delivery Instructions Input */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-1.5">
                <input
                  type="text"
                  value={cookingNotes}
                  onChange={(e) => setCookingNotes(e.target.value)}
                  placeholder="e.g. Extra green chutney, less sweet, pack nicely"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl placeholder:text-slate-400 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600 transition-all"
                />
              </div>

              {/* Delivery Terms Banner (Live from Google Sheet Column Q) */}
              {deliveryDescription && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 rounded-2xl p-3.5 shadow-2xs space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                    <span className="text-base">🚚</span>
                    <span className="leading-snug">{deliveryDescription}</span>
                  </div>
                  {freeThreshold !== undefined && (
                    <p className="text-[11px] font-semibold text-emerald-800 pl-6">
                      {isFreeDelivery
                        ? '🎉 You have unlocked FREE Delivery!'
                        : `Add ₹${remainingForFreeDelivery} more to get FREE Delivery! (Standard Delivery: ₹${deliveryFee})`}
                    </p>
                  )}
                </div>
              )}

              {/* Coupons Section (Clean redesign of Image 2) */}
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Tag className="w-3.5 h-3.5 text-rose-600" />
                  <span>Available Coupons</span>
                </div>

                <div className="space-y-2">
                  {AVAILABLE_COUPONS.map((coupon) => {
                    const isSelected = appliedCoupon === coupon.code;
                    return (
                      <div
                        key={coupon.code}
                        className={`p-3 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-rose-50/50 border-rose-300'
                            : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-rose-700 tracking-wide">
                                {coupon.code}
                              </span>
                              {isSelected && (
                                <span className="flex items-center text-[11px] font-bold text-emerald-700">
                                  <Check className="w-3 h-3 mr-0.5" /> Applied
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {coupon.description}
                            </p>
                          </div>

                          <button
                            onClick={() => handleApplyCoupon(coupon.code)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
                              isSelected
                                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                            }`}
                          >
                            {isSelected ? 'Remove' : 'Apply'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bill Details Card (Matches Image 1) */}
              <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-3">
                {/* Items Total */}
                <div className="flex justify-between items-center text-sm text-slate-600">
                  <span>Items Total</span>
                  <span className="font-semibold text-slate-800">₹{itemTotal}</span>
                </div>

                {/* Estimated Delivery (Live from Sheet Col P & Q) */}
                <div className="flex justify-between items-center text-sm text-slate-600">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold text-slate-800">
                    {deliveryFee === 0 ? (
                      <span className="font-bold text-emerald-700">FREE</span>
                    ) : (
                      <span className="font-bold text-slate-900">₹{deliveryFee}</span>
                    )}
                  </span>
                </div>

                {/* Coupon Savings */}
                {couponDiscount > 0 && (
                  <div className="flex justify-between items-center text-sm text-emerald-700 font-medium">
                    <span>Coupon Savings ({appliedCoupon})</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                {/* Total Amount Divider */}
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-base font-bold text-slate-900">Total Amount</span>
                  <span className="text-2xl font-bold text-[#0f766e]">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Bottom WhatsApp Order Action Button (Matches Image 1) */}
              <div className="pt-1 pb-2">
                <button
                  onClick={handleWhatsAppOrder}
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-[#00897b] hover:bg-[#00796b] active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75"
                >
                  {/* WhatsApp Custom Icon */}
                  <svg
                    className="w-5 h-5 fill-white shrink-0"
                    viewBox="0 0 24 24"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>
                    {isSubmitting ? 'Opening WhatsApp...' : 'Submit Order & Share on WhatsApp'}
                  </span>
                </button>

                <p className="text-xs text-slate-500 font-normal text-center mt-2.5">
                  Order directly to Owner on WhatsApp (+91 70173 73371)
                </p>

                {/* Direct In-App Order Placement Alternative */}
                <button
                  onClick={handleDirectInAppOrder}
                  disabled={isSubmitting}
                  className="w-full mt-2 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors text-center cursor-pointer disabled:opacity-50"
                >
                  Or Place Direct In-App Order (₹{grandTotal})
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
