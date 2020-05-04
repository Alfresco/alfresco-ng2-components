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

import { browser, by, element, ElementFinder } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';

export class TaskFiltersCloudComponentPage {

    filter: ElementFinder;
    taskFilters: ElementFinder = element(by.css(`mat-expansion-panel[data-automation-id='Task Filters']`));
    activeFilter: ElementFinder = element(by.css('.adf-active'));

    async checkTaskFilterIsDisplayed(filterName: string): Promise<void> {
        this.filter = this.getTaskFilterLocatorByFilterName(filterName);
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
    }

    async clickTaskFilter(filterName): Promise<void> {
        this.filter = this.getTaskFilterLocatorByFilterName(filterName);
        await BrowserVisibility.waitUntilElementIsClickable(this.filter);
        await BrowserActions.click(this.filter);
        await browser.sleep(1000);
    }

    async checkTaskFilterNotDisplayed(filterName: string): Promise<void> {
        this.filter = this.getTaskFilterLocatorByFilterName(filterName);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter);
    }

    async clickOnTaskFilters(): Promise<void> {
        await BrowserActions.click(this.taskFilters);
    }

    async getActiveFilterName(): Promise<string> {
        return BrowserActions.getText(this.activeFilter);
    }

    getTaskFilterLocatorByFilterName(filterName: string): ElementFinder {
        return element(by.css(`button[data-automation-id="${filterName}_filter"]`));
    }

}
