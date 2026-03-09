"use client";
import React, { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useCart } from "@/app/context/CartContext";
import { MealType } from "@/app/models/Meal";

export default function MealCardClient({
  meal,
  compact = false,
}: {
  meal: MealType;
  compact?: boolean;
}) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
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
      className={`bg-white rounded-xl overflow-hidden shadow-md flex flex-col ${
        compact ? "h-44" : "h-56"
      }`}
    >
      <div className={`relative ${compact ? "h-28" : "h-36"} w-full`}>
        <Image
          src={meal.image || "/menu/placeholders/default.jpg"}
          alt={meal.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-semibold text-sm md:text-base line-clamp-2">{meal.name}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{meal.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-gray-900">₦{meal.price}</span>
          <button
            onClick={handleAdd}
            disabled={adding}
            className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition transform hover:-translate-y-0.5"
          >
            {adding ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
