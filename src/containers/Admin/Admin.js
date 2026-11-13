'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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

const Admin = () => {
    const { auth } = getFirebase();
    const { register, handleSubmit, formState: { errors }, setError, clearErrors } = useForm();
    const { register: register2, control: menuControl } = useForm(); // The menu form
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const action = useWatch({ control: menuControl, name: 'action' });

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
        firebaseSignOut(auth).catch((error) => console.log(error));
    }

    useEffect(() => onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setAuthChecked(true);
    }), [auth]);

    let actionComponent = null;
    if (action === 'add product' || action === 'update product')
        actionComponent = <ProductManager key={action} action={action} /> // key: switching add/update starts fresh
    else if (action === 'set rally abroad')
        actionComponent = <AbroadEdit />

    if (!authChecked) {
        return <article className='page-container'><Loader /></article>;
    }

    if (user) {
        return (
            <article className='page-container'>
                <h2>עמוד מנהל</h2>
                <button className='button' onClick={signOut}>התנתק</button>
                <form className="form--compressed admin-menu">
                    <label className="segment">
                        <input type="radio" value="add product" {...register2('action')} />
                        מוצר חדש
                    </label>
                    <label className="segment">
                        <input type="radio" value="update product" {...register2('action')} />
                        עריכת מוצר
                    </label>
                    <label className="segment">
                        <input type="radio" value="set rally abroad" {...register2('action')} />
                        עריכת תוכן ראליים בחו&quot;ל
                    </label>
                </form>
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
