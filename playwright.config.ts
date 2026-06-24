import { defineConfig, devices } from '@playwright/test';

const PORT = 3399;

// e2e del recorrido MVP. Levanta el server (que sirve el build del client en mismo origen)
// con una base SQLite en memoria. Requiere `pnpm build` previo (lo hace el script test:e2e).
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node server/dist/index.js',
    url: `http://localhost:${PORT}/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      PORT: String(PORT),
      DATABASE_URL: ':memory:',
      NODE_ENV: 'production',
      CORS_ORIGIN: `http://localhost:${PORT}`,
    },
  },
});
