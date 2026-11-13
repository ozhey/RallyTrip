'use client';

import { useEffect, useState } from 'react';
import './ImageUploader.css';

// Shows the newly picked file if there is one, otherwise the product's current image.
const ImageUploader = ({ product, uploadedImage, registration }) => {
    const pickedFile = uploadedImage && uploadedImage.length && uploadedImage[0] instanceof Blob ? uploadedImage[0] : null;
    const [preview, setPreview] = useState({ file: null, url: '' });

    // Read the picked file as a data URL (state is set from the reader callback).
    useEffect(() => {
        if (!pickedFile) return undefined;
        const reader = new FileReader();
        reader.onload = () => setPreview({ file: pickedFile, url: reader.result });
        reader.readAsDataURL(pickedFile);
        return () => reader.abort();
    }, [pickedFile]);
    const previewUrl = preview.file === pickedFile ? preview.url : '';

    const imageUrl = pickedFile ? previewUrl : (product?.image || '');

    return (
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <div className='img-preview-container'>
                <div className='img-placeholder'>
                    אין תמונה
                </div>
                {imageUrl ? <img src={imageUrl} alt='preview' className='img-preview' /> : null}
            </div>
            <div>
                <input type="file" id="file" className="inputfile" accept="image/*" {...registration} />
                <label htmlFor="file" className="button" style={{ display: 'inline-block', marginRight: '5px' }}> {imageUrl ? 'החלף תמונה' : 'העלאת תמונה'} </label>
            </div>
        </div>
    );
}

export default ImageUploader;
