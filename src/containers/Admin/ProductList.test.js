import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductList from './ProductList';

const products = {
    a: { category: 'garmin', subcategory: 'watches', title: 'Zeta', stock: '1' },
    b: { category: 'garmin', subcategory: 'watches', title: 'Alpha', stock: '0' },
    c: { category: 'garmin', subcategory: 'watches', title: 'Beta', stock: '2', priority: '40' },
    d: { category: 'garmin', subcategory: 'watches', title: 'Gamma', stock: '1', hide: true, priority: '90' },
    e: { category: 'garmin', subcategory: 'watches', title: 'Delta', stock: '3', priority: '' },
};

const renderList = () => render(
    <ProductList products={products} loaded filters={{ search: '', category: '', subcategory: '' }}
        setFilters={vi.fn()} onOpen={vi.fn()} onNew={vi.fn()} />,
);

const rowTitles = () => [...document.querySelectorAll('.product-row .row-title')].map((el) => el.textContent);

describe('ProductList', () => {
    it('lists products in shop order (priority, in stock, name) with hidden ones last', () => {
        renderList();
        expect(rowTitles()).toEqual(['Beta', 'Delta', 'Zeta', 'Alpha', 'Gamma']);
    });

    it('shows a priority badge only for products with a priority', () => {
        renderList();
        expect(screen.getByText('עדיפות 40')).toBeInTheDocument();
        expect(screen.getByText('עדיפות 90')).toBeInTheDocument();
        expect(document.querySelectorAll('.badge.priority')).toHaveLength(2);
    });
});
