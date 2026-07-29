'use client';

import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const REVIEWS = [
  {
    name: 'Arjun Mehta',
    role: 'Verified Buyer',
    rating: 5,
    text: 'StyleHub has become my go-to for men\'s fashion. The quality is outstanding and the fit is always perfect. The oxford shirts are my absolute favorite.',
    product: 'Premium Oxford Shirt',
  },
  {
    name: 'Rahul Sharma',
    role: 'Verified Buyer',
    rating: 5,
    text: 'The sneakers I bought are incredibly comfortable and stylish. Delivery was fast and the packaging was premium. Highly recommend StyleHub to anyone looking for quality men\'s wear.',
    product: 'Apex Runner Sneakers',
  },
  {
    name: 'Vikram Patel',
    role: 'Verified Buyer',
    rating: 4,
    text: 'Great selection of watches at competitive prices. The chronograph I ordered exceeded my expectations. Customer service was helpful when I had questions.',
    product: 'Chrono Steel Watch',
  },
];

export function CustomerReviews() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">
          Loved by Thousands
        </p>
        <h2 className="font-display text-2xl sm:text-3xl font-bold">What Our Customers Say</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {REVIEWS.map((review, i) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative rounded-2xl border bg-card p-6"
          >
            <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`h-4 w-4 ${idx < review.rating ? 'fill-amber-400 text-amber-400' : 'text-muted'}`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              "{review.text}"
            </p>
            <div className="flex items-center gap-3 pt-4 border-t">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                {review.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-sm">{review.name}</p>
                <p className="text-xs text-muted-foreground">{review.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const INSTAGRAM_IMAGES = [
  'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
  'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
  'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
  'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg',
  'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg',
  'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg',
];

export function InstagramGallery() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">
          Follow Us
        </p>
        <h2 className="font-display text-2xl sm:text-3xl font-bold">@stylehub</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Tag us for a chance to be featured
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {INSTAGRAM_IMAGES.map((img, i) => (
          <motion.a
            key={i}
            href="#"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt="Instagram post"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium text-sm">
                View Post
              </span>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
