"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, ChefHat, Truck, Home, Loader2, ShoppingBag } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: string;
  items: OrderItem[];
  total: number;
  deliveryStatus: "placed" | "preparing" | "out-for-delivery" | "delivered";
  paymentStatus: string;
  deliveryDate: string;
  deliveryTime: string;
  createdAt: string;
}

const STATUS_STEPS = ["placed", "preparing", "out-for-delivery", "delivered"];

const STATUS_INFO: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  placed: { label: "Order Placed", color: "text-blue-400 bg-blue-500/10 border-blue-500/30", icon: Package },
  preparing: { label: "Preparing", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30", icon: ChefHat },
  "out-for-delivery": { label: "Out for Delivery", color: "text-orange-400 bg-orange-500/10 border-orange-500/30", icon: Truck },
  delivered: { label: "Delivered", color: "text-green-400 bg-green-500/10 border-green-500/30", icon: Home },
};

export default function MyOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const load = async () => {
      setFetching(true);
      const res = await fetch(`/api/my-orders?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (!cancelled) {
        setOrders(Array.isArray(data) ? data : []);
        setFetching(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [user]);

  if (loading || !user) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <Loader2 size={32} className="text-orange-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-orange-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-[450px] h-[450px] bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">My Orders</h1>
            <p className="text-gray-400 text-sm">Track all your past and current orders</p>
          </div>
        </div>

        {fetching ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-orange-500 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag size={36} className="text-orange-400" />
            </div>
            <p className="text-white font-semibold text-lg">No orders yet</p>
            <p className="text-gray-400 text-sm mt-1">When you place an order it will show up here</p>
            <Link href="/menu"
              className="inline-block mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-all">
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const status = STATUS_INFO[order.deliveryStatus];
              const Icon = status.icon;
              const stepIndex = STATUS_STEPS.indexOf(order.deliveryStatus);

              return (
                <div key={order.orderId}
                  className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">

                 
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-white font-bold font-mono">{order.orderId}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric"
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${status.color}`}>
                        <Icon size={11} />
                        {status.label}
                      </span>
                      <span className="text-orange-400 font-bold">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                
                  <div className="flex items-center gap-1 mb-4">
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step} className="flex items-center flex-1 last:flex-none">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all ${
                          i <= stepIndex ? "bg-orange-500" : "bg-white/10"
                        }`} />
                        {i < STATUS_STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-0.5 ${i < stepIndex ? "bg-orange-500" : "bg-white/10"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mb-4 -mt-2">
                    <span>Placed</span>
                    <span>Preparing</span>
                    <span>Delivering</span>
                    <span>Delivered</span>
                  </div>

                  {/* Items */}
                  <div className="space-y-1 mb-4">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-400">{item.name} × {item.quantity}</span>
                        <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-gray-600 text-xs">+{order.items.length - 3} more items</p>
                    )}
                  </div>

               
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <p className="text-gray-500 text-xs">
                      📅 {order.deliveryDate} · {order.deliveryTime}
                    </p>
                    <Link href={`/track-order/${order.orderId}`}
                      className="flex items-center gap-1.5 text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors">
                      <Truck size={12} /> Track Order
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}