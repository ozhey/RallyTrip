import Facebook from '../../icons/Facebook.png';
import WhatsApp from '../../icons/WhatsApp.png';
import Mail from '../../icons/Mail.png';
import './Footer.css';

const Footer = () => {
    return (
        <section className='footer'>
            <div className='icons-container'>
                <div>רז הימן</div>
                <div>
                    <a href="https://wa.me/972505562519"><img src={WhatsApp.src} alt="WhatsApp" className='icon' /></a>
                    <a href="https://www.facebook.com/RallyTrip"><img src={Facebook.src} alt="Facebook" className='icon' /></a>
                    <a href="mailto:119raz@walla.com"><img src={Mail.src} alt="Mail" className='icon' /></a>
                </div>
                <div>© כל הזכויות שמורות לRally Trip</div>
            </div>
            <div className='credit'><a href="https://www.linkedin.com/in/oz-heymann-2193901a6/">Developed by Oz Heymann</a></div>
        </section>
    );
}

export default Footer;
