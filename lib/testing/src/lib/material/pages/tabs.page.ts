/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { element, by } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';

export class TabsPage {

    async clickTabByTitle(tabTitle): Promise<void> {
        const tab = element(by.cssContainingText("div[id*='mat-tab-label']", tabTitle));
        await BrowserActions.click(tab);
    }

    async checkTabIsSelectedByTitle(tabTitle): Promise<void> {
        const tab = element(by.cssContainingText("div[id*='mat-tab-label']", tabTitle));
        const result = await tab.getAttribute('aria-selected');
        await expect(result).toBe('true');
    }
}
