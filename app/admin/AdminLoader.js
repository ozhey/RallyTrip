'use client';

import dynamic from 'next/dynamic';
import Loader from '@/components/Loader/Loader';

// The admin panel (Firebase Auth, Quill editor) only runs in the browser.
const Admin = dynamic(() => import('@/containers/Admin/Admin'), {
  ssr: false,
  loading: () => <article className='page-container'><Loader /></article>,
});

export default function AdminLoader() {
  return <Admin />;
}
