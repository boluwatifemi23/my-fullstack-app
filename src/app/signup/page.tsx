"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function SignupPage() {
  const { signup } = useAuth();
  const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(firstName, lastName, email, password);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#110803] via-[#2d1203] to-[#f59e0b]
        flex items-center justify-center px-4 relative overflow-hidden">
      
     
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.25, scale: 1.4 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
        className="absolute w-[500px] h-[500px] rounded-full bg-yellow-500/30 blur-3xl"
      />

      <motion.div
        initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.8 }}
        className="relative backdrop-blur-xl bg-white/10 border border-white/20 
        shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-semibold text-white text-center mb-6">
          Create Your Account
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-white/80 text-sm">First Name</label>
            <input
              type="text"
              required
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-white/5 text-white
                border border-white/20 rounded-lg outline-none
                focus:border-yellow-400 transition"
                 placeholder="Input your First Name here"
            />
          </div>

          <div>
            <label className="text-white/80 text-sm">Last name</label>
            <input
              type="text"
              required
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-white/5 text-white
                border border-white/20 rounded-lg outline-none
                focus:border-yellow-400 transition"
                 placeholder="Input your Last Name here"
            />
          </div>



          <div>
            <label className="text-white/80 text-sm">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-white/5 text-white
                border border-white/20 rounded-lg outline-none
                focus:border-yellow-400 transition"
                placeholder="Input your Email here"
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
                focus:border-yellow-400 transition"
                placeholder="Create a strong password"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className="w-full py-3 rounded-xl text-white font-semibold
              bg-linear-to-r from-amber-600 via-yellow-500 to-orange-500
              shadow-[0_0_20px_#fbbf2480] hover:shadow-[0_0_40px_#fbbf24bb]
              transition"
          >
            Sign Up
          </motion.button>
        </form>

        <p className="text-white/70 text-center mt-5 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-yellow-300 hover:text-yellow-200">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
