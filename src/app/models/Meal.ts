import { Schema, model, models } from "mongoose";

export interface MealType {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
}

const MealSchema = new Schema<MealType>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export default models.Meal || model<MealType>("Meal", MealSchema);
