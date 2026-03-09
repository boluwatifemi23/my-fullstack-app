import { NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const { file } = await req.json();

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploadRes = await cloudinary.uploader.upload(file, {
      folder: "cornerstone/menu",
    });

    return NextResponse.json({ url: uploadRes.secure_url });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
