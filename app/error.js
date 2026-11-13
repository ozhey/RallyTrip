'use client';

import Link from 'next/link';

export default function Error({ reset }) {
  return (
    <div className='page-container status-page'>
      <h1>משהו השתבש</h1>
      <p>אירעה שגיאה בטעינת הדף. אפשר לנסות שוב.</p>
      <div className='status-actions'>
        <button type='button' className='btn btn--primary' onClick={() => reset()}>נסו שוב</button>
        <Link href='/' className='btn btn--light'>לדף הבית</Link>
      </div>
    </div>
  );
}
