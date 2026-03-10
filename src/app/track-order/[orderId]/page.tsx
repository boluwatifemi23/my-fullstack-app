"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, Loader2, ChefHat, Truck, Package, Home } from "lucide-react";
import Link from "next/link";

const STEPS = [
  { key: "placed", label: "Order Placed", icon: Package, desc: "We received your order!" },
  { key: "preparing", label: "Preparing", icon: ChefHat, desc: "Our chefs are cooking your meal" },
  { key: "out-for-delivery", label: "Out for Delivery", icon: Truck, desc: "Your order is on the way!" },
  { key: "delivered", label: "Delivered", icon: Home, desc: "Enjoy your meal!" },
];

interface Order {
  orderId: string;
  customer: { name: string; address: string; city: string; state: string; zip: string };
  items: { name: string; quantity: number; price: number }[];
  total: number;
  deliveryFee: number;
  subtotal: number;
  deliveryStatus: string;
  paymentStatus: string;
  deliveryDate: string;
  deliveryTime: string;
  createdAt: string;
}

export default function TrackOrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${orderId}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setOrder(data);
      })
      .catch(() => setError("Failed to load order"))
      .finally(() => setLoading(false));
  }, [orderId]);

  const currentStepIndex = STEPS.findIndex(s => s.key === order?.deliveryStatus);

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-orange-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-[450px] h-[450px] bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative max-w-xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <Truck size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Track Order</h1>
            <p className="text-gray-400 text-sm font-mono">{orderId}</p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-orange-500 animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
            <p className="text-red-400 font-medium">{error}</p>
            <p className="text-gray-500 text-sm mt-2">Check your order ID and try again</p>
            <Link href="/" className="inline-block mt-4 text-orange-400 hover:text-orange-300 text-sm transition">← Back to Home</Link>
          </div>
        )}

        {order && (
          <div className="space-y-5">
            {/* Status Timeline */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-bold mb-6">Delivery Status</h2>
              <div className="space-y-4">
                {STEPS.map((step, i) => {
                  const isDone = i <= currentStepIndex;
                  const isCurrent = i === currentStepIndex;
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          isDone ? "bg-orange-500 border-orange-500" :
                          "bg-white/5 border-white/20"
                        }`}>
                          {isDone
                            ? <CheckCircle size={18} className="text-white" />
                            : <Icon size={16} className="text-gray-500" />
                          }
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`w-0.5 h-8 mt-1 ${isDone ? "bg-orange-500" : "bg-white/10"}`} />
                        )}
                      </div>
                      <div className="pt-1.5">
                        <p className={`font-semibold text-sm ${isDone ? "text-white" : "text-gray-500"}`}>
                          {step.label}
                          {isCurrent && <span className="ml-2 text-xs text-orange-400 font-normal">(Current)</span>}
                        </p>
                        <p className={`text-xs mt-0.5 ${isDone ? "text-gray-400" : "text-gray-600"}`}>{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Details */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-bold mb-4">Order Details</h2>
              <div className="space-y-2 text-sm">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-gray-400">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-2 mt-2 space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Delivery Fee</span><span>${order.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-orange-400">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
              <h2 className="text-white font-bold mb-3">Delivery Info</h2>
              <p className="text-gray-400 text-sm">{order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.zip}</p>
              <p className="text-gray-400 text-sm mt-1">📅 {order.deliveryDate} · {order.deliveryTime}</p>
            </div>

            <Link href="/"
              className="block text-center text-sm text-gray-500 hover:text-orange-400 transition py-2">
              ← Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}