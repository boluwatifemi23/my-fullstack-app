import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Category from "@/app/models/Category";

export async function GET() {
  await connectDB();
  const cats = await Category.find().sort({ name: 1 }).lean();
  return NextResponse.json(cats);
}
