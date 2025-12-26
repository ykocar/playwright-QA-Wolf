import { defineConfig } from "@playwright/test";
import dotenvFlow from "dotenv-flow";
import path from "path";
import fs from "fs";

dotenvFlow.config({ silent: true });

export const AUTH_FILE = path.join(process.cwd(), "authentication-cache/hn.json");

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  // Retry logic for cloud environments
  retries: process.env.CI ? 2 : 0,
  // Ensure the report folder is always generated
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: "https://news.ycombinator.com",
    storageState: fs.existsSync(AUTH_FILE) ? AUTH_FILE : undefined,
    actionTimeout: 10000,
    navigationTimeout: 40000,

    // Debugging artifacts
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