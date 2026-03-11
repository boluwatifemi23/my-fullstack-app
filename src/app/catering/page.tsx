import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Catering Services - Cornerstone Catering",
  description: "Full-service Nigerian and African catering for events, parties, corporate functions and more.",
};

const packages = [
  {
    name: "Small Gathering",
    guests: "Up to 30 guests",
    price: "From $1,000",
    features: ["2 rice dishes", "1 protein option", "1 salad", "Small chops", "Drinks"],
    highlight: false,
  },
  {
    name: "Mid-Size Event",
    guests: "30–100 guests",
    price: "From $5,000",
    features: ["3 rice dishes", "2 protein options", "2 soups/stews", "Small chops", "Salads", "Drinks & dessert"],
    highlight: true,
  },
  {
    name: "Grand Celebration",
    guests: "100+ guests",
    price: "Custom quote",
    features: ["Full buffet spread", "Multiple proteins", "All sides & soups", "Dedicated chef", "Staff & setup", "Custom menu"],
    highlight: false,
  },
];

export default function CateringPage() {
  return (
    <main>
     
      <section className="relative h-80 overflow-hidden">
        <Image src="/images/jollofrice2.jpg" alt="Catering" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="px-4 py-1.5 bg-orange-500/80 text-white text-sm font-semibold rounded-full mb-4">Catering Services</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            We Cater for Every Occasion
          </h1>
          <p className="mt-4 text-orange-100 text-lg max-w-xl">
            From intimate family dinners to large corporate events — we bring authentic Nigerian cuisine to your table.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { emoji: "🎉", title: "Weddings & Parties", desc: "Full buffet setup, live cooking stations, and dedicated service staff." },
              { emoji: "🏢", title: "Corporate Events", desc: "Professional catering for meetings, conferences, and company celebrations." },
              { emoji: "🏠", title: "Home Gatherings", desc: "Intimate dinners, birthday parties, and family reunions — big or small." },
              { emoji: "🎓", title: "Graduation Parties", desc: "Mark the milestone with a feast that brings family and friends together." },
              { emoji: "⛪", title: "Church Events", desc: "Large-scale catering for church programs, fellowship, and special services." },
              { emoji: "🍱", title: "Meal Prep / Delivery", desc: "Weekly meal prep and delivery for individuals and families." },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="bg-orange-50 rounded-2xl p-5">
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </section>

      
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Catering Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map(({ name, guests, price, features, highlight }) => (
              <div key={name}
                className={`rounded-2xl p-6 border-2 flex flex-col ${highlight ? "border-orange-500 bg-orange-50 shadow-xl shadow-orange-500/10" : "border-gray-200 bg-white"}`}>
                {highlight && (
                  <span className="self-start px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full mb-3">Most Popular</span>
                )}
                <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                <p className="text-gray-500 text-sm mt-1">{guests}</p>
                <p className="text-2xl font-extrabold text-orange-500 mt-3 mb-4">{price}</p>
                <ul className="space-y-2 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-orange-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact"
                  className={`mt-6 py-2.5 rounded-xl text-center text-sm font-semibold transition-all ${highlight ? "bg-orange-500 text-white hover:bg-orange-600" : "border border-orange-500 text-orange-500 hover:bg-orange-50"}`}>
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </section>

       
        <section className="bg-gray-900 rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Have a Custom Event?</h2>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">Tell us about your event and we&apos;ll create a custom catering package just for you.</p>
          <Link href="/contact"
            className="inline-block px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all">
            Get a Free Quote
          </Link>
        </section>
      </div>
    </main>
  );
}