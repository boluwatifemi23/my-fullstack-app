"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { isDeliverable } from "@/app/lib/deliveryZones";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ChefHat } from "lucide-react";
import DeliveryForm from "./componenets/DeliveryForm";
import ReviewOrder from "./componenets/ReviewOrder";
import PaymentForm from "./componenets/PaymentForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export type CustomerInfo = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  deliveryDate: string;
  deliveryTime: string;
  specialInstructions: string;
};

const STEPS = ["Delivery Details", "Review Order", "Payment"];

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "", email: "", phone: "", address: "",
    city: "", state: "", zip: "",
    deliveryDate: "", deliveryTime: "", specialInstructions: "",
  });
  const [clientSecret, setClientSecret] = useState("");
  const [orderId, setOrderId] = useState("");
  const [total, setTotal] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  if (items.length === 0 && step < 2) {
    router.replace("/");
  }
}, [items.length, step, router]);

if (items.length === 0 && step < 2) return null;

  const handleDeliverySubmit = async (info: CustomerInfo) => {
    setError("");
    if (!isDeliverable(info.zip)) {
      setError("Sorry, we don't deliver to this ZIP code yet. We serve Chicago and Minnesota areas.");
      return;
    }
    setCustomer(info);
    setStep(1);
  };

  const handleReviewConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: items.map(i => ({
            mealId: i._id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
          deliveryDate: customer.deliveryDate,
          deliveryTime: customer.deliveryTime,
          specialInstructions: customer.specialInstructions,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setLoading(false); return; }
      setClientSecret(data.clientSecret);
      setOrderId(data.orderId);
      setTotal(data.total);
      setDeliveryFee(data.deliveryFee);
      setSubtotal(data.subtotal);
      setStep(2);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const handlePaymentSuccess = () => {
    clear();
    router.push(`/order-confirmed/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-orange-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-[450px] h-[450px] bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-orange-500/15 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
            <ChefHat size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Checkout</h1>
            <p className="text-gray-400 text-sm">Secure checkout powered by Stripe</p>
          </div>
        </div>

       
        <div className="flex items-center mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                  i < step ? "bg-orange-500 border-orange-500 text-white" :
                  i === step ? "border-orange-500 text-orange-500 bg-orange-500/10" :
                  "border-white/20 text-gray-500 bg-white/5"
                }`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`text-xs mt-1 font-medium ${i === step ? "text-orange-400" : i < step ? "text-orange-300" : "text-gray-500"}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 rounded transition-all ${i < step ? "bg-orange-500" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        
        {step === 0 && (
          <DeliveryForm initial={customer} onSubmit={handleDeliverySubmit} />
        )}
        {step === 1 && (
          <ReviewOrder
            customer={customer}
            items={items}
            onBack={() => setStep(0)}
            onConfirm={handleReviewConfirm}
            loading={loading}
          />
        )}
        {step === 2 && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "night" } }}>
            <PaymentForm
              clientSecret={clientSecret}
              orderId={orderId}
              total={total}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              onBack={() => setStep(1)}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}