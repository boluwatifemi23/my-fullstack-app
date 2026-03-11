import MealCardClient from "@/app/components/MealCardClient";
import { connectDB } from "@/app/lib/dbConnect";
import Category from "@/app/models/Category";
import Meal, { MealType } from "@/app/models/Meal";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeanCategoryDoc, LeanMealDoc } from "@/app/utils/mongoose-types";

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
  }));

  return { category, meals };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const data = await getCategoryData(slug);

  if (!data) notFound();

  const { category, meals } = data;

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
        <h1 className="text-3xl font-bold text-gray-900 mt-2">{category.name}</h1>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No meals found in this category.</p>
          <Link href="/menu" className="text-orange-600 hover:text-orange-700 underline">
            Browse other categories
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <MealCardClient key={meal._id} meal={meal} />
          ))}
        </div>
      )}
    </section>
  );
}