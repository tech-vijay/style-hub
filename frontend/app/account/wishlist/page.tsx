'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/product-card';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import type { Product } from '@/lib/types';

export default function WishlistPage() {
  const { products, productIds } = useWishlistStore();
  const wishlistProducts = Object.values(products) as Product[];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">My Wishlist</h1>

      {wishlistProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="font-medium text-lg mb-1">Your wishlist is empty</p>
            <p className="text-sm text-muted-foreground mb-6">
              Save items you love by tapping the heart icon
            </p>
            <Button asChild>
              <Link href="/shop">Discover Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {wishlistProducts.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
