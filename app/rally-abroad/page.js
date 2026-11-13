import Abroad from '@/containers/Abroad/Abroad';
import { getAbroadContent } from '@/lib/firebase/server';

export const revalidate = 3600;

export const metadata = {
  title: 'ראליים בחו"ל',
  description: 'רז הימן מוציא קבוצות ויחידים למרוצים בין לאומיים בחו"ל',
  alternates: { canonical: '/rally-abroad/' },
};

export default async function RallyAbroadPage() {
  const content = await getAbroadContent();
  return <Abroad content={content} />;
}
