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
                const titleAttr = await ageElements.nth(i).getAttribute('title');
                // titleAttr is usually "YYYY-MM-DDTHH:MM:SS"
                const date = new Date(titleAttr.split(' ')[0]);
                timestamps.push(date.getTime());
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
            if (timestamps[i] < timestamps[i + 1]) return false;
        }
        return true;
    }
}