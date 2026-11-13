import logo from '../../images/logos/logoGlow.png';
import NavLink from '../NavLink';
import { links } from '../../links';
import TreeView from '../TreeView/TreeView';
import './SideDrawer.css';

const SideDrawer = ({ sideDrawerOpen }) => {
    return (
        <nav className={sideDrawerOpen ? 'sidedrawer open' : 'sidedrawer'}>
            <img src={logo.src} alt='Rally Trip' className='logo' />
            <NavLink exact href="/" activeClassName="active" className='sidedrawer-item'> בית </NavLink>
            <TreeView label='מוצרים' labelClass='sidedrawer-item'>
                {links.map(link =>
                    <li key={link.path}>
                        <NavLink href={link.path} activeClassName='active' className='link-item'>
                            {link.name}
                        </NavLink>
                    </li>)}
            </TreeView>
            <NavLink href="/rally-abroad" activeClassName="active" className='sidedrawer-item'>מרוצים בחו&quot;ל</NavLink>
            <NavLink href="/nav-guide" activeClassName="active" className='sidedrawer-item'>הדרכות ניווט</NavLink>
        </nav>
    );
}

export default SideDrawer;
