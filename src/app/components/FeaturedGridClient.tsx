"use client";
import React from "react";
import MealCardClient from "./MealCardClient";
import { MealType } from "@/app/models/Meal";

export default function FeaturedGridClient({ meals }: { meals: MealType[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {meals.map((m) => (
        <div
          key={m._id}
          className="transform transition hover:-translate-y-1 hover:shadow-2xl rounded-xl"
        >
          <MealCardClient meal={m} />
        </div>
      ))}
    </div>
  );
}
