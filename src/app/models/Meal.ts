import { Schema, model, models } from "mongoose";

export interface MealVariant {
  label: string;
  price: number;
}

export interface MealType {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  variants?: MealVariant[];
  featured?: boolean;
}

const VariantSchema = new Schema<MealVariant>({
  label: { type: String, required: true },
  price: { type: Number, required: true },
}, { _id: false });

const MealSchema = new Schema<MealType>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    variants: { type: [VariantSchema], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Meal || model<MealType>("Meal", MealSchema);