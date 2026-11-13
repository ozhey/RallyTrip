'use client';

import { useSyncExternalStore } from 'react';
import ProductPreview from '../../components/Product/ProductPreview';
import { DEFAULT_SORT, SORT_OPTIONS, parseSort, sortProducts } from '@/lib/products';

// The sort lives in the URL (?sort=price-asc) so it survives reloads and shared links.
// Listing pages are prerendered (static export / ISR), so the server always renders the default
// order and the browser applies ?sort= after hydration. useSearchParams is avoided on purpose:
// on a prerendered page it would drop the product grid out of the initial HTML.
const listeners = new Set();

function subscribe(listener) {
    listeners.add(listener);
    window.addEventListener('popstate', listener);
    return () => {
        listeners.delete(listener);
        window.removeEventListener('popstate', listener);
    };
}

const getSort = () => parseSort(new URLSearchParams(window.location.search).get('sort'));
const getServerSort = () => DEFAULT_SORT;

function setSort(value) {
    const url = new URL(window.location.href);
    if (value === DEFAULT_SORT) url.searchParams.delete('sort');
    else url.searchParams.set('sort', value);
    window.history.replaceState(null, '', url);
    listeners.forEach((listener) => listener());
}

/** Listing header (heading, count, sort menu) and product grid. `items` arrive in default order. */
const ProductListing = ({ items, heading }) => {
    const sort = useSyncExternalStore(subscribe, getSort, getServerSort);
    const sorted = sortProducts(items, sort);

    return (
        <>
            <div className='products-header'>
                <h1>{heading}</h1>
                {items.length ? (
                    <div className='products-tools'>
                        <span className='count'>{`${items.length} מוצרים`}</span>
                        {items.length > 1 ? (
                            <label className='products-sort'>
                                <span>מיון:</span>
                                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                                    {SORT_OPTIONS.map(({ value, label }) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </label>
                        ) : null}
                    </div>
                ) : null}
            </div>
            <div className='products-container'>
                {sorted.length
                    ? sorted.map(([id, product]) => <ProductPreview key={id} product={product} id={id} />)
                    : <p className='products-empty'>לא נמצאו מוצרים.</p>}
            </div>
        </>
    );
}

export default ProductListing;
