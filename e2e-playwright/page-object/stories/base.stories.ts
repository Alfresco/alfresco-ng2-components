/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
