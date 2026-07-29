'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/stores/cart-store';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { formatPrice, calculateDiscount } from '@/lib/format';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.has(product.id));

  const discount = calculateDiscount(product.price, product.compare_at_price);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, product.variants?.[0]?.size || null, product.variants?.[0]?.color || null);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.is_new && (
              <Badge className="bg-primary text-primary-foreground text-[10px]">NEW</Badge>
            )}
            {discount > 0 && (
              <Badge variant="destructive" className="text-[10px]">-{discount}%</Badge>
            )}
            {product.is_bestseller && (
              <Badge className="bg-amber-500 text-white text-[10px]">BESTSELLER</Badge>
            )}
            {product.is_flash_sale && (
              <Badge className="bg-red-600 text-white text-[10px] animate-pulse">FLASH SALE</Badge>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute top-3 right-3 h-9 w-9 rounded-full flex items-center justify-center transition-all',
              inWishlist
                ? 'bg-red-500 text-white'
                : 'bg-white/80 backdrop-blur-sm text-foreground hover:bg-white',
            )}
            aria-label="Toggle wishlist"
          >
            <Heart className={cn('h-4 w-4', inWishlist && 'fill-current')} />
          </button>

          {/* Quick actions */}
          <div className="absolute bottom-0 left-0 right-0 p-3 flex gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button
              onClick={handleQuickAdd}
              className="flex-1"
              size="sm"
            >
              <ShoppingBag className="h-4 w-4 mr-1" /> Add to Cart
            </Button>
            <Button
              asChild
              variant="secondary"
              size="sm"
              className="bg-white/90 backdrop-blur-sm"
            >
              <Link href={`/product/${product.slug}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          {product.brand && (
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              {product.brand.name}
            </p>
          )}
          <h3 className="font-medium text-sm leading-tight line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-muted-foreground">({product.rating_count})</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-base">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
