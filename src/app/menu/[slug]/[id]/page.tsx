import { connectDB } from "@/app/lib/dbConnect";
import Meal from "@/app/models/Meal";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AddToCartButton from "@/app/components/AddToCartButton";

type Props = { params: Promise<{ slug: string; id: string }> };

export default async function MealDetailPage({ params }: Props) {
  const { slug, id } = await params;
  await connectDB();

  const meal = await Meal.findById(id).lean() as {
    _id: { toString(): string };
    name: string;
    price: number;
    description?: string;
    image?: string;
    category: string;
    variants?: { label: string; price: number }[];
  } | null;

  if (!meal) notFound();

  const hasVariants = meal.variants && meal.variants.length > 0;
  const displayPrice = hasVariants
    ? `From $${Math.min(...meal.variants!.map(v => v.price))}`
    : `$${meal.price}`;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href={`/menu/${slug}`}
          className="inline-flex items-center gap-1.5 text-orange-500 hover:text-orange-600 text-sm font-medium mb-6 transition">
          <ChevronLeft size={16} /> Back to {slug.replace(/-/g, " ")}
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-white/10">
          <div className="relative w-full h-72 sm:h-96 bg-gray-100 dark:bg-gray-800">
            {meal.image ? (
              <Image src={meal.image} alt={meal.name} fill className="object-cover" priority
                sizes="(max-width: 768px) 100vw, 800px" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">🍽️</div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{meal.name}</h1>
                <Link href={`/menu/${slug}`}
                  className="inline-block mt-2 px-3 py-1 bg-orange-500/10 text-orange-500 text-xs font-semibold rounded-full capitalize">
                  {slug.replace(/-/g, " ")}
                </Link>
              </div>
              <span className="text-2xl font-extrabold text-orange-500">{displayPrice}</span>
            </div>

            {meal.description && (
              <p className="mt-5 text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                {meal.description}
              </p>
            )}

            <div className="mt-8">
              <AddToCartButton meal={{
                _id: meal._id.toString(),
                name: meal.name,
                price: meal.price,
                category: meal.category,
                image: meal.image,
                description: meal.description,
                variants: meal.variants ?? [],
              }} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}