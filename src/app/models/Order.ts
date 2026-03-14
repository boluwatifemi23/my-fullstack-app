import { Schema, model, models } from "mongoose";

export interface OrderItem {
  mealId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  selectedVariant?: { label: string; price: number };
}

export interface IOrder {
  _id: string;
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  specialInstructions?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  paymentStatus: "pending" | "pending_verification" | "paid" | "failed";
  deliveryStatus: "placed" | "preparing" | "out-for-delivery" | "delivered";
  stripePaymentIntentId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const OrderItemSchema = new Schema<OrderItem>({
  mealId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
  selectedVariant: {
    label: { type: String },
    price: { type: Number },
  },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    specialInstructions: { type: String },
    deliveryDate: { type: String },
    deliveryTime: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "pending_verification", "paid", "failed"],
      default: "pending",
    },
    deliveryStatus: {
      type: String,
      enum: ["placed", "preparing", "out-for-delivery", "delivered"],
      default: "placed",
    },
    stripePaymentIntentId: { type: String },
  },
  { timestamps: true }
);

export default models.Order || model<IOrder>("Order", OrderSchema);