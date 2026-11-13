'use client';

import PhoneColor from '../../icons/PhoneColor.png';
import FacebookColor from '../../icons/FacebookColor.png';
import WhatsAppColor from '../../icons/WhatsAppColor.png';
import MailColor from '../../icons/MailColor.png';
import './MakeContact.css';

const copyPhoneNumber = () => {
    navigator.clipboard.writeText("+972505562519").then(function () {
        alert('המספר הועתק')
    }, function (err) {
        console.error('Async: Could not copy text: ', err);
    });
}

const MakeContact = ({ withIcons, alignRight }) => {
    return (
        <div className={alignRight ? 'phone align-right' : 'phone'}>
            <div className='phone-grid'>
                <a href="tel:+972505562519" className='phone-button mobile'>
                    <span>לחץ להתקשר</span>
                    <img src={PhoneColor.src} alt="Phone" />
                </a>
                <div className='phone-button desktop' onClick={() => copyPhoneNumber()}>
                    <span>התקשר 050-5562-519</span>
                    <img src={PhoneColor.src} alt="Phone" />
                </div>
            </div>
            {withIcons ?
                <div className='icons'>
                    <a href="https://wa.me/972505562519"><img src={WhatsAppColor.src} alt="WhatsApp" /></a>
                    <a href="https://www.facebook.com/RallyTrip"><img src={FacebookColor.src} alt="Facebook" /></a>
                    <a href="mailto:119raz@walla.com"><img src={MailColor.src} alt="Mail" /></a>
                </div>
                : null}
        </div>
    );
}

export default MakeContact;
