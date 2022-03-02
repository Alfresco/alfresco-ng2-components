/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Page } from '@playwright/test';
import { timeouts } from '../timeouts';
import { ComponentTitles } from '../models/model';
import { PlaywrightBase } from './playwright-base';

interface NavigateParameters { componentName: string; story: string };

export class BaseStories extends PlaywrightBase {
    private rootComponentTitle: string;

    constructor(page: Page, rootComponentTitle: ComponentTitles) {
        super(page);
        this.rootComponentTitle = rootComponentTitle;
    }

    async navigateTo({ componentName, story }: NavigateParameters): Promise<void> {
        await this.page.goto(`/iframe.html?id=${this.rootComponentTitle}-components-${componentName}--${story}`, {
            waitUntil: 'networkidle',
            timeout: timeouts.large
        });
    }
}
