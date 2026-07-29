'use client';

import { useEffect, useState } from 'react';
import { Plus, MapPin, Trash2, Edit, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import type { Address } from '@/lib/types';
import { toast } from 'sonner';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    is_default: false,
    type: 'home',
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);
        loadAddresses(data.user.id);
      }
    });
  }, []);

  const loadAddresses = (uid: string) => {
    supabase
      .from('addresses')
      .select('*')
      .eq('user_id', uid)
      .order('is_default', { ascending: false })
      .then(({ data }) => setAddresses((data as Address[]) || []));
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ full_name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', is_default: false, type: 'home' });
    setOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditing(addr);
    setForm({
      full_name: addr.full_name,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      is_default: addr.is_default,
      type: addr.type,
    });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    if (form.is_default) {
      await supabase.from('addresses').update({ is_default: false }).eq('user_id', userId);
    }

    if (editing) {
      const { error } = await supabase.from('addresses').update(form).eq('id', editing.id);
      if (error) toast.error('Failed to update address');
      else toast.success('Address updated');
    } else {
      const { error } = await supabase.from('addresses').insert({ ...form, user_id: userId });
      if (error) toast.error('Failed to add address');
      else toast.success('Address added');
    }
    setOpen(false);
    loadAddresses(userId);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('addresses').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else {
      toast.success('Address deleted');
      if (userId) loadAddresses(userId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">My Addresses</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="h-4 w-4 mr-2" /> Add Address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Address' : 'Add New Address'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address Line 1</Label>
                <Input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Address Line 2 (Optional)</Label>
                <Input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>PIN Code</Label>
                  <Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_default}
                  onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                  className="rounded"
                />
                Set as default address
              </label>
              <Button type="submit" className="w-full">
                {editing ? 'Update Address' : 'Save Address'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="font-medium text-lg mb-1">No saved addresses</p>
            <p className="text-sm text-muted-foreground mb-6">
              Add an address to speed up checkout
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <Card key={addr.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">{addr.type}</Badge>
                    {addr.is_default && <Badge>Default</Badge>}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(addr)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(addr.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="font-medium text-sm">{addr.full_name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{addr.phone}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
