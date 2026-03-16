import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/app/lib/dbConnect";
import Order, { IOrder, OrderItem } from "@/app/models/Order";
import { verifyToken } from "@/app/lib/auth";

const SHIPDAY_API_KEY = process.env.SHIPDAY_API_KEY!;
const SHIPDAY_API_URL = "https://api.shipday.com/orders";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

    await connectDB();
    const order = await Order.findOne({ orderId }).lean<IOrder | null>();
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

   
    const shipdayPayload = {
      orderNumber: order.orderId,
      customerName: order.customer.name,
      customerAddress: `${order.customer.address}, ${order.customer.city}, ${order.customer.state} ${order.customer.zip}`,
      customerEmail: order.customer.email,
      customerPhoneNumber: order.customer.phone,
      restaurantName: "Cornerstone Catering Services",
      restaurantAddress: "606 E Portland Dr, Burnsville, MN 55337",
      restaurantPhoneNumber: "+17739831974",
      expectedDeliveryDate: order.deliveryDate || new Date().toISOString().split("T")[0],
      expectedPickupTime: order.deliveryTime || "12:00 PM",
      expectedDeliveryTime: order.deliveryTime || "1:00 PM",
      orderItem: order.items.map((item: OrderItem) => ({
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      orderTotal: order.total,
      tips: 0,
      deliveryFee: order.deliveryFee || 0,
      specialInstruction: order.specialInstructions || "",
    };

   
    const shipdayRes = await fetch(SHIPDAY_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${SHIPDAY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(shipdayPayload),
    });

    const shipdayData = await shipdayRes.json();

    if (!shipdayRes.ok) {
      console.error("Shipday error:", shipdayData);
      return NextResponse.json({ error: "Failed to dispatch with Shipday" }, { status: 500 });
    }

    
    await Order.findOneAndUpdate(
      { orderId },
      { shipdayOrderId: shipdayData.orderId, deliveryStatus: "preparing" },
    );

    return NextResponse.json({ success: true, shipdayOrderId: shipdayData.orderId });
  } catch (error) {
    console.error("Dispatch error:", error);
    return NextResponse.json({ error: "Failed to dispatch order" }, { status: 500 });
  }
}