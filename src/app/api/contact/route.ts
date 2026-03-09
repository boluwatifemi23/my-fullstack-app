import { NextResponse } from "next/server";
import { sendContactEmail } from "@/app/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Please fill all required fields" }, { status: 400 });
    }

    await sendContactEmail({ name, email, phone, subject, message });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}