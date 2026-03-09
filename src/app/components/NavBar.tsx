"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { usePathname, useRouter } from "next/navigation";
import { User } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { count } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // If not on the home page, redirect to home and then scroll after render
    router.push("/#menu");
  };

  const linkClass = (path: string) =>
    pathname === path
      ? "text-sm font-semibold text-[#f54a00]"
      : "text-sm font-medium hover:text-[#f54a00] transition-colors";

  return (
    <header className="sticky top-0 z-50">
      <div className="relative transition-all duration-[1200ms] ease-in-out">
        <div
          className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${
            scrolled
              ? "bg-gradient-to-r from-black via-[#f54a00]/40 to-white/90 backdrop-blur-md"
              : "bg-gradient-to-r from-[#f54a00]/70 via-orange-500/60 to-amber-400/70 bg-opacity-40 backdrop-blur-lg border-white/20 shadow-lg backdrop-saturate-150"
          }`}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center justify-between h-16">
            <Logo className="h-10 w-10" />

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className={linkClass("/")}>Home</Link>

              {/* 👉 Replace /menu with smooth scroll */}
              <button
                onClick={() => scrollToSection("menu")}
                className="text-sm font-medium hover:text-[#f54a00] transition-colors"
              >
                Menu
              </button>

              <Link href="/catering" className={linkClass("/catering")}>Catering</Link>
              <Link href="/about" className={linkClass("/about")}>About</Link>
              <Link href="/contact" className={linkClass("/contact")}>Contact</Link>
            </nav>

            {/* CART ICON */}
            <Link
              href="/cart"
              className="relative inline-flex items-center p-2 rounded-md hover:bg-white/10"
              aria-label="Cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                ></path>
                <circle cx="10" cy="20" r="1" fill="currentColor" />
                <circle cx="18" cy="20" r="1" fill="currentColor" />
              </svg>

              {count > 0 && (
                <span className="absolute -top-1 -right-1 px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                  {count}
                </span>
              )}
            </Link>

            {/* AUTH */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/profile" className="flex items-center gap-2 hover:text-[#f54a00] transition">
                  <User size={20} />
                  <span className="hidden sm:inline">{user.firstName}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-sm px-3 py-1 bg-white/10 rounded hover:bg-white/20 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm px-3 py-1 border border-white/40 rounded hover:bg-white/10 transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm px-3 py-1 bg-[#f54a00] text-white rounded hover:bg-orange-700 transition"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d={open ? "M6 18L18 6M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-gradient-to-b from-[#f54a00] via-orange-600 to-amber-400 text-white">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" className={linkClass("/")}>Home</Link>

            {/* 👉 Smooth scroll for mobile too */}
            <button onClick={() => scrollToSection("menu")} className="text-left">
              Menu
            </button>

            <Link href="/catering" className={linkClass("/catering")}>Catering</Link>
            <Link href="/about" className={linkClass("/about")}>About</Link>
            <Link href="/contact" className={linkClass("/contact")}>Contact</Link>

            <div className="pt-2 border-t border-white/30 mt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User size={18} /> {user.firstName}
                  </Link>
                  <button onClick={logout}>Logout</button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">Login</Link>
                  <Link href="/auth/register">Sign up</Link>
                </>
              )}

              <Link href="/cart">Cart ({count})</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
