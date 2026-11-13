'use client';

import { useState } from 'react';
import './TreeView.css';

const TreeView = ({ label, children, labelClass }) => {
    const [viewItems, setViewItems] = useState(false);

    return (
        <>
            <button
                type='button'
                className={['tree-toggle', labelClass].filter(Boolean).join(' ')}
                aria-expanded={viewItems}
                onClick={() => setViewItems(prevState => !prevState)}
            >
                {label}
                <svg className='tree-chevron' viewBox='0 0 24 24' aria-hidden='true'>
                    <path d='M15 6l-6 6 6 6' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
            </button>
            <div className={viewItems ? 'tree-panel open' : 'tree-panel'}>
                <ul>{children}</ul>
            </div>
        </>
    );
}

export default TreeView;
