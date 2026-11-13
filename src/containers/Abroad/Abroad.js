import RazImg from '../../images/raz.png';
import GroupImg from '../../images/abroadimg.png';
import MakeContact from '../../components/Product/MakeContact';
import RichText from '../../components/RichText';
import './Abroad.css';

const SERVICES = ['הרשמה', 'שילוח הכלים מהארץ', 'טיסות', 'לינה', 'ייעוץ מקצועי', 'ליווי קבוצתי או אישי לפני ובזמן המרוץ'];

const Abroad = ({ content }) => {
    return (
        <div className='page-container'>
            <header className='page-header'>
                <h1>ראלי רייד בחו&quot;ל</h1>
                <p>ליווי מקצה לקצה למרוצים בינלאומיים, ממקצוענים ועד חובבנים</p>
            </header>
            <article className='abroad-container'>
                <section className='abroad-intro'>
                    <div className='abroad-text'>
                        <blockquote className='abroad-quote'>
                            &quot;אחרי 30 שנה של השתתפות בראליים בעולם, אני יודע להגיד בוודאות שגם את/ה יכול/ה לחוות ולהנות מראלי רייד בחו&quot;ל.&quot;
                        </blockquote>
                        <p>רז הימן השתתף כרוכב, נהג ונווט בעשרות מרוצים בין לאומיים על אופנוע, רכב ו-SBS, ביניהם ראלי דקאר, דרך המשי, באחה 1000, מרוקו, פרעונים ועוד רבים נוספים.</p>
                        <p>רז ניהל וליווה קבוצות ויחידים במרוצים רבים, ביניהם מרוצי ראלי רייד באירופה, מרוצי ISDE, מוטוקרוס האומות, מרוצי הארד אנדורו ועוד.</p>
                        <p>ראליים בחו&quot;ל לא מיועדים רק לרוכבים ונהגים מקצועיים ורבי נסיון. השתתפות בראלי בחו&quot;ל היא חוויה שכל אחד יכול להנות ממנה, ממקצוענים ועד חובבנים.</p>
                    </div>
                    <img src={RazImg.src} alt='רז הימן' className='raz-image' width={467} height={411} />
                </section>

                <section className='abroad-services'>
                    <h2>מה אני מציע? טיפול מקצה לקצה</h2>
                    <ul className='check-list'>
                        {SERVICES.map(item => <li key={item}>{item}</li>)}
                        <li>ועוד...</li>
                    </ul>
                </section>

                <img src={GroupImg.src} alt='קבוצת רוכבים בראלי בחו"ל' className='abroad-group' width={1280} height={640} loading='lazy' />

                <section className='next-rally card'>
                    <h2>הראלי הקרוב</h2>
                    <RichText html={content} />
                </section>

                <section className='contact-card'>
                    <div>
                        <h2>לפרטים נוספים</h2>
                        <p>מוזמנים ליצור קשר בטלפון, בוואטסאפ או במייל.</p>
                    </div>
                    <MakeContact alignRight withIcons />
                </section>
            </article>
        </div>
    );
}

export default Abroad;
