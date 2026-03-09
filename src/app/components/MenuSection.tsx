"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Category = { _id?: string; name: string; slug: string };
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

  useEffect(() => {
    const fetchCats = async () => {
      setLoadingCats(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
      setLoadingCats(false);
    };

    const fetchMeals = async () => {
      setLoadingMeals(true);
      const res = await fetch("/api/meals");
      const data = await res.json();
      // show a few featured meals (first 6)
      setFeatured(data.slice(0, 6));
      setLoadingMeals(false);
    };

    fetchCats();
    fetchMeals();
  }, []);

  return (
    <section className="py-12 max-w-7xl mx-auto px-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Menu</h2>

      {/* Categories horizontal */}
      <div className="mb-8">
        {loadingCats ? (
          <div className="flex gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-32 rounded-lg bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto py-2">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/menu/${cat.slug}`}
                className="min-w-[150px] px-4 py-2 rounded-xl bg-gradient-to-r from-orange-50 to-white border border-orange-200 shadow-sm hover:scale-105 transition"
              >
                <div className="font-semibold text-gray-800">{cat.name}</div>
              </Link>
            ))}
          </div>
        )}
      </div>

     
      <div>
        <h3 className="text-xl font-semibold mb-4">Featured</h3>
        {loadingMeals ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-lg bg-white/5 p-4 animate-pulse h-56"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {featured.map((m) => (
              <article
                key={m._id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <Image
                  src={m.image || "/menu/placeholders/assorted-meat.jpg"}
                  alt={m.name}
                  width={500}
                  height={400}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4">
                  <h4 className="font-semibold">{m.name}</h4>
                  <p className="text-sm text-gray-500">{m.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold">₦{m.price}</span>
                    <div className="flex gap-2">
                      <Link
                        href={`/menu/${m.category}`}
                        className="text-sm text-orange-600 underline"
                      >
                        View category
                      </Link>
                      <button
                        onClick={() => {
                         
                          const event = new CustomEvent("add-to-cart", {
                            detail: m,
                          });
                          window.dispatchEvent(event);
                        }}
                        className="px-3 py-1 bg-orange-600 text-white rounded"
                      >
                        Order now
                      </button>
                    </div>
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
