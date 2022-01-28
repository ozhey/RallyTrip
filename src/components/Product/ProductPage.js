import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ReactQuill from 'react-quill';
import MakeContact from './MakeContact';
import Breadcrumbs from './Breadcrumbs';
import Loader from '../Loader/Loader';
import { fireDb } from "../../firebase";


import './Product.css';

const ProductPage = ({ product = {}, id }) => {
    const { title = '', description = '', price = 0, stock = 0, image = '', discount = "" } = product;
    const [quillData, setQuillData] = useState('');

    let priceTag;
    if (price > 0 && discount !== "") {
        priceTag = <>
            <div className='price'>{discount}</div>
            <div style={{ textDecoration: 'line-through', paddingRight: '7px' }}>{`₪${price}`}</div>
        </>
    } else if (price > 0) {
        priceTag = <div className='price'>{`₪${price}`}</div>
    } else {
        priceTag = <div className='price'>צור קשר לקבלת מחיר</div>
    }


    // After the current product id changes, we will change the fields accordingly
    useEffect(() => {
        fireDb.ref(`quill/${id}`).on('value', snapshot => {
            if (snapshot.val() != null) {
                setQuillData(snapshot.val())
            }
        })
    }, [id])

    if (Object.keys(product).length === 0 && product.constructor === Object) {
        return <Loader />
    } else {
        return (
            <article style={{ width: '100%' }}>
                <Helmet>
                    <title>{title + ' | ראלי טריפ'}</title>
                    <meta name="description" content={description} />
                </Helmet>
                <Breadcrumbs title={title} />
                <div className='product-grid'>
                    <div className='img-container'>
                        {title ? <img src={image} alt='product' /> : ''}
                    </div>
                    <div className='product-information'>
                        <h2>{title}</h2>
                        <div className='divider'></div>
                        {priceTag}
                        <h4>{description}</h4>
                        {parseInt(stock) ?
                            <div style={{ color: 'green', paddingRight: '7px' }}>&#9745; המוצר במלאי </div> :
                            <div style={{ color: 'red', paddingRight: '7px' }}>&#9746; המוצר לא קיים במלאי. צור קשר לבירור זמן אספקה. </div>}
                        <h2 style={{ textAlign: 'center' }}>לרכישה</h2>
                        <MakeContact withIcons />
                    </div>
                    <div className='grid-bottom'> {/*The length of blank quill data with rtl is 51 */}
                        {quillData.length > 51 ? <h3 style={{ padding: '12px 15px 0px' }}>פרטים נוספים</h3> : ''}
                        <div style={{ padding: '15px' }}>
                            <ReactQuill theme="bubble" value={quillData} readOnly />
                        </div>
                    </div>
                </div>
            </article >
        );
    }
}


export default ProductPage;
