import { Page  } from '@playwright/test';

export abstract class ADFPage {
    constructor(public readonly page?: Page) {}

    async close() {
        await this.page.close();
    }
}
