import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default async function OrderConfirmedPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-orange-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-[450px] h-[450px] bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="relative max-w-md w-full">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-400" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Order Confirmed! 🎉</h1>
          <p className="text-gray-400 mb-6">
            Thank you! Your order has been placed and we already preparing your meal.
          </p>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 mb-6">
            <p className="text-gray-400 text-sm mb-1">Your Order ID</p>
            <p className="text-orange-400 font-bold text-xl tracking-widest">{orderId}</p>
            <p className="text-gray-500 text-xs mt-2">Save this ID to track your order</p>
          </div>

          <p className="text-gray-400 text-sm mb-6">
            A confirmation email has been sent to you with your order details and tracking link.
          </p>

          <div className="space-y-3">
            <Link href={`/track-order/${orderId}`}
              className="block w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20">
              Track My Order
            </Link>
            <Link href="/"
              className="block w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium rounded-xl transition-all">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}