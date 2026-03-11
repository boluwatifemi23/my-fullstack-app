"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

type Cat = { _id: string; name: string; slug: string; image?: string };

export default function CategoriesCarousel({ categories }: { categories: Cat[] }) {
  const items = [...categories, ...categories];

  return (
    <div className="w-full overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      <div className="flex gap-5 py-4 animate-scroll-left will-change-transform">
        {items.map((cat, i) => (
          <Link
            key={`${cat.slug}-${i}`}
            href={`/menu/${cat.slug}`}
            className="group shrink-0 relative w-52 h-36 rounded-2xl overflow-hidden shadow-xl hover:shadow-orange-500/20 transition-all duration-300 hover:-translate-y-1 border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900 to-amber-800" />

            {cat.image ? (
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                sizes="208px"
              />
            ) : null}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white font-bold text-sm leading-tight">{cat.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}