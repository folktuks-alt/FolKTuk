import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: process.env.WEB_BASE_URL ?? 'http://localhost:3001',
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
  },
  webServer: process.env.START_WEB_SERVER === 'true'
    ? { command: 'npm run start -- --hostname 127.0.0.1 --port 3001', url: 'http://localhost:3001', reuseExistingServer: true }
    : undefined,
});
