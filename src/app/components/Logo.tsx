
"use client";
import Link from "next/link";

export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  
  return (
    <Link href="/" aria-label="Cornerstone Catering Home" className="flex items-center gap-3">
      <svg
        className={className}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        <rect x="0" y="0" width="64" height="64" rx="12" fill="#f54a00" />
        <path d="M18 34c0-6 7-10 14-10s14 4 14 10v6H18v-6z" fill="#FFF" opacity="0.98"/>
        <circle cx="32" cy="22" r="6" fill="#fff" opacity="0.98"/>
      </svg>

      <div className="hidden sm:flex flex-col leading-tight">
        <span className="text-lg font-extrabold text-white tracking-tight">Cornerstone<span className="text-orange-600">Catering</span></span>
        <span className="text-xs text-gray-500 -mt-0.5">Authentic Nigerian Meals</span>
      </div>

      
      <div className="sm:hidden text-lg font-bold text-gray-900">
        <span>Cornerstone</span>
      </div>
    </Link>
  );
}
