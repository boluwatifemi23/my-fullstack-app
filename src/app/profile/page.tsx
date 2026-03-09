"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, Mail, Shield, LogOut } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
          <div className="bg-linear-to-r from-orange-500 to-amber-500 px-6 py-10 text-center">
            <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 border-2 border-white/50">
              <span className="text-3xl font-bold text-white">{user.firstName[0]}{user.lastName[0]}</span>
            </div>
            <h1 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h1>
            <p className="text-orange-100 text-sm mt-1 capitalize">{user.role}</p>
          </div>

          
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <User size={18} className="text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="text-gray-900 font-medium">{user.firstName} {user.lastName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Mail size={18} className="text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Shield size={18} className="text-orange-500" />
              <div>
                <p className="text-xs text-gray-500">Account Role</p>
                <p className="text-gray-900 font-medium capitalize">{user.role}</p>
              </div>
            </div>

            {user.role === "admin" && (
              <Link href="/admin"
                className="flex items-center justify-center gap-2 w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium text-sm transition-all">
                Go to Admin Panel →
              </Link>
            )}

            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 w-full py-3 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl font-medium text-sm transition-all"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}