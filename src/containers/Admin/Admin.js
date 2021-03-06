import React, { useState, useEffect } from 'react';
import { fireAuth, firebase } from '../../firebase'
import { useForm } from "react-hook-form";
import Loader from '../../components/Loader/Loader';
import ProductManager from './ProductManager';
import AbroadEdit from './AbroadEdit';
import './Admin.css';

const Admin = () => {
    const { register, handleSubmit, errors, setError, clearErrors } = useForm();
    const { register: register2, watch: watch2 } = useForm(); // The menu form
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const action = watch2("action");
    let actionComponent = null;

    const onSubmit = ({ email, password, persistence }) => {
        setIsLoading(true);
        let authPersistence;
        if (persistence === true) {
            authPersistence = firebase.auth.Auth.Persistence.LOCAL;
        } else {
            authPersistence = firebase.auth.Auth.Persistence.NONE
        }
        fireAuth.setPersistence(authPersistence)
            .then(() => fireAuth.signInWithEmailAndPassword(email, password))
            .then(setIsLoading(false))
            .catch((error) => {
                console.log(`Error code: ${error.code}`);
                console.log(`Error message: ${error.message}`)
                setError("login", {
                    type: "manual",
                    message: "אימייל או סיסמה שגויים"
                });
            });
    }

    const signOut = () => {
        fireAuth.signOut().then(function () {
            console.log('signed out successfully')
        }).catch(function (error) {
            console.log(error)
        });
    }

    useEffect(() => {
        fireAuth.onAuthStateChanged(function (user) {
            if (user) {
                console.log('You are logged in!')
                setIsSignedIn(user);
            } else {
                console.log('No user is logged in.')
                setIsSignedIn(false);
            }
        });
    }, [])

    if (action === "add product" || action === "update product")
        actionComponent = <ProductManager action={action} />
    else if (action === "set rally abroad")
        actionComponent = <AbroadEdit />


    if (isSignedIn) {
        return (
            <article className='page-container'>
                <h2>עמוד מנהל</h2>
                <button className='button' onClick={signOut}>התנתק</button>
                <form className="form--compressed">
                    <input name="action" type="radio" value="add product" ref={register2} />
                    <label>מוצר חדש</label>
                    <input name="action" type="radio" value="update product" ref={register2} />
                    <label>עריכת מוצר</label>
                    <input name="action" type="radio" value="set rally abroad" ref={register2} />
                    <label>עריכת תוכן ראליים בחו"ל</label>
                </form>
                {actionComponent}
            </article>
        );
    } else {
        return (
            <article className='page-container'>
                <form onSubmit={handleSubmit(onSubmit)} className='form small'>
                    <h2 style={{ padding: '0px 0px 10px' }}>כניסת מנהל</h2>
                    <label>אימייל</label>
                    <input type="text" name="email" ref={register({ required: true })} placeholder="אימייל" />
                    {errors.email && <span className="error">יש להכניס אימייל</span>}
                    <label>סיסמא</label>
                    <input type='password' name="password" ref={register({ required: true })} placeholder="סיסמא" />
                    {errors.password && <span className="error">יש להכניס סיסמא</span>}
                    <div>
                        <input type="checkbox" name="persistence" defaultChecked={true} ref={register} />
                        <label>הישאר מחובר</label>
                    </div>
                    {isLoading ?
                        <Loader />
                        : <input type="submit" value="התחבר" className="button" onClick={() => clearErrors("login")} />
                    }
                    {errors.login && <span className="error">{errors.login.message}</span>}
                </form>
            </article>
        );
    }
}


export default Admin;
