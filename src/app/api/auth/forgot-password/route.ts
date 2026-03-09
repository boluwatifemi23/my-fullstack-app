import { NextResponse } from "next/server";
import OTP from "@/app/models/OTP";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/dbConnect";
import { sendOTPEmail } from "@/app/lib/email";

export async function POST(req: Request) {
  await connectDB();

  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "Email not found" }, { status: 404 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await OTP.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendOTPEmail(email, otp);

  return NextResponse.json({ message: "OTP sent to email" });
}
