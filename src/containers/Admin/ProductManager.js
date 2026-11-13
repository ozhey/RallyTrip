'use client';

import { useEffect, useRef, useState } from 'react';
import { onValue, ref, update } from 'firebase/database';
import { deleteObject, ref as storageRef } from 'firebase/storage';
import { getFirebase } from '@/lib/firebase/client';
import Loader from '../../components/Loader/Loader';
import Dialog from '../../components/Dialog/Dialog';
import ProductList from './ProductList';
import ProductForm, { errorContent } from './ProductForm';
import { PUBLISH_NOTE, refreshPublicPages } from './refresh';
import './Admin.css';

/**
 * Products section: the product list, or the editor for one product.
 * productParam (from the URL): null → list, 'new' → new-product form, otherwise a product id.
 */
const ProductManager = ({ productParam, navigate, onDirtyChange }) => {
    const { db, auth, storage } = getFirebase();
    const [products, setProducts] = useState({}); // All products from firebase
    const [loaded, setLoaded] = useState(false);
    const [filters, setFilters] = useState({ search: '', category: '', subcategory: '' }); // kept while going list ↔ editor
    const [isLoading, setIsLoading] = useState(false);
    const [dialogContent, setDialogContent] = useState(false);
    const deletingRef = useRef(null); // product being deleted here (its disappearance is expected)

    const isNew = productParam === 'new';
    const productId = productParam && !isNew ? productParam : undefined;
    const product = productId ? products[productId] : undefined;

    useEffect(() => onValue(ref(db, 'products'), (snapshot) => {
        setProducts(snapshot.val() ?? {});
        setLoaded(true);
    }), [db]);

    // The open product no longer exists (bad link, or deleted elsewhere) → back to the list.
    useEffect(() => {
        if (loaded && productId && !product && deletingRef.current !== productId) {
            navigate({}, { replace: true, force: true });
            setDialogContent('המוצר לא נמצא — אולי הוא נמחק.');
        }
    }, [loaded, productId, product, navigate]);

    const deleteProduct = async (id) => {
        const { image } = products[id] ?? {};
        setIsLoading(true);
        deletingRef.current = id;
        try {
            await update(ref(db), { ['/products/' + id]: null, ['/quill/' + id]: null });
            navigate({}, { replace: true, force: true });
            if (image) {
                deleteObject(storageRef(storage, image))
                    .catch((error) => console.error('Failed to delete product image:', error));
            }
            await refreshPublicPages(auth, ['products']);
            setDialogContent('המוצר נמחק בהצלחה.' + PUBLISH_NOTE);
        } catch (error) {
            setDialogContent(errorContent('המחיקה נכשלה. כדאי לבדוק את החיבור לאינטרנט ולנסות שוב.', error));
        } finally {
            deletingRef.current = null;
            setIsLoading(false);
        }
    };

    let content;
    if (!productParam) {
        content = <ProductList products={products} loaded={loaded} filters={filters} setFilters={setFilters}
            onOpen={(id) => navigate({ product: id })} onNew={() => navigate({ product: 'new' })} />;
    } else if (productId && !product) {
        content = <Loader />; // still loading (or about to go back to the list)
    } else {
        content = <ProductForm key={productParam} productId={productId} product={product} products={products}
            onBack={() => navigate({})}
            onCreated={(id) => navigate({ product: id }, { replace: true, force: true })}
            onDelete={deleteProduct}
            onDirtyChange={onDirtyChange} setBusy={setIsLoading} notify={setDialogContent} />;
    }

    return (
        <article>
            <Dialog dialogContent={dialogContent} setDialogContent={setDialogContent} />
            {content}
            {isLoading ? <Loader fullscreen /> : null}
        </article>
    );
};

export default ProductManager;
