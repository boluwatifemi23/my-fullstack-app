
import Link from "next/link";
import { connectDB } from "@/app/lib/dbConnect";
import Category from "@/app/models/Category";
import Meal, { MealType } from "@/app/models/Meal";
import MealCardClient from "@/app/components/MealCardClient";
import { LeanCategoryDoc, LeanMealDoc } from "@/app/utils/mongoose-types";
import ImageWithFallback from "../components/ImageWithFallBack";

export const metadata = {
  title: "Menu - Cornerstone Catering",
  description: "Explore our authentic Nigerian menu",
};

export const revalidate = 60;


const categoryImages: Record<string, string> = {
  "small-chops": "/images/assorted-meat.png",
  "soups-stews": "/images/assorted-meat.png",
  stew: "/images/assorted-meat.png",
  "special-delicacy": "/images/assorted-meat.png",
  salads: "/images/assorted-meat.png",
  proteins: "/images/assorted-meat.png",
  seafood: "/images/assorted-meat.png",
  "main-dish": "/images/assorted-meat.png",
  accompaniments: "/images/assorted-meat.png",
};


const categoryColors = [
  "from-orange-500 to-red-500",
  "from-amber-500 to-orange-500",
  "from-yellow-500 to-amber-500",
  "from-green-500 to-emerald-500",
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-red-500 to-rose-500",
  "from-teal-500 to-green-500",
  "from-indigo-500 to-purple-500",
];

async function getMenuData() {
  await connectDB();

  const categoriesRaw = (await Category.find()
    .sort({ order: 1, name: 1 })
    .lean()
    .exec()) as unknown as LeanCategoryDoc[];

  const categories = categoriesRaw.map((cat) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
  }));

  const featuredRaw = (await Meal.find()
    .sort({ createdAt: -1 })
    .limit(6)
    .lean()
    .exec()) as unknown as LeanMealDoc[];

  const featured: MealType[] = featuredRaw.map((meal) => ({
    _id: meal._id.toString(),
    name: meal.name,
    price: meal.price,
    category: meal.category,
    ...(meal.image && { image: meal.image }),
    ...(meal.description && { description: meal.description }),
  }));

  return { categories, featured };
}

export default async function MenuIndexPage() {
  const { categories, featured } = await getMenuData();

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-8">
        <h2 className="text-4xl font-extrabold text-gray-900">Our Menu</h2>
        <p className="mt-2 text-gray-600 max-w-xl">
          Dear Esteemed customer — this is our new Blast Off menu pricing. Same
          great quality — enjoy!
        </p>
      </header>

      
      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-4">Categories</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat, idx) => {
            const hasImage = categoryImages[cat.slug];

            return (
              <Link
                key={cat._id}
                href={`/menu/${cat.slug}`}
                className="min-w-[160px] shrink-0 rounded-2xl overflow-hidden shadow-lg relative hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className="relative w-40 h-24">
                  {hasImage ? (
                    <>
                      <ImageWithFallback
                        src={categoryImages[cat.slug]}
                        alt={cat.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 40vw, 160px"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                    </>
                  ) : (
                    
                    <div
                      className={`absolute inset-0 bg-linear-to-br ${
                        categoryColors[idx % categoryColors.length]
                      }`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <svg
                          className="w-16 h-16 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                    </div>
                  )}

                 
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border border-white/50 z-10">
                    <span className="text-white font-bold text-sm">
                      {idx + 1}
                    </span>
                  </div>

                 
                  <div className="absolute inset-0 flex items-end p-3 z-10">
                    <div className="text-white font-semibold text-sm drop-shadow-lg">
                      {cat.name}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

    
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold">Featured</h3>
        </div>

        {featured.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No meals available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featured.map((meal) => (
              <MealCardClient key={meal._id} meal={meal} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
