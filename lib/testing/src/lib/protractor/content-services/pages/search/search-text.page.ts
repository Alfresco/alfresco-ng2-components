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

import { protractor, ElementFinder } from 'protractor';
import { BrowserVisibility } from '../../../core/utils/browser-visibility';
import { BrowserActions } from '../../../core/utils/browser-actions';

export class SearchTextPage {

    filter: ElementFinder;
    inputBy = 'input';

    constructor(filter: ElementFinder) {
        this.filter = filter;
    }

    async searchByName(name: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        await BrowserActions.clearSendKeys(this.filter.$(this.inputBy), name);
        await this.filter.$(this.inputBy).sendKeys(protractor.Key.ENTER);
    }
}
