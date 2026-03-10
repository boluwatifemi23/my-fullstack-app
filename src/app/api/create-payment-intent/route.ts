import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/app/lib/dbConnect";
import Order from "@/app/models/Order";
import { getDeliveryFee } from "@/app/lib/deliveryZones";
import { nanoid } from "nanoid";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, deliveryDate, deliveryTime, specialInstructions } = body;

    const deliveryFee = getDeliveryFee(customer.zip);
    if (deliveryFee === null) {
      return NextResponse.json({ error: "We don't deliver to this ZIP code yet." }, { status: 400 });
    }

    const subtotal = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
    const total = subtotal + deliveryFee;

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Stripe uses cents
      currency: "usd",
      metadata: { customerEmail: customer.email, customerName: customer.name },
    });

    // Save order to DB as pending
    await connectDB();
    const orderId = "CC-" + nanoid(8).toUpperCase();

    await Order.create({
      orderId,
      customer,
      items,
      subtotal,
      deliveryFee,
      total,
      deliveryDate,
      deliveryTime,
      specialInstructions,
      paymentStatus: "pending",
      deliveryStatus: "placed",
      stripePaymentIntentId: paymentIntent.id,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId,
      total,
      deliveryFee,
      subtotal,
    });
  } catch (error) {
    console.error("Payment intent error:", error);
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}