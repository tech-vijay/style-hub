'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Package, Truck, Home, MapPin, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';
import { ORDER_STATUS_LABELS, ORDER_STATUS_STEPS, type Order, type OrderStatus } from '@/lib/types';
import { toast } from 'sonner';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('orders')
      .select('*, items:order_items(*), address:addresses(*)')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) {
          toast.error('Order not found');
        } else {
          setOrder(data as Order);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="h-96 rounded-2xl bg-muted animate-pulse" />;
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-medium mb-2">Order not found</p>
        <Button asChild><Link href="/account/orders">Back to Orders</Link></Button>
      </div>
    );
  }

  const status = order.status as OrderStatus;
  const currentStepIndex = ORDER_STATUS_STEPS.indexOf(status);
  const isCancelled = status === 'cancelled' || status === 'returned';

  return (
    <div className="space-y-6">
      <div>
        <Link href="/account/orders" className="text-sm text-muted-foreground hover:text-primary">
          ← Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
          <div>
            <h1 className="font-display text-2xl font-bold">Order {order.order_number}</h1>
            <p className="text-sm text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}
            </p>
          </div>
          <Badge className="text-sm">{ORDER_STATUS_LABELS[status]}</Badge>
        </div>
      </div>

      {/* Tracking */}
      {!isCancelled && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-primary -z-10 transition-all"
                style={{ width: `${(currentStepIndex / (ORDER_STATUS_STEPS.length - 1)) * 100}%` }}
              />
              {ORDER_STATUS_STEPS.map((step, i) => {
                const isComplete = i <= currentStepIndex;
                const icons = [Package, Package, Truck, Home, Check];
                const Icon = icons[i];
                return (
                  <div key={step} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                        isComplete ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className={`text-xs text-center ${isComplete ? 'font-medium' : 'text-muted-foreground'}`}>
                      {ORDER_STATUS_LABELS[step]}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Items in Order</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.items?.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="h-20 w-16 rounded-lg overflow-hidden bg-muted shrink-0">
                {item.product_image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.product_image} alt={item.product_name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.product_name}</p>
                <p className="text-xs text-muted-foreground">
                  {[item.size, item.color].filter(Boolean).join(' • ')} • Qty {item.quantity}
                </p>
                <p className="font-semibold text-sm mt-1">{formatPrice(Number(item.price))}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Address + Summary */}
      <div className="grid sm:grid-cols-2 gap-4">
        {order.address && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <p className="font-medium">{order.address.full_name}</p>
              <p className="text-muted-foreground">{order.address.line1}</p>
              {order.address.line2 && <p className="text-muted-foreground">{order.address.line2}</p>}
              <p className="text-muted-foreground">
                {order.address.city}, {order.address.state} - {order.address.pincode}
              </p>
              <p className="text-muted-foreground">{order.address.phone}</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(Number(order.subtotal))}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(Number(order.discount))}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{Number(order.shipping) === 0 ? 'FREE' : formatPrice(Number(order.shipping))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatPrice(Number(order.tax))}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>{formatPrice(Number(order.total))}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground pt-2">
              <span>Payment Method</span>
              <span className="uppercase">{order.payment_method}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Payment Status</span>
              <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                {order.payment_status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button variant="outline" onClick={() => toast.info('Invoice download coming soon')}>
        <Download className="h-4 w-4 mr-2" /> Download Invoice
      </Button>
    </div>
  );
}
