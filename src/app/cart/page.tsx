"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, clear, addToCart } = useCart();
  const [removing, setRemoving] = useState<string | null>(null);

  
  const removeItem = (id: string) => {
    
    setRemoving(id);
    setTimeout(() => setRemoving(null), 300);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
            <ShoppingBag size={40} className="text-orange-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-500 mb-6">Looks like you haven&apos;t added any meals yet.</p>
          <Link href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all">
            <ArrowLeft size={18} /> Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-gray-500 hover:text-orange-500 transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
            <p className="text-gray-500 text-sm">{items.reduce((s, i) => s + i.quantity, 0)} items</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item._id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 transition-all
                  ${removing === item._id ? "opacity-0 scale-95" : "opacity-100"}`}>
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} width={80} height={80} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{item.category.replace(/-/g, " ")}</p>
                  <p className="text-orange-600 font-bold mt-1">₦{item.price.toLocaleString()}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                  title="Remove from cart"
                   onClick={() => { removeItem(item._id); toast.success(`${item.name} removed`); }}
                    className="text-gray-400 hover:text-red-500 transition p-1">
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">
                      <Minus size={14} />
                    </span>
                    <span className="w-6 text-center font-semibold text-gray-900">{item.quantity}</span>
                    <button
                    title="Add to cart"
                     onClick={() => addToCart(item)} className="text-orange-500 hover:text-orange-600 transition">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={() => { clear(); toast.success("Cart cleared"); }}
              className="text-sm text-red-400 hover:text-red-500 transition flex items-center gap-1">
              <Trash2 size={14} /> Clear cart
            </button>
          </div>

         
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm mb-4">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between text-gray-600">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold text-gray-900">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Delivery fees calculated at checkout</p>
              </div>

              <button
                onClick={() => toast("Checkout coming soon! 🚀", { icon: "ℹ️" })}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-orange-500/30"
              >
                Proceed to Checkout
              </button>

              <Link href="/"
                className="block text-center text-sm text-gray-500 hover:text-orange-500 mt-3 transition">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}