import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/dbConnect";

export async function POST(req: Request) {
  await connectDB();

  const { email, newPassword } = await req.json();

  const hashed = await bcrypt.hash(newPassword, 10);

  await User.findOneAndUpdate(
    { email },
    { password: hashed }
  );

  return NextResponse.json({ message: "Password updated" });
}
