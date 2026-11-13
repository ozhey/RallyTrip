import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextVitals,
  {
    ignores: ['.next/**', '.next-e2e/**', '.next-e2e-static/**', '.next-static/**', 'out/**', 'node_modules/**', 'backup/**', 'playwright-report/**', 'test-results/**'],
  },
  {
    rules: {
      // Images are plain <img> on purpose until the visual-refresh phase.
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;
