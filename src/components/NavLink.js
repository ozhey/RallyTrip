'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { withSlash, withoutSlash } from '@/lib/site';

/** next/link with react-router v5 NavLink semantics (activeClassName, exact). */
export function isActivePath(pathname, href, exact = false) {
  if (!pathname) return false;
  const current = withoutSlash(pathname);
  const target = withoutSlash(href);
  if (exact || target === '/') return current === target;
  return current === target || current.startsWith(`${target}/`);
}

export default function NavLink({ href, exact = false, className, activeClassName = 'active', children, ...rest }) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href, exact);
  const classes = [className, active ? activeClassName : null].filter(Boolean).join(' ') || undefined;
  return (
    <Link href={withSlash(href)} className={classes} aria-current={active ? 'page' : undefined} {...rest}>
      {children}
    </Link>
  );
}
