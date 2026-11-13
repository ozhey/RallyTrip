import MakeContact from './MakeContact';
import Breadcrumbs from './Breadcrumbs';
import RichText from '../RichText';
import { hasRichText } from '@/lib/richText';
import { isInStock, pagePrice } from '@/lib/products';
import './Product.css';

const PriceTag = ({ product }) => {
    const info = pagePrice(product);
    if (info.kind === 'discount') {
        return (
            <div className='price-row sale'>
                <div className='price'>{`₪${info.sale}`}</div>
                <div className='old-price'>{`₪${info.price}`}</div>
                <div className='percent-off'>{`${info.percentOff}% הנחה`}</div>
            </div>
        );
    }
    if (info.kind === 'price') return <div className='price-row'><div className='price'>{`₪${info.price}`}</div></div>;
    return <div className='price-row contact'><div className='price'>צור קשר לקבלת מחיר</div></div>;
}

const ProductPage = ({ product, details, category, subcategory }) => {
    const { title = '', description = '', image = '' } = product;

    return (
        <article className='product-page'>
            <Breadcrumbs category={category} subcategory={subcategory} title={title} />
            <div className='product-grid'>
                <div className='img-container'>
                    {image ? <img src={image} alt={title} /> : null}
                </div>
                <div className='product-information'>
                    <h1 className='product-title'>{title}</h1>
                    <PriceTag product={product} />
                    {isInStock(product) ?
                        <div className='stock in'>המוצר במלאי</div> :
                        <div className='stock out'>המוצר לא קיים במלאי. צור קשר לבירור זמן אספקה.</div>}
                    {description ? <p className='product-description'>{description}</p> : null}
                    <div className='buy-box'>
                        <h2>לרכישה</h2>
                        <MakeContact withIcons alignRight />
                    </div>
                </div>
                {hasRichText(details) ? (
                    <section className='product-details'>
                        <h2>פרטים נוספים</h2>
                        <RichText html={details} />
                    </section>
                ) : null}
            </div>
        </article>
    );
}

export default ProductPage;
