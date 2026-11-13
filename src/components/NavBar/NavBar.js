'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SideDrawer from '../SideDrawer/SideDrawer';
import BackDrop from '../BackDrop/BackDrop';
import NavLink from '../NavLink';
import Dropdown from './Dropdown';
import logo from '../../images/logos/logoGlow.png';
import './NavBar.css';

const NavBar = () => {
    const pathname = usePathname();
    // The drawer is open only for the path it was opened on, so navigating closes it.
    const [drawerOpenedOn, setDrawerOpenedOn] = useState(null);
    // Same for the products dropdown: picking a category closes it even though the mouse is still over it.
    const [dropdownOpenedOn, setDropdownOpenedOn] = useState(null);
    const showDropdown = dropdownOpenedOn === pathname;
    const sideDrawerOpen = drawerOpenedOn === pathname;
    const closeDrawer = () => setDrawerOpenedOn(null);

    return (
        <>
            <SideDrawer sideDrawerOpen={sideDrawerOpen} />
            {sideDrawerOpen ? <BackDrop setWindowOpen={closeDrawer} /> : null}
            <div id='navbar'>
                <button
                    className='hamburger'
                    aria-label='תפריט'
                    aria-expanded={sideDrawerOpen}
                    onClick={() => setDrawerOpenedOn(sideDrawerOpen ? null : pathname)}
                >
                    <div className='line'></div>
                    <div className='line'></div>
                    <div className='line'></div>
                </button>
                <ul className='nav-links'>
                    <li><NavLink exact href="/" activeClassName="nav-active">בית</NavLink></li>
                    <li onMouseEnter={() => setDropdownOpenedOn(pathname)} onMouseLeave={() => setDropdownOpenedOn(null)}>
                        <NavLink href="/products" activeClassName="nav-active">
                            מוצרים
                        </NavLink>
                        {showDropdown ? <Dropdown /> : null}
                    </li>
                </ul>
                <Link href='/' className='logo-link'>
                    <img src={logo.src} alt='Rally Trip' className='logo' width={132} height={53} />
                </Link>
                <ul className='nav-links'>
                    <li><NavLink href="/rally-abroad" activeClassName="nav-active">מרוצים בחו&quot;ל</NavLink></li>
                    <li><NavLink href="/nav-guide" activeClassName="nav-active">הדרכות ניווט</NavLink></li>
                </ul>
            </div>
        </>
    );
}

export default NavBar;
