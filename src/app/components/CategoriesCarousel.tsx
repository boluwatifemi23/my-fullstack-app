"use client";
import React from "react";
import Link from "next/link";

type Cat = { _id: string; name: string; slug: string };

export default function CategoriesCarousel({ categories }: { categories: Cat[] }) {
  const items = [...categories, ...categories];

  return (
    <div className="w-full overflow-hidden">
      <div className="flex gap-6 py-4 animate-scroll-left will-change-transform">
        {items.map((cat, i) => (
          <div
            key={`${cat.slug}-${i}`}
            className="shrink-0 w-64 md:w-72 lg:w-80 rounded-3xl bg-linear-to-b from-[#2a0a00] to-[#6b2b00] text-white shadow-xl overflow-hidden hover:scale-105 transition-transform"
          >
            <Link href={`/menu/${cat.slug}`} className="h-40 flex items-end p-4">
              <span className="text-lg font-bold">{cat.name}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}