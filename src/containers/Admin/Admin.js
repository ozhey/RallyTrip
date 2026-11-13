'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import {
    browserLocalPersistence,
    inMemoryPersistence,
    onAuthStateChanged,
    setPersistence,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
} from 'firebase/auth';
import { getFirebase } from '@/lib/firebase/client';
import Loader from '../../components/Loader/Loader';
import ProductManager from './ProductManager';
import AbroadEdit from './AbroadEdit';
import './Admin.css';

const TABS = [
    { value: 'products', label: 'מוצרים' },
    { value: 'abroad', label: 'ראליים בחו"ל' },
];

const UNSAVED_WARNING = 'יש שינויים שלא נשמרו. להמשיך בלי לשמור?';

const Admin = () => {
    const { auth } = getFirebase();
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false); // the open editor has unsaved changes
    const dirtyRef = useRef(false); // same as isDirty, readable from navigate/popstate handlers
    useEffect(() => { dirtyRef.current = isDirty; }, [isDirty]);

    // The view lives in the URL so the phone's back button and reloads work:
    // /admin/ → product list · ?product=<id|new> → product editor · ?section=abroad → rally-abroad editor.
    const searchParams = useSearchParams();
    const section = searchParams.get('section') === 'abroad' ? 'abroad' : 'products';
    const productParam = section === 'products' ? searchParams.get('product') : null;

    const onSubmit = async ({ email, password, persistence }) => {
        setIsLoading(true);
        try {
            await setPersistence(auth, persistence ? browserLocalPersistence : inMemoryPersistence);
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log(`Error code: ${error.code}`);
            setError('login', { type: 'manual', message: 'אימייל או סיסמה שגויים' });
        } finally {
            setIsLoading(false);
        }
    }

    const signOut = () => {
        if (isDirty && !window.confirm(UNSAVED_WARNING)) return;
        setIsDirty(false);
        firebaseSignOut(auth).catch((error) => console.log(error));
    }

    /**
     * Go to another admin view. query: { section?, product? }.
     * Asks first when there are unsaved changes (unless force), replace: no new history entry.
     * Returns false when the user chose to stay.
     */
    const navigate = useCallback((query, { replace = false, force = false } = {}) => {
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(query)) if (value) params.set(key, value);
        const url = `${window.location.pathname}${params.size ? `?${params}` : ''}`;
        if (url === window.location.pathname + window.location.search) return true; // already there
        if (!force && dirtyRef.current && !window.confirm(UNSAVED_WARNING)) return false;
        dirtyRef.current = false;
        setIsDirty(false);
        window.history[replace ? 'replaceState' : 'pushState'](null, '', url);
        window.scrollTo(0, 0);
        return true;
    }, []);

    // Browser/phone back with unsaved changes: ask, and on "stay" restore the URL we were on.
    const currentUrlRef = useRef('');
    useEffect(() => { currentUrlRef.current = window.location.href; }, [searchParams]);
    useEffect(() => {
        const onPopState = () => {
            if (!dirtyRef.current) return;
            if (window.confirm(UNSAVED_WARNING)) {
                dirtyRef.current = false;
                setIsDirty(false);
            } else {
                window.history.pushState(null, '', currentUrlRef.current);
            }
        };
        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, []);

    // Warn before closing/reloading the tab with unsaved changes.
    useEffect(() => {
        if (!isDirty) return undefined;
        const onBeforeUnload = (event) => { event.preventDefault(); event.returnValue = ''; };
        window.addEventListener('beforeunload', onBeforeUnload);
        return () => window.removeEventListener('beforeunload', onBeforeUnload);
    }, [isDirty]);

    useEffect(() => onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setAuthChecked(true);
    }), [auth]);

    const sectionComponent = section === 'abroad' ?
        <AbroadEdit onDirtyChange={setIsDirty} /> :
        <ProductManager productParam={productParam} navigate={navigate} onDirtyChange={setIsDirty} />;

    if (!authChecked) {
        return <article className='page-container'><Loader /></article>;
    }

    if (user) {
        return (
            <article className='page-container'>
                <header className='admin-header'>
                    <h2>עמוד מנהל</h2>
                    <div className='admin-user'>
                        <span className='hint'>מחובר כ־{user.email}</span>
                        <button className='button' onClick={signOut}>התנתק</button>
                    </div>
                </header>
                <div className='admin-tabs' role='tablist'>
                    {TABS.map(({ value, label }) => (
                        <button key={value} id={`tab-${value}`} type='button' role='tab' aria-selected={section === value}
                            className={'admin-tab' + (section === value ? ' active' : '')}
                            onClick={() => navigate(value === 'abroad' ? { section: 'abroad' } : {})}>
                            {label}
                        </button>
                    ))}
                </div>
                <div role='tabpanel' aria-labelledby={`tab-${section}`}>
                    {sectionComponent}
                </div>
            </article>
        );
    }

    return (
        <article className='page-container'>
            <form onSubmit={handleSubmit(onSubmit)} className='form small'>
                <h2 style={{ padding: '0px 0px 10px' }}>כניסת מנהל</h2>
                <label htmlFor="email">אימייל</label>
                <input id="email" type="text" autoComplete="username" {...register('email', { required: true })} placeholder="אימייל" />
                {errors.email && <span className="error">יש להכניס אימייל</span>}
                <label htmlFor="password">סיסמא</label>
                <input id="password" type='password' autoComplete="current-password" {...register('password', { required: true })} placeholder="סיסמא" />
                {errors.password && <span className="error">יש להכניס סיסמא</span>}
                <div>
                    <input id="persistence" type="checkbox" defaultChecked={true} {...register('persistence')} />
                    <label htmlFor="persistence">הישאר מחובר</label>
                </div>
                {isLoading ?
                    <Loader />
                    : <input type="submit" value="התחבר" className="button" onClick={() => clearErrors('login')} />
                }
                {errors.login && <span className="error">{errors.login.message}</span>}
            </form>
        </article>
    );
}

export default Admin;
