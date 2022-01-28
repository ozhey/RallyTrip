    import React from 'react';
import { Link } from 'react-router-dom';
import './Product.css';

const ProductPreview = ({ product, id }) => {
    const { image, title, price = 0, category, subcategory, discount = ""} = product;
    let priceTag;
    if (discount !== "") {
        priceTag = <div style={{ color: 'red', fontWeight: 'bold', fontSize: '17px', marginBottom: '10px' }}>{discount}</div>
    } else if (price > 0) {
        priceTag = <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{`₪${price}`}</div>
    } else {
        priceTag = <div style={{ marginBottom: '10px' }}>צור קשר לקבלת מחיר</div>
    }

    return (
        <Link to={`/products/${category}/${subcategory}/${id}`} >
            <article className='preview-container'>
                <div className='preview-top'>
                    <img className='preview-img' src={image} alt='product' />
                </div>
                <div className='preview-bot'>
                    <div style={{ fontWeight: 'bold', textAlign: 'center' }}>{title}</div>
                    <div className='divider'></div>
                    {priceTag}
                    <button className='btn'>לפרטים נוספים</button>
                </div>
            </article>
        </Link>
    );
}

export default ProductPreview;
