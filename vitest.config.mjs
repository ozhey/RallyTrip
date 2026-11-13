import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformWithOxc } from 'vite';
import { defineConfig } from 'vitest/config';

const root = path.dirname(fileURLToPath(import.meta.url));

// Next.js lets .js files contain JSX; teach Vite the same for project sources.
const jsxInJs = {
  name: 'jsx-in-js',
  enforce: 'pre',
  async transform(code, id) {
    if (!/\/(src|app|tests)\/.*\.js$/.test(id) || id.includes('node_modules')) return null;
    return transformWithOxc(code, id, { lang: 'jsx', jsx: { runtime: 'automatic' } });
  },
};

export default defineConfig({
  plugins: [jsxInJs],
  resolve: {
    alias: {
      '@': path.join(root, 'src'),
      'server-only': path.join(root, 'tests/unit/server-only-stub.js'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js', 'tests/unit/**/*.test.js'],
    setupFiles: ['tests/unit/setup.js'],
    css: false,
  },
});
