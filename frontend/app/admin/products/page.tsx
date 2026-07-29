'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  Star,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { formatPrice, calculateDiscount } from '@/lib/format';
import type { Product, Category, Brand } from '@/lib/types';
import { toast } from 'sonner';

interface ProductForm {
  name: string;
  slug: string;
  description: string;
  category_id: string;
  brand_id: string;
  price: number;
  compare_at_price: number;
  stock: number;
  sku: string;
  material: string;
  fit: string;
  sleeve: string;
  occasion: string;
  is_featured: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  is_flash_sale: boolean;
  images: string;
}

const EMPTY_FORM: ProductForm = {
  name: '', slug: '', description: '', category_id: '', brand_id: '',
  price: 0, compare_at_price: 0, stock: 0, sku: '', material: '', fit: '', sleeve: '', occasion: '',
  is_featured: false, is_new: false, is_bestseller: false, is_flash_sale: false,
  images: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);

  useEffect(() => {
    loadProducts();
    supabase.from('categories').select('*').then(({ data }) => setCategories((data as Category[]) || []));
    supabase.from('brands').select('*').then(({ data }) => setBrands((data as Brand[]) || []));
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*, category:categories(*), brand:brands(*)')
      .order('created_at', { ascending: false });
    setProducts((data as Product[]) || []);
    setLoading(false);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description || '',
      category_id: p.category_id || '',
      brand_id: p.brand_id || '',
      price: p.price,
      compare_at_price: p.compare_at_price || 0,
      stock: p.stock,
      sku: p.sku || '',
      material: p.material || '',
      fit: p.fit || '',
      sleeve: p.sleeve || '',
      occasion: p.occasion || '',
      is_featured: p.is_featured,
      is_new: p.is_new,
      is_bestseller: p.is_bestseller,
      is_flash_sale: p.is_flash_sale,
      images: p.images.join('\n'),
    });
    setOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const images = form.images.split('\n').map((u) => u.trim()).filter(Boolean);
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      category_id: form.category_id || null,
      brand_id: form.brand_id || null,
      price: Number(form.price),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      stock: Number(form.stock),
      sku: form.sku || null,
      material: form.material || null,
      fit: form.fit || null,
      sleeve: form.sleeve || null,
      occasion: form.occasion || null,
      is_featured: form.is_featured,
      is_new: form.is_new,
      is_bestseller: form.is_bestseller,
      is_flash_sale: form.is_flash_sale,
      images,
    };

    if (editing) {
      const { error } = await supabase.from('products').update(payload).eq('id', editing.id);
      if (error) toast.error('Failed to update product');
      else toast.success('Product updated');
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) toast.error('Failed to add product');
      else toast.success('Product added');
    }
    setOpen(false);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else {
      toast.success('Product deleted');
      loadProducts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} products</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd}>
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || slugify(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Brand</Label>
                  <Select value={form.brand_id} onValueChange={(v) => setForm({ ...form, brand_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger>
                    <SelectContent>
                      {brands.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <Label>Compare At (₹)</Label>
                  <Input type="number" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>SKU</Label>
                  <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Material</Label>
                  <Input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Fit</Label>
                  <Input value={form.fit} onChange={(e) => setForm({ ...form, fit: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Sleeve</Label>
                  <Input value={form.sleeve} onChange={(e) => setForm({ ...form, sleeve: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Occasion</Label>
                  <Input value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Image URLs (one per line)</Label>
                <Textarea value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} rows={3} placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'is_featured', label: 'Featured' },
                  { key: 'is_new', label: 'New Arrival' },
                  { key: 'is_bestseller', label: 'Bestseller' },
                  { key: 'is_flash_sale', label: 'Flash Sale' },
                ].map((f) => (
                  <label key={f.key} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={form[f.key as keyof ProductForm] as boolean}
                      onCheckedChange={(c) => setForm({ ...form, [f.key]: c === true })}
                    />
                    {f.label}
                  </label>
                ))}
              </div>
              <Button type="submit" className="w-full">
                {editing ? 'Update Product' : 'Add Product'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Product</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Category</th>
                  <th className="text-left p-4 font-medium">Price</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Stock</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Rating</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Tags</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No products found</td></tr>
                ) : (
                  filtered.map((p) => {
                    const discount = calculateDiscount(p.price, p.compare_at_price);
                    return (
                      <tr key={p.id} className="border-b hover:bg-muted/30">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-10 rounded-lg overflow-hidden bg-muted shrink-0">
                              {p.images[0] && (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{p.sku || p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">{p.category?.name || '—'}</td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{formatPrice(p.price)}</p>
                            {discount > 0 && (
                              <p className="text-xs text-green-600">{discount}% off</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <Badge variant={p.stock < 10 ? 'destructive' : 'secondary'}>
                            {p.stock}
                          </Badge>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            {p.rating.toFixed(1)}
                          </span>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {p.is_new && <Badge className="text-[9px]">NEW</Badge>}
                            {p.is_featured && <Badge className="text-[9px] bg-blue-500">FEAT</Badge>}
                            {p.is_bestseller && <Badge className="text-[9px] bg-amber-500">BEST</Badge>}
                            {p.is_flash_sale && <Badge variant="destructive" className="text-[9px]">SALE</Badge>}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(p.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
