"use client";
import React, { useEffect, useState } from "react";
import CategoriesCarousel from "./CategoriesCarousel";
import FeaturedGridClient from "./FeaturedGridClient";
import DailySpecials from "./DailySpecials";
import { MealType } from "@/app/models/Meal";

type Cat = { _id: string; name: string; slug: string };

export default function MenuSectionClient() {
  const [categories, setCategories] = useState<Cat[]>([]);
  const [featured, setFeatured] = useState<MealType[]>([]);
  const [specials, setSpecials] = useState<MealType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const [catsRes, mealsRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/meals"),
      ]);
      const cats = await catsRes.json();
      const meals = await mealsRes.json();
      if (!mounted) return;
      setCategories(cats);
      setFeatured(meals.slice(0, 6));
      setSpecials(meals.slice(2, 12));
      setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <section id="menu" className="py-12 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold">Our Menu</h2>
        <p className="text-gray-600 mt-2 max-w-xl">Dear Esteemed customer — this is our new Blast Off menu pricing.</p>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-40 bg-white/5 rounded-2xl" />
          <div className="h-64 bg-white/5 rounded-2xl" />
        </div>
      ) : (
        <>
          <CategoriesCarousel categories={categories} />
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Featured</h3>
            <FeaturedGridClient meals={featured} />
          </div>
          <DailySpecials meals={specials} />
        </>
      )}
    </section>
  );
}