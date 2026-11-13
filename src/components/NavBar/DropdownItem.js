'use client';

import { useState } from 'react';
import NavLink from '../NavLink';
import './Dropdown.css';

const DropdownItem = ({ path, label, routes }) => {
    const [viewSubMenu, setViewSubMenu] = useState(false);

    return (
        <li onMouseEnter={() => setViewSubMenu(true)} onMouseLeave={() => setViewSubMenu(false)}>
            <NavLink href={path} activeClassName='active'>{label}</NavLink>
            <ul className='submenu'>
                {viewSubMenu ? routes.map(link =>
                    <li key={link.path}>
                        <NavLink href={link.path} activeClassName='active'>
                            {link.name}
                        </NavLink>
                    </li>) : ''}
            </ul>
        </li>
    );
}

export default DropdownItem;
