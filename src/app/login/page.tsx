"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#110803] via-[#2d1203] to-[#f59e0b]
        flex items-center justify-center px-4 relative overflow-hidden">
      
     
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.25, scale: 1.4 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
        className="absolute w-[500px] h-[500px] rounded-full bg-orange-500/40 blur-3xl"
      />

      <motion.div
        initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8 }}
        className="relative backdrop-blur-xl bg-white/10 border border-white/20 
        shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          Welcome Back
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-white/80 text-sm">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-white/5 text-white
                border border-white/20 rounded-lg outline-none
                focus:border-orange-400 transition"
                placeholder="Input Your Email Here"
            />
          </div>

          <div>
            <label className="text-white/80 text-sm">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-white/5 text-white
                border border-white/20 rounded-lg outline-none
                focus:border-orange-400 transition"
                placeholder="Enter your password"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className="w-full py-3 rounded-xl text-white font-semibold
              bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400
              shadow-[0_0_20px_#f59e0b50] hover:shadow-[0_0_40px_#f59e0b80]
              transition"
          >
            Login
          </motion.button>
        </form>

        <p className="text-white/70 text-center mt-5 text-sm">
          <Link href="/forgot-password" className="text-orange-300 hover:text-orange-200">
              Forgot Password?
          </Link>
        </p>

         <p className="text-white/70 text-center mt-5 text-sm">
          Do not have an account?{" "}
          <Link href="/signup" className="text-orange-300 hover:text-orange-200">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
