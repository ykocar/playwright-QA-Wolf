import { test as base, expect } from "@playwright/test";
import { LoginPage } from "./pages/login.page.js";
import { NewLinksPage } from "./pages/newLinks.page.js";
import { AUTH_FILE } from "./playwright.config.js";

export const test = base.extend({
    // This fixture ensures we are authenticated before the test starts
    authenticatedPage: async ({ page, loginPage }, use) => {
        await loginPage.goto();
        const isLoggedIn = await loginPage.isLoggedIn();

        if (!isLoggedIn) {
            const user = process.env.HN_USERNAME;
            const password = process.env.HN_PASSWORD;

            if (!user || !password) {
                throw new Error("Missing HN_USERNAME or HN_PASSWORD in .env file");
            }

            await loginPage.login(user, password);
            // Save state so we don't have to login next time
            await page.context().storageState({ path: AUTH_FILE });
        }
        await use(page);
    },

    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    newLinksPage: async ({ page }, use) => {
        await use(new NewLinksPage(page));
    },
});

export { expect };