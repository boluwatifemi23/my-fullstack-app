import "./globals.css";
import { ReactNode } from "react";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import ConditionalFooter from "./components/ConditionalFooter";
import ConditionalNavbar from "./components/ConditionalNavbar";

const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

export const metadata = {
  title: "Cornerstone Catering Services",
  description: "Authentic African and Nigerian catering. Same great quality — enjoy!",
  metadataBase: new URL(appUrl),
  openGraph: {
    title: "Cornerstone Catering Services",
    description: "Authentic African and Nigerian catering. Same great quality — enjoy!",
    url: appUrl,
    siteName: "Cornerstone Catering Services",
    images: [
      {
        url: "https://res.cloudinary.com/dtj1k9kka/image/upload/v1773097928/cornerstone/menu/ojmqccpjtzpiysweshir.jpg",
        width: 1200,
        height: 630,
        alt: "Cornerstone Catering Services — Authentic Nigerian Meals",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cornerstone Catering Services",
    description: "Authentic African and Nigerian catering. Same great quality — enjoy!",
    images: ["https://res.cloudinary.com/dtj1k9kka/image/upload/v1773097928/cornerstone/menu/ojmqccpjtzpiysweshir.jpg"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-900 antialiased flex flex-col">
        <AuthProvider>
          <CartProvider>
            <ConditionalNavbar />
            <Toaster position="top-right" />
            <main id="content" className="flex-1">{children}</main>
            <ConditionalFooter />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}