/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Page } from '@playwright/test';
import { timeouts } from '../../utils/timeouts';
import { ComponentTitles } from '../../models/component-titles.model';
import { PlaywrightBase } from '../playwright-base';

interface NavigationParameters {
    moduleNames: string[];
    componentName: string;
    story: string;
};

export class BaseStories extends PlaywrightBase {
    private libraryName: string;

    constructor(page: Page, libraryName: ComponentTitles) {
        super(page);
        this.libraryName = libraryName;
    }

    private buildStoryId({ moduleNames, componentName, story }: NavigationParameters): string{
        const moduleNamesConcatenated = moduleNames.reduce((module, submodule) => module + '-' + submodule);
        return this.libraryName + '-' + moduleNamesConcatenated + '-' + componentName + '--' + story;
    }

    async navigateTo(navigationParameters: NavigationParameters): Promise<void> {
        await this.page.goto(`/iframe.html?args=&viewMode=story&id=${this.buildStoryId(navigationParameters)}`, {
            waitUntil: 'networkidle',
            timeout: timeouts.large
        });
    }
}
