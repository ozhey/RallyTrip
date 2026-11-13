import NavGuide from '@/containers/NavGuide/NavGuide';

export const metadata = {
  title: 'הדרכות ניווט',
  description: 'הדרכות ניווט באמצעות ספר דרך אישיות או קבוצתיות. כל ההדרכות מועברות על ידי רז הימן.',
  alternates: { canonical: '/nav-guide/' },
};

export default function NavGuidePage() {
  return <NavGuide />;
}
