"use client";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import toast from "react-hot-toast";
import { ShoppingCart, Check } from "lucide-react";

type Meal = {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
};

export default function AddToCartButton({ meal }: { meal: Meal }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(meal as never);
    toast.success(`${meal.name} added to cart!`);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button onClick={handleAdd}
      className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-base transition-all duration-300
        ${added ? "bg-green-500 scale-95" : "bg-orange-500 hover:bg-orange-600 active:scale-95"}`}>
      {added ? <><Check size={20} /> Added to Cart!</> : <><ShoppingCart size={20} /> Add to Cart — ${meal.price}</>}
    </button>
  );
}