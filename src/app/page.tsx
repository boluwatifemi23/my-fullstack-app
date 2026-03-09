"use client";
import dynamic from "next/dynamic";
import Hero from "./components/Hero";



const MenuSectionClient = dynamic(
  () => import("./components/MenuSectionClient"),
  { ssr: false }
);

export default function Page() {
  return (
    <>
     
      <Hero />
      <MenuSectionClient />
    </>
  );
}
