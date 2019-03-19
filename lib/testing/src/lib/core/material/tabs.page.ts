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
import { BrowserVisibility } from '../browser-visibility';

export class TabsPage {

    clickTabByTitle(tabTitle) {
        let tab = element(by.cssContainingText("div[id*='mat-tab-label']", tabTitle));
        BrowserVisibility.waitUntilElementIsVisible(tab);
        tab.click();
    }

    checkTabIsSelectedByTitle(tabTitle) {
        let tab = element(by.cssContainingText("div[id*='mat-tab-label']", tabTitle));
        tab.getAttribute('aria-selected').then((result) => {
            expect(result).toBe('true');
        });
    }
}
