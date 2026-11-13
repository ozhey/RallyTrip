// Static build (GitHub Pages, STATIC_EXPORT=true): every page is generated at build time.
// New products appear after the next scheduled rebuild (.github/workflows/deploy.yml).
export { default, generateMetadata, generateStaticParams } from '@/containers/Products/productsRoute';

export const dynamicParams = false;
