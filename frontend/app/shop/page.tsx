'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ProductCard } from '@/components/product/product-card';
import { getProducts, getCategories, getBrands } from '@/lib/data';
import type { Product, Category, Brand } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const SIZES = ['S', 'M', 'L', 'XL', '30', '32', '34', '7', '8', '9'];
const COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Blue', hex: '#1E3A8A' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Grey', hex: '#808080' },
  { name: 'Brown', hex: '#5C3317' },
  { name: 'Beige', hex: '#E8DCC8' },
  { name: 'Olive', hex: '#556B2F' },
  { name: 'Indigo', hex: '#3F51B5' },
  { name: 'Khaki', hex: '#C3B091' },
  { name: 'Charcoal', hex: '#36454F' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'discount', label: 'Biggest Discount' },
];

export default function ShopPage() {
  const params = useSearchParams();
  const router = useRouter();

  const filter = params.get('filter');
  const search = params.get('search') || undefined;
  const brandId = params.get('brand') || undefined;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(brandId || null);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sort, setSort] = useState<string>('newest');

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getBrands().then(setBrands).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const filters: Parameters<typeof getProducts>[0] = {
      search,
      sort: sort as 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'discount',
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      minRating,
      category: selectedCategory || undefined,
      brand: selectedBrand || undefined,
      size: selectedSizes[0],
      color: selectedColors[0],
    };
    if (filter === 'new') filters.isNew = true;
    if (filter === 'featured') filters.featured = true;
    if (filter === 'bestseller') filters.bestseller = true;
    if (filter === 'sale') filters.flashSale = true;

    getProducts(filters)
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search, sort, priceRange, minRating, selectedCategory, selectedBrand, selectedSizes, selectedColors, filter]);

  const pageTitle = useMemo(() => {
    if (search) return `Search: "${search}"`;
    if (filter === 'new') return 'New Arrivals';
    if (filter === 'featured') return 'Featured Products';
    if (filter === 'bestseller') return 'Best Sellers';
    if (filter === 'sale') return 'Flash Sale';
    return 'All Products';
  }, [search, filter]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color],
    );
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, 10000]);
    setMinRating(0);
    setSort('newest');
  };

  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (minRating > 0 ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${cat.id}`}
                checked={selectedCategory === cat.id}
                onCheckedChange={(checked) =>
                  setSelectedCategory(checked ? cat.id : null)
                }
              />
              <Label htmlFor={`cat-${cat.id}`} className="text-sm cursor-pointer">
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brand */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Brand</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.id}`}
                checked={selectedBrand === brand.id}
                onCheckedChange={(checked) =>
                  setSelectedBrand(checked ? brand.id : null)
                }
              />
              <Label htmlFor={`brand-${brand.id}`} className="text-sm cursor-pointer">
                {brand.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Price Range</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="h-9"
          />
          <span className="text-muted-foreground">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="h-9"
          />
        </div>
      </div>

      <Separator />

      {/* Size */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`h-9 min-w-9 px-2 rounded-md border text-sm font-medium transition-colors ${
                selectedSizes.includes(size)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'hover:border-primary'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Color */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Color</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              title={color.name}
              className={`h-8 w-8 rounded-full border-2 transition-all ${
                selectedColors.includes(color.name)
                  ? 'ring-2 ring-primary ring-offset-2'
                  : 'border-border'
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-sm mb-3">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <div key={r} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${r}`}
                checked={minRating === r}
                onCheckedChange={(checked) => setMinRating(checked ? r : 0)}
              />
              <Label htmlFor={`rating-${r}`} className="text-sm cursor-pointer">
                {r}★ & above
              </Label>
            </div>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear All Filters ({activeFilterCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? 'Loading...' : `${products.length} products found`}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Filters</h2>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              )}
            </div>
            <FilterContent />
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
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
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg font-medium mb-2">No products found</p>
              <p className="text-sm text-muted-foreground mb-6">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
