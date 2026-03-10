import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/app/lib/dbConnect";
import Order from "@/app/models/Order";
import { sendOrderConfirmedEmail } from "@/app/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId } = await req.json();

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntentId },
      { paymentStatus: "paid" },
      { new: true }
    );

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    
    await sendOrderConfirmedEmail(
      order.customer.email,
      order.customer.name,
      order.orderId,
      order.items,
      order.total,
      order.deliveryDate,
      order.deliveryTime,
    );

    return NextResponse.json({ success: true, orderId: order.orderId });
  } catch (error) {
    console.error("Confirm payment error:", error);
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 });
  }
}