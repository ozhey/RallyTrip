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

const AbroadEdit = ({ onDirtyChange }) => {
    const { db, auth } = getFirebase();
    const [editorValue, setEditorValue] = useState(EMPTY_EDITOR_VALUE);
    const [touched, setTouched] = useState(false); // the user edited (Quill also fires onChange when it normalizes loaded HTML)
    const [isLoading, setIsLoading] = useState(false);
    const [dialogContent, setDialogContent] = useState(false);

    useEffect(() => { onDirtyChange?.(touched); }, [touched, onDirtyChange]);

    const onSubmit = async () => {
        setIsLoading(true);
        try {
            await update(ref(db), { abroad: normalizeQuillSpaces(editorValue) });
            await refreshPublicPages(auth, ['abroad']);
            setTouched(false);
            setDialogContent('העדכון בוצע בהצלחה.' + PUBLISH_NOTE);
        } catch (error) {
            setDialogContent(<>
                השמירה נכשלה. כדאי לבדוק את החיבור לאינטרנט ולנסות שוב.
                <div className='dialog-detail'>{String(error)}</div>
            </>);
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
        <article className='form abroad-edit'>
            <h2>תוכן עמוד ראליים בחו&quot;ל</h2>
            <span className='hint'>הטקסט כאן מופיע בעמוד &quot;ראליים בחו&quot;ל&quot; באתר.</span>
            <ReactQuill theme="snow" value={editorValue} modules={modules} formats={formats}
                onChange={(value, _delta, source) => { setEditorValue(value); if (source === 'user') setTouched(true); }} />
            <div className='form-actions'>
                <button className={'button green big' + (touched ? ' is-dirty' : '')} onClick={onSubmit}>עדכן</button>
                {touched ? <span className='hint unsaved'>יש שינויים שלא נשמרו</span> : null}
            </div>
            {isLoading ? <Loader fullscreen /> : null}
            <Dialog dialogContent={dialogContent} setDialogContent={setDialogContent} />
        </article>
    );
}

export default AbroadEdit;
