"use client";

import { motion } from "framer-motion";

export default function MeetTheChef() {
  return (
    <section
      id="chef"
      className="py-24 bg-linear-to-br from-orange-300 via-orange-400 via-white to-[#ffebd6]"
    >
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          src="/images/chef2.jpg"
          alt="Chef Oladejo OlaTokunbo"
          className="w-full rounded-3xl shadow-2xl object-cover"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Meet the Chef
          </h2>

          <h3 className="text-2xl font-bold text-orange-600 mb-6">
            Chef Oladejo OlaTokunbo
          </h3>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Born into a Nigerian family but raised in the vibrant city of
            Chicago, USA, Chef Oladejo OlaTokunbo brings a beautiful blend of
            heritage and modern culinary artistry. Growing up, she learned the
            beauty and essence of Nigerian meals from her mother and aunties —
            watching them transform simple ingredients into dishes that brought
            the whole family together.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Her passion for cooking intensified over the years and led her to
            attend one of the top culinary schools in the United States. There,
            she mastered professional techniques while still staying rooted in the
            soulful, flavor-rich traditions of Nigerian cuisine.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Chef OlaTokunbo believes deeply in the power of family, community,
            and food that nourishes both body and soul. Her love for seeing
            families enjoy wholesome, delicious meals inspired the creation of
            Cornerstone Catering Services — a brand dedicated to spreading warmth
            and culture through every dish.
          </p>

          <p className="text-xl font-semibold text-orange-600 italic">
            Food is more than taste — it is love, it is memory, it is culture.
            Every meal tells a story, and I am honored to share mine with you.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
