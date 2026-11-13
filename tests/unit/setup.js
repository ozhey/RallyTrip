import '@testing-library/jest-dom/vitest';

// Mirror next.config trailingSlash: true for next/link in tests.
process.env.__NEXT_TRAILING_SLASH = 'true';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => cleanup());
