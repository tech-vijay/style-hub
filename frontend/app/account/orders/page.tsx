'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';
import { ORDER_STATUS_LABELS, type Order, type OrderStatus } from '@/lib/types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  ordered: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  packed: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  shipped: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  out_for_delivery: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  returned: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .eq('user_id', data.user.id)
          .order('created_at', { ascending: false })
          .then(({ data: orderData, error }) => {
            if (error) {
              setLoading(false);
              return;
            }
            setOrders((orderData as Order[]) || []);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="font-medium text-lg mb-1">No orders yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              When you place orders, they'll appear here
            </p>
            <Button asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{order.order_number}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={STATUS_COLORS[order.status as OrderStatus]}>
                        {ORDER_STATUS_LABELS[order.status as OrderStatus]}
                      </Badge>
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(Number(order.total))}</p>
                        <p className="text-xs text-muted-foreground">{order.items?.length || 0} items</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
