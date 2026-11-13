'use client';

import { useState } from 'react';
import arrow from '../../icons/arrow.png';
import './TreeView.css';

const TreeView = ({ label, children, labelClass }) => {
    const [viewItems, setViewItems] = useState(false);

    return (
        <>
            <div className={labelClass} style={{ display: 'flex' }} onClick={() => setViewItems(prevState => !prevState)}>
                {label}
                <img src={arrow.src} alt='' style={{ height: '20px', marginRight: 'auto' }} className={viewItems ? 'rotate-up' : 'rotate-down'} />
            </div>
            <div className={viewItems ? 'show-tree' : 'hide-tree'}>
                <ul style={{ overflow: 'hidden' }} className={viewItems ? 'show-tree' : 'hide-tree'}>
                    {children}
                </ul>
            </div>
        </>
    );
}

export default TreeView;
