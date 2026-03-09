import "./globals.css";
import { ReactNode } from "react";
import Navbar from "./components/NavBar";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Cornerstone Catering Services",
  description: "Authentic African and Nigerian catering in the USA."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <Toaster position="top-right"/>
            <main id="content">{children}</main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
