'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/lib/types';

interface WishlistState {
  productIds: string[];
  products: Record<string, Product>;
  toggle: (product: Product) => void;
  remove: (productId: string) => void;
  has: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      products: {},
      toggle: (product) => {
        const exists = get().productIds.includes(product.id);
        if (exists) {
          set((s) => {
            const products = { ...s.products };
            delete products[product.id];
            return {
              productIds: s.productIds.filter((id) => id !== product.id),
              products,
            };
          });
        } else {
          set((s) => ({
            productIds: [...s.productIds, product.id],
            products: { ...s.products, [product.id]: product },
          }));
        }
      },
      remove: (productId) =>
        set((s) => {
          const products = { ...s.products };
          delete products[productId];
          return {
            productIds: s.productIds.filter((id) => id !== productId),
            products,
          };
        }),
      has: (productId) => get().productIds.includes(productId),
      clear: () => set({ productIds: [], products: {} }),
    }),
    { name: 'stylehub-wishlist' },
  ),
);
