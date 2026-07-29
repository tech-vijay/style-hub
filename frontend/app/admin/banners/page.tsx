'use client';

import { Image as ImageIcon, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminBanners() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Banners</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage homepage banners</p>
        </div>
        <Button onClick={() => toast.info('Banner management coming soon')}>
          <Plus className="h-4 w-4 mr-2" /> Add Banner
        </Button>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="font-medium text-lg mb-1">No banners yet</p>
          <p className="text-sm text-muted-foreground">Banners will appear here once created</p>
        </CardContent>
      </Card>
    </div>
  );
}
