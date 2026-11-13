import Link from 'next/link';

export const metadata = { title: 'הדף לא נמצא', robots: { index: false } };

export default function NotFound() {
  return (
    <div className='page-container status-page'>
      <div className='status-code'>404</div>
      <h1>הדף לא נמצא</h1>
      <p>ייתכן שהקישור שגוי או שהדף הוסר.</p>
      <div className='status-actions'>
        <Link href='/' className='btn btn--primary'>לדף הבית</Link>
        <Link href='/products/' className='btn btn--light'>לכל המוצרים</Link>
      </div>
    </div>
  );
}
