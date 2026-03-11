"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CartVariant = { label: string; price: number };

type Meal = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
  description?: string;
  variants?: CartVariant[];
};

export type CartItem = Meal & {
  quantity: number;
  selectedVariant?: CartVariant;
  cartKey: string; // unique key: _id + variant label
};

type CartContextShape = {
  count: number;
  items: CartItem[];
  add: (n?: number) => void;
  remove: (n?: number) => void;
  clear: () => void;
  addToCart: (meal: Meal, variant?: CartVariant) => void;
  removeFromCart: (cartKey: string) => void;
  decreaseQuantity: (cartKey: string) => void;
};

const CartContext = createContext<CartContextShape | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cornerstone-cart");
      if (saved) setItems(JSON.parse(saved));
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    } finally {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("cornerstone-cart", JSON.stringify(items));
  }, [items, mounted]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const add = () => {};
  const remove = () => {};
  const clear = () => setItems([]);

  const addToCart = (meal: Meal, variant?: CartVariant) => {
    const selectedPrice = variant ? variant.price : meal.price;
    const cartKey = variant ? `${meal._id}-${variant.label}` : meal._id;

    setItems((prev) => {
      const existing = prev.find((item) => item.cartKey === cartKey);
      if (existing) {
        return prev.map((item) =>
          item.cartKey === cartKey
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        ...meal,
        price: selectedPrice,
        selectedVariant: variant,
        cartKey,
        quantity: 1,
      }];
    });
  };

  const removeFromCart = (cartKey: string) => {
    setItems((prev) => prev.filter((item) => item.cartKey !== cartKey));
  };

  const decreaseQuantity = (cartKey: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.cartKey === cartKey);
      if (!item) return prev;
      if (item.quantity === 1) return prev.filter((i) => i.cartKey !== cartKey);
      return prev.map((i) => i.cartKey === cartKey ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  return (
    <CartContext.Provider value={{ count, items, add, remove, clear, addToCart, removeFromCart, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}

export default CartContext;