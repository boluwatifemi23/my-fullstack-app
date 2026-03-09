"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";


const PHRASES = [
  "Fresh meals.",
  "Authentic Nigerian flavors.",
  "Delivered daily.",
  "Party catering for every occasion.",
];


const BG_IMAGES = [
  "/images/assorted-meat.png",
  "/images/fishpie.webp",
  "/images/fried chicken.webp",
  "/images/rice.jpg",
  "/images/nwkobi.avif",
];

export default function Hero() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [bgIdx, setBgIdx] = useState(0);

  
  useEffect(() => {
    const t = setInterval(
      () => setPhraseIdx((i) => (i + 1) % PHRASES.length),
      3000
    );
    return () => clearInterval(t);
  }, []);

  
  useEffect(() => {
    const t = setInterval(
      () => setBgIdx((i) => (i + 1) % BG_IMAGES.length),
      4000
    );
    return () => clearInterval(t);
  }, []);

 
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="relative overflow-hidden h-screen">
      
      <div className="absolute inset-0">
        {BG_IMAGES.map((src, idx) => (
          <Image
            key={idx}
            src={src}
            alt=""
            fill
            priority
            className={`object-cover w-full h-full transition-opacity duration-1000 ease-in-out
              ${idx === bgIdx ? "opacity-100 scale-105" : "opacity-0 scale-100"}`}
          />
        ))}

       
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-28 lg:py-36 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left text-white">
        <div className="lg:w-6/12">
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight drop-shadow-md">
            Cornerstone Catering Services
            <span className="block mt-2 text-orange-400 text-3xl sm:text-4xl">
              {PHRASES[phraseIdx]}
            </span>
          </h1>

          <p className="mt-6 text-lg max-w-2xl drop-shadow">
            Savor authentic African & Nigerian meals prepared fresh and
            delivered across the USA. We also offer full-service catering for
            events, corporate functions, and celebrations.
          </p>

         
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
           
            <button
              type="button"
              onClick={() => scrollToSection("menu-section")}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold shadow hover:bg-orange-700 transition"
            >
              Explore Menu
            </button>

            <Link
              href="/catering"
              className="px-6 py-3 rounded-lg bg-white text-gray-900 hover:bg-gray-100 transition"
            >
              Catering Services
            </Link>
          </div>

          
          <div className="mt-8 inline-flex items-center gap-4 justify-center lg:justify-start">
            <Image
              src="/images/chef.jpg"
              alt="Meet the chef"
              width={72}
              height={72}
              className="rounded-full object-cover shadow-md"
            />
            <div>
              <p className="text-sm text-gray-200">Meet the Chef</p>
              <Link
                href="/chef"
                className="text-sm font-semibold text-orange-400 hover:underline"
              >
                See Bio →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
