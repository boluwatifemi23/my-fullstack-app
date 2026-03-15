import MealCardClient from "@/app/components/MealCardClient";
import { connectDB } from "@/app/lib/dbConnect";
import Category from "@/app/models/Category";
import Meal, { MealType } from "@/app/models/Meal";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeanCategoryDoc, LeanMealDoc } from "@/app/utils/mongoose-types";
import { Clock } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  await connectDB();
  const cat = (await Category.findOne({ slug })
    .lean()
    .exec()) as unknown as LeanCategoryDoc | null;

  return {
    title: cat ? `${cat.name} - Menu` : "Menu Category",
    description: cat ? `Browse our ${cat.name} menu` : "Menu category",
  };
}

async function getCategoryData(slug: string) {
  await connectDB();

  const categoryDoc = (await Category.findOne({ slug })
    .lean()
    .exec()) as unknown as LeanCategoryDoc | null;

  if (!categoryDoc) return null;

  const category = {
    _id: categoryDoc._id.toString(),
    name: categoryDoc.name,
    slug: categoryDoc.slug,
  };

  const mealsRaw = (await Meal.find({ category: slug })
    .sort({ name: 1 })
    .lean()
    .exec()) as unknown as LeanMealDoc[];

  const meals: MealType[] = mealsRaw.map((meal) => ({
    _id: meal._id.toString(),
    name: meal.name,
    price: meal.price,
    category: meal.category,
    ...(meal.image && { image: meal.image }),
    ...(meal.description && { description: meal.description }),
    ...(meal.variants && { variants: meal.variants }),
  }));

  return { category, meals };
}


const COMING_SOON_SLUGS = ["special-delicacy", "special-delicacies", "specials", "special"];

function isComingSoon(slug: string): boolean {
  return COMING_SOON_SLUGS.some(s => slug.toLowerCase().includes("special"));
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCategoryData(slug);

  if (!data) notFound();

  const { category, meals } = data;
  const comingSoon = isComingSoon(slug);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-6">
        <Link
          href="/menu"
          className="text-orange-600 hover:text-orange-700 mb-4 inline-flex items-center gap-1 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Menu
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-3xl font-bold text-white">{category.name}</h1>
          {comingSoon && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold rounded-full">
              <Clock size={12} /> Coming Soon
            </span>
          )}
        </div>
      </div>

     
      {comingSoon && (
        <div className="mb-8 rounded-2xl overflow-hidden border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-amber-500/5 p-8 text-center">
          <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock size={32} className="text-orange-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">Coming Soon!</h2>
          <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
            Our Special Delicacy menu is currently being prepared. We&apos;re working on bringing you the most authentic and exclusive Nigerian delicacies. Stay tuned!
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/menu"
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all text-sm"
            >
              Browse Other Meals
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi! I'd like to know when the Special Delicacy menu will be available.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/30 text-[#25D366] font-semibold rounded-xl transition-all text-sm"
            >
              Get Notified via WhatsApp
            </a>
          </div>
        </div>
      )}

     
      {meals.length === 0 && !comingSoon ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No meals found in this category.</p>
          <Link href="/menu" className="text-orange-600 hover:text-orange-700 underline">
            Browse other categories
          </Link>
        </div>
      ) : meals.length > 0 ? (
        <div>
          {comingSoon && (
            <p className="text-gray-500 text-sm mb-4 italic">
              Preview — these items are not yet available for ordering.
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <div key={meal._id} className={`relative ${comingSoon ? "pointer-events-none" : ""}`}>
                {comingSoon && (
                  <div className="absolute inset-0 z-10 rounded-2xl bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="flex items-center gap-1.5 bg-orange-500/90 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                      <Clock size={12} /> Coming Soon
                    </span>
                  </div>
                )}
                <MealCardClient meal={meal} />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}