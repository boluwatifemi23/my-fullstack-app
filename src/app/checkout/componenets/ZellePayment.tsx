"use client";

import { useState } from "react";
import { Copy, CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

interface ZellePaymentProps {
  orderId: string;
  total: number;
  subtotal: number;
  onConfirmed: () => void;
}

export default function ZellePayment({ orderId, total, subtotal, onConfirmed }: ZellePaymentProps) {
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState<"amount" | "memo" | null>(null);

  const copy = (text: string, field: "amount" | "memo") => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success("Copied!");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const res = await fetch("/api/orders/confirm-zelle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      if (res.ok) {
        onConfirmed();
      } else {
        toast.error("Something went wrong. Please contact us.");
      }
    } catch {
      toast.error("Something went wrong. Please contact us.");
    }
    setConfirming(false);
  };

  return (
    <div className="space-y-5">

      <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-6 text-center">
        <Image
          src="/images/zelle-qr.png"
          alt="Scan to pay with Zelle"
          width={200}
          height={200}
          className="mx-auto rounded-xl mb-4 bg-white p-2"
        />
        <h2 className="text-white font-bold text-xl mb-1">Pay with Zelle</h2>
        <p className="text-gray-400 text-sm">Scan the QR code with your bank app to pay</p>
        <p className="text-purple-300 font-semibold text-sm mt-1">CORNERSTONE CATERING SERVICES LLC</p>
      </div>

   
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span className="text-white">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t border-white/10 pt-2 mt-2">
            <span className="text-white">Total to Send</span>
            <span className="text-orange-400">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <h3 className="text-white font-semibold">How to Pay</h3>

     
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</div>
          <div>
            <p className="text-white text-sm font-medium">Open your bank app and scan the QR code above</p>
            <p className="text-gray-500 text-xs mt-0.5">Works with Chase, Bank of America, Wells Fargo, and most US banks</p>
          </div>
        </div>

      
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium mb-2">Send exactly this amount:</p>
            <div className="flex items-center justify-between bg-gray-900 border border-white/10 rounded-xl px-4 py-3">
              <span className="text-orange-400 font-bold text-lg">${total.toFixed(2)}</span>
              <button onClick={() => copy(total.toFixed(2), "amount")} aria-label="Copy amount"
                className="text-gray-500 hover:text-white transition ml-2 shrink-0">
                {copied === "amount" ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        </div>

       
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium mb-2">Add this as the memo/note:</p>
            <div className="flex items-center justify-between bg-gray-900 border border-white/10 rounded-xl px-4 py-3">
              <span className="text-green-300 font-mono text-sm">{orderId}</span>
              <button onClick={() => copy(orderId, "memo")} aria-label="Copy order ID"
                className="text-gray-500 hover:text-white transition ml-2 shrink-0">
                {copied === "memo" ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-1.5">This helps us match your payment to your order</p>
          </div>
        </div>

     
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</div>
          <div>
            <p className="text-white text-sm font-medium">Click the button below once you&apos;ve sent the payment</p>
            <p className="text-gray-500 text-xs mt-1">We&apos;ll confirm your order and send you an email receipt</p>
          </div>
        </div>
      </div>

     
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-yellow-400 text-sm">
        ⚠️ Your order is reserved but will only be confirmed once we verify your Zelle payment. This usually takes a few minutes.
      </div>

     
      <button
        onClick={handleConfirm}
        disabled={confirming}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
      >
        {confirming
          ? <><Loader2 size={18} className="animate-spin" /> Confirming...</>
          : "✅ I've Sent the Payment"}
      </button>

      <p className="text-center text-gray-500 text-xs">
        Need help? WhatsApp or call us directly.
      </p>
    </div>
  );
}