import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/cart/cart-drawer';

export const metadata: Metadata = {
  title: {
    default: 'StyleHub — Premium Men\'s Fashion',
    template: '%s | StyleHub',
  },
  description:
    'Shop premium men\'s fashion — shirts, denim, sneakers, watches, and more. Curated collections, flash sales, and fast delivery.',
  keywords: ['mens fashion', 'shirts', 'jeans', 'sneakers', 'watches', 'online shopping', 'StyleHub'],
  openGraph: {
    title: 'StyleHub — Premium Men\'s Fashion',
    description: 'Shop premium men\'s fashion with curated collections, flash sales, and fast delivery.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StyleHub — Premium Men\'s Fashion',
    description: 'Shop premium men\'s fashion with curated collections, flash sales, and fast delivery.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' }}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
