import { readFileSync } from 'node:fs';
import { describeMe } from '@describe-me/vitest/plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

// The web fonts of the Atlas text styles. The test page loads them in src/test/setup.ts; every replayed frame gets them here.
const previewHead = readFileSync(new URL('./src/styles/fonts.html', import.meta.url), 'utf8');

export default defineConfig({
  plugins: [react(), describeMe({ previewHead })],
  test: {
    include: ['src/**/*.test.tsx'],
    setupFiles: ['./src/test/setup.ts'],
    // A real browser, so layout, fonts, focus and contrast are the real ones.
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
