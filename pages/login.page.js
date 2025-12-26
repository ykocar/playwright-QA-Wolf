import { expect } from "@playwright/test";
import { BasePage } from "./basePage.page.js";

export const locators = {
    fields: {
        username: (page) => page.locator('input[name="acct"], input[name="username"]'),
        password: (page) => page.locator('input[name="pw"], input[name="password"]'),
    },
    actions: {
        login: (page) => page.locator('input[type="submit"][value="login"]'),
        logoutLink: (page) => page.getByRole("link", { name: "logout" }),
    },
    captcha: {
        checkbox: (page) => page.frameLocator('iframe[title*="reCAPTCHA"]').locator('#recaptcha-anchor'),
    },
};

export class LoginPage extends BasePage {
    async goto() {
        await this.page.goto("/login");
    }

    /**
     * Checks if the user is currently authenticated by looking for the logout link.
     */
    async isLoggedIn() {
        return await this.get(locators.actions.logoutLink).isVisible();
    }

    /**
     * Navigates home and performs a logout only if the user is currently authenticated.
     */
    async logoutIfLoggedIn() {
        await this.page.goto("/");
        if (await this.isLoggedIn()) {
            await this.get(locators.actions.logoutLink).click();
            await this.page.waitForLoadState('networkidle');
        } else {
        }
    }

    /**
     * Fills credentials and handles the login flow.
     */
    async login(username, password) {
        // Ensure we are actually on the login page before filling fields
        if (!this.page.url().includes('/login')) {
            await this.goto();
        }

        await this.get(locators.fields.username).first().fill(username);
        await this.get(locators.fields.password).first().fill(password);

        await this.handleCaptcha();

        await this.get(locators.actions.login).click();

        // Wait for successful redirect (usually to the home page or user profile)
        await this.page.waitForURL((url) => url.origin === 'https://news.ycombinator.com' && !url.pathname.includes('/login'));
    }

    async handleCaptcha() {
        const checkbox = this.get(locators.captcha.checkbox);
        try {
            // Check if captcha exists without failing the test if it's absent
            if (await checkbox.isVisible({ timeout: 2000 })) {
                console.warn("⚠️ CAPTCHA detected. Attempting to click...");
                await checkbox.click({ force: true });
                // Playwright will wait up to 60s for manual or auto-resolution
                await expect(checkbox).toHaveAttribute("aria-checked", "true", { timeout: 60000 });
            }
        } catch (e) {
            // Captcha not present or interaction timed out
        }
    }
}