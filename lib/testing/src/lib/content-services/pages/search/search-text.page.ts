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

import { protractor, by, ElementFinder, Locator } from 'protractor';
import { BrowserVisibility } from '../../../core/utils/browser-visibility';
import { BrowserActions } from '../../../core/utils/browser-actions';

export class SearchTextPage {

    filter: ElementFinder;
    inputBy: Locator = by.css('input');

    constructor(filter: ElementFinder) {
        this.filter = filter;
    }

    async getNamePlaceholder(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        return this.filter.element(this.inputBy).getAttribute('placeholder');
    }

    async searchByName(name: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        await BrowserActions.clearSendKeys(this.filter.element(this.inputBy), name);
        await this.filter.element(this.inputBy).sendKeys(protractor.Key.ENTER);
    }

}
