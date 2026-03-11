import { connectDB } from "@/app/lib/dbConnect";
import Category from "@/app/models/Category";
import Meal, { MealType } from "@/app/models/Meal";
import { LeanCategoryDoc, LeanMealDoc } from "@/app/utils/mongoose-types";
import CategoriesCarousel from "@/app/components/CategoriesCarousel";
import MealCardClient from "@/app/components/MealCardClient";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Menu - Cornerstone Catering Services",
  description: "Explore our authentic Nigerian menu",
};

export const revalidate = 60;

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
    image: cat.image || "",
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
    <main className="min-h-screen bg-gray-950 relative overflow-hidden">
    
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-600/8 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-orange-700/6 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">

      
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-semibold rounded-full mb-4">
            Our Menu
          </span>
          <h1 className="text-4xl font-extrabold text-white">Authentic Nigerian Meals</h1>
          <p className="text-gray-400 mt-2 max-w-xl">
            Dear Esteemed customer — this is our new Blast Off menu pricing. Same great quality — enjoy!
          </p>
        </div>

       
        <section className="mb-16">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-white">Browse by Category</h2>
          </div>
          <CategoriesCarousel categories={categories} />
        </section>

       
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-5">All Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link key={cat._id} href={`/menu/${cat.slug}`}
                className="group bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/30 rounded-2xl p-4 text-center transition-all duration-200">
                <p className="text-white font-semibold text-sm group-hover:text-orange-400 transition-colors">{cat.name}</p>
                <p className="text-gray-500 text-xs mt-1">View meals →</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-white">Featured Meals</h2>
          </div>
          {featured.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No meals available yet. Check back soon!</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {featured.map((meal) => (
                <MealCardClient key={meal._id} meal={meal} />
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}