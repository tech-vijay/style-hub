'use client';

import { useEffect, useState } from 'react';
import { Star, Check, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import type { Review } from '@/lib/types';
import { toast } from 'sonner';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<(Review & { product_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadReviews(); }, []);

  const loadReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('reviews')
      .select('*, product:products(name)')
      .order('created_at', { ascending: false });
    const mapped = ((data || []) as Review[]).map((r) => ({
      ...r,
      product_name: (r as unknown as { product?: { name?: string } }).product?.name,
    }));
    setReviews(mapped);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Review deleted'); loadReviews(); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Review Moderation</h1>
        <p className="text-sm text-muted-foreground mt-1">{reviews.length} reviews</p>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-8">Loading...</p>
      ) : reviews.length === 0 ? (
        <Card><CardContent className="text-center py-12 text-muted-foreground">No reviews yet</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`} />
                        ))}
                      </div>
                      <span className="font-medium text-sm">{r.author_name}</span>
                      {r.verified && <Badge className="text-[10px] gap-1"><Check className="h-2.5 w-2.5" /> Verified</Badge>}
                      {r.product_name && <Badge variant="secondary" className="text-[10px]">{r.product_name}</Badge>}
                    </div>
                    {r.title && <p className="font-medium text-sm">{r.title}</p>}
                    {r.body && <p className="text-sm text-muted-foreground">{r.body}</p>}
                    <p className="text-xs text-muted-foreground mt-2">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(r.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
