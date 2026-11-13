'use client';

import { usePathname, useRouter } from 'next/navigation';
import { links } from '../../links';
import { withSlash, withoutSlash } from '@/lib/site';
import './MobileMenu.css';

const MobileMenu = () => {
    const router = useRouter();
    const pathname = withoutSlash(usePathname() ?? '/products');
    const [, , category, subcategory] = pathname.split('/');
    const currentLink = links.find(link => pathname.includes(link.path));
    const subOptions = currentLink ? currentLink.routes : [];

    const goToPath = (path) => router.push(withSlash(path));

    return (
        <section className='mobile-navigation'>
            <select value={pathname} onChange={(e) => goToPath(e.target.value)} aria-label='בחר קטגוריה'>
                <option value="/products" disabled hidden>בחר קטגוריה</option>
                <option value={`/products/${category}/${subcategory}`} disabled hidden>{`${currentLink?.name}`}</option>
                {links.map(link => <option key={link.path} value={link.path}>{link.name}</option>)}
            </select>
            {subOptions.length ?
                <select value={pathname} onChange={(e) => goToPath(e.target.value)} aria-label='בחר תת קטגוריה'>
                    <option value={`/products/${category}`} disabled hidden>בחר תת קטגוריה</option>
                    {subOptions.map(subLink => <option key={subLink.path} value={subLink.path}>{subLink.name}</option>)}
                </select> : <div></div>}
        </section>
    );
}

export default MobileMenu;
