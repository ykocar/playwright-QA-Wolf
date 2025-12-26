import { defineConfig } from "@playwright/test";
import dotenvFlow from "dotenv-flow";
import path from "path";
import fs from "fs";

dotenvFlow.config({ silent: true });

export const AUTH_FILE = path.join(process.cwd(), "authentication-cache/hn.json");

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,

  // Added the CTRF reporter alongside the HTML and List reporters
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ['playwright-ctrf-json-reporter', { outputDir: 'ctrf' }]
  ],

  use: {
    baseURL: "https://news.ycombinator.com",
    storageState: fs.existsSync(AUTH_FILE) ? AUTH_FILE : undefined,
    actionTimeout: 10000,
    navigationTimeout: 40000,

    trace: "retain-on-failure",
    video: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    }
  ],
});