"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/app/context/CartContext";
import toast from "react-hot-toast";

type MealVariant = { label: string; price: number };
type Meal = {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  variants?: MealVariant[];
  featured?: boolean;
};

export default function FeaturedMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch("/api/meals?featured=true")
      .then((r) => r.json())
      .then((data) => { setMeals(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (!loading && meals.length === 0) return null;

  return (
    <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gray-950">
      <div className="max-w-7xl mx-auto">
       
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-sm font-semibold uppercase tracking-wider">Chef&apos;s Picks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Featured Meals</h2>
            <p className="text-gray-400 text-sm mt-1">Our most loved dishes, handpicked for you</p>
          </div>
          <Link href="/menu"
            className="text-orange-400 hover:text-orange-300 text-sm font-medium transition whitespace-nowrap">
            View all →
          </Link>
        </div>

    
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-700" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {meals.map((meal) => {
              const minPrice = meal.variants && meal.variants.length > 0
                ? Math.min(...meal.variants.map((v) => v.price))
                : meal.price;
              const hasVariants = meal.variants && meal.variants.length > 0;

              return (
                <div key={meal._id}
                  className="group bg-gray-900 border border-white/5 rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10">
                 
                  <div className="relative h-36 sm:h-44 overflow-hidden bg-gray-800">
                    {meal.image ? (
                      <Image src={meal.image} alt={meal.name} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No image</div>
                    )}
                  
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-yellow-500/90 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold">
                      <Star size={10} className="fill-yellow-900" /> Featured
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="text-white font-semibold text-sm leading-tight line-clamp-1">{meal.name}</h3>
                    {meal.description && (
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-2">{meal.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <span className="text-orange-400 font-bold text-sm">
                        {hasVariants ? `From $${minPrice}` : `$${meal.price}`}
                      </span>
                      {hasVariants ? (
                        <Link href={`/menu/${meal.category}/${meal._id}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium transition">
                          <ShoppingCart size={12} /> Order
                        </Link>
                      ) : (
                        <button
                          onClick={() => { addToCart(meal); toast.success(`${meal.name} added!`); }}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium transition">
                          <ShoppingCart size={12} /> Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}