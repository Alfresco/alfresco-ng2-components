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

import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';
import { element, by, ElementFinder } from 'protractor';

export class ProcessListPage {

    processListTitle: ElementFinder = element.all(by.css("div[class='adf-empty-content__title']")).first();
    processInstanceList: ElementFinder = element(by.css('adf-process-instance-list'));

    getDisplayedProcessListTitle(): Promise<string> {
        return BrowserActions.getText(this.processListTitle);
    }

    async checkProcessListIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.processInstanceList);
    }

}
