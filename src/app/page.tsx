"use client";
import dynamic from "next/dynamic";
import Hero from "./components/Hero";
import FeaturedMeals from "./components/FeaturedMeals";



const MenuSectionClient = dynamic(
  () => import("./components/MenuSectionClient"),
  { ssr: false }
);

export default function Page() {
  return (
    <>
     
      <Hero />
       <FeaturedMeals />
      <MenuSectionClient />
    </>
  );
}
