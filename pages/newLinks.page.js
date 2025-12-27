import { BasePage } from './basePage.page';

export const locators = {
    ageElement: (page) => page.locator('.age'),
    moreButton: (page) => page.getByRole('link', { name: 'More' }).last(),
};

export class NewLinksPage extends BasePage {
    async goto() {
        await this.page.goto("/newest");
    }

    async getFirst100ArticleTimestamps() {
        let timestamps = [];
        while (timestamps.length < 100) {
            const ageElements = this.get(locators.ageElement);
            const count = await ageElements.count();

            for (let i = 0; i < count && timestamps.length < 100; i++) {
                /**
                * On the real Hacker News page, each `.age` element has a hidden `title` attribute
                * like "2025-12-26T15:59:15 1766764755".
                * We extract the second value (Unix timestamp in seconds) and convert it to a number
                * so we can compare and validate sorting reliably.
                */
                const titleAttr = await ageElements.nth(i).getAttribute('title');
                const unixSeconds = Number(titleAttr.split(' ')[1]); // extract unix timestamp (seconds)
                timestamps.push(unixSeconds);
            }

            if (timestamps.length < 100) {
                await this.get(locators.moreButton).click();
                await this.page.waitForLoadState('networkidle');
            }
        }
        return timestamps;
    }

    async areTimestampsSortedDescending(timestamps) {
        for (let i = 0; i < timestamps.length - 1; i++) {
            if (timestamps[i] < timestamps[i + 1])
                return false;
        }
        return true;
    }
}