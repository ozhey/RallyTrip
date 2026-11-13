import MakeContact from './MakeContact';
import Breadcrumbs from './Breadcrumbs';
import RichText from '../RichText';
import { hasRichText } from '@/lib/richText';
import { isInStock, pagePrice } from '@/lib/products';
import './Product.css';

const PriceTag = ({ product }) => {
    const info = pagePrice(product);
    if (info.kind === 'discount') {
        return <>
            <div className='price'>{info.discount}</div>
            <div style={{ textDecoration: 'line-through', paddingRight: '7px' }}>{`₪${info.price}`}</div>
        </>;
    }
    if (info.kind === 'price') return <div className='price'>{`₪${info.price}`}</div>;
    return <div className='price'>צור קשר לקבלת מחיר</div>;
}

const ProductPage = ({ product, details, category, subcategory }) => {
    const { title = '', description = '', image = '' } = product;

    return (
        <article style={{ width: '100%' }}>
            <Breadcrumbs category={category} subcategory={subcategory} title={title} />
            <div className='product-grid'>
                <div className='img-container'>
                    {image ? <img src={image} alt={title} /> : ''}
                </div>
                <div className='product-information'>
                    <h1 className='product-title'>{title}</h1>
                    <div className='divider'></div>
                    <PriceTag product={product} />
                    <h4>{description}</h4>
                    {isInStock(product) ?
                        <div style={{ color: 'green', paddingRight: '7px' }}>&#9745; המוצר במלאי </div> :
                        <div style={{ color: 'red', paddingRight: '7px' }}>&#9746; המוצר לא קיים במלאי. צור קשר לבירור זמן אספקה. </div>}
                    <h2 style={{ textAlign: 'center' }}>לרכישה</h2>
                    <MakeContact withIcons />
                </div>
                <div className='grid-bottom'>
                    {/* The old markup had a stray space here that adds one line of spacing; kept for visual parity. */}
                    {' '}
                    {hasRichText(details) ? <h3 style={{ padding: '12px 15px 0px' }}>פרטים נוספים</h3> : ''}
                    <div style={{ padding: '15px' }}>
                        <RichText html={details} />
                    </div>
                </div>
            </div>
        </article>
    );
}

export default ProductPage;
