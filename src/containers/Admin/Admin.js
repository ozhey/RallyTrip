'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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

const ACTIONS = [
    { value: 'update product', label: 'עריכת מוצר' },
    { value: 'add product', label: 'מוצר חדש' },
    { value: 'set rally abroad', label: 'עריכת תוכן ראליים בחו"ל' },
];

const UNSAVED_WARNING = 'יש שינויים שלא נשמרו. להמשיך בלי לשמור?';

const Admin = () => {
    const { auth } = getFirebase();
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [action, setAction] = useState('update product'); // editing is the most common task
    const [isDirty, setIsDirty] = useState(false); // the open editor has unsaved changes

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

    const changeAction = (next) => {
        if (next === action) return;
        if (isDirty && !window.confirm(UNSAVED_WARNING)) return;
        setIsDirty(false);
        setAction(next);
    }

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

    let actionComponent = null;
    if (action === 'add product' || action === 'update product')
        actionComponent = <ProductManager key={action} action={action} onDirtyChange={setIsDirty} /> // key: switching add/update starts fresh
    else if (action === 'set rally abroad')
        actionComponent = <AbroadEdit onDirtyChange={setIsDirty} />

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
                <div className="admin-menu" role="radiogroup" aria-label="מה תרצה לעשות?">
                    {ACTIONS.map(({ value, label }) => (
                        <label key={value} className="segment">
                            <input type="radio" name="admin-action" value={value} checked={action === value} onChange={() => changeAction(value)} />
                            {label}
                        </label>
                    ))}
                </div>
                {actionComponent}
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
