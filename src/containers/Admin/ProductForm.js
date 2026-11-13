'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import ReactQuill from 'react-quill-new';
import { get, push, ref, update } from 'firebase/database';
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import { getFirebase } from '@/lib/firebase/client';
import { categoryOptions, pagePrice, priorityOf, subcategoryOptions, toNumber } from '@/lib/products';
import { normalizeQuillSpaces } from '@/lib/quillHtml';
import ImageUploader from './ImageUploader';
import { modules, formats, EMPTY_EDITOR_VALUE } from './quillConfig';
import { PUBLISH_NOTE, refreshPublicPages } from './refresh';
import 'react-quill-new/dist/quill.snow.css';
import './Admin.css';

const CATEGORY_OPTIONS = categoryOptions().map(({ value, label }) => <option key={value} value={value}>{label}</option>);
const EMPTY_PRODUCT = { title: '', description: '', price: '', stock: '', category: categoryOptions()[0]?.value ?? '', subcategory: '', priority: '', hide: false, discount: '', image: undefined };

/** Form values for a product (or a blank new product), plus an old free-text discount to show as a note. */
function toFormValues(product) {
    if (!product) return { values: EMPTY_PRODUCT, legacyDiscount: '' };
    const str = (v) => (v == null ? '' : String(v));
    // Older products may hold free text in "discount"; keep only a plain number and show the old text.
    const rawDiscount = str(product.discount).trim();
    const discountNumber = toNumber(rawDiscount);
    const discount = discountNumber > 0 ? String(discountNumber) : '';
    return {
        values: {
            title: str(product.title), description: str(product.description), price: str(product.price), stock: str(product.stock),
            category: str(product.category), subcategory: str(product.subcategory), priority: str(product.priority),
            hide: product.hide === true, discount, image: undefined,
        },
        legacyDiscount: rawDiscount && rawDiscount !== discount ? rawDiscount : '',
    };
}

// Uploads a product image and resolves to its download URL.
async function uploadProductImage(storage, productId, file) {
    const task = uploadBytesResumable(storageRef(storage, `products/${productId}/image.png`), file);
    await task;
    return getDownloadURL(task.snapshot.ref);
}

// Sale price must be a positive number below the regular price (or empty for no sale).
function validateDiscount(value, { price }) {
    if (value === '' || value == null) return true;
    if (!(toNumber(price) > 0)) return 'מחיר מבצע אפשרי רק כשיש מחיר רגיל';
    const sale = toNumber(value);
    if (!(sale > 0)) return 'יש להכניס מספר בלבד, למשל 150';
    if (sale >= toNumber(price)) return 'מחיר המבצע חייב להיות נמוך מהמחיר הרגיל';
    return true;
}

export const errorContent = (title, error) => (
    <>
        {title}
        <div className='dialog-detail'>{String(error)}</div>
    </>
);

// How the price will look on the site, using the same rules as the product cards/page.
const PricePreview = ({ price, discount }) => {
    const info = pagePrice({ price, discount });
    return (
        <div className='price-preview' aria-live='polite'>
            <span className='hint'>כך יופיע באתר:</span>
            {info.kind === 'discount' ? <>
                <span className='pp-price sale'>{`₪${info.sale}`}</span>
                <span className='pp-old'>{`₪${info.price}`}</span>
                <span className='pp-badge'>{`${info.percentOff}% הנחה`}</span>
            </> : info.kind === 'price' ?
                <span className='pp-price'>{`₪${info.price}`}</span> :
                <span className='pp-price contact'>צור קשר לקבלת מחיר</span>}
        </div>
    );
};

/**
 * Add/edit form for one product. Mounted per product (key), so its starting values come from `product`.
 * productId undefined = new product. The parent owns navigation, the loader and the dialog.
 */
/** Other visible products in a category that have a priority, highest first, as "name (n)". */
function prioritizedPeers(products, category, productId, limit = 6) {
    return Object.entries(products ?? {})
        .filter(([id, p]) => id !== productId && p.category === category && p.hide !== true && priorityOf(p) > 0)
        .sort(([, a], [, b]) => priorityOf(b) - priorityOf(a))
        .slice(0, limit)
        .map(([, p]) => `${String(p.title ?? '').trim()} (${priorityOf(p)})`);
}

const ProductForm = ({ productId, product, products, onBack, onCreated, onDelete, onDirtyChange, setBusy, notify }) => {
    const { db, auth, storage } = getFirebase();
    const [initial] = useState(() => toFormValues(product));

    // shouldUnregister drops fields that disappear (e.g. subcategory after switching to a
    // category without subcategories), like react-hook-form v6 did.
    const { register, handleSubmit, formState: { errors, dirtyFields }, control, reset } = useForm({ shouldUnregister: true, defaultValues: initial.values });

    // Quill data. touched: the user typed in the editor (Quill also fires onChange when it normalizes loaded HTML).
    const [editor, setEditor] = useState({ value: EMPTY_EDITOR_VALUE, touched: false });
    const [legacyDiscount, setLegacyDiscount] = useState(initial.legacyDiscount);

    const [categorySelectedProd, uploadedImage, price, discount] = useWatch({ control, name: ['category', 'image', 'price', 'discount'] });
    const isDirty = Object.keys(dirtyFields).length > 0 || editor.touched;
    const peers = prioritizedPeers(products, categorySelectedProd, productId);

    useEffect(() => { onDirtyChange(isDirty); }, [isDirty, onDirtyChange]);

    // Rich-text details of an existing product.
    useEffect(() => {
        if (!productId) return undefined;
        let cancelled = false;
        get(ref(db, `quill/${productId}`)).then((snapshot) => {
            if (!cancelled) setEditor({ value: snapshot.val() ?? EMPTY_EDITOR_VALUE, touched: false });
        });
        return () => { cancelled = true; };
    }, [db, productId]);

    const onSubmit = async (data) => {
        setBusy(true);
        const { image, ...saved } = data;
        if (!saved.subcategory) saved.subcategory = 'sc'; // no subcategory → 'sc' just to organize the data
        saved.hide = Boolean(saved.hide);
        saved.discount = String(saved.discount ?? '').trim();
        // New product → generate a key locally (no write yet).
        const productKey = productId || push(ref(db, 'products')).key;
        try {
            if (image && image[0]) { // A new image overwrites the old one.
                saved.image = await uploadProductImage(storage, productKey, image[0]);
            } else if (product?.image) { // No new image → keep the old one.
                saved.image = product.image;
            }
            // Write the product and its rich-text details together.
            await update(ref(db), {
                ['/products/' + productKey]: saved,
                ['/quill/' + productKey]: normalizeQuillSpaces(editor.value),
            });
            await refreshPublicPages(auth, ['products']);
            notify('ההעלאה בוצעה בהצלחה.' + PUBLISH_NOTE);
            if (productId) { // keep the product open, with the saved values as the new baseline
                reset({ ...data, discount: saved.discount, image: undefined });
                setEditor((prev) => ({ ...prev, touched: false }));
                setLegacyDiscount('');
            } else {
                onCreated(productKey); // open the new product for editing
            }
        } catch (error) {
            notify(errorContent('השמירה נכשלה. כדאי לבדוק את החיבור לאינטרנט ולנסות שוב.', error));
        } finally {
            setBusy(false);
        }
    }

    const confirmDelete = () => {
        if (window.confirm(`אתה עומד למחוק את המוצר "${product?.title ?? ''}". האם אתה בטוח?`)) onDelete(productId);
    };

    const formSubOptions = subcategoryOptions(categorySelectedProd);

    return (
                <form onSubmit={handleSubmit(onSubmit)} className='form product-form' noValidate>
                    <button type='button' className='back-link' onClick={onBack}>→ חזרה לרשימה</button>
                    <h2>{productId ? `עדכון מוצר "${product?.title ?? ''}"` : 'הוספת מוצר'}</h2>

                    <fieldset className='form-section'>
                        <legend>פרטי מוצר</legend>
                        <div className='field'>
                            <label htmlFor='title'>כותרת</label>
                            <input id='title' type="text" {...register('title', { required: true })} placeholder="שם המוצר" />
                            {errors.title && <span className="error">יש להכניס כותרת</span>}
                        </div>
                        <div className='field'>
                            <label htmlFor='description'>תיאור</label>
                            <textarea id='description' {...register('description')} placeholder="תיאור קצר שיופיע ליד המחיר" />
                        </div>
                    </fieldset>

                    <fieldset className='form-section'>
                        <legend>מחיר ומבצע</legend>
                        <div className='field-grid'>
                            <div className='field'>
                                <label htmlFor='price'>מחיר</label>
                                <input id='price' type='number' inputMode='decimal' min='0' {...register('price', { required: true })} placeholder="למשל 200" />
                                <span className='hint'>מחיר 0 = באתר יופיע &quot;צור קשר לקבלת מחיר&quot;</span>
                                {errors.price && <span className="error">יש לציין מחיר (אפשר 0)</span>}
                            </div>
                            <div className='field'>
                                <label htmlFor='discount'>מחיר מבצע (לא חובה)</label>
                                <input id='discount' type='number' inputMode='decimal' min='0' {...register('discount', { validate: validateDiscount, deps: ['price'] })} placeholder="למשל 150" />
                                <span className='hint'>השאר ריק אם אין מבצע. מספר בלבד, נמוך מהמחיר הרגיל.</span>
                                {legacyDiscount ? <span className='hint legacy'>בעבר נכתב כאן: &quot;{legacyDiscount}&quot; — עכשיו נשמר רק מספר.</span> : null}
                                {errors.discount && <span className="error">{errors.discount.message}</span>}
                            </div>
                        </div>
                        <PricePreview price={price} discount={discount} />
                    </fieldset>

                    <fieldset className='form-section'>
                        <legend>קטגוריה</legend>
                        <div className='field-grid'>
                            <div className='field'>
                                <label htmlFor='category'>קטגוריה</label>
                                <select id='category' {...register('category', { required: true })}>
                                    {CATEGORY_OPTIONS}
                                </select>
                            </div>
                            {formSubOptions.length ?
                                <div className='field'>
                                    <label htmlFor='subcategory'>תת קטגוריה</label>
                                    <select id='subcategory' {...register('subcategory', { required: true })}>
                                        {formSubOptions.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
                                    </select>
                                    {errors.subcategory && <span className="error">יש לציין תת קטגוריה</span>}
                                </div> : null}
                        </div>
                    </fieldset>

                    <fieldset className='form-section'>
                        <legend>מלאי ותצוגה</legend>
                        <div className='field-grid'>
                            <div className='field'>
                                <label htmlFor='stock'>מלאי</label>
                                <input id='stock' type='number' inputMode='numeric' min='0' {...register('stock', { required: true })} placeholder="כמה יחידות יש" />
                                <span className='hint'>0 = באתר יופיע &quot;המוצר לא קיים במלאי&quot;</span>
                                {errors.stock && <span className="error">יש להכניס מספר מוצרים במלאי (אפשר 0)</span>}
                            </div>
                            <div className='field'>
                                <label htmlFor='priority'>עדיפות בתצוגה</label>
                                <input id='priority' type='number' inputMode='numeric' {...register('priority')} placeholder="0" />
                                <span className='hint'>
                                    מספר גבוה = מופיע ראשון ברשימות באתר.
                                    ריק או 0 = סדר רגיל (מוצרים במלאי קודם, ואז לפי שם).
                                    {peers.length ?
                                        <span className='priority-peers'>{`כבר מקודמים בקטגוריה: ${peers.join(' · ')}`}</span> : null}
                                </span>
                            </div>
                        </div>
                        <label className='checkbox-row' htmlFor='hide'>
                            <input id='hide' type='checkbox' {...register('hide')} />
                            <span>הסתר מוצר מהאתר <span className='hint'>(המוצר נשמר אבל לא מופיע ללקוחות)</span></span>
                        </label>
                    </fieldset>

                    <fieldset className='form-section'>
                        <legend>תמונה</legend>
                        <ImageUploader product={product} uploadedImage={uploadedImage} registration={register('image')} />
                    </fieldset>

                    <fieldset className='form-section'>
                        <legend>מידע נוסף</legend>
                        <span className='hint'>יופיע בעמוד המוצר תחת &quot;פרטים נוספים&quot;</span>
                        <ReactQuill theme="snow" value={editor.value} modules={modules} formats={formats}
                            onChange={(value, _delta, source) => setEditor((prev) => ({ ...prev, value, touched: prev.touched || source === 'user' }))} />
                    </fieldset>

                    <div className='form-actions'>
                        <input type="submit" value={productId ? 'שמור שינויים' : 'העלה מוצר'} className={'button green big' + (isDirty ? ' is-dirty' : '')} />
                        <button className='button' type='button' onClick={onBack}>ביטול</button>
                        {isDirty ? <span className='hint unsaved'>יש שינויים שלא נשמרו</span> : null}
                        {productId ? <button className='button danger-outline' type='button' onClick={confirmDelete}>מחק מוצר</button> : null}
                    </div>
                </form>
    );
}

export default ProductForm;
