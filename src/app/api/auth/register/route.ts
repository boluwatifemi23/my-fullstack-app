// import { NextResponse } from "next/server";
// import User from "@/app/models/User";
// import { connectDB } from "@/app/lib/dbConnect";
// import { sendWelcomeEmail } from "@/app/lib/email";
// import { createToken } from "@/app/lib/auth";

// export async function POST(req: Request) {
//   try {
//     await connectDB();

//     const { firstName, lastName, email, password } = await req.json();


//     const exists = await User.findOne({ email });
//     if (exists) {
//       return NextResponse.json({ error: "User already exists" }, { status: 400 });
//     }


//     const user = await User.create({ firstName, lastName, email, password });


//     const token = createToken(user);


//     const res = NextResponse.json(
//       {
//         user: {
//           id: user._id,
//           firstName: user.firstName,
//           email: user.email,
//         },
//       },
//       { status: 201 }
//     );

//     res.cookies.set("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//     });

 
//     await sendWelcomeEmail(email, firstName);

//     return res;
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import User from "@/app/models/User";
import { connectDB } from "@/app/lib/dbConnect";
import { sendWelcomeEmail } from "@/app/lib/email";
import { createToken } from "@/app/lib/auth";

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const { firstName, lastName, email, password } = body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    // Create token
    const token = createToken(user);

    // Create response
    const res = NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );

    // Set cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Send welcome email (don't await to avoid blocking)
    sendWelcomeEmail(email, firstName).catch((err) =>
      console.error("Failed to send welcome email:", err)
    );

    return res;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
