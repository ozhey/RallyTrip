import { Fragment } from 'react';
import Link from 'next/link';
import { resolveCategoryNames } from '@/lib/products';
import './Product.css';

const Breadcrumbs = ({ category, subcategory, title }) => {
    const { categoryName, subcategoryName } = resolveCategoryNames(category, subcategory);
    const crumbs = [
        { href: '/', label: 'בית' },
        { href: '/products/', label: 'כל המוצרים' },
        categoryName && { href: `/products/${category}/`, label: categoryName },
        subcategoryName && { href: `/products/${category}/${subcategory}/`, label: subcategoryName },
    ].filter(Boolean);

    return (
        <nav className='breadcrumbs' aria-label='breadcrumbs'>
            {crumbs.map(crumb => (
                <Fragment key={crumb.href}>
                    <Link href={crumb.href}>{crumb.label}</Link>
                    <span className='sep' aria-hidden='true' />
                </Fragment>
            ))}
            <span className='current' aria-current='page'>{title}</span>
        </nav>
    );
}

export default Breadcrumbs;
