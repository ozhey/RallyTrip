import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { isActivePath } from '../NavLink';

let pathname = '/products/garmin';
vi.mock('next/navigation', () => ({ usePathname: () => pathname, useRouter: () => ({ push: vi.fn() }) }));

const { default: NavBar } = await import('./NavBar');

describe('isActivePath', () => {
  it('matches like react-router NavLink', () => {
    expect(isActivePath('/products/garmin', '/products')).toBe(true);
    expect(isActivePath('/productsx', '/products')).toBe(false);
    expect(isActivePath('/products', '/', true)).toBe(false);
    expect(isActivePath('/', '/', true)).toBe(true);
    expect(isActivePath('/products/garmin/', '/products/garmin')).toBe(true);
    expect(isActivePath('/products/', '/')).toBe(false);
  });
});

describe('NavBar', () => {
  beforeEach(() => { pathname = '/products/garmin'; });

  it('renders the main links with the active one highlighted', () => {
    render(<NavBar />);
    const products = screen.getAllByRole('link', { name: 'מוצרים' })[0];
    expect(products).toHaveAttribute('href', '/products/');
    expect(products).toHaveClass('nav-active');
    expect(screen.getAllByRole('link', { name: 'בית' })[0]).not.toHaveClass('nav-active');
  });

  it('opens and closes the side drawer', () => {
    const { container } = render(<NavBar />);
    const drawer = container.querySelector('.sidedrawer');
    expect(drawer).not.toHaveClass('open');
    fireEvent.click(screen.getByRole('button', { name: 'תפריט' }));
    expect(drawer).toHaveClass('open');
    fireEvent.click(container.querySelector('.backdrop'));
    expect(drawer).not.toHaveClass('open');
  });

  it('shows the products dropdown on hover', () => {
    const { container } = render(<NavBar />);
    expect(container.querySelector('.dropdown')).toBeNull();
    fireEvent.mouseEnter(screen.getAllByRole('link', { name: 'מוצרים' })[0].closest('li'));
    expect(container.querySelector('.dropdown')).not.toBeNull();
  });
});
