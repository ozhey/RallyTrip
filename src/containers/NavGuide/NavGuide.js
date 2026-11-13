import image from '../../images/navguide1.png';
import image1 from '../../images/navguide2.png';
import image2 from '../../images/navguide3.png';
import MakeContact from '../../components/Product/MakeContact';
import './NavGuide.css';

const PRICES = [
    { title: 'יום הדרכה מלא אישי', detail: 'הדרכת תאוריה + תרגול מעשי', price: '₪1200', featured: true },
    { title: 'הדרכת תאוריה בלבד', detail: 'כ-3 שעות', price: '₪600' },
    { title: 'הדרכה מעשית בלבד', detail: 'כ-3 שעות', price: '₪700' },
];

const NavGuide = () => {

    return (
        <div className='page-container'>
            <header className='page-header'>
                <h1>ניווט באמצעות ספר דרך</h1>
                <p>הדרכות אישיות וקבוצתיות לרוכבים, נהגים ונווטים, מועברות על ידי רז הימן</p>
            </header>
            <article className='navguide-container'>
                <section className='navguide-item'>
                    <img src={image1.src} alt='הדרכת תאוריה' className='navguide-image' width={1016} height={678} />
                    <div className='navguide-text'>
                        <span className='step'>01</span>
                        <h2>הדרכת תאוריה</h2>
                        <ul>
                            <li>הדרכה אישית / קבוצתית</li>
                            <li>משך הדרכה: כ-3 שעות</li>
                            <li>בהדרכה נלמד: סוגי ניווט, שימוש בספר דרך, שימוש במד מרחק, סימנים מוסכמים, טיפים ועוד..</li>
                        </ul>
                    </div>
                </section>
                <section className='navguide-item reverse'>
                    <img src={image2.src} alt='הדרכה מעשית' className='navguide-image' width={1600} height={1066} loading='lazy' />
                    <div className='navguide-text'>
                        <span className='step'>02</span>
                        <h2>הדרכה מעשית</h2>
                        <ul>
                            <li>רכבים: הדרכה מעשית לצוות - נהג ונווט</li>
                            <li>אופנועים: הדרכה מעשית לרוכב</li>
                            <li>משך הדרכה: כ-3 שעות</li>
                            <li>כולל ניווט ספר דרך בשטח עם סיפור דרך מתוך מגוון סיפורי הדרך של Rally Trip</li>
                        </ul>
                    </div>
                </section>

                <section className='navguide-prices'>
                    <img src={image.src} alt='מחירון הדרכות' className='prices-image' width={1600} height={1066} loading='lazy' />
                    <h2>מחירון</h2>
                    <div className='price-cards'>
                        {PRICES.map(item => (
                            <div key={item.title} className={item.featured ? 'price-card featured' : 'price-card'}>
                                <h3>{item.title}</h3>
                                <p>{item.detail}</p>
                                <div className='amount'>{item.price}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className='contact-card'>
                    <div>
                        <h2>לתיאום הדרכה</h2>
                        <p>דברו איתנו ונמצא מועד שמתאים לכם.</p>
                    </div>
                    <MakeContact alignRight withIcons />
                </section>
            </article>
        </div>
    );
}

export default NavGuide;
