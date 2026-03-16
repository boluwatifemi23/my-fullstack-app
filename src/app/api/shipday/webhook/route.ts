import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Order, { IOrder } from "@/app/models/Order";
import { sendOutForDeliveryEmail, sendDeliveredEmail } from "@/app/lib/email";

type DeliveryStatus = IOrder["deliveryStatus"];

export async function POST(req: NextRequest) {
  try {
   
    const token = req.headers.get("authorization") ?? req.headers.get("x-shipday-token") ?? "";
    const validToken = process.env.SHIPDAY_WEBHOOK_TOKEN ?? "";

    if (validToken && token !== validToken && token !== `Bearer ${validToken}`) {
      console.warn("Shipday webhook: invalid token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Shipday webhook received:", JSON.stringify(body));

    const { orderNumber, status } = body;
    if (!orderNumber || !status) {
      return NextResponse.json({ error: "Missing orderNumber or status" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findOne({ orderId: orderNumber });
    if (!order) {
      console.log("Order not found for webhook:", orderNumber);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let newStatus: DeliveryStatus | null = null;

    const s = status.toLowerCase();
    if (s.includes("picked") || s.includes("pickup") || s.includes("in_transit") || s.includes("out")) {
      newStatus = "out-for-delivery";
    } else if (s.includes("delivered") || s.includes("complete")) {
      newStatus = "delivered";
    } else if (s.includes("assigned") || s.includes("accepted")) {
      newStatus = "preparing";
    }

    if (newStatus && newStatus !== order.deliveryStatus) {
      order.deliveryStatus = newStatus;
      await order.save();

      if (newStatus === "out-for-delivery") {
        await sendOutForDeliveryEmail(
          order.customer.email,
          order.customer.name,
          order.orderId
        );
      }
      if (newStatus === "delivered") {
        await sendDeliveredEmail(
          order.customer.email,
          order.customer.name,
          order.orderId
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Shipday webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}