"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { UtensilsCrossed, Tag, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ meals: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [mealsRes, catsRes] = await Promise.all([
        fetch("/api/meals"),
        fetch("/api/categories"),
      ]);
      const meals = await mealsRes.json();
      const cats = await catsRes.json();
      setStats({ meals: meals.length, categories: cats.length });
      setLoading(false);
    }
    loadStats();
  }, []);

  const cards = [
    { label: "Total Meals", value: stats.meals, icon: UtensilsCrossed, href: "/admin/meals", color: "from-orange-500 to-amber-500" },
    { label: "Categories", value: stats.categories, icon: Tag, href: "/admin/categories", color: "from-amber-500 to-yellow-500" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here&apos;s an overview of your menu.</p>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href}
            className="bg-gray-800 border border-white/10 rounded-2xl p-6 hover:border-orange-500/30 transition-all group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{label}</p>
                <p className="text-3xl font-bold text-white mt-1">
                  {loading ? <span className="animate-pulse">...</span> : value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${color} flex items-center justify-center`}>
                <Icon size={22} className="text-white" />
              </div>
            </div>
            <p className="text-orange-400 text-xs mt-4 group-hover:underline">Manage →</p>
          </Link>
        ))}
      </div>

      
      <div className="bg-gray-800 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-orange-400" />
          <h2 className="text-white font-semibold">Quick Actions</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/meals"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-xl transition-all font-medium">
            + Add New Meal
          </Link>
          <Link href="/admin/categories"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl transition-all font-medium">
            + Add Category
          </Link>
          <Link href="/" target="_blank"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-xl transition-all font-medium">
            View Live Site ↗
          </Link>
        </div>
      </div>
    </div>
  );
}