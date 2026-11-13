import RazImg from '../../images/raz.png';
import MakeContact from '../../components/Product/MakeContact';
import RichText from '../../components/RichText';
import './Abroad.css';

const Abroad = ({ content }) => {
    return (
        <div className='page-container'>
            <h1 style={{ textAlign: 'center', padding: '15px 0px 20px' }}>ראלי רייד בחו&quot;ל</h1>
            <article className='abroad-container'>
                <h3>&quot;אחרי 30 שנה של השתתפות בראליים בעולם, אני יודע להגיד בוודאות שגם את/ה יכול/ה לחוות ולהנות מראלי רייד בחו&quot;ל.&quot;</h3>
                <img src={RazImg.src} alt='רז הימן' className='raz-image' />
                <p>רז הימן השתתף כרוכב, נהג ונווט בעשרות מרוצים בין לאומיים על אופנוע, רכב וSBS, ביניהם ראלי דקאר, דרך המשי, באחה 1000, מרוקו, פרעונים ועוד רבים נוספים. </p>
                <p>רז ניהל וליווה קבוצות ויחידים במרוצים רבים, ביניהם מרוצי ראלי רייד באירופה, מרוצי ISDE, מוטוקרוס האומות, מרוצי הארד אנדורו ועוד.</p>
                <p>ראליים בחו&quot;ל לא מיועדים רק לרוכבים ונהגים מקצועיים ורבי נסיון. השתתפות בראלי בחו&quot;ל היא חוויה שכל אחד יכול להנות ממנה, ממקצוענים ועד חובבנים.  </p>
                <p></p>
                <h4>מה אני מציע? טיפול מקצה לקצה:</h4>
                <ul className='list'>
                    <li>הרשמה</li>
                    <li>שילוח הכלים מהארץ</li>
                    <li>טיסות</li>
                    <li>לינה</li>
                    <li>ייעוץ מקצועי</li>
                    <li>ליווי קבוצתי או אישי לפני ובזמן המרוץ</li>
                    <li>ועוד..</li>
                </ul>
                <h2 style={{ padding: '10px 0px', fontSize: '2em' }}>הראלי הקרוב</h2>
                <RichText html={content} />
                <h4>לפרטים נוספים:</h4>
                <div><MakeContact alignRight withIcons /></div>
            </article>
        </div>
    );
}

export default Abroad;
