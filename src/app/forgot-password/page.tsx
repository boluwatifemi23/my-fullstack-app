"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);



    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Something went wrong");
      return;
    }

    toast.success("OTP sent to your email!");
    router.push(`/verify-otp?email=${email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#1a0f0a] to-black text-white">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl w-full max-w-md shadow-xl animate-fadeIn">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
          Forgot Password
        </h2>

        <p className="text-center text-sm text-gray-300 mt-2">
          Enter your email to receive a verification code.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="text-sm">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-orange-400 outline-none"
              placeholder="Enter your email"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-400 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-40"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
