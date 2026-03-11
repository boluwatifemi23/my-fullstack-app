import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About Us - Cornerstone Catering Services",
  description: "Learn about Cornerstone Catering Services — authentic Nigerian and African food in the USA.",
};

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <section className="text-center mb-16">
        <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4">
          Our Story
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          Bringing the Taste of <span className="text-orange-500">Home</span> to You
        </h1>
        <p className="mt-5 text-lg text-gray-600 max-w-2xl mx-auto">
          Cornerstone Catering Services was born out of a love for authentic Nigerian and African cuisine —
          and a desire to share it with communities across the USA.
        </p>
      </section>

     
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <Image src="/images/chef2.jpg" alt="Our kitchen" width={600} height={400} className="object-cover w-full h-72 md:h-80" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Who We Are</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We are a team of passionate cooks and food lovers dedicated to bringing you the most
            authentic Nigerian and African meals — prepared fresh, with love, and delivered right to your door.
          </p>
          <p className="text-gray-600 leading-relaxed">
            From jollof rice to small chops, soups, stews, and full event catering — every dish
            we make carries the warmth and richness of African culture.
          </p>
        </div>
      </section>

      
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
        {[
          { emoji: "🌿", title: "Fresh Ingredients", desc: "We source the freshest ingredients to guarantee authentic taste and quality." },
          { emoji: "🍽️", title: "Authentic Recipes", desc: "Our recipes are rooted in generations of Nigerian and African culinary tradition." },
          { emoji: "💛", title: "Made with Love", desc: "Every meal is prepared with care, passion, and a dedication to your satisfaction." },
        ].map(({ emoji, title, desc }) => (
          <div key={title} className="bg-orange-50 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">{emoji}</div>
            <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{desc}</p>
          </div>
        ))}
      </section>

      
      <section className="bg-linear-to-r from-orange-500 to-amber-500 rounded-2xl p-10 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Ready to Experience the Taste?</h2>
        <p className="text-orange-100 mb-6">Order from our menu or book us for your next event.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition">
            Browse Menu
          </Link>
          <Link href="/catering" className="px-6 py-3 bg-orange-700 text-white rounded-xl font-semibold hover:bg-orange-800 transition">
            Catering Services
          </Link>
        </div>
      </section>
    </main>
  );
}