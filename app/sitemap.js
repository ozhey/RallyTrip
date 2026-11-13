import { getProducts } from '@/lib/firebase/server';
import { listingSlugs, productPath } from '@/lib/products';
import { absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function sitemap() {
  const products = await getProducts();
  const staticPages = ['/', '/rally-abroad', '/nav-guide'].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));
  const listings = listingSlugs().map((slug) => ({
    url: absoluteUrl(['/products', ...slug].join('/')),
    changeFrequency: 'weekly',
    priority: slug.length ? 0.7 : 0.9,
  }));
  const productPages = Object.entries(products)
    .filter(([, p]) => p.hide !== true && p.category)
    .map(([id, p]) => ({ url: absoluteUrl(productPath(id, p)), changeFrequency: 'weekly', priority: 0.6 }));
  return [...staticPages, ...listings, ...productPages];
}
