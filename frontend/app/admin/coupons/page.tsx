'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/format';
import type { Coupon } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    code: '', type: 'percentage', value: 0, min_order: 0, max_uses: '', expires_at: '',
  });

  useEffect(() => { loadCoupons(); }, []);

  const loadCoupons = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    setCoupons((data as Coupon[]) || []);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      min_order: Number(form.min_order),
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      expires_at: form.expires_at || null,
      active: true,
    };
    const { error } = await supabase.from('coupons').insert(payload);
    if (error) toast.error('Failed to add coupon');
    else {
      toast.success('Coupon created');
      setOpen(false);
      setForm({ code: '', type: 'percentage', value: 0, min_order: 0, max_uses: '', expires_at: '' });
      loadCoupons();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Coupon deleted'); loadCoupons(); }
  };

  const toggleActive = async (c: Coupon) => {
    await supabase.from('coupons').update({ active: !c.active }).eq('id', c.id);
    loadCoupons();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Coupons</h1>
          <p className="text-sm text-muted-foreground mt-1">{coupons.length} coupons</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Add Coupon</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Coupon</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label>Code</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required className="uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="flat">Flat Discount</SelectItem>
                      <SelectItem value="free_shipping">Free Shipping</SelectItem>
                      <SelectItem value="bogo">Buy One Get One</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Min Order (₹)</Label>
                  <Input type="number" value={form.min_order} onChange={(e) => setForm({ ...form, min_order: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Max Uses</Label>
                  <Input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} placeholder="Unlimited" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
              </div>
              <Button type="submit" className="w-full">Create Coupon</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((c) => (
          <Card key={c.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">{c.code}</p>
                    <Badge variant="secondary" className="text-[10px] capitalize">{c.type}</Badge>
                  </div>
                </div>
                <Badge variant={c.active ? 'default' : 'secondary'}>
                  {c.active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Value: {c.type === 'percentage' ? `${c.value}%` : c.type === 'free_shipping' ? 'Free Ship' : formatPrice(c.value)}</p>
                <p>Min Order: {formatPrice(c.min_order)}</p>
                <p>Used: {c.used_count}{c.max_uses ? ` / ${c.max_uses}` : ''}</p>
                {c.expires_at && <p>Expires: {new Date(c.expires_at).toLocaleDateString()}</p>}
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => toggleActive(c)}>
                  {c.active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(c.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
