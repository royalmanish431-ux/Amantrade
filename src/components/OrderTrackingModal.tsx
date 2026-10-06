import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, Bike, Phone, MessageSquare, X, ChefHat, Sparkles } from 'lucide-react';
import { Order } from '../types';
import { triggerAppsScriptOrder, getFormattedCurrentDate } from '../services/appsScriptService';

interface OrderTrackingModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Auto-progress simulation for realistic feedback
  useEffect(() => {
    if (!isOpen) return;
    setCurrentStep(1);

    const timer1 = setTimeout(() => {
      setCurrentStep(2);
    }, 4000);

    const timer2 = setTimeout(() => {
      setCurrentStep(3);
    }, 12000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handleWhatsAppShare = () => {
    const todayStr = getFormattedCurrentDate();

    // Trigger Apps Script to ensure Column N (Date) & Column O (Amount) are recorded
    triggerAppsScriptOrder({
      date: todayStr,
      amount: order.grandTotal,
      total_amount: order.grandTotal,
      order_id: order.id,
      customer_name: order.customerName,
      customer_phone: order.customerPhone,
      delivery_address: order.deliveryAddress,
      items: order.items.map((i) => ({
        name: i.dish.name,
        item_name: i.dish.name,
        qty: i.quantity,
      })),
    }).catch((err) => console.debug('Apps Script share trigger notice:', err));

    const itemsSummary = order.items
      .map((i) => `• ${i.dish.name} (${i.dish.hindiName}) x${i.quantity} = ₹${i.dish.price * i.quantity}`)
      .join('\n');

    const message = `Namaste Aman Traders! 🙏\nI have placed order *#${order.id}* on *${todayStr}*.\n\n*Order Items:*\n${itemsSummary}\n\n*Total Amount:* ₹${order.grandTotal}\n*Delivery Address:* ${order.deliveryAddress}\n*Payment:* ${order.paymentMethod.toUpperCase()}\n\nPlease confirm & prepare fresh! Thank you!`;

    const whatsappNumber =
      localStorage.getItem('aman_traders_whatsapp_number') || '919876543210';
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
  };

  const steps = [
    { title: 'Order Confirmed', desc: 'Order received at Aman Traders', icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" /> },
    { title: 'Kitchen Preparing', desc: 'Master Chef Aman is handcrafting your order', icon: <ChefHat className="w-5 h-5 text-amber-600" /> },
    { title: 'Out For Delivery', desc: 'Delivery partner Rohit is en route (30-45 mins)', icon: <Bike className="w-5 h-5 text-red-600" /> },
    { title: 'Delivered', desc: 'Enjoy your fresh confectionery & bakery items!', icon: <Sparkles className="w-5 h-5 text-emerald-600" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-red-700 via-red-800 to-amber-700 text-white p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-200 font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Order Received Successfully!</span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5">Order #{order.id}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Estimated Delivery Time Card */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase block">
                  Estimated Delivery
                </span>
                <span className="text-base font-black text-stone-900">
                  {order.estimatedDeliveryTime}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              Live Cooking
            </span>
          </div>

          {/* Timeline tracker */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Order Status Tracker
            </h4>
            <div className="space-y-3 relative pl-6 border-l-2 border-stone-200 ml-3">
              {steps.map((st, idx) => {
                const stepNum = idx + 1;
                const isPassed = currentStep >= stepNum;
                const isCurrent = currentStep === stepNum;

                return (
                  <div key={st.title} className="relative">
                    <div
                      className={`absolute -left-[31px] top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isPassed
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {stepNum}
                    </div>
                    <div>
                      <h5
                        className={`text-xs font-bold ${
                          isCurrent ? 'text-red-700' : isPassed ? 'text-stone-900' : 'text-stone-400'
                        }`}
                      >
                        {st.title}
                        {isCurrent && (
                          <span className="ml-2 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-extrabold animate-pulse">
                            In Progress
                          </span>
                        )}
                      </h5>
                      <p className="text-[11px] text-stone-500">{st.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-2">
            <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Items Ordered ({order.items.length})
            </h4>
            <div className="divide-y divide-stone-100 text-xs">
              {order.items.map(({ dish, quantity }) => (
                <div key={dish.id} className="py-1.5 flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span className="font-semibold text-stone-800">
                      {dish.name} x {quantity}
                    </span>
                  </div>
                  <span className="font-bold text-stone-900">₹{dish.price * quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-200 flex justify-between font-black text-sm text-stone-900">
              <span>Total Paid</span>
              <span className="text-red-700">₹{order.grandTotal}</span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="p-3 rounded-xl bg-stone-50 text-xs border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">
              Delivering to
            </span>
            <p className="font-bold text-stone-800 mt-0.5">{order.deliveryAddress}</p>
          </div>

          {/* WhatsApp & Call Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleWhatsAppShare}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-white text-emerald-600" />
              <span>WhatsApp Order</span>
            </button>

            <a
              href="tel:+919876543210"
              className="py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Call Shop</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
