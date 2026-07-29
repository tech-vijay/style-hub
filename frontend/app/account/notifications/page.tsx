'use client';

import { Bell, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const NOTIFICATIONS = [
  { id: 'order_updates', label: 'Order Updates', desc: 'Get notified about your order status', enabled: true },
  { id: 'promotions', label: 'Promotions & Offers', desc: 'Receive deals and discount alerts', enabled: true },
  { id: 'new_arrivals', label: 'New Arrivals', desc: 'Be the first to know about new products', enabled: false },
  { id: 'wishlist_alerts', label: 'Wishlist Price Drops', desc: 'Alert when wishlist items go on sale', enabled: true },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your notification preferences</p>
      </div>
      <Card>
        <CardContent className="p-0">
          {NOTIFICATIONS.map((n, i) => (
            <div key={n.id} className={`flex items-center justify-between p-4 ${i < NOTIFICATIONS.length - 1 ? 'border-b' : ''}`}>
              <div>
                <p className="font-medium text-sm">{n.label}</p>
                <p className="text-xs text-muted-foreground">{n.desc}</p>
              </div>
              <Switch defaultChecked={n.enabled} />
            </div>
          ))}
        </CardContent>
      </Card>
      <Button onClick={() => toast.success('Preferences saved')}>Save Preferences</Button>
    </div>
  );
}
