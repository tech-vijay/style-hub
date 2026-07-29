'use client';

import { useEffect, useState, use } from 'react';
import { getProducts, getCategories } from '@/lib/data';
import type { Product, Category } from '@/lib/types';
import { ProductCard } from '@/components/product/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight } from 'lucide-react';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCategories().then((cats) => {
      const cat = cats.find((c) => c.slug === slug);
      setCategory(cat || null);
      if (cat) {
        getProducts({ category: cat.id }).then(setProducts).catch(() => {});
      }
      setLoading(false);
    });
  }, [slug]);

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <a href="/" className="hover:text-primary">Home</a>
        <ChevronRight className="h-3 w-3" />
        <a href="/shop" className="hover:text-primary">Shop</a>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium capitalize">{slug}</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold capitalize">
          {category?.name || slug}
        </h1>
        {category?.description && (
          <p className="text-muted-foreground mt-1">{category.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          {loading ? 'Loading...' : `${products.length} products`}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg font-medium mb-2">No products in this category yet</p>
          <a href="/shop" className="text-primary hover:underline">Browse all products</a>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
