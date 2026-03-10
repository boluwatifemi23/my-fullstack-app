"use client";

import Image from "next/image";
import { CustomerInfo } from "../page";
import { MapPin, Calendar, ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category: string;
}

export default function ReviewOrder({ customer, items, onBack, onConfirm, loading }: {
  customer: CustomerInfo;
  items: CartItem[];
  onBack: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="space-y-5">
     
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <ShoppingBag size={18} className="text-orange-400" /> Your Items
        </h2>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item._id} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 shrink-0 border border-white/10">
                {item.image ? (
                  <Image src={item.image} alt={item.name} width={48} height={48} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{item.name}</p>
                <p className="text-gray-400 text-xs">× {item.quantity}</p>
              </div>
              <p className="text-orange-400 font-bold text-sm shrink-0">
                ${(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 mt-4 pt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Subtotal</span><span className="text-white">${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Delivery fee</span><span className="text-white">Calculated next step</span>
          </div>
        </div>
      </div>

     
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-orange-400" /> Delivery To
        </h2>
        <div className="space-y-2 text-sm">
          <p className="text-white font-medium">{customer.name}</p>
          <p className="text-gray-400">{customer.email} · {customer.phone}</p>
          <p className="text-gray-400">{customer.address}</p>
          <p className="text-gray-400">{customer.city}, {customer.state} {customer.zip}</p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
            <Calendar size={14} className="text-orange-400" />
            <p className="text-gray-300">{customer.deliveryDate} · {customer.deliveryTime}</p>
          </div>
          {customer.specialInstructions && (
            <p className="text-gray-500 italic text-xs mt-2">{customer.specialInstructions}</p>
          )}
        </div>
      </div>

     
      <div className="flex gap-3">
        <button onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl font-medium text-sm transition-all">
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={onConfirm} disabled={loading}
          className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2">
          {loading ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : "Confirm & Pay →"}
        </button>
      </div>
    </div>
  );
}