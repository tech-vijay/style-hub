'use client';

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus,
  Check,
  ThumbsUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductCard } from '@/components/product/product-card';
import { getProductBySlug, getProductReviews, getRelatedProducts } from '@/lib/data';
import type { Product, Review } from '@/lib/types';
import { formatPrice, calculateDiscount } from '@/lib/format';
import { useCartStore } from '@/lib/stores/cart-store';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => product ? s.has(product.id) : false);

  useEffect(() => {
    setLoading(true);
    setSelectedImage(0);
    setSelectedSize(null);
    setSelectedColor(null);
    setQuantity(1);
    getProductBySlug(slug)
      .then((p) => {
        setProduct(p);
        if (p) {
          getProductReviews(p.id).then(setReviews).catch(() => {});
          getRelatedProducts(p.id, p.category_id, p.brand_id).then(setRelated).catch(() => {});
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.variants && product.variants.length > 0 && (!selectedSize || !selectedColor)) {
      toast.error('Please select a size and color');
      return;
    }
    addItem(product, quantity, selectedSize, selectedColor);
    toast.success(`${product.name} added to cart`);
    setOpen(true);
  };

  const handleWishlist = () => {
    if (!product) return;
    toggleWishlist(product);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Product not found</h1>
        <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
        <Button asChild>
          <a href="/shop">Back to Shop</a>
        </Button>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.compare_at_price);
  const allSizes = product.variants?.map((v) => v.size) || [];
  const sizes = Array.from(new Set(allSizes));
  const allColors = product.variants?.map((v) => v.color) || [];
  const colors = Array.from(new Set(allColors));
  const colorHexMap: Record<string, string> = {};
  product.variants?.forEach((v) => {
    if (v.color && v.color_hex && !colorHexMap[v.color]) {
      colorHexMap[v.color] = v.color_hex;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <a href="/" className="hover:text-primary">Home</a>
        <ChevronRight className="h-3 w-3" />
        <a href="/shop" className="hover:text-primary">Shop</a>
        {product.category && (
          <>
            <ChevronRight className="h-3 w-3" />
            <a href={`/category/${product.category.slug}`} className="hover:text-primary">
              {product.category.name}
            </a>
          </>
        )}
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square rounded-2xl overflow-hidden bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </motion.div>
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-20 w-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === i ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            {product.brand && (
              <p className="text-sm font-medium text-primary uppercase tracking-wide mb-1">
                {product.brand.name}
              </p>
            )}
            <h1 className="font-display text-2xl sm:text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-muted'
                    }`}
                  />
                ))}
                <span className="text-sm font-medium ml-1">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating_count} reviews
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
                <Badge variant="destructive">{discount}% OFF</Badge>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {/* Variants */}
          {sizes.length > 0 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-10 min-w-10 px-3 rounded-md border text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Color</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center gap-2 px-3 h-10 rounded-md border text-sm transition-all ${
                        selectedColor === color
                          ? 'border-primary ring-1 ring-primary'
                          : 'hover:border-primary'
                      }`}
                    >
                      {colorHexMap[color] && (
                        <span
                          className="h-4 w-4 rounded-full border"
                          style={{ backgroundColor: colorHexMap[color] }}
                        />
                      )}
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quantity & Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium">Quantity</p>
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddToCart} size="lg" className="flex-1">
                <ShoppingBag className="h-5 w-5 mr-2" /> Add to Cart
              </Button>
              <Button
                onClick={handleWishlist}
                variant="outline"
                size="lg"
                className={inWishlist ? 'text-red-500 border-red-500' : ''}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="flex flex-col items-center text-center gap-1">
              <Truck className="h-5 w-5 text-primary" />
              <p className="text-xs">Free Shipping</p>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <RefreshCw className="h-5 w-5 text-primary" />
              <p className="text-xs">30-Day Returns</p>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="text-xs">Secure Payment</p>
            </div>
          </div>

          {/* Specs */}
          {(product.material || product.fit || product.sleeve || product.occasion) && (
            <div className="space-y-2 pt-4 border-t">
              <p className="font-semibold text-sm">Specifications</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {product.material && (
                  <div><span className="text-muted-foreground">Material:</span> {product.material}</div>
                )}
                {product.fit && (
                  <div><span className="text-muted-foreground">Fit:</span> {product.fit}</div>
                )}
                {product.sleeve && (
                  <div><span className="text-muted-foreground">Sleeve:</span> {product.sleeve}</div>
                )}
                {product.occasion && (
                  <div><span className="text-muted-foreground">Occasion:</span> {product.occasion}</div>
                )}
                {product.sku && (
                  <div><span className="text-muted-foreground">SKU:</span> {product.sku}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs: Description, Reviews */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none text-muted-foreground">
              <p>{product.description}</p>
              <p>
                Crafted with attention to detail and designed for the modern man, the {product.name} combines premium materials with contemporary style. 
                {product.brand ? ` From ${product.brand.name}, ` : ''}this piece is built to last and designed to impress.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            {reviews.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                          {review.author_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{review.author_name}</p>
                          {review.verified && (
                            <Badge variant="secondary" className="text-[10px] gap-1">
                              <Check className="h-2.5 w-2.5" /> Verified Purchase
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
                    {review.body && <p className="text-sm text-muted-foreground">{review.body}</p>}
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-primary">
                        <ThumbsUp className="h-3 w-3" /> Helpful ({review.helpful_count})
                      </button>
                      <span>{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="shipping" className="mt-6">
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <Truck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Free Shipping</p>
                  <p>Free standard shipping on all orders above ₹999. Express delivery available at checkout.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <RefreshCw className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Easy 30-Day Returns</p>
                  <p>Not satisfied? Return any item within 30 days for a full refund. Items must be unworn with tags attached.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Secure Payment</p>
                  <p>All transactions are encrypted and secure. We support UPI, credit/debit cards, net banking, and cash on delivery.</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
