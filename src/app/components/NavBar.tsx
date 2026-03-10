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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    router.push("/#menu");
  };

  const linkClass = (path: string) =>
    pathname === path
      ? "text-sm font-semibold text-[#f54a00] border-b-2 border-[#f54a00] pb-0.5"
      : "text-sm font-medium hover:text-[#f54a00] transition-colors";

  const menuActive = pathname === "/menu";

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="relative w-full transition-all duration-300 ease-in-out">
        <div className={`absolute inset-0 w-full transition-all duration-300 ease-in-out ${
          scrolled
            ? "bg-gradient-to-r from-black via-[#f54a00]/40 to-black/90 backdrop-blur-md"
            : "bg-gradient-to-r from-[#f54a00]/70 via-orange-500/60 to-amber-400/70 backdrop-blur-lg shadow-lg"
        }`} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center justify-between h-16">
            <Logo className="h-10 w-10" />

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className={linkClass("/")}>Home</Link>
              <button onClick={() => scrollToSection("menu")}
                className={`text-sm font-medium transition-colors ${menuActive ? "text-[#f54a00] font-semibold border-b-2 border-[#f54a00] pb-0.5" : "hover:text-[#f54a00]"}`}>
                Menu
              </button>
              <Link href="/catering" className={linkClass("/catering")}>Catering</Link>
              <Link href="/about" className={linkClass("/about")}>About</Link>
              <Link href="/contact" className={linkClass("/contact")}>Contact</Link>
            </nav>

            <div className="flex items-center gap-2">
              <Link href="/cart"
                className="relative inline-flex items-center p-2 rounded-md hover:bg-white/10"
                aria-label="Cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="10" cy="20" r="1" fill="currentColor" />
                  <circle cx="18" cy="20" r="1" fill="currentColor" />
                </svg>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
                    {count}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/profile"
                    className={`flex items-center gap-2 transition ${pathname === "/profile" ? "text-[#f54a00]" : "hover:text-[#f54a00]"}`}>
                    <User size={20} />
                    <span className="hidden sm:inline">{user.firstName}</span>
                  </Link>
                  <button onClick={logout}
                    className="text-sm px-3 py-1 bg-white/10 rounded hover:bg-white/20 transition">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login"
                    className={`text-sm px-3 py-1 border border-white/40 rounded hover:bg-white/10 transition ${pathname === "/login" ? "bg-white/10 text-[#f54a00]" : ""}`}>
                    Login
                  </Link>
                  <Link href="/signup"
                    className="text-sm px-3 py-1 bg-[#f54a00] text-white rounded hover:bg-orange-700 transition">
                    Sign up
                  </Link>
                </div>
              )}

              <button onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md hover:bg-white/10">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d={open ? "M6 18L18 6M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"}
                    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden w-full bg-gradient-to-b from-[#f54a00] via-orange-600 to-amber-400 text-white">
          <div className="px-4 py-4 space-y-3">
            <Link href="/" onClick={() => setOpen(false)} className="block text-sm font-medium">Home</Link>
            <button onClick={() => { scrollToSection("menu"); setOpen(false); }}
              className="block text-left text-sm font-medium w-full">Menu</button>
            <Link href="/catering" onClick={() => setOpen(false)} className="block text-sm font-medium">Catering</Link>
            <Link href="/about" onClick={() => setOpen(false)} className="block text-sm font-medium">About</Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="block text-sm font-medium">Contact</Link>

            <div className="pt-2 border-t border-white/30 flex flex-col gap-2">
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2">
                    <User size={18} /> {user.firstName}
                  </Link>
                  <button onClick={() => { logout(); setOpen(false); }}>Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
                  <Link href="/signup" onClick={() => setOpen(false)}>Sign up</Link>
                </>
              )}
              <Link href="/cart" onClick={() => setOpen(false)}>Cart ({count})</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}