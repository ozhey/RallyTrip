'use client';

import { categoryOptions, isInStock, pagePrice, resolveCategoryNames, subcategoryOptions } from '@/lib/products';
import './Admin.css';

const CATEGORIES = categoryOptions();
const CATEGORY_ORDER = Object.fromEntries(CATEGORIES.map(({ value }, i) => [value, i]));

// Same order customers see: by category, then priority (high first); hidden products last in each category.
function compareProducts([, a], [, b]) {
    return (CATEGORY_ORDER[a.category] ?? 999) - (CATEGORY_ORDER[b.category] ?? 999) ||
        (a.hide === true) - (b.hide === true) ||
        (parseInt(b.priority) || 0) - (parseInt(a.priority) || 0) ||
        String(a.title ?? '').localeCompare(String(b.title ?? ''), 'he');
}

const RowPrice = ({ product }) => {
    const info = pagePrice(product);
    if (info.kind === 'discount') return <><span className='pp-price sale'>{`₪${info.sale}`}</span> <span className='pp-old'>{`₪${info.price}`}</span></>;
    if (info.kind === 'price') return <span className='pp-price'>{`₪${info.price}`}</span>;
    return <span className='hint'>צור קשר לקבלת מחיר</span>;
};

const ProductRow = ({ product, onOpen }) => {
    const { title, image, category, subcategory, hide } = product;
    const { categoryName, subcategoryName } = resolveCategoryNames(category, subcategory);
    const onSale = pagePrice(product).kind === 'discount';
    return (
        <li>
            <button type='button' className={'product-row' + (hide === true ? ' is-hidden' : '')} onClick={onOpen}>
                <span className='row-thumb'>
                    {image ? <img src={image} alt='' loading='lazy' /> : <span className='hint'>אין תמונה</span>}
                </span>
                <span className='row-main'>
                    <span className='row-title'>{title || '(ללא שם)'}</span>
                    <span className='hint'>{[categoryName, subcategoryName].filter(Boolean).join(' › ')}</span>
                </span>
                <span className='row-meta'>
                    <span className='row-price'><RowPrice product={product} /></span>
                    <span className='row-badges'>
                        {onSale ? <span className='badge sale'>מבצע</span> : null}
                        {!isInStock(product) ? <span className='badge out'>אזל מהמלאי</span> : null}
                        {hide === true ? <span className='badge hidden'>מוסתר</span> : null}
                    </span>
                </span>
            </button>
        </li>
    );
};

/** Searchable, filterable list of all products; clicking a row opens it for editing. */
const ProductList = ({ products, loaded, filters, setFilters, onOpen, onNew }) => {
    const { search, category, subcategory } = filters;
    const query = search.trim();
    const subOptions = subcategoryOptions(category);
    const isFiltered = Boolean(query || category);

    const rows = Object.entries(products)
        .filter(([, p]) => (!category || p.category === category) &&
            (!subcategory || p.subcategory === subcategory) &&
            (!query || String(p.title ?? '').includes(query)))
        .sort(compareProducts);

    return (
        <section className='product-list-section'>
            <div className='product-toolbar'>
                <div className='field toolbar-search'>
                    <label htmlFor='pick-search'>חיפוש לפי שם</label>
                    <input id='pick-search' type='search' value={search} placeholder='הקלד חלק משם המוצר'
                        onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} />
                </div>
                <div className='field'>
                    <label htmlFor='pick-category'>קטגוריה</label>
                    <select id='pick-category' value={category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value, subcategory: '' }))}>
                        <option value=''>כל הקטגוריות</option>
                        {CATEGORIES.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                    </select>
                </div>
                {subOptions.length ?
                    <div className='field'>
                        <label htmlFor='pick-subcategory'>תת קטגוריה</label>
                        <select id='pick-subcategory' value={subcategory} onChange={(e) => setFilters((f) => ({ ...f, subcategory: e.target.value }))}>
                            <option value=''>הכל</option>
                            {subOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                        </select>
                    </div> : null}
                <button type='button' className='button green new-product' onClick={onNew}>+ מוצר חדש</button>
            </div>

            {!loaded ? <p className='hint list-status'>טוען מוצרים…</p> : <>
                <p className='hint list-status'>{rows.length} מוצרים</p>
                {rows.length ?
                    <ul className='product-list'>
                        {rows.map(([id, p]) => <ProductRow key={id} product={p} onOpen={() => onOpen(id)} />)}
                    </ul> :
                    <div className='list-empty'>
                        <p>לא נמצאו מוצרים.</p>
                        {isFiltered ? <button type='button' className='button' onClick={() => setFilters({ search: '', category: '', subcategory: '' })}>נקה סינון</button> : null}
                    </div>}
            </>}
        </section>
    );
};

export default ProductList;
