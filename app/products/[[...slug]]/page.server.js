// Server build (Next.js server / Cloudflare): pages are cached and refreshed on admin edits (ISR),
// and products added after the build are rendered on first request.
export { default, generateMetadata, generateStaticParams } from '@/containers/Products/productsRoute';

export const revalidate = 3600;
export const dynamicParams = true;
