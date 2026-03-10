"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, Mail, Shield, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-orange-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-[450px] h-[450px] bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-orange-500/15 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] bg-red-600/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-lg mx-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">

          <div className="relative px-6 py-10 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 via-amber-500/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />

            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-xl">
                <span className="text-3xl font-bold text-white">{user.firstName[0]}{user.lastName[0]}</span>
              </div>
              <h1 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h1>
              <span className="inline-block mt-2 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-300 text-xs font-semibold capitalize">
                {user.role}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-3">
            {[
              { icon: User, label: "Full Name", value: `${user.firstName} ${user.lastName}` },
              { icon: Mail, label: "Email Address", value: user.email },
              { icon: Shield, label: "Account Role", value: user.role },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/8 rounded-2xl border border-white/8 transition-all">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-orange-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-white font-medium capitalize truncate">{value}</p>
                </div>
              </div>
            ))}

            {user.role === "admin" && (
              <Link href="/admin"
                className="flex items-center justify-between w-full p-4 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 hover:border-orange-500/40 text-orange-400 rounded-2xl font-medium text-sm transition-all group">
                <span>Go to Admin Panel</span>
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}

            <button onClick={logout}
              className="flex items-center justify-center gap-2 w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 rounded-2xl font-medium text-sm transition-all">
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}