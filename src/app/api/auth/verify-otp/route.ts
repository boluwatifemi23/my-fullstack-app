import { NextResponse } from "next/server";
import OTP from "@/app/models/OTP";
import { connectDB } from "@/app/lib/dbConnect";

export async function POST(req: Request) {
  await connectDB();

  const { email, otp } = await req.json();

  const record = await OTP.findOne({ email, otp });
  if (!record) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
  }

  if (record.expiresAt < new Date()) {
    return NextResponse.json({ error: "OTP expired" }, { status: 400 });
  }

  return NextResponse.json({ message: "OTP verified" });
}
