import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/lib/firebase/client', () => ({ getFirebase: () => ({ db: {}, auth: {}, storage: {} }) }));
vi.mock('firebase/database', () => ({
    get: vi.fn(() => Promise.resolve({ val: () => null })),
    push: vi.fn(),
    ref: vi.fn(),
    update: vi.fn(),
}));
vi.mock('firebase/storage', () => ({ getDownloadURL: vi.fn(), ref: vi.fn(), uploadBytesResumable: vi.fn() }));
vi.mock('react-quill-new', () => ({ default: () => null }));
vi.mock('./ImageUploader', () => ({ default: () => null }));

const { default: ProductForm } = await import('./ProductForm');

const products = {
    me: { category: 'garmin', subcategory: 'watches', title: 'Me', price: '10', stock: '1', priority: '99' },
    top: { category: 'garmin', subcategory: 'devices', title: ' Top ', price: '10', stock: '1', priority: '90' },
    mid: { category: 'garmin', subcategory: 'watches', title: 'Mid', price: '10', stock: '1', priority: '40' },
    zero: { category: 'garmin', subcategory: 'watches', title: 'Zero', price: '10', stock: '1', priority: '0' },
    hidden: { category: 'garmin', subcategory: 'watches', title: 'Hidden', price: '10', stock: '1', priority: '50', hide: true },
    other: { category: 'roadbooks', subcategory: 'sc', title: 'Other', price: '10', stock: '1', priority: '80' },
};

const renderForm = (productId) => render(
    <ProductForm productId={productId} product={products[productId]} products={products}
        onBack={vi.fn()} onCreated={vi.fn()} onDelete={vi.fn()} onDirtyChange={vi.fn()}
        setBusy={vi.fn()} notify={vi.fn()} />,
);

describe('ProductForm priority field', () => {
    it('lists other visible prioritized products in the same category, highest first', () => {
        renderForm('me');
        expect(screen.getByLabelText('עדיפות בתצוגה')).toHaveValue(99);
        expect(screen.getByText('כבר מקודמים בקטגוריה: Top (90) · Mid (40)')).toBeInTheDocument();
    });
});
