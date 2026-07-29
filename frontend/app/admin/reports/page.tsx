'use client';

import { BarChart3, TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';

export default function AdminReports() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, avgOrder: 0 });

  useEffect(() => {
    async function load() {
      const { data: orders } = await supabase.from('orders').select('total');
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const revenue = (orders || []).reduce((s, o) => s + Number(o.total), 0);
      const orderCount = orders?.length || 0;
      setStats({
        revenue,
        orders: orderCount,
        products: productCount || 0,
        avgOrder: orderCount > 0 ? revenue / orderCount : 0,
      });
    }
    load();
  }, []);

  const monthlyData = [
    { month: 'Jan', revenue: 45000, orders: 120 },
    { month: 'Feb', revenue: 52000, orders: 145 },
    { month: 'Mar', revenue: 48000, orders: 132 },
    { month: 'Apr', revenue: 61000, orders: 168 },
    { month: 'May', revenue: 58000, orders: 155 },
    { month: 'Jun', revenue: 72000, orders: 190 },
    { month: 'Jul', revenue: 68000, orders: 178 },
  ];

  const cards = [
    { label: 'Total Revenue', value: formatPrice(stats.revenue), icon: DollarSign },
    { label: 'Total Orders', value: stats.orders, icon: TrendingUp },
    { label: 'Products', value: stats.products, icon: Package },
    { label: 'Avg Order Value', value: formatPrice(stats.avgOrder), icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Business performance insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-4">
              <c.icon className="h-8 w-8 text-primary mb-2" />
              <p className="text-2xl font-bold">{c.value}</p>
              <p className="text-xs text-muted-foreground">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-lg">Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="revenue" fill="hsl(225 73% 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Monthly Orders</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="orders" stroke="hsl(225 73% 35%)" strokeWidth={2} dot={{ fill: 'hsl(225 73% 35%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
