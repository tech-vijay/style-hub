'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/types';

export interface LocalCartItem {
  id: string;
  product: Product;
  quantity: number;
  size: string | null;
  color: string | null;
  savedForLater: boolean;
}

interface CartState {
  items: LocalCartItem[];
  isOpen: boolean;
  couponCode: string | null;
  giftWrap: boolean;
  addItem: (product: Product, quantity?: number, size?: string | null, color?: string | null) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  saveForLater: (id: string, saved: boolean) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void;
  setCoupon: (code: string | null) => void;
  setGiftWrap: (wrap: boolean) => void;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      giftWrap: false,
      addItem: (product, quantity = 1, size = null, color = null) => {
        const items = get().items;
        const existing = items.find(
          (i) =>
            i.product.id === product.id &&
            i.size === size &&
            i.color === color &&
            !i.savedForLater,
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i,
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: `${product.id}-${size}-${color}-${Date.now()}`,
                product,
                quantity,
                size,
                color,
                savedForLater: false,
              },
            ],
            isOpen: true,
          });
        }
      },
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i,
          ),
        })),
      saveForLater: (id, saved) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, savedForLater: saved } : i,
          ),
        })),
      clearCart: () => set({ items: [], couponCode: null, giftWrap: false }),
      setOpen: (open) => set({ isOpen: open }),
      setCoupon: (code) => set({ couponCode: code }),
      setGiftWrap: (wrap) => set({ giftWrap: wrap }),
      subtotal: () =>
        get()
          .items.filter((i) => !i.savedForLater)
          .reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      itemCount: () =>
        get()
          .items.filter((i) => !i.savedForLater)
          .reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'stylehub-cart' },
  ),
);
