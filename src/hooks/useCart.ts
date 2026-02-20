import { create } from "zustand";
import type { CartItem, Product, ProductConversion } from "@/type/product";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, conversion: ProductConversion) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const useCart = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product, conversion) => {
    const { items } = get();
    const existingIndex = items.findIndex(
      (item) => item.product.id === product.id,
    );

    const price =
      conversion.productSellPrices.length > 0
        ? conversion.productSellPrices[0].price
        : 0;

    if (existingIndex > -1) {
      const updated = [...items];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + 1,
      };
      set({ items: updated });
    } else {
      set({
        items: [
          ...items,
          { product, quantity: 1, selectedConversion: conversion, price },
        ],
      });
    }
  },

  removeItem: (productId) => {
    const { items } = get();
    const existingIndex = items.findIndex(
      (item) => item.product.id === productId,
    );

    if (existingIndex > -1) {
      const updated = [...items];
      if (updated[existingIndex].quantity > 1) {
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity - 1,
        };
        set({ items: updated });
      } else {
        set({ items: items.filter((item) => item.product.id !== productId) });
      }
    }
  },

  updateQuantity: (productId, quantity) => {
    const { items } = get();
    const existingIndex = items.findIndex(
      (item) => item.product.id === productId,
    );

    if (existingIndex > -1) {
      if (quantity <= 0) {
        set({ items: items.filter((item) => item.product.id !== productId) });
      } else {
        const updated = [...items];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: quantity,
        };
        set({ items: updated });
      }
    }
  },

  clearCart: () => set({ items: [] }),

  getItemQuantity: (productId) => {
    const item = get().items.find((item) => item.product.id === productId);
    return item?.quantity ?? 0;
  },

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  },
}));

export default useCart;
