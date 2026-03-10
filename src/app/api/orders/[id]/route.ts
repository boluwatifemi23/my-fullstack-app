import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Order from "@/app/models/Order";
import { verifyToken } from "@/app/lib/auth";
import { sendOutForDeliveryEmail, sendDeliveredEmail } from "@/app/lib/email";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const order = await Order.findOne({ orderId: id }).lean();
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await connectDB();
    const { deliveryStatus } = await req.json();
    const order = await Order.findOneAndUpdate(
      { orderId: id },
      { deliveryStatus },
      { new: true }
    );
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  
    if (deliveryStatus === "out-for-delivery") {
      await sendOutForDeliveryEmail(order.customer.email, order.customer.name, order.orderId);
    }
    if (deliveryStatus === "delivered") {
      await sendDeliveredEmail(order.customer.email, order.customer.name, order.orderId);
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}