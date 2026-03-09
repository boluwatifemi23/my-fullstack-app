// src/scripts/seedAdmin.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../app/models/User";

const MONGO_URI = process.env.MONGO_URI!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Please set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local");
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const exists = await User.findOne({ email: ADMIN_EMAIL });
    if (exists) {
      console.log("Admin already exists, aborting.");
      process.exit(0);
    }
    
    const hashed = await bcrypt.hash(ADMIN_PASSWORD as string , 10);
    const user = await User.create({
      firstName: "Admin",
      lastName: "User",
      email: ADMIN_EMAIL,
      password: hashed,
      role: "admin",
    });

    console.log("Admin user created:", user.email);
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
