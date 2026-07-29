'use client';

import Link from 'next/link';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

const FOOTER_LINKS = {
  Shop: [
    { label: 'New Arrivals', href: '/shop?filter=new' },
    { label: 'Best Sellers', href: '/shop?filter=bestseller' },
    { label: 'Flash Sale', href: '/shop?filter=sale' },
    { label: 'Featured', href: '/shop?filter=featured' },
  ],
  Categories: [
    { label: 'Shirts', href: '/category/shirts' },
    { label: 'T-Shirts', href: '/category/t-shirts' },
    { label: 'Jeans', href: '/category/jeans' },
    { label: 'Shoes', href: '/category/shoes' },
    { label: 'Watches', href: '/category/watches' },
  ],
  Account: [
    { label: 'My Account', href: '/account' },
    { label: 'My Orders', href: '/account/orders' },
    { label: 'Wishlist', href: '/account/wishlist' },
    { label: 'Addresses', href: '/account/addresses' },
  ],
  Help: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faq' },
  ],
};

export function Footer() {
  const [email, setEmail] = useState('');
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  if (pathname.startsWith('/admin')) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thanks for subscribing! Check your inbox for a welcome offer.');
      setEmail('');
    }
  };

  return (
    <footer className="border-t bg-muted/30 mt-16">
      {/* Newsletter */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left max-w-md">
              <h3 className="font-display text-2xl font-bold mb-2">Join the Style Club</h3>
              <p className="text-sm text-muted-foreground">
                Subscribe for exclusive drops, early access to sales, and 10% off your first order.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
              <Button type="submit" size="lg" className="shrink-0">
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="font-display text-2xl font-bold mb-4 block">
              Style<span className="text-primary">Hub</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Premium men's fashion for the modern gentleman. Curated collections, quality craftsmanship, and unbeatable style.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-muted-foreground border-t pt-8">
          <span className="flex items-center gap-2">
            <Phone className="h-4 w-4" /> +91 1800-STYLE-HUB
          </span>
          <span className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> care@stylehub.com
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Bengaluru, India
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} StyleHub. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Secure Payments</span>
            <span>•</span>
            <span>Fast Delivery</span>
            <span>•</span>
            <span>Easy Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
