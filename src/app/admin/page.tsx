"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UtensilsCrossed, Tag, ShoppingBag, DollarSign, Clock, CheckCircle, ChefHat, Truck, Package, TrendingUp } from "lucide-react";

interface Order {
  orderId: string;
  customer: { name: string; email: string };
  total: number;
  deliveryStatus: "placed" | "preparing" | "out-for-delivery" | "delivered";
  paymentStatus: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  placed: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  preparing: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  "out-for-delivery": "bg-orange-500/10 border-orange-500/30 text-orange-400",
  delivered: "bg-green-500/10 border-green-500/30 text-green-400",
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  placed: Package,
  preparing: ChefHat,
  "out-for-delivery": Truck,
  delivered: CheckCircle,
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    meals: 0, categories: 0, totalOrders: 0,
    totalRevenue: 0, pendingOrders: 0, deliveredOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [mealsRes, catsRes, ordersRes] = await Promise.all([
        fetch("/api/meals"),
        fetch("/api/categories"),
        fetch("/api/orders", { credentials: "include" }),
      ]);
      const meals = await mealsRes.json();
      const cats = await catsRes.json();
      const orders: Order[] = await ordersRes.json();

      if (!cancelled) {
        const totalRevenue = Array.isArray(orders)
          ? orders.filter(o => o.paymentStatus === "paid").reduce((s, o) => s + o.total, 0) : 0;
        const pendingOrders = Array.isArray(orders)
          ? orders.filter(o => o.deliveryStatus !== "delivered").length : 0;
        const deliveredOrders = Array.isArray(orders)
          ? orders.filter(o => o.deliveryStatus === "delivered").length : 0;

        setStats({
          meals: Array.isArray(meals) ? meals.length : 0,
          categories: Array.isArray(cats) ? cats.length : 0,
          totalOrders: Array.isArray(orders) ? orders.length : 0,
          totalRevenue, pendingOrders, deliveredOrders,
        });
        setRecentOrders(Array.isArray(orders) ? orders.slice(0, 5) : []);
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const statCards = [
    { label: "Total Meals", value: stats.meals, icon: UtensilsCrossed, href: "/admin/meals", color: "from-orange-500 to-amber-500", prefix: "" },
    { label: "Categories", value: stats.categories, icon: Tag, href: "/admin/categories", color: "from-amber-500 to-yellow-500", prefix: "" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, href: "/admin/orders", color: "from-blue-500 to-cyan-500", prefix: "" },
    { label: "Total Revenue", value: stats.totalRevenue.toFixed(2), icon: DollarSign, href: "/admin/orders", color: "from-green-500 to-emerald-500", prefix: "$" },
    { label: "Active Orders", value: stats.pendingOrders, icon: Clock, href: "/admin/orders", color: "from-yellow-500 to-orange-500", prefix: "" },
    { label: "Delivered", value: stats.deliveredOrders, icon: CheckCircle, href: "/admin/orders", color: "from-green-600 to-teal-500", prefix: "" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1 text-sm">Welcome back! Here is your business overview.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {statCards.map(({ label, value, icon: Icon, href, color, prefix }) => (
          <Link key={label} href={href}
            className="bg-gray-800 border border-white/10 rounded-2xl p-4 hover:border-orange-500/30 transition-all group">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-gray-400 text-xs truncate">{label}</p>
                <p className="text-xl font-bold text-white mt-1">
                  {loading ? <span className="animate-pulse text-gray-600">...</span> : `${prefix}${value}`}
                </p>
              </div>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                <Icon size={16} className="text-white" />
              </div>
            </div>
            <p className="text-orange-400 text-xs mt-2 group-hover:underline">View →</p>
          </Link>
        ))}
      </div>

     
      <div className="bg-gray-800 border border-white/10 rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-orange-400" />
            <h2 className="text-white font-semibold">Recent Orders</h2>
          </div>
          <Link href="/admin/orders" className="text-orange-400 text-xs hover:underline">View all →</Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => {
              const Icon = STATUS_ICONS[order.deliveryStatus];
              return (
                <div key={order.orderId}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500/10 border border-orange-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-mono font-medium">{order.orderId}</p>
                      <p className="text-gray-400 text-xs">{order.customer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap pl-11 sm:pl-0">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[order.deliveryStatus]}`}>
                      {order.deliveryStatus.replace(/-/g, " ")}
                    </span>
                    <span className="text-orange-400 font-bold text-sm">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      
      <div className="bg-gray-800 border border-white/10 rounded-2xl p-4 sm:p-6">
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/meals"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-xl transition-all font-medium">
            + Add New Meal
          </Link>
          <Link href="/admin/categories"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl transition-all font-medium">
            + Add Category
          </Link>
          <Link href="/admin/orders"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl transition-all font-medium">
            View Orders
          </Link>
          <Link href="/" target="_blank"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl transition-all font-medium">
            View Live Site ↗
          </Link>
        </div>
      </div>
    </div>
  );
}