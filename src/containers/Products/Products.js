import SideMenu from '../../components/SideMenu/SideMenu';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import ProductListing from './ProductListing';
import './Products.css';

/**
 * Product listing (all / category / subcategory). `items` is [id, product][] already filtered
 * and in default (priority) order; the visitor can re-sort it in the browser.
 */
const Products = ({ items, heading }) => {
    return (
        <div className='page-container products-page'>
            <SideMenu />
            <div className='products-main'>
                <MobileMenu />
                <ProductListing items={items} heading={heading} />
            </div>
        </div>
    );
}

/** Wrapper used for a single product page. */
export const ProductContainer = ({ children }) => (
    <div className='page-container products-page single'>{children}</div>
);

export default Products;
