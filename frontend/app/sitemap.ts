import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '', '/shop', '/contact', '/faq',
    '/category/shirts', '/category/t-shirts', '/category/jeans',
    '/category/shoes', '/category/watches',
  ];
  const base = 'https://stylehub.com';
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));
}
