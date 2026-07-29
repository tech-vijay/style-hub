'use client';

import { Settings, CreditCard, Truck, Percent, Globe, Mail, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your store</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Globe className="h-5 w-5" /> Website Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Store Name</Label>
              <Input defaultValue="StyleHub" />
            </div>
            <div className="space-y-2">
              <Label>Support Email</Label>
              <Input defaultValue="care@stylehub.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Input defaultValue="INR (₹)" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><CreditCard className="h-5 w-5" /> Payment Gateway</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {['Razorpay', 'Stripe', 'UPI', 'Cash on Delivery'].map((method) => (
            <div key={method} className="flex items-center justify-between">
              <span className="text-sm font-medium">{method}</span>
              <Switch defaultChecked={method === 'UPI' || method === 'Cash on Delivery'} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Truck className="h-5 w-5" /> Shipping</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Free Shipping Threshold (₹)</Label>
              <Input type="number" defaultValue="999" />
            </div>
            <div className="space-y-2">
              <Label>Standard Shipping Rate (₹)</Label>
              <Input type="number" defaultValue="99" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Percent className="h-5 w-5" /> Tax</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>GST Rate (%)</Label>
            <Input type="number" defaultValue="5" />
          </div>
        </CardContent>
      </Card>

      <Button onClick={() => toast.success('Settings saved')}>Save All Settings</Button>
    </div>
  );
}
