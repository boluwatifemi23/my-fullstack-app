import "./globals.css";
import { ReactNode } from "react";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import ConditionalFooter from "./components/ConditionalFooter";
import ConditionalNavbar from "./components/ConditionalNavbar";
import WhatsAppButton from "./components/WhatsAppButton";

const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

export const metadata = {
  title: {
    default: "Cornerstone Catering Services | Authentic Nigerian Food — Chicago & Minnesota",
    template: "%s | Cornerstone Catering Services",
  },
  description: "Authentic Nigerian and African catering services in Chicago and Minnesota. Order fresh Jollof Rice, Peppersoup, Small Chops, Soups & Stews online. Party catering, bulk orders and home delivery available.",
  keywords: [
    "Nigerian catering Chicago",
    "African food delivery Chicago",
    "Nigerian food Minnesota",
    "authentic Nigerian catering",
    "Jollof Rice Chicago",
    "Nigerian party catering",
    "African catering services USA",
    "Nigerian food delivery",
    "small chops catering",
    "Cornerstone Catering Services",
    "Nigerian caterer Burnsville MN",
    "African food catering Illinois",
    "Nigerian soup delivery",
    "bulk food orders Nigerian",
    "authentic African meals USA",
  ],
  metadataBase: new URL(appUrl),
  alternates: {
    canonical: appUrl,
  },
  openGraph: {
    title: "Cornerstone Catering Services | Authentic Nigerian Food",
    description: "Fresh Nigerian and African meals delivered to your door in Chicago and Minnesota. Party catering, bulk orders and home delivery.",
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
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cornerstone Catering Services | Authentic Nigerian Food",
    description: "Fresh Nigerian and African meals delivered to your door in Chicago and Minnesota.",
    images: ["https://res.cloudinary.com/dtj1k9kka/image/upload/v1773097928/cornerstone/menu/ojmqccpjtzpiysweshir.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION ?? "",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
      
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FoodEstablishment",
              "name": "Cornerstone Catering Services",
              "description": "Authentic Nigerian and African catering services in Chicago and Minnesota.",
              "url": appUrl,
              "telephone": "+17739831974",
              "email": "cateringcornerstone2@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "606 E Portland Dr",
                "addressLocality": "Burnsville",
                "addressRegion": "MN",
                "postalCode": "55337",
                "addressCountry": "US",
              },
              "areaServed": ["Chicago, IL", "Minnesota, MN"],
              "servesCuisine": ["Nigerian", "African", "West African"],
              "priceRange": "$$",
              "openingHours": "Mo-Su 09:00-20:00",
              "hasMenu": `${appUrl}/menu`,
              "acceptsReservations": "True",
              "sameAs": [
                appUrl,
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-950 text-gray-900 antialiased flex flex-col">
        <AuthProvider>
          <CartProvider>
            <ConditionalNavbar />
            <Toaster position="top-right" />
            <main id="content" className="flex-1">{children}</main>
            <ConditionalFooter />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}