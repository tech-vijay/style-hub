'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';

interface Customer {
  user_id: string;
  email: string;
  order_count: number;
  total_spent: number;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: orders } = await supabase.from('orders').select('user_id, total');
      if (!orders) { setLoading(false); return; }

      const map = new Map<string, Customer>();
      for (const o of orders) {
        const existing = map.get(o.user_id) || { user_id: o.user_id, email: '', order_count: 0, total_spent: 0 };
        existing.order_count += 1;
        existing.total_spent += Number(o.total);
        map.set(o.user_id, existing);
      }

      const userIds = Array.from(map.keys());
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email')
          .in('id', userIds);
        if (profiles) {
          for (const p of profiles) {
            if (map.has(p.id)) {
              map.get(p.id)!.email = p.email || '';
            }
          }
        }
      }

      setCustomers(Array.from(map.values()).sort((a, b) => b.total_spent - a.total_spent));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Customers</h1>
        <p className="text-sm text-muted-foreground mt-1">{customers.length} customers</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Orders</th>
                  <th className="text-left p-4 font-medium">Total Spent</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : customers.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No customers yet</td></tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.user_id} className="border-b hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                            {(c.email || '?').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{c.email || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">ID: {c.user_id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{c.order_count}</td>
                      <td className="p-4 font-medium">{formatPrice(c.total_spent)}</td>
                      <td className="p-4">
                        <Badge variant="secondary">Active</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
