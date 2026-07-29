'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Wallet,
  Banknote,
  Tag,
  Check,
  Gift,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useCartStore } from '@/lib/stores/cart-store';
import { formatPrice } from '@/lib/format';
import { supabase } from '@/lib/supabase';
import { validateCoupon } from '@/lib/data';
import type { Address } from '@/lib/types';
import { toast } from 'sonner';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', desc: 'Pay via UPI app', icon: Wallet },
  { id: 'card', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'netbanking', label: 'Net Banking', desc: 'All major banks', icon: CreditCard },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: Banknote },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, couponCode, setCoupon, giftWrap, setGiftWrap, clearCart } = useCartStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);

  const activeItems = items.filter((i) => !i.savedForLater);
  const total = subtotal();
  const couponDiscount = appliedCoupon?.discount || 0;
  const giftWrapFee = giftWrap ? 49 : 0;
  const shipping = total >= 999 ? 0 : 99;
  const tax = Math.round(total * 0.05);
  const grandTotal = total - couponDiscount + shipping + tax + giftWrapFee;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({ id: data.user.id });
        supabase
          .from('addresses')
          .select('*')
          .eq('user_id', data.user.id)
          .order('is_default', { ascending: false })
          .then(({ data: addrData }) => {
            if (addrData) {
              setAddresses(addrData as Address[]);
              const defaultAddr = addrData.find((a) => a.is_default) || addrData[0];
              if (defaultAddr) setSelectedAddress(defaultAddr.id);
            }
          });
      }
    });
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const result = await validateCoupon(couponInput, total);
      if (result.valid && result.coupon) {
        setAppliedCoupon({ code: result.coupon.code, discount: result.discount || 0 });
        setCoupon(result.coupon.code);
        toast.success(`Coupon applied! You saved ${formatPrice(result.discount || 0)}`);
      } else {
        toast.error(result.message || 'Invalid coupon');
      }
    } catch {
      toast.error('Failed to validate coupon');
    }
    setCouponLoading(false);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      router.push('/auth/login');
      return;
    }
    if (!selectedAddress && addresses.length > 0) {
      toast.error('Please select a delivery address');
      return;
    }
    if (activeItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setPlacing(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/place-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.session?.access_token}`,
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          },
          body: JSON.stringify({
            items: activeItems,
            address_id: selectedAddress,
            subtotal: total,
            shipping,
            tax,
            discount: couponDiscount,
            total: grandTotal,
            payment_method: paymentMethod,
            coupon_code: appliedCoupon?.code || null,
          }),
        },
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to place order');

      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/account/orders/${result.order_id}`);
    } catch {
      toast.error('Failed to place order. Please try again.');
    }
    setPlacing(false);
  };

  if (activeItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground font-medium">Checkout</span>
      </nav>

      <h1 className="font-display text-2xl sm:text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Address */}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Delivery Address
            </h2>
            {addresses.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-4">No saved addresses found.</p>
                <Button asChild variant="outline">
                  <Link href="/account/addresses">Add Address</Link>
                </Button>
              </div>
            ) : (
              <RadioGroup value={selectedAddress || ''} onValueChange={setSelectedAddress}>
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      htmlFor={addr.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedAddress === addr.id ? 'border-primary ring-1 ring-primary' : ''
                      }`}
                    >
                      <RadioGroupItem value={addr.id} id={addr.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{addr.full_name}</p>
                          {addr.is_default && (
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            )}
          </div>

          {/* Payment */}
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" /> Payment Method
            </h2>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    htmlFor={method.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === method.id ? 'border-primary ring-1 ring-primary' : ''
                    }`}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <method.icon className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{method.label}</p>
                      <p className="text-xs text-muted-foreground">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Gift wrap */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Gift Wrap</p>
                  <p className="text-xs text-muted-foreground">Add premium gift wrapping (+₹49)</p>
                </div>
              </div>
              <Checkbox checked={giftWrap} onCheckedChange={(c) => setGiftWrap(c === true)} />
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border bg-card p-6 space-y-4">
            <h2 className="font-semibold text-lg">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {activeItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="h-16 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.product.images[0]} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[item.size, item.color].filter(Boolean).join(' • ')} • Qty {item.quantity}
                    </p>
                    <p className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Coupon */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="h-9 uppercase"
                />
                <Button variant="outline" size="sm" onClick={handleApplyCoupon} disabled={couponLoading}>
                  {couponLoading ? '...' : 'Apply'}
                </Button>
              </div>
              {appliedCoupon && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="h-4 w-4" /> {appliedCoupon.code} applied
                </div>
              )}
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Tag className="h-3 w-3" /> Try: WELCOME10, FLAT200, FREESHIP
              </p>
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (5%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              {giftWrapFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gift Wrap</span>
                  <span>{formatPrice(giftWrapFee)}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-between items-baseline">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-xl">{formatPrice(grandTotal)}</span>
            </div>

            <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={placing}>
              {placing ? 'Placing Order...' : 'Place Order'}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By placing your order, you agree to our Terms & Conditions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
