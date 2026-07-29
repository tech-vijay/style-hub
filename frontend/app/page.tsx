import { Hero } from '@/components/home/hero';
import {
  TrendingCollection,
  NewArrivals,
  FlashSale,
  BestSellers,
  FeaturedProducts,
} from '@/components/home/product-sections';
import { CategoriesSection, BrandsSection } from '@/components/home/categories-section';
import { CustomerReviews, InstagramGallery } from '@/components/home/reviews-instagram';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <TrendingCollection />
      <FlashSale />
      <NewArrivals />
      <FeaturedProducts />
      <BestSellers />
      <BrandsSection />
      <CustomerReviews />
      <InstagramGallery />
    </>
  );
}
