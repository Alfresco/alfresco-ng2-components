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

import { by, ElementFinder } from 'protractor';
import { BrowserVisibility } from '../utils/browser-visibility';
import { BrowserActions } from '../utils/browser-actions';

export class FormControllersPage {

    async enableToggle(toggle: ElementFinder): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(toggle);
        const check = await toggle.getAttribute('class');
        if (check.indexOf('mat-checked') < 0) {
            const elem = toggle.all(by.css('div')).first();
            await BrowserActions.click(elem);
        }
    }

    async disableToggle(toggle: ElementFinder): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(toggle);
        const check = await toggle.getAttribute('class');
        if (check.indexOf('mat-checked') >= 0) {
            const elem = toggle.all(by.css('div')).first();
            await BrowserActions.click(elem);
        }
    }
}
