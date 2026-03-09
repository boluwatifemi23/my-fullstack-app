import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Meal from "@/app/models/Meal";
import { verifyToken } from "@/app/lib/auth";

export async function GET(req: Request) {
  await connectDB();

  const url = new URL(req.url);
  const category = url.searchParams.get("category");

  const query: Record<string, string> = {};
  if (category) query.category = category;

  const meals = await Meal.find(query).sort({ name: 1 }).lean();
  return NextResponse.json(meals);
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const body = await req.json();
    const { name, price, category, image, description } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: "Name, price and category are required" }, { status: 400 });
    }

    const meal = await Meal.create({ name, price: Number(price), category, image, description });
    return NextResponse.json(meal, { status: 201 });
  } catch (error) {
    console.error("Create meal error:", error);
    return NextResponse.json({ error: "Failed to create meal" }, { status: 500 });
  }
}