import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Meal from "@/app/models/Meal";
import { MealType } from "@/app/utils/meal";

export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const category = url.searchParams.get("category");

  const query: Record<string, string> = {};
  if (category) query.category = category;

  // ⭐ FIXED — Cast as unknown first (correct + safe)
  const meals = (await Meal.find(query).sort({ name: 1 }).lean()) as unknown as MealType[];

  return NextResponse.json(meals);
}
