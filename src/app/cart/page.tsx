"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, clear, addToCart, removeFromCart, decreaseQuantity } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-orange-600/25 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-[450px] h-[450px] bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-orange-500/15 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="relative text-center max-w-sm">
          <div className="w-24 h-24 mx-auto mb-6 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <ShoppingBag size={40} className="text-orange-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
          <p className="text-gray-400 mb-6">Looks like you haven&apos;t added any meals yet.</p>
          <Link href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all">
            <ArrowLeft size={18} /> Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-orange-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute -bottom-20 left-1/3 w-[450px] h-[450px] bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] bg-red-600/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-gray-400 hover:text-orange-500 transition p-2 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Your Cart</h1>
            <p className="text-gray-400 text-sm">{items.reduce((s, i) => s + i.quantity, 0)} items</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item._id}
                className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex gap-4 hover:bg-white/8 transition-all duration-200">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-800 border border-white/10">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} width={80} height={80} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🍽️</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{item.name}</h3>
                  <p className="text-sm text-gray-400 capitalize">{item.category.replace(/-/g, " ")}</p>
                  <p className="text-orange-400 font-bold mt-1">${item.price.toLocaleString()}</p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button title="Remove item"
                    onClick={() => { removeFromCart(item._id); toast.success(`${item.name} removed`); }}
                    className="text-gray-500 hover:text-red-400 transition p-1 rounded-lg hover:bg-red-400/10">
                    <Trash2 size={15} />
                  </button>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-2 py-1">
                    <button title="Decrease quantity" onClick={() => decreaseQuantity(item._id)}
                      className="text-gray-400 hover:text-orange-400 transition">
                      <Minus size={13} />
                    </button>
                    <span className="w-6 text-center font-bold text-white text-sm">{item.quantity}</span>
                    <button title="Increase quantity" onClick={() => addToCart(item)}
                      className="text-gray-400 hover:text-orange-400 transition">
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={() => { clear(); toast.success("Cart cleared"); }}
              className="text-sm text-red-400 hover:text-red-300 transition flex items-center gap-1.5 mt-2 px-3 py-2 rounded-xl hover:bg-red-400/10">
              <Trash2 size={13} /> Clear cart
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 sticky top-24">
              <h2 className="font-bold text-white text-lg mb-4">Order Summary</h2>
              <div className="space-y-2 text-sm mb-4">
                {items.map((item) => (
                  <div key={item._id} className="flex justify-between text-gray-400">
                    <span className="truncate mr-2">{item.name} × {item.quantity}</span>
                    <span className="text-white font-medium shrink-0">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between font-bold">
                  <span className="text-white">Subtotal</span>
                  <span className="text-orange-400 text-lg">${subtotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Delivery fees calculated at checkout</p>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-orange-500/20 active:scale-95">
                Proceed to Checkout
              </button>

              <Link href="/"
                className="block text-center text-sm text-gray-500 hover:text-orange-400 mt-3 transition">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}