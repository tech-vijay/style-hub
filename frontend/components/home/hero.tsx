'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary to-slate-900 text-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 -left-20 h-72 w-72 rounded-full bg-blue-500 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-400 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-1" /> New Season Collection 2026
            </Badge>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-balance">
              Elevate Your Style, <br />
              <span className="bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
                Define Your Edge
              </span>
            </h1>
            <p className="text-lg text-white/80 max-w-md">
              Discover premium men's fashion crafted for the modern gentleman. From sharp shirts to statement sneakers — find your signature look.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link href="/shop">
                  Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/shop?filter=sale">
                  Flash Sale — Up to 50% Off
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 pt-6">
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Truck className="h-4 w-4" /> Free Shipping ₹999+
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <RefreshCw className="h-4 w-4" /> 30-Day Returns
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <ShieldCheck className="h-4 w-4" /> Secure Payments
              </div>
            </div>
          </motion.div>

          {/* Hero image grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg"
                    alt="Premium shirt"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg"
                    alt="Watch"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-square rounded-2xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg"
                    alt="Sneakers"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg"
                    alt="Jacket"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feature strip */}
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹999' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
              { icon: ShieldCheck, title: 'Secure Payment', desc: '100% protected checkout' },
              { icon: Headphones, title: '24/7 Support', desc: 'Dedicated customer care' },
            ].map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <f.icon className="h-8 w-8 text-blue-300 shrink-0" />
                <div>
                  <p className="font-medium text-sm">{f.title}</p>
                  <p className="text-xs text-white/60">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
