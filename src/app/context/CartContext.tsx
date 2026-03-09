// "use client";

// import { createContext, useContext, useState, ReactNode } from "react";
// import { MealType } from "@/app/utils/meal";

// export interface CartItem extends MealType {
//   quantity: number;
// }

// export interface CartContextShape {
//   items: CartItem[];
//   count: number;
//   addToCart: (meal: MealType) => void;
//   removeFromCart: (id: string) => void;
//   clearCart: () => void;
// }

// const CartContext = createContext<CartContextShape | undefined>(undefined);

// export function CartProvider({ children }: { children: ReactNode }) {
//   const [items, setItems] = useState<CartItem[]>([]);

//   const addToCart = (meal: MealType) => {
//     setItems((prev) => {
//       const exists = prev.find((i) => i._id === meal._id);

//       if (exists) {
//         return prev.map((i) =>
//           i._id === meal._id ? { ...i, quantity: i.quantity + 1 } : i
//         );
//       }
//       return [...prev, { ...meal, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (id: string) => {
//     setItems((prev) => prev.filter((i) => i._id !== id));
//   };

//   const clearCart = () => setItems([]);

//   const count = items.reduce((sum, item) => sum + item.quantity, 0);

//   return (
//     <CartContext.Provider
//       value={{ items, count, addToCart, removeFromCart, clearCart }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export const useCart = () => {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error("useCart must be used inside CartProvider");
//   return ctx;
// };

// context/CartContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

type Meal = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
  description?: string;
};

type CartItem = Meal & { quantity: number };

type CartContextShape = {
  count: number;
  items: CartItem[];
  add: (n?: number) => void;
  remove: (n?: number) => void;
  clear: () => void;
  addToCart: (meal: Meal) => void;
};

const CartContext = createContext<CartContextShape | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState<number>(0);
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (n = 1) => setCount((c) => Math.max(0, c + n));
  const remove = (n = 1) => setCount((c) => Math.max(0, c - n));
  const clear = () => {
    setCount(0);
    setItems([]);
  };

  const addToCart = (meal: Meal) => {
    setItems((prev) => {
      const existing = prev.find((item) => item._id === meal._id);
      if (existing) {
        return prev.map((item) =>
          item._id === meal._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...meal, quantity: 1 }];
    });
    setCount((c) => c + 1);
  };

  return (
    <CartContext.Provider value={{ count, items, add, remove, clear, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default CartContext;
