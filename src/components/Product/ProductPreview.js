import Link from 'next/link';
import { previewPrice, productPath } from '@/lib/products';
import { withSlash } from '@/lib/site';
import './Product.css';

const PriceTag = ({ product }) => {
    const info = previewPrice(product);
    if (info.kind === 'discount') {
        return (
            <div className='preview-price sale'>
                {`₪${info.sale}`} <span className='preview-old-price'>{`₪${info.price}`}</span>
            </div>
        );
    }
    if (info.kind === 'price') return <div className='preview-price'>{`₪${info.price}`}</div>;
    return <div className='preview-price contact'>צור קשר לקבלת מחיר</div>;
}

const ProductPreview = ({ product, id }) => {
    const { image, title } = product;
    const onSale = previewPrice(product).kind === 'discount';
    return (
        <Link href={withSlash(productPath(id, product))} className='preview-link'>
            <article className='preview-container'>
                <div className='preview-top'>
                    {onSale ? <span className='sale-badge'>מבצע</span> : null}
                    {image ? <img className='preview-img' src={image} alt={title} loading='lazy' /> : null}
                </div>
                <div className='preview-bot'>
                    <div className='preview-title'>{title}</div>
                    <PriceTag product={product} />
                    <span className='card-cta'>לפרטים נוספים</span>
                </div>
            </article>
        </Link>
    );
}

export default ProductPreview;
