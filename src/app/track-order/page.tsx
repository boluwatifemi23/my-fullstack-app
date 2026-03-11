"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Truck, Loader2 } from "lucide-react";

export default function TrackOrderSearchPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const trimmed = orderId.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError("");

    const res = await fetch(`/api/orders/${trimmed}`);
    if (res.ok) {
      router.push(`/track-order/${trimmed}`);
    } else {
      setError("Order not found. Please check your Order ID and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-orange-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-[450px] h-[450px] bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center">
              <Truck size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Track Your Order</h1>
              <p className="text-gray-400 text-sm">Enter your Order ID to see live updates</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                Order ID
              </label>
              <input
                required
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                placeholder="e.g. CC-EVM_ZBEZ"
                className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all text-sm font-mono uppercase"
              />
              <p className="text-gray-600 text-xs mt-1.5">
                You can find your Order ID in your confirmation email
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2">
              {loading
                ? <><Loader2 size={18} className="animate-spin" /> Searching...</>
                : <><Search size={18} /> Track Order</>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-500 text-xs">
              Do not have your Order ID?{" "}
              <a href="mailto:cateringcornerstone2@gmail.com" className="text-orange-400 hover:text-orange-300 transition">
                Contact us
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}