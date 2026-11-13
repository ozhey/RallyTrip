'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import ReactQuill from 'react-quill-new';
import { get, onValue, push, ref, update } from 'firebase/database';
import { deleteObject, getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import { getFirebase } from '@/lib/firebase/client';
import { categoryOptions, subcategoryOptions } from '@/lib/products';
import { normalizeQuillSpaces } from '@/lib/quillHtml';
import ImageUploader from './ImageUploader';
import Loader from '../../components/Loader/Loader';
import Dialog from '../../components/Dialog/Dialog';
import { modules, formats, EMPTY_EDITOR_VALUE } from './quillConfig';
import { PUBLISH_NOTE, refreshPublicPages } from './refresh';
import 'react-quill-new/dist/quill.snow.css';
import './Admin.css';

const CATEGORY_OPTIONS = categoryOptions().map(({ value, label }) => <option key={value} value={value}>{label}</option>);
const EMPTY_PRODUCT = { title: '', description: '', price: '', stock: '', category: categoryOptions()[0]?.value ?? '', subcategory: '', priority: '', hide: false, discount: '', image: undefined };

// Uploads a product image and resolves to its download URL.
async function uploadProductImage(storage, productId, file) {
    const task = uploadBytesResumable(storageRef(storage, `products/${productId}/image.png`), file);
    task.on('state_changed', (snapshot) => {
        console.log('Upload is ' + Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + '% done');
    });
    await task;
    return getDownloadURL(task.snapshot.ref);
}

const ProductManager = ({ action }) => {
    const { db, auth, storage } = getFirebase();

    // The edited product form. shouldUnregister drops fields that disappear (e.g. subcategory
    // after switching to a category without subcategories), like react-hook-form v6 did.
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm({ shouldUnregister: true, defaultValues: EMPTY_PRODUCT });
    const { register: register2, control: pickerControl } = useForm(); // The product picker form

    // Quill data, tagged with the product it belongs to so a slow load can't overwrite another product.
    const [editor, setEditor] = useState({ id: undefined, value: EMPTY_EDITOR_VALUE });
    const [productsInfo, setProductsInfo] = useState({}); // All products from firebase
    const [currentProductId, setCurrentProductId] = useState(); // The product being edited
    const [isLoading, setIsLoading] = useState(false);
    const [dialogContent, setDialogContent] = useState(false);

    const [category, subcategory, selectedProductId] = useWatch({ control: pickerControl, name: ['category', 'subcategory', 'product-id'] });
    const [categorySelectedProd, uploadedImage] = useWatch({ control, name: ['category', 'image'] });
    const currentProduct = currentProductId ? productsInfo[currentProductId] : undefined;

    const onSubmit = async (data) => {
        setIsLoading(true);
        const { image, ...product } = data;
        if (!product.subcategory) product.subcategory = 'sc'; // no subcategory → 'sc' just to organize the data
        product.hide = Boolean(product.hide);
        // New product → generate a key locally (no write yet).
        const productKey = currentProductId || push(ref(db, 'products')).key;
        try {
            if (image && image[0]) { // A new image overwrites the old one.
                product.image = await uploadProductImage(storage, productKey, image[0]);
            } else if (currentProduct?.image) { // No new image → keep the old one.
                product.image = currentProduct.image;
            }
            // Write the product and its rich-text details together.
            await update(ref(db), {
                ['/products/' + productKey]: product,
                ['/quill/' + productKey]: normalizeQuillSpaces(editor.value),
            });
            await refreshPublicPages(auth, ['products']);
            setDialogContent('ההעלאה בוצעה בהצלחה.' + PUBLISH_NOTE);
            selectProduct(); // clear the form (and close it in "update" mode)
        } catch (error) {
            setDialogContent('תקלה :' + error);
        } finally {
            setIsLoading(false);
        }
    }

    const deleteProduct = async () => {
        if (!window.confirm(`אתה עומד למחוק את המוצר "${currentProduct.title}". האם אתה בטוח?`)) return;
        setIsLoading(true);
        const id = currentProductId;
        if (currentProduct?.image) {
            deleteObject(storageRef(storage, currentProduct.image))
                .then(() => console.log('image deleted successfully!'))
                .catch((error) => console.log('error in deleting image:' + error));
        }
        selectProduct();
        try {
            await update(ref(db), { ['/products/' + id]: null, ['/quill/' + id]: null });
            await refreshPublicPages(auth, ['products']);
            setDialogContent('המוצר נמחק בהצלחה.' + PUBLISH_NOTE);
        } catch (error) {
            setDialogContent('תקלה :' + error);
        } finally {
            setIsLoading(false);
        }
    }

    // Load a product (or nothing, for a clean "new product" form) into the form and editor.
    const selectProduct = (id) => {
        setCurrentProductId(id);
        setEditor({ id, value: EMPTY_EDITOR_VALUE });
        if (!id) {
            reset(EMPTY_PRODUCT);
            return;
        }
        const { title = '', description = '', price = 0, stock = 0, category = '', subcategory = '', priority = 0, hide = false, discount = '' } = productsInfo[id] ?? {};
        reset({ title, description, price, stock, category, subcategory, priority, hide, discount, image: undefined });
        get(ref(db, `quill/${id}`)).then((snapshot) => {
            setEditor((prev) => (prev.id === id ? { id, value: snapshot.val() ?? EMPTY_EDITOR_VALUE } : prev));
        });
    };

    // Product list (only needed when editing).
    useEffect(() => {
        if (action !== 'update product') return undefined;
        return onValue(ref(db, 'products'), (snapshot) => setProductsInfo(snapshot.val() ?? {}));
    }, [action, db]);

    const productOptions = Object.keys(productsInfo)
        .filter((id) => (!category ||
            (category === productsInfo[id].category && !subcategory) ||
            subcategory === productsInfo[id].subcategory))
        .map(id => <option key={id} value={id}>{productsInfo[id].title}</option>);

    const pickerSubOptions = subcategoryOptions(category);
    const formSubOptions = subcategoryOptions(categorySelectedProd);

    return (
        <article>
            <Dialog dialogContent={dialogContent} setDialogContent={setDialogContent} />
            <form className="form--compressed">
                {action === 'update product' ?
                    <>
                        <h3>בחירת מוצר לעריכה/מחיקה</h3>
                        <label htmlFor='pick-category'>קטגוריה: </label>
                        <select id='pick-category' {...register2('category', { required: true })}>
                            {CATEGORY_OPTIONS}
                        </select>
                        {pickerSubOptions.length ? <>
                            <label htmlFor='pick-subcategory'>תת קטגוריה: </label>
                            <select id='pick-subcategory' {...register2('subcategory', { required: true, shouldUnregister: true })}>
                                {pickerSubOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                            </select>
                        </> : null}
                        <label htmlFor='pick-product'>שם מוצר: </label>
                        <select id='pick-product' {...register2('product-id', { required: true })}>
                            {productOptions}
                        </select>
                        <div>
                            <button className='button green' type='button' onClick={() => selectProduct(selectedProductId || productOptions[0]?.key)}>ערוך מוצר נבחר</button>
                        </div>
                    </>
                    : null}
            </form>
            {(action === 'update product' && !currentProductId) ? null : // If you chose update and there's no current product, dont show the form
                <form onSubmit={handleSubmit(onSubmit)} className='form'>
                    <h2 style={{ paddingBottom: '10px' }}>{currentProductId ? `עדכון מוצר "${currentProduct?.title ?? ''}"` : 'הוספת מוצר'}</h2>
                    <label htmlFor='title'>כותרת</label>
                    <input id='title' type="text" {...register('title', { required: true })} placeholder="כותרת" />
                    {errors.title && <span className="error">יש להכניס כותרת</span>}
                    <label htmlFor='price'>מחיר</label>
                    <input id='price' type='number' {...register('price', { required: true })} placeholder="מחיר" />
                    {errors.price && <span className="error">יש לציין מחיר. כדי שיופיע &quot;צור קשר לקבלת מחיר&quot;, יש לציין מחיר 0</span>}
                    <label htmlFor='discount'>מחיר מבצע</label>
                    <input id='discount' type='text' {...register('discount')} placeholder="מחיר מבצע" />
                    <label htmlFor='description'>תיאור</label>
                    <textarea id='description' {...register('description')} placeholder="תיאור" />
                    <label htmlFor='category'>קטגוריה</label>
                    <select id='category' {...register('category', { required: true })}>
                        {CATEGORY_OPTIONS}
                    </select>
                    {formSubOptions.length ? <>
                        <label htmlFor='subcategory'> תת קטגוריה:  </label>
                        <select id='subcategory' {...register('subcategory', { required: true })}>
                            {formSubOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                        </select>
                        {errors.subcategory && <span className="error">יש לציין תת קטגוריה</span>}
                    </> : null}
                    <label htmlFor='stock'>מלאי</label>
                    <input id='stock' type='number' {...register('stock', { required: true })} placeholder="מלאי" />
                    {errors.stock && <span className="error">יש להכניס מספר מוצרים במלאי</span>}
                    <label htmlFor='priority'> עדיפות (מוצר בעל ערך גבוה יוצג יותר למעלה)</label>
                    <input id='priority' type='number' {...register('priority')} placeholder="עדיפות" />
                    <label htmlFor='hide'> הסתר מוצר </label>
                    <input id='hide' type='checkbox' {...register('hide')} />
                    <label>תמונה</label>
                    <ImageUploader product={currentProduct} uploadedImage={uploadedImage} registration={register('image')} />
                    <label style={{ padding: '5px 0px 7px' }}>מידע נוסף</label>
                    <ReactQuill theme="snow" value={editor.value} onChange={(value) => setEditor((prev) => ({ ...prev, value }))} modules={modules} formats={formats} />
                    <div>
                        <input type="submit" value={action === 'add product' ? 'העלה מוצר' : 'שמור שינויים'} className='button green big' />
                        {currentProductId ? <button className='button red big' type='button' onClick={deleteProduct}>מחק מוצר</button> : null}
                    </div>
                </form>}
            {isLoading ? <Loader fullscreen /> : null}
        </article>
    );
}

export default ProductManager;
