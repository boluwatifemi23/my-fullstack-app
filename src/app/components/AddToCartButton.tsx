"use client";
import { useState } from "react";
import { useCart, CartVariant } from "@/app/context/CartContext";
import toast from "react-hot-toast";
import { ShoppingCart, Check } from "lucide-react";

type Meal = {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  variants?: CartVariant[];
};

export default function AddToCartButton({ meal }: { meal: Meal }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<CartVariant | null>(
    meal.variants && meal.variants.length > 0 ? meal.variants[0] : null
  );

  const hasVariants = meal.variants && meal.variants.length > 0;
  const displayPrice = selectedVariant ? selectedVariant.price : meal.price;

  function handleAdd() {
    if (hasVariants && !selectedVariant) {
      toast.error("Please select an option first");
      return;
    }
    addToCart(meal, selectedVariant ?? undefined);
    toast.success(`${meal.name}${selectedVariant ? ` (${selectedVariant.label})` : ""} added to cart!`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      {hasVariants && (
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Select Size / Quantity
          </p>
          <div className="flex flex-wrap gap-2">
            {meal.variants!.map((variant) => (
              <button
                key={variant.label}
                onClick={() => setSelectedVariant(variant)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                  selectedVariant?.label === variant.label
                    ? "border-orange-500 bg-orange-500/10 text-orange-500"
                    : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-orange-400 hover:text-orange-400"
                }`}
              >
                {variant.label}
                <span className="ml-2 text-xs opacity-75">${variant.price}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleAdd}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-base transition-all duration-300
          ${added ? "bg-green-500 scale-95" : "bg-orange-500 hover:bg-orange-600 active:scale-95"}`}>
        {added
          ? <><Check size={20} /> Added to Cart!</>
          : <><ShoppingCart size={20} /> Add to Cart — ${displayPrice}</>}
      </button>
    </div>
  );
}