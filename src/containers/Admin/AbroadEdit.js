'use client';

import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import { get, ref, update } from 'firebase/database';
import { getFirebase } from '@/lib/firebase/client';
import { normalizeQuillSpaces } from '@/lib/quillHtml';
import Loader from '../../components/Loader/Loader';
import Dialog from '../../components/Dialog/Dialog';
import { modules, formats, EMPTY_EDITOR_VALUE } from './quillConfig';
import { PUBLISH_NOTE, refreshPublicPages } from './refresh';
import 'react-quill-new/dist/quill.snow.css';
import './Admin.css';

const AbroadEdit = () => {
    const { db, auth } = getFirebase();
    const [editorValue, setEditorValue] = useState(EMPTY_EDITOR_VALUE);
    const [isLoading, setIsLoading] = useState(false);
    const [dialogContent, setDialogContent] = useState(false);

    const onSubmit = async () => {
        setIsLoading(true);
        try {
            await update(ref(db), { abroad: normalizeQuillSpaces(editorValue) });
            await refreshPublicPages(auth, ['abroad']);
            setDialogContent('העדכון בוצע בהצלחה.' + PUBLISH_NOTE);
        } catch (error) {
            setDialogContent('תקלה :' + error);
        } finally {
            setIsLoading(false);
        }
    }

    // Load the current content once (a live listener would overwrite in-progress edits).
    useEffect(() => {
        let cancelled = false;
        get(ref(db, 'abroad')).then((snapshot) => {
            if (!cancelled && snapshot.val() != null) setEditorValue(snapshot.val());
        });
        return () => { cancelled = true; };
    }, [db]);

    return (
        <article className='abroad-edit'>
            <div>
                <ReactQuill theme="snow" value={editorValue} onChange={setEditorValue} modules={modules} formats={formats} />
                <button className='button green big' onClick={onSubmit}>עדכן</button>
            </div>
            {isLoading ? <Loader fullscreen /> : null}
            <Dialog dialogContent={dialogContent} setDialogContent={setDialogContent} />
        </article>
    );
}

export default AbroadEdit;
