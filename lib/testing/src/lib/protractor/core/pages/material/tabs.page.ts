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

import { element, by, $$ } from 'protractor';
import { BrowserActions } from '../../utils/browser-actions';
import { BrowserVisibility } from '../../utils/browser-visibility';

export class TabsPage {

    tabs = $$(`div[id*='mat-tab-label']`);

    async clickTabByTitle(tabTitle): Promise<void> {
        const tab = element(by.cssContainingText(`div[id*='mat-tab-label']`, tabTitle));
        await BrowserActions.click(tab);
    }

    async checkTabIsSelectedByTitle(tabTitle): Promise<void> {
        const tab = element(by.cssContainingText(`div[id*='mat-tab-label']`, tabTitle));
        const result = await BrowserActions.getAttribute(tab, 'aria-selected');
        await expect(result).toBe('true');
    }

    async getNoOfTabs(): Promise<number> {
        await BrowserVisibility.waitUntilElementIsVisible(this.tabs.first());
        return this.tabs.count();
    }

    async getTabsLabels(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.tabs.first());
        return this.tabs.getText();
    }
}
