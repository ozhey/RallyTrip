import Home from '@/containers/Home/Home';
import { getProducts } from '@/lib/firebase/server';
import { categoryCovers, featuredProducts } from '@/lib/products';

export const revalidate = 3600;

export default async function HomePage() {
  const products = await getProducts();
  return <Home featured={featuredProducts(products, 8)} covers={categoryCovers(products)} />;
}
