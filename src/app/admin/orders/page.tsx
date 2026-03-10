"use client";

import { useEffect, useState } from "react";
import { Package, ChefHat, Truck, Home, ChevronDown, Loader2, RefreshCw, Eye } from "lucide-react";
import Link from "next/link";
import ConfirmModal from "../components/ConfirmModal";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryStatus: "placed" | "preparing" | "out-for-delivery" | "delivered";
  paymentStatus: "pending" | "paid" | "failed";
  deliveryDate: string;
  deliveryTime: string;
  specialInstructions?: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  placed: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  preparing: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  "out-for-delivery": "bg-orange-500/10 border-orange-500/30 text-orange-400",
  delivered: "bg-green-500/10 border-green-500/30 text-green-400",
};

const PAYMENT_STYLES: Record<string, string> = {
  paid: "bg-green-500/10 border-green-500/30 text-green-400",
  pending: "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  failed: "bg-red-500/10 border-red-500/30 text-red-400",
};

const DELIVERY_STEPS = ["placed", "preparing", "out-for-delivery", "delivered"];

const STEP_ICONS: Record<string, React.ElementType> = {
  placed: Package,
  preparing: ChefHat,
  "out-for-delivery": Truck,
  delivered: Home,
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean; orderId: string; newStatus: string; label: string;
  }>({ open: false, orderId: "", newStatus: "", label: "" });

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/orders", { credentials: "include" });
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
  let cancelled = false;

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/orders", { credentials: "include" });
    const data = await res.json();
    if (!cancelled) {
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    }
  };

  load();
  return () => { cancelled = true; };
}, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ deliveryStatus: newStatus }),
    });
    await fetchOrders();
    setUpdating(null);
    setConfirmModal({ open: false, orderId: "", newStatus: "", label: "" });
  };

  const nextStatus = (current: string) => {
    const idx = DELIVERY_STEPS.indexOf(current);
    return idx < DELIVERY_STEPS.length - 1 ? DELIVERY_STEPS[idx + 1] : null;
  };

  const formatStatus = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-gray-400 text-sm mt-1">{orders.length} total orders</p>
        </div>
        <button onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-sm transition-all">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="text-orange-500 animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Package size={48} className="mx-auto mb-4 opacity-30" />
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const next = nextStatus(order.deliveryStatus);
            const Icon = STEP_ICONS[order.deliveryStatus];
            const isExpanded = expanded === order.orderId;

            return (
              <div key={order.orderId}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden">

              
                <div className="p-5 flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-orange-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold font-mono">{order.orderId}</p>
                      <p className="text-gray-400 text-sm truncate">{order.customer.name} · {order.customer.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${STATUS_STYLES[order.deliveryStatus]}`}>
                      {formatStatus(order.deliveryStatus)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${PAYMENT_STYLES[order.paymentStatus]}`}>
                      {order.paymentStatus}
                    </span>
                    <span className="text-orange-400 font-bold">${order.total.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {next && (
                      <button
                        disabled={updating === order.orderId}
                        onClick={() => setConfirmModal({
                          open: true,
                          orderId: order.orderId,
                          newStatus: next,
                          label: `Mark as "${formatStatus(next)}"?`,
                        })}
                        className="flex items-center gap-1.5 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-xl text-xs font-semibold transition-all disabled:opacity-50">
                        {updating === order.orderId
                          ? <Loader2 size={12} className="animate-spin" />
                          : <Truck size={12} />}
                        {formatStatus(next)}
                      </button>
                    )}
                    {order.deliveryStatus === "delivered" && (
                      <span className="text-green-400 text-xs font-semibold px-3 py-2">✓ Delivered</span>
                    )}
                    <button
                    title="o"
                      onClick={() => setExpanded(isExpanded ? null : order.orderId)}
                      className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                      <ChevronDown size={14} className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-white/10 p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                 
                    <div>
                      <h3 className="text-white font-semibold mb-3 text-sm">Order Items</h3>
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-400">{item.name} × {item.quantity}</span>
                            <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t border-white/10 pt-2 mt-2 space-y-1">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Delivery</span><span>${order.deliveryFee.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold text-sm">
                            <span className="text-white">Total</span>
                            <span className="text-orange-400">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delivery info */}
                    <div>
                      <h3 className="text-white font-semibold mb-3 text-sm">Delivery Info</h3>
                      <div className="space-y-1.5 text-sm text-gray-400">
                        <p>📍 {order.customer.address}</p>
                        <p>{order.customer.city}, {order.customer.state} {order.customer.zip}</p>
                        <p>📞 {order.customer.phone}</p>
                        <p>📅 {order.deliveryDate} · {order.deliveryTime}</p>
                        {order.specialInstructions && (
                          <p className="italic text-gray-500">{order.specialInstructions}</p>
                        )}
                        <p className="text-gray-600 text-xs pt-2">
                          Placed: {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Link href={`/track-order/${order.orderId}`} target="_blank"
                        className="inline-flex items-center gap-1.5 mt-3 text-xs text-orange-400 hover:text-orange-300 transition">
                        <Eye size={12} /> View tracking page
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={confirmModal.open}
        title="Update Order Status"
        message={`${confirmModal.label} This will send an email notification to the customer.`}
        onConfirm={() => handleStatusUpdate(confirmModal.orderId, confirmModal.newStatus)}
        onCancel={() => setConfirmModal({ open: false, orderId: "", newStatus: "", label: "" })}
      />
    </div>
  );
}