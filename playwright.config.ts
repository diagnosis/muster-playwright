import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    actionTimeout:10_000,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'api',
      testDir: './tests/api',
      use: {baseURL: 'http://localhost:8088'},

    },
    {
      name: 'ui-chromium',
      testDir: './tests/ui',
      use:{...devices['Desktop Chrome'], baseURL:'http://localhost:5173'}
    },
    {
      name: 'ui-mobile-ios',
      testDir: './tests/ui',
      use:{...devices['iPhone 17 Pro'], baseURL:'http://localhost:5173'}
    },
    {
      name: 'ui-mobile-android',
      testDir:'./tests/ui',
      use:{...devices['Galaxy S24'], baseURL:'http://localhost:5173'}
    }

  ],

});
