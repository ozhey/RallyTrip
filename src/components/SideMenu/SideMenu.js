'use client';

import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import NavLink from '../NavLink';
import { links } from '../../links';
import './SideMenu.css';

const SideMenu = () => {
    const pathname = usePathname() ?? '';

    return (
        <nav className='sidemenu-container'>
            <h3>סינון</h3>
            <ul className='sidemenu-list'>
                {links.map(link => (
                    <Fragment key={link.path}>
                        <li>
                            <NavLink href={link.path} activeClassName='active'>{link.name}</NavLink>
                        </li>
                        {pathname.includes(link.path) ? link.routes.map(subLink =>
                            <li key={subLink.path}>
                                <NavLink href={subLink.path} activeClassName='active' className='subitem'>- {subLink.name}</NavLink>
                            </li>
                        ) : null}
                    </Fragment>
                ))}
            </ul>
        </nav>
    );
}

export default SideMenu;
