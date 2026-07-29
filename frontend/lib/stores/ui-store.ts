'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  searchHistory: string[];
  addSearchHistory: (term: string) => void;
  clearSearchHistory: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      searchHistory: [],
      addSearchHistory: (term) => {
        const trimmed = term.trim();
        if (!trimmed) return;
        const existing = get().searchHistory.filter((t) => t.toLowerCase() !== trimmed.toLowerCase());
        set({ searchHistory: [trimmed, ...existing].slice(0, 8) });
      },
      clearSearchHistory: () => set({ searchHistory: [] }),
    }),
    { name: 'stylehub-ui' },
  ),
);
