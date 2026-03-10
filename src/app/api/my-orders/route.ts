import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Order from "@/app/models/Order";

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  await connectDB();
  const orders = await Order.find({ "customer.email": email })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json(orders);
}