import { supabase } from '@/lib/supabase';
import type { Product, Category, Brand, ProductVariant, Review, Coupon } from '@/lib/types';

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  if (error) throw error;
  return data || [];
}

export async function getBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('name');
  if (error) throw error;
  return data || [];
}

export async function getProducts(filters?: {
  category?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  minRating?: number;
  sort?: 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'discount';
  limit?: number;
  featured?: boolean;
  isNew?: boolean;
  bestseller?: boolean;
  flashSale?: boolean;
}): Promise<Product[]> {
  let query = supabase.from('products').select(`
    *,
    category:categories(*),
    brand:brands(*),
    variants:product_variants(*)
  `);

  if (filters?.category) {
    query = query.eq('category_id', filters.category);
  }
  if (filters?.brand) {
    query = query.eq('brand_id', filters.brand);
  }
  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  if (filters?.minPrice !== undefined) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters?.maxPrice !== undefined) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters?.minRating !== undefined) {
    query = query.gte('rating', filters.minRating);
  }
  if (filters?.featured) {
    query = query.eq('is_featured', true);
  }
  if (filters?.isNew) {
    query = query.eq('is_new', true);
  }
  if (filters?.bestseller) {
    query = query.eq('is_bestseller', true);
  }
  if (filters?.flashSale) {
    query = query.eq('is_flash_sale', true);
  }

  switch (filters?.sort) {
    case 'price-asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('price', { ascending: false });
      break;
    case 'rating':
      query = query.order('rating', { ascending: false });
      break;
    case 'discount':
      query = query.order('compare_at_price', { ascending: false, nullsFirst: false });
      break;
    case 'newest':
    default:
      query = query.order('created_at', { ascending: false });
      break;
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;

  let products = (data || []) as Product[];

  if (filters?.size) {
    products = products.filter((p) =>
      p.variants?.some((v) => v.size === filters.size),
    );
  }
  if (filters?.color) {
    products = products.filter((p) =>
      p.variants?.some((v) => v.color.toLowerCase() === filters.color!.toLowerCase()),
    );
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      brand:brands(*),
      variants:product_variants(*)
    `)
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as Product | null;
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  brandId: string | null,
): Promise<Product[]> {
  if (!categoryId && !brandId) return [];
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      brand:brands(*),
      variants:product_variants(*)
    `)
    .neq('id', productId)
    .or(`category_id.eq.${categoryId},brand_id.eq.${brandId}`)
    .limit(8);
  if (error) throw error;
  return (data || []) as Product[];
}

export async function validateCoupon(code: string, subtotal: number): Promise<{
  valid: boolean;
  coupon?: Coupon;
  discount?: number;
  message?: string;
}> {
  const { data, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('active', true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return { valid: false, message: 'Invalid coupon code' };

  const coupon = data as Coupon;
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { valid: false, message: 'Coupon has expired' };
  }
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
    return { valid: false, message: 'Coupon usage limit reached' };
  }
  if (subtotal < coupon.min_order) {
    return {
      valid: false,
      message: `Minimum order of ₹${coupon.min_order} required`,
    };
  }

  let discount = 0;
  switch (coupon.type) {
    case 'percentage':
      discount = Math.round((subtotal * coupon.value) / 100);
      break;
    case 'flat':
      discount = coupon.value;
      break;
    case 'bogo':
      discount = Math.round(subtotal * 0.5);
      break;
    case 'free_shipping':
      discount = 0;
      break;
  }

  return { valid: true, coupon, discount };
}
