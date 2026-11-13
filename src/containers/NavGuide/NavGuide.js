import image from '../../images/navguide1.png';
import image1 from '../../images/navguide2.png';
import image2 from '../../images/navguide3.png';
import MakeContact from '../../components/Product/MakeContact';
import './NavGuide.css';

const NavGuide = () => {

    return (
        <div className='page-container'>
            <h1 style={{ textAlign: 'center', padding: '15px 0px 20px' }}>ניווט באמצעות ספר דרך</h1>
            <article className='navguide-container'>
                <div className='navguide-item reverse'>
                    <img src={image1.src} alt='הדרכת תאוריה' className='navguide-image reverse' />
                    <div className='navguide-text'>
                        <h2>הדרכת תאוריה</h2>
                        <ul>
                            <li>הדרכה אישית / קבוצתית</li>
                            <li>משך הדרכה: כ3 שעות</li>
                            <li>בהדרכה נלמד: סוגי ניווט, שימוש בספר דרך, שימוש במד מרחק, סימנים מוסכמים, טיפים ועוד..</li>
                        </ul>
                    </div>
                </div>
                <div className='navguide-item'>
                    <img src={image2.src} alt='הדרכה מעשית' className='navguide-image' />
                    <div className='navguide-text'>
                        <h2>הדרכה מעשית</h2>
                        <ul>
                            <li>רכבים: הדרכה מעשית לצוות - נהג ונווט</li>
                            <li>אופנועים - הדרכה מעשית לרוכב</li>
                            <li> משך הדרכה: כ3 שעות</li>
                            <li> כולל ניווט ספר דרך בשטח עם סיפור דרך מתוך מגוון סיפורי הדרך של Rally Trip</li>
                        </ul>
                    </div>
                </div>
                <div className='navguide-item reverse'>
                    <img src={image.src} alt='מחירון הדרכות' className='navguide-image reverse' />
                    <div className='navguide-text'>
                        <h2>מחירון</h2>
                        <ul>
                            <li>מחיר ליום הדרכה מלא אישי - הדרכת תאוריה + תרגול מעשי - ₪1200</li>
                            <li>הדרכת תאוריה בלבד - 600₪</li>
                            <li>הדרכה מעשית בלבד - 700₪</li>
                        </ul>
                    </div>
                </div>
                <h2>לרכישה</h2>
                <div><MakeContact alignRight withIcons /></div>
            </article>
        </div>
    );
}

export default NavGuide;
