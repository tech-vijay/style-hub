export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  brand_id: string | null;
  price: number;
  compare_at_price: number | null;
  rating: number;
  rating_count: number;
  stock: number;
  sku: string | null;
  barcode: string | null;
  material: string | null;
  fit: string | null;
  sleeve: string | null;
  occasion: string | null;
  is_featured: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  is_flash_sale: boolean;
  flash_sale_ends_at: string | null;
  images: string[];
  created_at: string;
  category?: Category;
  brand?: Brand;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color: string;
  color_hex: string | null;
  stock: number;
  sku: string | null;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string | null;
  image_url: string | null;
  verified: boolean;
  helpful_count: number;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'flat' | 'bogo' | 'free_shipping';
  value: number;
  min_order: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  active: boolean;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  size: string | null;
  color: string | null;
  saved_for_later: boolean;
  created_at: string;
  product?: Product;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
  type: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  payment_method: string | null;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  address_id: string | null;
  coupon_code: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  address?: Address | null;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number;
}

export type OrderStatus = 'ordered' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  ordered: 'Ordered',
  packed: 'Packed',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
};

export const ORDER_STATUS_STEPS: OrderStatus[] = ['ordered', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
