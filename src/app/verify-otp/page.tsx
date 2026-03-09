"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOtp() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  // your logic
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      toast.error(data.error || "Invalid OTP");
      return;
    }

    toast.success("OTP verified!");
    router.push(`/reset-password?email=${email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#1a0f0a] to-black text-white">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-2xl w-full max-w-md shadow-xl animate-scaleIn">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
          Verify OTP
        </h2>

        <p className="text-center text-sm text-gray-300 mt-2">
          Enter the 6-digit code sent to:
          <br />
          <span className="text-orange-300">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="text-sm">OTP Code</label>
            <input
              type="text"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:ring-2 focus:ring-orange-400 outline-none text-center tracking-widest"
              placeholder="______"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-400 py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-40"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
