"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "@/app/context/CartContext";
import { MealType } from "@/app/models/Meal";
import { ShoppingCart } from "lucide-react";

export default function MealCardClient({ meal }: { meal: MealType }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdding(true);
    try {
      addToCart(meal);
      toast.success(`${meal.name} added to cart`);
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <article
      onClick={() => router.push(`/menu/${meal.category}/${meal._id}`)}
      className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-white/10 flex flex-col"
    >
   
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        {meal.image ? (
          <Image
            src={meal.image}
            alt={meal.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
        )}
      
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
      </div>

    
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug line-clamp-2">
          {meal.name}
        </h3>
        {meal.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 flex-1">
            {meal.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="font-extrabold text-orange-600 text-lg">${meal.price}</span>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 active:scale-95"
          >
            <ShoppingCart size={14} />
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}