import SideMenu from '../../components/SideMenu/SideMenu';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import ProductPreview from '../../components/Product/ProductPreview';
import './Products.css';

/** Product listing (all / category / subcategory). `items` is [id, product][] already filtered and sorted. */
const Products = ({ items, heading }) => {
    return (
        <div className='page-container products-page'>
            <SideMenu />
            <MobileMenu />
            <div className='products-container'>
                <h1 className='visually-hidden'>{heading}</h1>
                {items.length
                    ? items.map(([id, product]) => <ProductPreview key={id} product={product} id={id} />)
                    : 'לא נמצאו מוצרים.'}
            </div>
        </div>
    );
}

/** Wrapper used for a single product page (same container as the old SPA). */
export const ProductContainer = ({ children }) => (
    <div className='page-container products-page'>{children}</div>
);

export default Products;
