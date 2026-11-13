// Shared implementation of /products/[[...slug]]. The route files in app/products/[[...slug]]/
// only add the segment config, which differs between the server and static (GitHub Pages) builds.
import { notFound, permanentRedirect } from 'next/navigation';
import Products, { ProductContainer } from '@/containers/Products/Products';
import ProductPage from '@/components/Product/ProductPage';
import { getProductDetails, getProducts } from '@/lib/firebase/server';
import { resolveProductsRoute } from '@/lib/productRoute';
import {
  effectivePrice,
  filterAndSortProducts,
  isInStock,
  listingSlugs,
  productPath,
  resolveCategoryNames,
} from '@/lib/products';
import { PRODUCTS_DESCRIPTION, absoluteUrl, withSlash } from '@/lib/site';

export async function generateStaticParams() {
  const products = await getProducts();
  const params = listingSlugs().map((slug) => ({ slug }));
  for (const [id, product] of Object.entries(products)) {
    if (product.hide !== true && product.category) {
      params.push({ slug: productPath(id, product).split('/').slice(2) });
    }
  }
  return params;
}

function listingHeading(category, subcategory) {
  const { categoryName, subcategoryName } = resolveCategoryNames(category, subcategory);
  return [subcategoryName, categoryName].filter(Boolean).join(' - ') || 'מוצרים';
}

export async function generateMetadata({ params }) {
  const { slug = [] } = await params;
  const route = resolveProductsRoute(slug, await getProducts());

  if (route.type === 'listing') {
    const path = withSlash(['/products', ...slug].join('/'));
    return {
      title: listingHeading(route.category, route.subcategory),
      description: PRODUCTS_DESCRIPTION,
      alternates: { canonical: path },
      openGraph: { url: path },
    };
  }
  if (route.type === 'product') {
    const { product, id } = route;
    const path = withSlash(productPath(id, product));
    const description = product.description || PRODUCTS_DESCRIPTION;
    const images = product.image ? [{ url: product.image, alt: product.title }] : undefined;
    return {
      title: product.title,
      description,
      alternates: { canonical: path },
      openGraph: { type: 'website', url: path, title: product.title, description, images },
      twitter: { card: images ? 'summary_large_image' : 'summary', title: product.title, description },
    };
  }
  return {};
}

function productJsonLd({ id, product, category, subcategory }) {
  const url = absoluteUrl(productPath(id, product));
  const { categoryName, subcategoryName } = resolveCategoryNames(category, subcategory);
  const price = effectivePrice(product);
  const crumbs = [
    { name: 'בית', item: absoluteUrl('/') },
    { name: 'כל המוצרים', item: absoluteUrl('/products') },
    categoryName && { name: categoryName, item: absoluteUrl(`/products/${category}`) },
    subcategoryName && { name: subcategoryName, item: absoluteUrl(`/products/${category}/${subcategory}`) },
    { name: product.title, item: url },
  ].filter(Boolean);

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.description || undefined,
      image: product.image ? [product.image] : undefined,
      url,
      sku: id,
      brand: { '@type': 'Brand', name: 'Rally Trip' },
      category: [categoryName, subcategoryName].filter(Boolean).join(' > ') || undefined,
      offers:
        price !== null
          ? {
              '@type': 'Offer',
              url,
              priceCurrency: 'ILS',
              price,
              availability: isInStock(product) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              seller: { '@type': 'Organization', name: 'Rally Trip' },
            }
          : undefined,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.item })),
    },
  ];
}

export default async function ProductsPage({ params }) {
  const { slug = [] } = await params;
  const products = await getProducts();
  const route = resolveProductsRoute(slug, products);

  if (route.type === 'notFound') notFound();
  if (route.type === 'redirect') permanentRedirect(withSlash(route.path));

  if (route.type === 'product') {
    const details = await getProductDetails(route.id);
    return (
      <ProductContainer>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(route)).replace(/</g, '\\u003c') }}
        />
        <ProductPage
          product={route.product}
          details={details}
          category={route.category}
          subcategory={route.subcategory}
        />
      </ProductContainer>
    );
  }

  const items = filterAndSortProducts(products, { category: route.category, subcategory: route.subcategory });
  return <Products items={items} heading={listingHeading(route.category, route.subcategory)} />;
}
