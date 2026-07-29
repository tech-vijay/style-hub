'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Heart, MapPin, TrendingUp, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useWishlistStore } from '@/lib/stores/wishlist-store';
import { useCartStore } from '@/lib/stores/cart-store';
import { formatPrice } from '@/lib/format';
import type { Order } from '@/lib/types';

export default function AccountDashboard() {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const wishlistCount = useWishlistStore((s) => s.productIds.length);
  const cartCount = useCartStore((s) => s.itemCount());

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser({
          id: data.user.id,
          name: (data.user.user_metadata?.full_name as string) || 'User',
          email: data.user.email || '',
        });
        supabase
          .from('orders')
          .select('*')
          .eq('user_id', data.user.id)
          .order('created_at', { ascending: false })
          .limit(5)
          .then(({ data: orderData }) => {
            if (orderData) {
              setOrders(orderData as Order[]);
              setTotalSpent(orderData.reduce((sum, o) => sum + Number(o.total), 0));
            }
          });
      }
    });
  }, []);

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: Package, href: '/account/orders' },
    { label: 'Wishlist Items', value: wishlistCount, icon: Heart, href: '/account/wishlist' },
    { label: 'Cart Items', value: cartCount, icon: TrendingUp, href: '/shop' },
    { label: 'Total Spent', value: formatPrice(totalSpent), icon: TrendingUp, href: '/account/orders' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">
          Welcome, {user?.name?.split(' ')[0] || 'User'}!
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's an overview of your account
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Orders</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/account/orders">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-4">No orders yet</p>
              <Button asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-sm">{order.order_number}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()} • {order.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatPrice(Number(order.total))}</p>
                    <p className="text-xs text-muted-foreground capitalize">{order.payment_status}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
