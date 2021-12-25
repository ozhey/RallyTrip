import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form"
import ReactQuill from 'react-quill';
import ImageUploader from './ImageUploader';
import Loader from '../../components/Loader/Loader';
import Dialog from '../../components/Dialog/Dialog';
import { links } from '../../links';
import { fireDb, fireStorage } from "../../firebase";
import { modules, formats } from './quillConfig'
import 'react-quill/dist/quill.snow.css';
import './Admin.css';

const categoriesOptions = links.map(link => <option key={link.path} value={link.path.slice(link.path.lastIndexOf('/') + 1)}>{link.name}</option>)

const ProductManager = ({ action }) => {

    const { register, handleSubmit, errors, watch, reset } = useForm(); // The edited product form
    const { register: register2, watch: watch2 } = useForm({ defaultValues: { todo: "add" } }); // The menu form

    const [editorValue, setEditorValue] = useState(''); //Quill data
    const [productsOptions, setProductsOptions] = useState([]) // The product's names to be shown in the select tag 
    const [productsInfo, setProductsInfo] = useState({}) // The information about all of the products fetched from firebase
    const [subCatOptions, setSubCatOptions] = useState([]); // The sub categories options in the menu
    const [subCatOptSelectedProd, setSubCatOptSelectedProd] = useState([]); // The sub categories options in the selected product
    const [currentProductId, setCurrentProductId] = useState(); // The current edited product
    const [isLoading, setIsLoading] = useState(false); // Loading indicator
    const [dialogContent, setDialogContent] = useState(false); // Dialog handler

    const category = watch2("category");
    const subcategory = watch2("subcategory");
    const selectedProductId = watch2("product-id");
    const categorySelectedProd = watch("category");
    const uploadedImage = watch("image");

    const onSubmit = async (data) => {
        console.log("Upload proccess begun");
        setIsLoading(true);
        let { image, ...product } = data;
        let productKey = currentProductId;
        if (!product.subcategory) { //if there is no sub category, the default will be 'sc' just to organize the data
            product.subcategory = 'sc';
        }
        if (!productKey) { // if we are adding a new product and not editing, a new key will be generated.
            productKey = fireDb.ref().child('products').push().key; // create a new product reference
        }
        if (image[0]) { // if there's an image it will be uploaded. The old image will be overwritten.
            let downloadUrl = await uploadTaskPromise(productKey, image[0], 'image');
            product.image = downloadUrl; // Add the downloadUrl to the new product's information
        } else if (productsInfo[currentProductId] && productsInfo[currentProductId].image) { // if there isn't a new image, but there is an old image, keep the old one
            product.image = productsInfo[currentProductId].image;
        }
        // Write the new products's data simultaneously in the products list and the quill list.
        var updates = {};
        updates['/products/' + productKey] = product;
        updates['/quill/' + productKey] = editorValue;
        fireDb.ref().update(updates, (error) => {
            if (error) {
                setIsLoading(false);
                setDialogContent("תקלה :" + error);
            } else {
                setIsLoading(false);
                setDialogContent("ההעלאה בוצעה בהצלחה");
                if (!currentProductId) { //If it's a new product, make sure to reset all values after upload
                    reset({}); //reset field values
                    setEditorValue('<p class="ql-align-right ql-direction-rtl"><br></p>'); //reset quill value
                }
                setCurrentProductId();
            }
        });
    }

    const deleteProduct = () => {
        if (window.confirm(`אתה עומד למחוק את המוצר "${productsInfo[currentProductId].title}". האם אתה בטוח?`)) {
            setIsLoading(true);
            if (productsInfo[currentProductId] && productsInfo[currentProductId].image) {
                fireStorage.refFromURL(productsInfo[currentProductId].image)
                    .delete()
                    .then(() => {
                        console.log('image deleted successfully!')
                    }).catch((error) => {
                        console.log("error in deleting image:" + error);
                    });
            }
            let updates = {};
            updates['/products/' + currentProductId] = null;
            updates['/quill/' + currentProductId] = null;
            setCurrentProductId(); // reset the current product id state
            fireDb.ref().update(updates, (error) => { // delete the product
                if (error) {
                    setIsLoading(false);
                    setDialogContent("תקלה :" + error);
                } else {
                    setIsLoading(false);
                    setDialogContent("המוצר נמחק בהצלחה")
                }
            });
        }
    }

    // After the current product id changes, we will change the fields accordingly
    useEffect(() => {
        if (currentProductId) {
            const { title = '', description = '', price = 0, stock = 0, category = '', subcategory = '', priority = 0, hide = false } = productsInfo[currentProductId];
            reset({ title, description, price, stock, category, subcategory, priority, hide }); // insert product's values to the form fields
            fireDb.ref(`quill/${currentProductId}`).once('value', snapshot => {
                if (snapshot.val() != null) {
                    setEditorValue(snapshot.val())
                }
            })
        } else {
            reset({}); //reset field values
            setEditorValue('<p class="ql-align-right ql-direction-rtl"><br></p>'); //reset quill value
        }
    }, [currentProductId, productsInfo, reset])


    // This hook is used to fetch the information from firebase
    useEffect(() => {
        // make sure to only fetch the data from firebase if the user wants to update or delete AND it wasn't already fetched before
        if (action === "update product" && Object.keys(productsInfo).length === 0 && productsInfo.constructor === Object) {
            fireDb.ref().child('products').on('value', snapshot => {
                if (snapshot.val() != null) {
                    setProductsInfo({ ...snapshot.val() })
                }
            })
        }
        if (action === "add product") {
            setCurrentProductId(); // reset the current product id
        }
    }, [action, productsInfo, reset])

    // This hook is used to filter the relevant products in the select tag
    useEffect(() => {
        let productsTemp = Object.keys(productsInfo)
            .filter((id) => (!category ||
                (category === productsInfo[id].category && !subcategory) ||
                subcategory === productsInfo[id].subcategory))
            .map(id => <option key={id} value={id}>{productsInfo[id].title}</option>)
        setProductsOptions(<>
            <label>שם מוצר: </label>
            <select name="product-id" ref={register2({ required: true })}>
                {productsTemp}
            </select>
        </>);
    }, [category, subcategory, productsInfo, register2])

    // This hook is used to build the sub categories list
    useEffect(() => {
        links.forEach((link) => {
            if (link.path.includes(category)) {
                if (link.routes.length) {
                    setSubCatOptions(<>
                        <label>תת קטגוריה: </label>
                        <select name="subcategory" ref={register2({ required: true })}>
                            {link.routes.map(subLink => <option key={subLink.path} value={subLink.path.slice(subLink.path.lastIndexOf('/') + 1)}>{subLink.name}</option>)}
                        </select>
                    </>
                    )
                } else {
                    setSubCatOptions([]);
                }
            }
        })
    }, [category, register2])

    // This hook is used to build the sub categories list in the selected product
    useEffect(() => {
        links.forEach((link) => {
            if (link.path.includes(categorySelectedProd)) {
                if (link.routes.length) {
                    setSubCatOptSelectedProd(<>
                        <label> תת קטגוריה:  </label>
                        <select name="subcategory" ref={register({ required: true })}>
                            {link.routes.map(subLink => <option key={subLink.path} value={subLink.path.slice(subLink.path.lastIndexOf('/') + 1)}>{subLink.name}</option>)}
                        </select>
                        {errors.subcategory && <span className="error">יש לציין תת קטגוריה</span>}
                    </>
                    )
                } else {
                    setSubCatOptSelectedProd([]);
                }
            }
        })
    }, [categorySelectedProd, register, errors.subcategory])

    return (
        <article>
            <Dialog dialogContent={dialogContent} setDialogContent={setDialogContent} />
            <form className="form--compressed">
                {action === "update product" ?
                    <>
                        <h3>בחירת מוצר לעריכה/מחיקה</h3>
                        <label>קטגוריה: </label>
                        <select name="category" ref={register2({ required: true })}>
                            {categoriesOptions}
                        </select>
                        {subCatOptions}
                        {productsOptions}
                        <div>
                            <button className='button green' type='button' onClick={() => setCurrentProductId(selectedProductId)}>ערוך מוצר נבחר</button>
                        </div>
                    </>
                    : null}
            </form>
            {(action === 'update product' && !currentProductId) ? null : // If you chose update and there's no current product, dont show the form
                <form onSubmit={handleSubmit(onSubmit)} className='form'>
                    <h2 style={{ paddingBottom: '10px' }}>{currentProductId ? `עדכון מוצר "${productsInfo[currentProductId].title}"` : "הוספת מוצר"}</h2>
                    <label>כותרת</label>
                    <input type="text" name="title" ref={register({ required: true })} placeholder="כותרת" />
                    {errors.title && <span className="error">יש להכניס כותרת</span>}
                    <label>מחיר</label>
                    <input type='number' name="price" ref={register({ required: true })} placeholder="מחיר" />
                    {errors.price && <span className="error">יש לציין מחיר. כדי שיופיע "צור קשר לקבלת מחיר", יש לציין מחיר 0</span>}
                    <label>מחיר מבצע</label>
                    <input type='number' name="discount" ref={register} placeholder="מחיר מבצע" />
                    <label>תיאור</label>
                    <textarea name="description" ref={register} placeholder="תיאור" />
                    <label>קטגוריה</label>
                    <select name="category" ref={register({ required: true })}>
                        {categoriesOptions}
                    </select>
                    {subCatOptSelectedProd}
                    <label>מלאי</label>
                    <input type='number' name="stock" ref={register({ required: true })} placeholder="מלאי" />
                    {errors.stock && <span className="error">יש להכניס מספר מוצרים במלאי</span>}
                    <label> עדיפות (מוצר בעל ערך גבוה יוצג יותר למעלה)</label>
                    <input type='number' name="priority" ref={register} placeholder="עדיפות" />
                    <label> הסתר מוצר </label>
                    <input type='checkbox' name='hide' ref={register} />
                    <label>תמונה</label>
                    <ImageUploader product={productsInfo[currentProductId]} uploadedImage={uploadedImage} register={register} />
                    <label style={{ padding: '5px 0px 7px' }}>מידע נוסף</label>
                    <ReactQuill theme="snow" value={editorValue} onChange={setEditorValue} modules={modules} formats={formats} />
                    <div>
                        <input type="submit" value={action === 'add product' ? "העלה מוצר" : "שמור שינויים"} className='button green big' />
                        {currentProductId ? <button className='button red big' type='button' onClick={deleteProduct}>מחק מוצר</button> : null}
                    </div>
                </form>}
            {isLoading ? <Loader fullscreen /> : null}
        </article>
    );
}

// This function uploads an image to firebase and returns the download url
async function uploadTaskPromise(productId, file, name) {
    return new Promise(function (resolve, reject) {
        //Now we will upload the image and return the download url
        let uploadTask = fireStorage.ref().child(`products/${productId}/${name}.png`).put(file); // upload 
        uploadTask.on('state_changed', (snapshot) => {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        }, (error) => {
            console.log(error)
            reject();
        }, () => { //Success
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('Uploaded image available at', downloadURL);
                resolve(downloadURL)
            });
        })
    });
}

export default ProductManager;