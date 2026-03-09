import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Meal from "@/app/models/Meal";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const meal = await Meal.findById(params.id).lean();
  if (!meal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(meal);
}
