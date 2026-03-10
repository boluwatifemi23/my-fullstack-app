"use client";
import React, { useEffect, useState } from "react";
import MealCardClient from "./MealCardClient";
import { MealType } from "@/app/models/Meal";

export default function DailySpecials({ meals }: { meals: MealType[] }) {
  const [index, setIndex] = useState(() => {
    const today = new Date();
    return today.getDate() % Math.max(1, meals.length);
  });

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % meals.length);
    }, 6000);
    return () => clearInterval(t);
  }, [meals.length]);

  if (!meals || meals.length === 0) return null;

  const windowItems = [
    meals[index],
    meals[(index + 1) % meals.length],
    meals[(index + 2) % meals.length],
  ];

  return (
    <section className="mt-10">
      <h3 className="text-2xl font-semibold mb-4">Daily Specials</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {windowItems.map((m) => (
          <div key={m._id} className="w-full transform transition duration-500 hover:scale-105">
            <MealCardClient meal={m}/>
          </div>
        ))}
      </div>
    </section>
  );
}