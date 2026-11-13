import Link from 'next/link';
import { resolveCategoryNames } from '@/lib/products';
import './Product.css';

const Breadcrumbs = ({ category, subcategory, title }) => {
    const { categoryName, subcategoryName } = resolveCategoryNames(category, subcategory);

    return (
        <nav className='breadcrumbs' aria-label='breadcrumbs'>
            <Link href='/'>בית</Link> &#x203A;
            <Link href='/products/'> כל המוצרים</Link> &#x203A;
            {categoryName ? <><Link href={`/products/${category}/`}> {categoryName} </Link> &#x203A;</> : null}
            {subcategoryName ? <><Link href={`/products/${category}/${subcategory}/`}> {subcategoryName} </Link> &#x203A;</> : null}
            <span> {title}</span>
        </nav>
    );
}

export default Breadcrumbs;
