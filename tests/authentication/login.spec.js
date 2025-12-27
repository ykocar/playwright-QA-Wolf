import { test, expect } from "../../fixture.js";
import { getEnvVar } from "../../utils/helpers/envVarHelper.js";

test.describe("Authentication - Login Page", () => {
    test("Login with valid credentials", async ({ loginPage, page }) => {
        const user = getEnvVar("HN_USERNAME");
        const password = getEnvVar("HN_PASSWORD");

        await test.step("Ensure clean state (logout if already logged in)", async () => {
            await loginPage.logoutIfLoggedIn();
        });

        await test.step("Login with valid credentials", async () => {
            await loginPage.goto();
            await loginPage.login(user, password);
        });

        await test.step("Verify user is authenticated", async () => {
            // Checking for the logout link confirms the session is active
            await expect(page.getByRole("link", { name: /logout/i })).toBeVisible();

            // Verifying the username appears in the top-right corner
            await expect(page.locator("#me")).toHaveText(user);
        });
    });
});