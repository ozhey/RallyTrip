'use client';

import { useEffect, useState } from 'react';
import PhoneColor from '../../icons/PhoneColor.png';
import FacebookColor from '../../icons/FacebookColor.png';
import MailColor from '../../icons/MailColor.png';
import { FACEBOOK_URL, MAILTO, PHONE_DISPLAY, PHONE_INTL, PHONE_TEL, WHATSAPP_URL } from '@/lib/contact';
import './MakeContact.css';

const MakeContact = ({ withIcons, alignRight }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return undefined;
        const timer = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(timer);
    }, [copied]);

    const copyPhoneNumber = () => {
        navigator.clipboard?.writeText(PHONE_INTL).then(
            () => setCopied(true),
            (err) => console.error('Could not copy phone number: ', err),
        );
    };

    return (
        <div className={alignRight ? 'phone align-right' : 'phone'}>
            <div className='phone-grid'>
                <a href={PHONE_TEL} className='btn btn--primary phone-button mobile'>
                    <img src={PhoneColor.src} alt='' />
                    <span>לחץ להתקשר</span>
                </a>
                <button type='button' className='btn btn--primary phone-button desktop' onClick={copyPhoneNumber} title='לחץ להעתקת המספר'>
                    <img src={PhoneColor.src} alt='' />
                    <span>{copied ? 'המספר הועתק ✓' : `התקשר ${PHONE_DISPLAY}`}</span>
                </button>
                <a href={WHATSAPP_URL} className='btn btn--whatsapp'>
                    <span>שלחו הודעה בוואטסאפ</span>
                </a>
            </div>
            {withIcons ?
                <div className='icons'>
                    <a href={FACEBOOK_URL}><img src={FacebookColor.src} alt="Facebook" /></a>
                    <a href={MAILTO}><img src={MailColor.src} alt="Mail" /></a>
                </div>
                : null}
        </div>
    );
}

export default MakeContact;
