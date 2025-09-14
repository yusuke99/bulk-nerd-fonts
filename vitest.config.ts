import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    env: {
      NODE_ENV: 'dev',
    },
    environment: 'node',
    include: ['./**/*.test.ts'],
  },
});
