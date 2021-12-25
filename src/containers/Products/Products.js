import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet'
import SideMenu from '../../components/SideMenu/SideMenu';
import MobileMenu from '../../components/MobileMenu/MobileMenu';
import ProductPreview from '../../components/Product/ProductPreview';
import ProductPage from '../../components/Product/ProductPage';
import Loader from '../../components/Loader/Loader';
import { Switch, Route, useParams } from 'react-router-dom';
import { fireDb } from "../../firebase";
import './Products.css';

const Products = () => {
    const [information, setInformation] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Loading indicator
    let { category, subcategory, id } = useParams();

    // This hook is used to fetch the information from firebase
    useEffect(() => {
        setIsLoading(true)
        fireDb.ref().child('products').on('value', snapshot => {
            if (snapshot.val() != null) {
                setInformation({ ...snapshot.val() })
                setIsLoading(false)
            }
        })
    }, [])


    // This hook is used for filtering
    useEffect(() => {
        let productsTemp = Object.keys(information)
            .filter((id) => (
                (!category ||
                (category === information[id].category && !subcategory) ||
                (subcategory === information[id].subcategory)) &&
                information[id].hide !== true
                ))
            .sort((idA, idB) => parseInt((information[idB].priority) || 0) - (parseInt(information[idA].priority) || 0))
            .map(id => <ProductPreview key={id} product={information[id]} id={id} />)
        setProducts(productsTemp);
    }, [category, subcategory, information])


    return (
        <div className='page-container products-page'>
            <Helmet>
                <title>מוצרים - Rally Trip</title>
                <meta name="description" content='בראלי טריפ ניתן לרכוש מגווון מוצרים הקשורים לעולם הראלי רייד ולשטח בכלל. ספרי דרך, מכשירי גרמין, דיבוריות, מצלמות גופרו ועוד' />
            </Helmet>
            <Switch>
                <Route path='/products/:category/:subcategory/:id'>
                    <ProductPage product={information[id]} id={id} />
                </Route>
                <Route exact path={["/products/:category/:subcategory", "/products/:category", "/products"]}>
                    <SideMenu />
                    <MobileMenu />
                    <div className='products-container'>
                        {isLoading ? <Loader /> : null}
                        {!products.length && !isLoading ? 'לא נמצאו מוצרים.' : products}
                    </div>
                </Route>
            </Switch>

        </div>
    );
}

export default Products;


        // @@ this code is used to migrate from the json file @@
        // migrate.forEach(product => {
        //     let newProduct = fireDb.ref().child('products').push();
        //     newProduct.set(product, (err) => {
        //         if (err)
        //             console.log(err)
        //     })
        // })