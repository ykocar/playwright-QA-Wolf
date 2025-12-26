import { test, expect } from "../../fixture.js";

test.describe("Hacker News Newest Links", () => {
    test("Validate first 100 articles are sorted newest to oldest", async ({ newLinksPage, authenticatedPage }) => {

        await test.step("Navigate to newest page", async () => {
            await newLinksPage.goto();
        });

        await test.step("Collect and validate timestamps", async () => {
            const timestamps = await newLinksPage.getFirst100ArticleTimestamps();

            // Ensure we actually got 100 items
            expect(timestamps.length).toBe(100);

            // Validate sorting logic
            const isSorted = await newLinksPage.areTimestampsSortedDescending(timestamps);
            expect(isSorted, "Articles are not in descending chronological order").toBe(true);
        });
    });
});