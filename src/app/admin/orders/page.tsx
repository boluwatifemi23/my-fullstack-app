"use client";

import { useEffect, useState } from "react";
import { Package, ChefHat, Truck, Home, ChevronDown, Loader2, RefreshCw, Eye, Printer, CheckCircle, Navigation } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import ConfirmModal from "../components/ConfirmModal";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  selectedVariant?: { label: string };
}

interface Order {
  orderId: string;
  customer: { name: string; email: string; phone: string; address: string; city: string; state: string; zip: string; };
  items: OrderItem[];
  subtotal: number; deliveryFee: number; total: number;
  deliveryStatus: "placed" | "preparing" | "out-for-delivery" | "delivered";
  paymentStatus: "pending" | "pending_verification" | "paid" | "failed";
  specialInstructions?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  shipdayOrderId?: string;
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
  pending: "bg-gray-500/10 border-gray-500/30 text-gray-400",
  pending_verification: "bg-purple-500/10 border-purple-500/30 text-purple-400",
  failed: "bg-red-500/10 border-red-500/30 text-red-400",
};

const PAYMENT_LABELS: Record<string, string> = {
  paid: "Paid",
  pending: "Awaiting Payment",
  pending_verification: "Zelle Sent — Verify",
  failed: "Failed",
};

const DELIVERY_STEPS = ["placed", "preparing", "out-for-delivery", "delivered"];
const STEP_ICONS: Record<string, React.ElementType> = {
  placed: Package, preparing: ChefHat, "out-for-delivery": Truck, delivered: Home,
};

function printOrder(order: Order) {
  const printWindow = window.open("", "_blank", "width=800,height=600");
  if (!printWindow) return;

  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;">
        ${item.name}${item.selectedVariant ? ` <span style="color:#999;font-size:12px;">(${item.selectedVariant.label})</span>` : ""}
      </td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join("");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Order ${order.orderId} — Cornerstone Catering</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; color: #111; padding: 32px; font-size: 14px; }
        .header { text-align: center; border-bottom: 2px solid #f54a00; padding-bottom: 16px; margin-bottom: 24px; }
        .logo { font-size: 22px; font-weight: 900; color: #f54a00; }
        .logo span { color: #111; }
        .tagline { font-size: 11px; color: #888; margin-top: 2px; }
        .order-id { font-size: 18px; font-weight: 700; margin-top: 8px; color: #111; }
        .date { font-size: 11px; color: #888; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
        .customer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .field { margin-bottom: 6px; }
        .field-label { font-size: 11px; color: #888; }
        .field-value { font-size: 13px; font-weight: 600; color: #111; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { background: #f9f9f9; }
        th { padding: 8px 12px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #888; }
        th:last-child { text-align: right; }
        th:nth-child(2) { text-align: center; }
        .totals { margin-top: 12px; border-top: 2px solid #111; padding-top: 12px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 13px; color: #555; }
        .total-final { display: flex; justify-content: space-between; font-size: 16px; font-weight: 900; color: #f54a00; margin-top: 8px; padding-top: 8px; border-top: 1px solid #eee; }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .badge-paid { background: #dcfce7; color: #166534; }
        .badge-pending { background: #fef9c3; color: #854d0e; }
        .badge-verify { background: #f3e8ff; color: #6b21a8; }
        .instructions { background: #fff8f0; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px; font-size: 13px; color: #7c2d12; }
        .footer { margin-top: 32px; text-align: center; font-size: 11px; color: #aaa; border-top: 1px solid #eee; padding-top: 16px; }
        @media print { body { padding: 16px; } button { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Cornerstone<span>Catering</span></div>
        <div class="tagline">Authentic Nigerian Meals — cornerstonecatering.vercel.app</div>
        <div class="order-id">Order #${order.orderId}</div>
        <div class="date">Placed: ${new Date(order.createdAt).toLocaleString()}</div>
      </div>
      <div class="section">
        <div class="section-title">Customer Details</div>
        <div class="customer-grid">
          <div>
            <div class="field"><div class="field-label">Name</div><div class="field-value">${order.customer.name}</div></div>
            <div class="field"><div class="field-label">Email</div><div class="field-value">${order.customer.email}</div></div>
            <div class="field"><div class="field-label">Phone</div><div class="field-value">${order.customer.phone}</div></div>
          </div>
          <div>
            <div class="field"><div class="field-label">Address</div><div class="field-value">${order.customer.address}</div></div>
            <div class="field"><div class="field-label">City, State ZIP</div><div class="field-value">${order.customer.city}, ${order.customer.state} ${order.customer.zip}</div></div>
            <div class="field">
              <div class="field-label">Payment</div>
              <div class="field-value">
                <span class="badge ${order.paymentStatus === 'paid' ? 'badge-paid' : order.paymentStatus === 'pending_verification' ? 'badge-verify' : 'badge-pending'}">
                  ${PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      ${order.deliveryDate || order.deliveryTime ? `
      <div class="section">
        <div class="section-title">Delivery Schedule</div>
        <div class="field"><div class="field-value">📅 ${order.deliveryDate ?? ""} ${order.deliveryTime ? `· ${order.deliveryTime}` : ""}</div></div>
      </div>` : ""}
      ${order.specialInstructions ? `
      <div class="section">
        <div class="section-title">Special Instructions</div>
        <div class="instructions">${order.specialInstructions}</div>
      </div>` : ""}
      <div class="section">
        <div class="section-title">Order Items</div>
        <table>
          <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
          <tbody>${itemsHTML}</tbody>
        </table>
        <div class="totals">
          <div class="total-row"><span>Subtotal</span><span>$${order.subtotal.toFixed(2)}</span></div>
          ${order.deliveryFee > 0 ? `<div class="total-row"><span>Delivery Fee</span><span>$${order.deliveryFee.toFixed(2)}</span></div>` : ""}
          <div class="total-final"><span>TOTAL</span><span>$${order.total.toFixed(2)}</span></div>
        </div>
      </div>
      <div class="footer">Cornerstone Catering Services — God is our Cornerstone<br/>+1 773-983-1974 · cornerstonecatering.vercel.app</div>
      <script>window.onload = function() { window.print(); }</script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [dispatching, setDispatching] = useState<string | null>(null);
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
      if (!cancelled) { setOrders(Array.isArray(data) ? data : []); setLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    await fetch(`/api/orders/${orderId}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      credentials: "include", body: JSON.stringify({ deliveryStatus: newStatus }),
    });
    await fetchOrders();
    setUpdating(null);
    setConfirmModal({ open: false, orderId: "", newStatus: "", label: "" });
  };

  const handleMarkPaid = async (orderId: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ paymentStatus: "paid" }),
      });
      if (res.ok) { toast.success("✅ Order marked as paid!"); await fetchOrders(); }
      else toast.error("Failed to update payment status");
    } catch { toast.error("Something went wrong"); }
    setUpdating(null);
  };

  const handleDispatch = async (orderId: string) => {
    setDispatching(orderId);
    try {
      const res = await fetch("/api/orders/dispatch", {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "include", body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("🚗 Driver dispatched successfully!");
        await fetchOrders();
      } else {
        toast.error(data.error || "Failed to dispatch driver");
      }
    } catch { toast.error("Something went wrong"); }
    setDispatching(null);
  };

  const nextStatus = (current: string) => {
    const idx = DELIVERY_STEPS.indexOf(current);
    return idx < DELIVERY_STEPS.length - 1 ? DELIVERY_STEPS[idx + 1] : null;
  };

  const formatStatus = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const pendingVerification = orders.filter(o => o.paymentStatus === "pending_verification").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-gray-400 text-sm mt-1">
            {orders.length} total
            {pendingVerification > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold">
                {pendingVerification} Zelle pending
              </span>
            )}
          </p>
        </div>
        <button onClick={fetchOrders} aria-label="Refresh orders"
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-sm transition-all shrink-0">
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
            const isZellePending = order.paymentStatus === "pending_verification";
            const isDispatched = !!order.shipdayOrderId;

            return (
              <div key={order.orderId}
                className={`bg-white/5 backdrop-blur-md border rounded-2xl overflow-hidden transition-all ${
                  isZellePending ? "border-purple-500/30" : "border-white/10"
                }`}>

                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-orange-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-bold font-mono text-sm">{order.orderId}</p>
                        <p className="text-gray-400 text-xs truncate">{order.customer.name}</p>
                        <p className="text-gray-500 text-xs truncate hidden sm:block">{order.customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => printOrder(order)} title="Print order" aria-label="Print order"
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl transition-all">
                        <Printer size={14} />
                      </button>
                      <button title="Toggle details" aria-label="Toggle order details"
                        onClick={() => setExpanded(isExpanded ? null : order.orderId)}
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${STATUS_STYLES[order.deliveryStatus]}`}>
                      {formatStatus(order.deliveryStatus)}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${PAYMENT_STYLES[order.paymentStatus]}`}>
                      {PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus}
                    </span>
                    {isDispatched && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold border bg-teal-500/10 border-teal-500/30 text-teal-400">
                        🚗 Driver Dispatched
                      </span>
                    )}
                    <span className="text-orange-400 font-bold text-sm ml-auto">${order.total.toFixed(2)}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {/* Confirm Zelle */}
                    {isZellePending && (
                      <button disabled={updating === order.orderId} aria-label="Confirm Zelle payment"
                        onClick={() => handleMarkPaid(order.orderId)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl text-xs font-semibold transition-all disabled:opacity-50">
                        {updating === order.orderId ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                        Confirm Zelle Payment
                      </button>
                    )}

                    {/* Dispatch Driver — only show if payment confirmed and not already dispatched */}
                    {order.paymentStatus === "paid" && !isDispatched && (
                      <button
                        disabled={dispatching === order.orderId}
                        aria-label="Dispatch delivery driver"
                        onClick={() => handleDispatch(order.orderId)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-400 rounded-xl text-xs font-semibold transition-all disabled:opacity-50">
                        {dispatching === order.orderId ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
                        {dispatching === order.orderId ? "Dispatching..." : "Dispatch Driver"}
                      </button>
                    )}

                    {/* Advance delivery status */}
                    {next && (
                      <button disabled={updating === order.orderId} aria-label={`Mark as ${formatStatus(next)}`}
                        onClick={() => setConfirmModal({
                          open: true, orderId: order.orderId, newStatus: next,
                          label: `Mark as "${formatStatus(next)}"?`,
                        })}
                        className="flex items-center gap-1.5 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-xl text-xs font-semibold transition-all disabled:opacity-50">
                        {updating === order.orderId ? <Loader2 size={12} className="animate-spin" /> : <Truck size={12} />}
                        {formatStatus(next)}
                      </button>
                    )}
                    {!next && <span className="text-green-400 text-xs font-semibold">✓ Delivered</span>}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-white/10 p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <h3 className="text-white font-semibold mb-3 text-sm">Order Items</h3>
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-400">
                              {item.name}
                              {item.selectedVariant && <span className="text-gray-500"> ({item.selectedVariant.label})</span>}
                              {" "}× {item.quantity}
                            </span>
                            <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t border-white/10 pt-2 mt-2 space-y-1">
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span>
                          </div>
                          {order.deliveryFee > 0 && (
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Delivery</span><span>${order.deliveryFee.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-sm">
                            <span className="text-white">Total</span>
                            <span className="text-orange-400">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-semibold mb-3 text-sm">Delivery Info</h3>
                      <div className="space-y-1.5 text-sm text-gray-400">
                        <p>📍 {order.customer.address}</p>
                        <p>{order.customer.city}, {order.customer.state} {order.customer.zip}</p>
                        <p>📞 {order.customer.phone}</p>
                        {order.deliveryDate && <p>📅 {order.deliveryDate} {order.deliveryTime && `· ${order.deliveryTime}`}</p>}
                        {order.specialInstructions && (
                          <p className="italic text-gray-500">&quot;{order.specialInstructions}&quot;</p>
                        )}
                        {isDispatched && (
                          <p className="text-teal-400 text-xs font-semibold mt-2">🚗 Shipday ID: {order.shipdayOrderId}</p>
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