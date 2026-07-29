'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/lib/stores/cart-store';
import { formatPrice } from '@/lib/format';
import { useEffect, useState } from 'react';

export function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, updateQuantity, subtotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const activeItems = items.filter((i) => !i.savedForLater);
  const total = subtotal();
  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/50 z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="font-semibold text-lg">
                  Cart {activeItems.length > 0 && `(${activeItems.length})`}
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {activeItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
                <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-lg">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add some products to get started
                  </p>
                </div>
                <Button asChild onClick={() => setOpen(false)}>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            ) : (
              <>
                {/* Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {activeItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="h-24 w-20 rounded-lg overflow-hidden bg-muted shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm leading-tight truncate">
                          {item.product.name}
                        </h3>
                        {(item.size || item.color) && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {[item.size, item.color].filter(Boolean).join(' • ')}
                          </p>
                        )}
                        <p className="font-semibold text-sm mt-1">{formatPrice(item.product.price)}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-primary bg-primary/5 rounded-md p-2 flex items-center gap-1.5">
                      <Tag className="h-3 w-3" />
                      Add {formatPrice(999 - total)} more for free shipping
                    </p>
                  )}
                  <Separator />
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">{formatPrice(grandTotal)}</span>
                  </div>
                  <Button asChild className="w-full" size="lg" onClick={() => setOpen(false)}>
                    <Link href="/checkout">
                      Checkout <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setOpen(false)}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
