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
    if (meals.length === 0) return;
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
      <div className="flex gap-4 items-center justify-center">
        {windowItems.map((m) => (
          <div
            key={m._id}
            className="w-64 transition duration-500 hover:scale-105 will-change-transform"
          >
            <MealCardClient meal={m} />
          </div>
        ))}
      </div>
    </section>
  );
}