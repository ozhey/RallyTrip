import Link from 'next/link';
import ProductPreview from '../../components/Product/ProductPreview';
import MakeContact from '../../components/Product/MakeContact';
import { links } from '../../links';
import { WHATSAPP_URL } from '@/lib/contact';
import { withSlash } from '@/lib/site';
import productsImg from '../../images/542241.jpg';
import navGuideImg from '../../images/navguide3.png';
import abroadImg from '../../images/abroadimg.png';
import razImg from '../../images/raz.png';
import './Home.css';

const SERVICES = [
    {
        href: '/products',
        image: productsImg,
        title: 'חנות ציוד',
        text: 'ספרי דרך, סיפורי דרך, גרמין, מדי מרחק, דיבוריות, GoPro ועוד.',
        cta: 'לכל המוצרים',
    },
    {
        href: '/nav-guide',
        image: navGuideImg,
        title: 'הדרכות ניווט',
        text: 'הדרכות תאוריה ומעשיות בניווט עם ספר דרך, לרוכבים ולצוותי רכב.',
        cta: 'להדרכות',
    },
    {
        href: '/rally-abroad',
        image: abroadImg,
        title: 'מרוצים בחו"ל',
        text: 'ליווי מקצה לקצה: הרשמה, שילוח, טיסות, לינה וליווי במרוץ.',
        cta: 'לפרטים',
    },
];

const Hero = () => (
    <section className='hero'>
        <div className='hero-content container'>
            <h1>ראלי טריפ</h1>
            <p className='hero-subtitle'>השער שלך לעולם הראלי רייד</p>
            <p className='hero-text'>ציוד ניווט, הדרכות ספר דרך וליווי למרוצים בחו&quot;ל, מניסיון של 30 שנה במרוצים בעולם.</p>
            <div className='hero-actions'>
                <Link href='/products/' className='btn btn--primary'>לכל המוצרים</Link>
                <a href={WHATSAPP_URL} className='btn btn--ghost hero-ghost'>דברו איתנו בוואטסאפ</a>
            </div>
        </div>
    </section>
);

const Categories = ({ covers }) => (
    <section className='section'>
        <div className='container'>
            <div className='section-head'>
                <div>
                    <h2>קטגוריות</h2>
                </div>
                <Link href='/products/' className='link-arrow'>כל המוצרים ←</Link>
            </div>
            <ul className='category-grid'>
                {links.map(link => {
                    const slug = link.path.slice(link.path.lastIndexOf('/') + 1);
                    const cover = covers[slug] ?? {};
                    return (
                        <li key={link.path}>
                            <Link href={withSlash(link.path)} className='category-tile'>
                                <div className='category-img'>
                                    {cover.image ? <img src={cover.image} alt='' loading='lazy' /> : null}
                                </div>
                                <div className='category-name'>{link.name}</div>
                                {cover.count ? <div className='category-count'>{`${cover.count} מוצרים`}</div> : null}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    </section>
);

const Services = () => (
    <section className='section section--surface'>
        <div className='container'>
            <div className='section-head'>
                <div>
                    <h2>הכל לראלי רייד במקום אחד</h2>
                </div>
            </div>
            <div className='service-grid'>
                {SERVICES.map(service => (
                    <Link key={service.href} href={withSlash(service.href)} className='service-card'>
                        <img src={service.image.src} alt='' loading='lazy' width={service.image.width} height={service.image.height} />
                        <div className='service-body'>
                            <h3>{service.title}</h3>
                            <p>{service.text}</p>
                            <span className='link-arrow'>{service.cta} ←</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    </section>
);

const Featured = ({ items }) => (
    items.length ? (
        <section className='section'>
            <div className='container'>
                <div className='section-head'>
                    <div>
                        <h2>מבצעים ומוצרים נבחרים</h2>
                    </div>
                    <Link href='/products/' className='link-arrow'>לכל המוצרים ←</Link>
                </div>
                <div className='featured-grid'>
                    {items.map(([id, product]) => <ProductPreview key={id} id={id} product={product} />)}
                </div>
            </div>
        </section>
    ) : null
);

const About = () => (
    <section className='section section--surface'>
        <div className='container about'>
            <img src={razImg.src} alt='רז הימן' className='about-img' loading='lazy' width={razImg.width} height={razImg.height} />
            <div className='about-text'>
                <h2>רז הימן</h2>
                <blockquote>&quot;אחרי 30 שנה של השתתפות בראליים בעולם, אני יודע להגיד בוודאות שגם את/ה יכול/ה לחוות ולהנות מראלי רייד בחו&quot;ל.&quot;</blockquote>
                <p>רוכב, נהג ונווט בעשרות מרוצים בינלאומיים, ביניהם ראלי דקאר, דרך המשי, באחה 1000, מרוקו ופרעונים.</p>
                <Link href='/rally-abroad/' className='link-arrow'>על מרוצים בחו&quot;ל ←</Link>
            </div>
        </div>
    </section>
);

const ContactBand = () => (
    <section className='contact-band'>
        <div className='container contact-band-inner'>
            <div>
                <h2>מחפשים ציוד או ייעוץ?</h2>
                <p>דברו איתנו, נשמח לעזור להתאים בדיוק את מה שצריך.</p>
            </div>
            <MakeContact />
        </div>
    </section>
);

const Home = ({ featured = [], covers = {} }) => {
    return (
        <div className='home'>
            <Hero />
            <Categories covers={covers} />
            <Services />
            <Featured items={featured} />
            <About />
            <ContactBand />
        </div>
    );
}

export default Home;
