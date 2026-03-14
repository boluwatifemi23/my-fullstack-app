import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Order from "@/app/models/Order";
import { sendOrderConfirmedEmail } from "@/app/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

    await connectDB();
    const order = await Order.findOneAndUpdate(
      { orderId },
      { paymentStatus: "pending_verification" },
      { new: true }
    );

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Send confirmation email to customer
    await sendOrderConfirmedEmail(
      order.customer.email,
      order.customer.name,
      order.orderId,
      order.items,
      order.total,
      order.deliveryDate || "",
      order.deliveryTime || "",
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Confirm Zelle error:", error);
    return NextResponse.json({ error: "Failed to confirm order" }, { status: 500 });
  }
}