"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

type Cat = { _id: string; name: string; slug: string };

export default function CategoriesCarousel({ categories }: { categories: Cat[] }) {
  // duplicate items for seamless loop
  const items = [...categories, ...categories];

  return (
    <div className="w-full overflow-hidden">
      <div
        className="flex gap-6 py-4 animate-scroll-left"
        style={{ willChange: "transform" }}
      >
        {items.map((cat, i) => (
          <div
            key={`${cat.slug}-${i}`}
            className="flex-shrink-0 w-64 md:w-72 lg:w-80 rounded-3xl bg-gradient-to-b from-[#2a0a00] to-[#6b2b00] text-white shadow-xl overflow-hidden transform hover:scale-105 transition"
          >
            <Link href={`/menu/${cat.slug}`} className="block relative h-40">
              <Image
                src={`/menu/placeholders/${cat.slug}.jpg`}
                alt={cat.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 60vw, 320px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <div>
                  <div className="text-lg font-bold">{cat.name}</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

     
    </div>
  );
}
