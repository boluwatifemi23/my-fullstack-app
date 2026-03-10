"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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
  removeFromCart: (id: string) => void;
  decreaseQuantity: (id: string) => void;
};

const CartContext = createContext<CartContextShape | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cornerstone-cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
    } finally {
      setMounted(true);
    }
  }, []);

  // Persist cart
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("cornerstone-cart", JSON.stringify(items));
  }, [items, mounted]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  const add = () => {};
  const remove = () => {};

  const clear = () => setItems([]);

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
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  const decreaseQuantity = (id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i._id === id);

      if (!item) return prev;

      if (item.quantity === 1) {
        return prev.filter((i) => i._id !== id);
      }

      return prev.map((i) =>
        i._id === id ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  return (
    <CartContext.Provider
      value={{
        count,
        items,
        add,
        remove,
        clear,
        addToCart,
        removeFromCart,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}

export default CartContext;