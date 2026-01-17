import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  globalSetup: './tests/auth.setup.ts',  
  testDir: './tests',
  timeout: 120_000,
  use: {
    baseURL: 'http://frontend:5173',
    viewport: { width: 1440, height: 1024 },
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  outputDir: './tests/test-results',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      actionTimeout: 30000,
      navigationTimeout: 45000,
    },
  ],
})
