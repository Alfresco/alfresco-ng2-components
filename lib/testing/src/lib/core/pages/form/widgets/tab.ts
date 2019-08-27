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

import { by, element, browser} from 'protractor';
import { BrowserActions, BrowserVisibility } from '../../../utils/public-api';

export class Tab {

    async clickTabByLabel(tabLabel): Promise<void> {
        const user = element(by.cssContainingText('.mat-tab-label-content', tabLabel));
        await BrowserActions.click(user);
        await browser.sleep(300);
    }

    async checkTabIsDisplayedByLabel(tabLabel): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText('.mat-tab-label-content', tabLabel)));
    }

    async checkTabIsNotDisplayedByLabel(tabLabel): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.cssContainingText('.mat-tab-label-content', tabLabel)));
    }
}
