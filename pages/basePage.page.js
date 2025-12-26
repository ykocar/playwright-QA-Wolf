export class BasePage {
    constructor(page) {
        this.page = page;
    }

    /**
     * @param {(page: any) => any} locate
     */
    get(locate) {
        return locate(this.page);
    }
}