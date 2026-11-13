import logo from '../../images/logos/logoGlow.png';
import NavLink from '../NavLink';
import { links } from '../../links';
import TreeView from '../TreeView/TreeView';
import { PHONE_DISPLAY, PHONE_TEL, WHATSAPP_URL } from '@/lib/contact';
import './SideDrawer.css';

const SideDrawer = ({ sideDrawerOpen }) => {
    return (
        <nav className={sideDrawerOpen ? 'sidedrawer open' : 'sidedrawer'} aria-hidden={!sideDrawerOpen}>
            <div className='drawer-head'>
                <img src={logo.src} alt='Rally Trip' className='logo' width={120} height={48} />
            </div>
            <NavLink exact href="/" activeClassName="active" className='sidedrawer-item'>בית</NavLink>
            <TreeView label='מוצרים' labelClass='sidedrawer-item'>
                <li>
                    <NavLink exact href='/products' activeClassName='active' className='link-item'>כל המוצרים</NavLink>
                </li>
                {links.map(link =>
                    <li key={link.path}>
                        <NavLink href={link.path} activeClassName='active' className='link-item'>
                            {link.name}
                        </NavLink>
                    </li>)}
            </TreeView>
            <NavLink href="/rally-abroad" activeClassName="active" className='sidedrawer-item'>מרוצים בחו&quot;ל</NavLink>
            <NavLink href="/nav-guide" activeClassName="active" className='sidedrawer-item'>הדרכות ניווט</NavLink>
            <div className='drawer-contact'>
                <a href={WHATSAPP_URL} className='btn btn--whatsapp'>וואטסאפ</a>
                <a href={PHONE_TEL} className='btn btn--light'>{`התקשרו ${PHONE_DISPLAY}`}</a>
            </div>
        </nav>
    );
}

export default SideDrawer;
