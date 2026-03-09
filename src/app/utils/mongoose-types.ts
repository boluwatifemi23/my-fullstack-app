// app/utils/mongoose-types.ts
import { Types } from "mongoose";

export interface LeanCategoryDoc {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface LeanMealDoc {
  _id: Types.ObjectId;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}