import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Order from "@/app/models/Order";
import { verifyToken } from "@/app/lib/auth";
import { nanoid } from "nanoid";


export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, specialInstructions } = body;

    if (!customer || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing order data" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity, 0
    );
    const total = subtotal; // No delivery fee — client handles separately

    await connectDB();
    const orderId = "CC-" + nanoid(8).toUpperCase();

    await Order.create({
      orderId,
      customer,
      items,
      subtotal,
      deliveryFee: 0,
      total,
      specialInstructions,
      paymentStatus: "pending",
      deliveryStatus: "placed",
    });

    return NextResponse.json({ orderId, total, subtotal });
  } catch (error) {
    console.error("Create Zelle order error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}