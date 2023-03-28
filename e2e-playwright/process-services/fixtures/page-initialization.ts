import { BaseStories } from '../../page-object';
import { test as base } from '@playwright/test';
import { ComponentTitles } from '../../models/component-titles.model';


interface Pages {
    processServices: BaseStories;
}

export const test = base.extend<Pages>({
    processServices: async ({ page }, use) => { await use(new BaseStories(page, ComponentTitles.processServices)); },
    
});
