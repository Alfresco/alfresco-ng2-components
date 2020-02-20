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

import { by, ElementFinder, Locator } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class TaskFiltersPage {

    filter;
    taskIcon: Locator = by.xpath("ancestor::div[@class='mat-list-item-content']/mat-icon");

    constructor(filter: ElementFinder) {
        this.filter = filter;
    }

    async checkTaskFilterIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
    }

    async getTaskFilterIcon(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const icon = this.filter.element(this.taskIcon);
        return BrowserActions.getText(icon);
    }

    async checkTaskFilterHasNoIcon(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.taskIcon));
    }

    async clickTaskFilter(): Promise<void> {
        return BrowserActions.click(this.filter);
    }

    async checkTaskFilterNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter);
    }

}
