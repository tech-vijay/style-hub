'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { getCategories, getBrands } from '@/lib/data';
import type { Category, Brand } from '@/lib/types';

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">
          Explore
        </p>
        <h2 className="font-display text-2xl sm:text-3xl font-bold">Shop by Category</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link href={`/category/${cat.slug}`} className="group block">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-muted">
                {cat.image_url && (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  </>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-lg">{cat.name}</h3>
                  <p className="text-white/70 text-xs flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Shop now <ArrowRight className="h-3 w-3" />
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function BrandsSection() {
  const [brands, setBrands] = useState<Brand[]>([]);
  useEffect(() => {
    getBrands().then(setBrands).catch(() => {});
  }, []);

  return (
    <section className="bg-muted/30 border-y">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">
            Trusted Quality
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">Featured Brands</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/shop?brand=${brand.id}`}
              className="group flex flex-col items-center justify-center p-6 rounded-xl bg-background border hover:shadow-md transition-all"
            >
              <span className="font-display text-xl font-bold text-center group-hover:text-primary transition-colors">
                {brand.name}
              </span>
              {brand.description && (
                <span className="text-xs text-muted-foreground mt-1 text-center">
                  {brand.description}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
