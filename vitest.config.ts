import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.ts'],
    },
    snapshotFormat: {
      maxOutputLength: Infinity,
    },
    // setupFiles: ['vitest.setup.ts'],
  },
});
