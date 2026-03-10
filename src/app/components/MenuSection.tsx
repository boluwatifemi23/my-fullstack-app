"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import toast from "react-hot-toast";
import { ShoppingCart, ArrowRight } from "lucide-react";

type Category = { _id?: string; name: string; slug: string; image?: string };
type Meal = {
  _id?: string;
  name: string;
  price: number;
  image?: string;
  category: string;
  description?: string;
};

export default function MenuSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Meal[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingMeals, setLoadingMeals] = useState(true);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(d => { setCategories(d); setLoadingCats(false); });
    fetch("/api/meals").then(r => r.json()).then(d => { setFeatured(d.slice(0, 6)); setLoadingMeals(false); });
  }, []);

  function handleAdd(e: React.MouseEvent, meal: Meal) {
    e.stopPropagation();
    addToCart(meal as never);
    toast.success(`${meal.name} added to cart`);
  }

  return (
    <section className="py-16 max-w-7xl mx-auto px-6" id="menu">

     
      <div className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Browse by Category</h2>
          <Link href="/menu" className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-medium transition">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {loadingCats ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[...Array(5)].map((_, i) => <div key={i} className="h-32 w-40 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse shrink-0" />)}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/menu/${cat.slug}`}
                className="group shrink-0 relative w-40 h-32 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-linear-to-br from-orange-800 to-amber-700" />
                {cat.image && (
                  <Image src={cat.image} alt={cat.name} fill className="object-cover opacity-60 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-bold text-sm leading-tight">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

     
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured</h2>
          <Link href="/menu" className="flex items-center gap-1 text-orange-500 hover:text-orange-600 text-sm font-medium transition">
            See all meals <ArrowRight size={14} />
          </Link>
        </div>
        {loadingMeals ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="h-72 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featured.map((meal) => (
              <article key={meal._id}
                onClick={() => router.push(`/menu/${meal.category}/${meal._id}`)}
                className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-white/10 flex flex-col">
                <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {meal.image ? (
                    <Image src={meal.image} alt={meal.name} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug line-clamp-2">{meal.name}</h3>
                  {meal.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 flex-1">{meal.description}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="font-extrabold text-orange-600 text-lg">${meal.price}</span>
                    <button onClick={(e) => handleAdd(e, meal)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all active:scale-95">
                      <ShoppingCart size={14} /> Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}