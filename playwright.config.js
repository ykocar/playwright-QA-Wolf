import { defineConfig } from "@playwright/test";
import dotenvFlow from "dotenv-flow";
import path from "path";
import fs from "fs";

dotenvFlow.config({ silent: true });

// Path where the browser state (cookies/localStorage) will be saved
export const AUTH_FILE = path.join(process.cwd(), "authentication-cache/hn.json");

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  use: {
    baseURL: "https://news.ycombinator.com",
    // Inject the saved state if it exists
    storageState: fs.existsSync(AUTH_FILE) ? AUTH_FILE : undefined,
    actionTimeout: 10000,
    navigationTimeout: 40000,
    trace: "retain-on-failure",
  },
  // We can also use a setup project for more complex flows, 
  // but for now, we'll ensure the fixture handles the check.
});