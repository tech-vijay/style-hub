'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
import { getProducts } from '@/lib/data';
import { timeLeft } from '@/lib/format';
import type { Product } from '@/lib/types';

interface SectionProps {
  title: string;
  subtitle?: string;
  href?: string;
  children: React.ReactNode;
}

export function ProductSection({ title, subtitle, href, children }: SectionProps) {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          {subtitle && (
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">
              {subtitle}
            </p>
          )}
          <h2 className="font-display text-2xl sm:text-3xl font-bold">{title}</h2>
        </div>
        {href && (
          <Button asChild variant="ghost" className="shrink-0">
            <Link href={href}>
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
      {children}
    </section>
  );
}

export function TrendingCollection() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    getProducts({ featured: true, limit: 8 }).then(setProducts).catch(() => {});
  }, []);

  return (
    <ProductSection title="Trending Collection" subtitle="What's Hot" href="/shop?filter=featured">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </ProductSection>
  );
}

export function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    getProducts({ isNew: true, sort: 'newest', limit: 8 }).then(setProducts).catch(() => {});
  }, []);

  return (
    <ProductSection title="New Arrivals" subtitle="Fresh Drops" href="/shop?filter=new">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </ProductSection>
  );
}

export function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    getProducts({ bestseller: true, sort: 'rating', limit: 8 }).then(setProducts).catch(() => {});
  }, []);

  return (
    <ProductSection title="Best Sellers" subtitle="Customer Favorites" href="/shop?filter=bestseller">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </ProductSection>
  );
}

export function FlashSale() {
  const [products, setProducts] = useState<Product[]>([]);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0, done: false });

  useEffect(() => {
    getProducts({ flashSale: true, limit: 4 }).then(setProducts).catch(() => {});
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    const tick = () => {
      const earliest = products
        .map((p) => p.flash_sale_ends_at)
        .filter(Boolean)
        .sort()[0];
      setTime(timeLeft(earliest || null));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [products]);

  if (products.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold">Flash Sale</h2>
              <p className="text-sm text-muted-foreground">Limited time deals — grab them before they're gone!</p>
            </div>
          </div>
          {!time.done && (
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-500" />
              <div className="flex gap-1.5">
                {[
                  { label: 'H', value: time.hours },
                  { label: 'M', value: time.minutes },
                  { label: 'S', value: time.seconds },
                ].map((t) => (
                  <div key={t.label} className="bg-foreground text-background rounded-md px-2 py-1 text-center min-w-[2.5rem]">
                    <div className="text-lg font-bold tabular-nums leading-none">
                      {String(t.value).padStart(2, '0')}
                    </div>
                    <div className="text-[9px] uppercase opacity-70">{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    getProducts({ sort: 'rating', limit: 4 }).then(setProducts).catch(() => {});
  }, []);

  return (
    <ProductSection title="Featured Products" subtitle="Editor's Pick" href="/shop">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </ProductSection>
  );
}
