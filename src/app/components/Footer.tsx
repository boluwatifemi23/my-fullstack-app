import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

         
          <div>
            <div className="mb-4">
              <Logo className="h-10 w-10" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mt-3">
              Authentic Nigerian meals crafted with love. Same great quality, every time.
            </p>
          </div>

          
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Menu", href: "/menu" },
                { label: "Catering", href: "/catering" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href}
                    className="text-gray-400 hover:text-orange-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-4">

              
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="group w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/50 hover:bg-pink-500/10 flex items-center justify-center transition-all duration-200">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-pink-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>

              
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="group w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:border-sky-500/50 hover:bg-sky-500/10 flex items-center justify-center transition-all duration-200">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-sky-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.213 5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>

             
              <Link href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
                className="group w-11 h-11 rounded-2xl bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 flex items-center justify-center transition-all duration-200">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" />
                </svg>
              </Link>
            </div>

            <p className="text-gray-500 text-xs mt-6">
              Follow us for daily specials, behind the scenes and more!
            </p>
          </div>
        </div>

       
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} Cornerstone Catering Services. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Made with ❤️ for authentic Nigerian cuisine
          </p>
        </div>
      </div>
    </footer>
  );
}