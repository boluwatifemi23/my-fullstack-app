"use client";
import dynamic from "next/dynamic";
import Hero from "./components/Hero";


// Lazy-load the animated menu section for smooth client behavior
const MenuSectionClient = dynamic(
  () => import("./components/MenuSectionClient"),
  { ssr: false }
);

export default function Page() {
  return (
    <>
      {/* HERO */}
      <Hero />

      {/* MENU SECTION (Categories + Featured + Specials) */}
      <MenuSectionClient />
    </>
  );
}
