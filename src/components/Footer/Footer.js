import Link from 'next/link';
import Facebook from '../../icons/Facebook.png';
import WhatsApp from '../../icons/WhatsApp.png';
import Mail from '../../icons/Mail.png';
import logo from '../../images/logos/logoGlow.png';
import { EMAIL, FACEBOOK_URL, MAILTO, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from '@/lib/contact';
import './Footer.css';

const Footer = () => {
    return (
        <footer className='footer'>
            <div className='container footer-grid'>
                <div className='footer-brand'>
                    <img src={logo.src} alt='Rally Trip' className='footer-logo' width={112} height={45} loading='lazy' />
                    <p>השער שלך לעולם הראלי רייד. ציוד ניווט, הדרכות וליווי למרוצים בחו&quot;ל.</p>
                </div>
                <nav className='footer-links' aria-label='ניווט תחתון'>
                    <p className='footer-title'>ניווט</p>
                    <ul>
                        <li><Link href='/products/'>מוצרים</Link></li>
                        <li><Link href='/nav-guide/'>הדרכות ניווט</Link></li>
                        <li><Link href='/rally-abroad/'>מרוצים בחו&quot;ל</Link></li>
                    </ul>
                </nav>
                <div className='footer-contact'>
                    <p className='footer-title'>רז הימן</p>
                    <ul>
                        <li><a href={PHONE_TEL} dir='ltr'>{PHONE_DISPLAY}</a></li>
                        <li><a href={MAILTO}>{EMAIL}</a></li>
                    </ul>
                    <div className='footer-social'>
                        <a href={WHATSAPP_URL}><img src={WhatsApp.src} alt='WhatsApp' className='icon' /></a>
                        <a href={FACEBOOK_URL}><img src={Facebook.src} alt='Facebook' className='icon' /></a>
                        <a href={MAILTO}><img src={Mail.src} alt='Mail' className='icon' /></a>
                    </div>
                </div>
            </div>
            <div className='container footer-bottom'>
                <div>© כל הזכויות שמורות ל-Rally Trip</div>
                <div className='credit'><a href="https://www.linkedin.com/in/oz-heymann-2193901a6/">Developed by Oz Heymann</a></div>
            </div>
        </footer>
    );
}

export default Footer;
