import SideMenu from '../../components/SideMenu/SideMenu';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import ProductPreview from '../../components/Product/ProductPreview';
import './Products.css';

/** Product listing (all / category / subcategory). `items` is [id, product][] already filtered and sorted. */
const Products = ({ items, heading }) => {
    return (
        <div className='page-container products-page'>
            <SideMenu />
            <div className='products-main'>
                <MobileMenu />
                <div className='products-header'>
                    <h1>{heading}</h1>
                    {items.length ? <span className='count'>{`${items.length} מוצרים`}</span> : null}
                </div>
                <div className='products-container'>
                    {items.length
                        ? items.map(([id, product]) => <ProductPreview key={id} product={product} id={id} />)
                        : <p className='products-empty'>לא נמצאו מוצרים.</p>}
                </div>
            </div>
        </div>
    );
}

/** Wrapper used for a single product page. */
export const ProductContainer = ({ children }) => (
    <div className='page-container products-page single'>{children}</div>
);

export default Products;
