import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Category from "@/app/models/Category";
import { verifyToken } from "@/app/lib/auth";

export async function GET() {
  await connectDB();
  const cats = await Category.find().sort({ name: 1 }).lean();
  return NextResponse.json(cats);
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const body = await req.json();
    const { name, slug, image } = body;
    if (!name || !slug) return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });

    const existing = await Category.findOne({ slug });
    if (existing) return NextResponse.json({ error: "Category with this slug already exists" }, { status: 400 });

    const category = await Category.create({ name, slug, image });
    return NextResponse.json(category, { status: 201 });
  } catch  {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}