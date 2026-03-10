import { Schema, model, models } from "mongoose";

export interface CategoryType {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  order?: number;
}

const CategorySchema = new Schema<CategoryType>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    description: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default models.Category || model<CategoryType>("Category", CategorySchema);