import Link from 'next/link';
import { previewPrice, productPath } from '@/lib/products';
import { withSlash } from '@/lib/site';
import './Product.css';

const PriceTag = ({ product }) => {
    const info = previewPrice(product);
    if (info.kind === 'discount') {
        return <div style={{ color: 'red', fontWeight: 'bold', fontSize: '17px', marginBottom: '10px' }}>{info.discount}</div>;
    }
    if (info.kind === 'price') {
        return <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{`₪${info.price}`}</div>;
    }
    return <div style={{ marginBottom: '10px' }}>צור קשר לקבלת מחיר</div>;
}

const ProductPreview = ({ product, id }) => {
    const { image, title } = product;
    return (
        <Link href={withSlash(productPath(id, product))}>
            <article className='preview-container'>
                <div className='preview-top'>
                    <img className='preview-img' src={image} alt={title} loading='lazy' />
                </div>
                <div className='preview-bot'>
                    <div style={{ fontWeight: 'bold', textAlign: 'center' }}>{title}</div>
                    <div className='divider'></div>
                    <PriceTag product={product} />
                    {/* Kept as <button> for visual parity; becomes a styled span in the visual refresh. */}
                    <button type='button' className='btn' tabIndex={-1}>לפרטים נוספים</button>
                </div>
            </article>
        </Link>
    );
}

export default ProductPreview;
