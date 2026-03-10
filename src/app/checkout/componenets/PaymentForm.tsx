"use client";

import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { ArrowLeft, Lock, Loader2 } from "lucide-react";

export default function PaymentForm({ orderId, total, subtotal, deliveryFee, onBack, onSuccess }: {
  clientSecret: string;
  orderId: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message || "Payment failed. Please try again.");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      // Confirm on our backend + send email
      const res = await fetch("/api/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
      });
      if (res.ok) {
        onSuccess();
      } else {
        setError("Payment succeeded but order confirmation failed. Please contact support with Order ID: " + orderId);
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Order Summary */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
        <h2 className="text-white font-bold mb-3 flex items-center gap-2">
          <Lock size={16} className="text-orange-400" /> Order Summary
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span><span className="text-white">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Delivery Fee</span><span className="text-white">${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t border-white/10 pt-2 mt-2">
            <span className="text-white">Total</span>
            <span className="text-orange-400">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
        <h2 className="text-white font-bold mb-4 flex items-center gap-2">
          <Lock size={16} className="text-orange-400" /> Card Details
        </h2>
        <PaymentElement />
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button type="button" onClick={onBack} disabled={loading}
          className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl font-medium text-sm transition-all disabled:opacity-50">
          <ArrowLeft size={16} /> Back
        </button>
        <button type="submit" disabled={loading || !stripe}
          className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2">
          {loading
            ? <><Loader2 size={18} className="animate-spin" /> Processing...</>
            : <><Lock size={16} /> Pay ${total.toFixed(2)}</>}
        </button>
      </div>

      <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
        <Lock size={11} /> Secured by Stripe. Your card info is never stored on our servers.
      </p>
    </form>
  );
}