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

import { ElementFinder, $, $$ } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';

export class TaskFiltersCloudComponentPage {

    filter: ElementFinder;
    taskFilters = $(`mat-expansion-panel[data-automation-id='Task Filters']`);
    activeFilter = $('.adf-active [data-automation-id="adf-filter-label"]');

    getTaskFilterLocatorByFilterName = async (filterName: string): Promise<ElementFinder> => $$(`button[data-automation-id="${filterName}_filter"]`).first();
    getFilterCounterLocatorByFilterName = async (filterName: string): Promise<ElementFinder> => $$(`[data-automation-id="${filterName}_filter-counter"]`).first();

    async checkTaskFilterIsDisplayed(filterName: string): Promise<void> {
        this.filter = await this.getTaskFilterLocatorByFilterName(filterName);
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
    }

    async clickTaskFilter(filterName): Promise<void> {
        this.filter = await this.getTaskFilterLocatorByFilterName(filterName);
        await BrowserVisibility.waitUntilElementIsClickable(this.filter);
        await BrowserActions.click(this.filter);
    }

    async checkTaskFilterNotDisplayed(filterName: string): Promise<void> {
        this.filter = await this.getTaskFilterLocatorByFilterName(filterName);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter);
    }

    async clickOnTaskFilters(): Promise<void> {
        await BrowserActions.click(this.taskFilters);
    }

    async getActiveFilterName(): Promise<string> {
        return BrowserActions.getText(this.activeFilter);
    }

    async getTaskFilterCounter(filterName: string): Promise<string> {
        const filterCounter = await this.getFilterCounterLocatorByFilterName(filterName);
        return BrowserActions.getText(filterCounter);
    }

    async checkTaskFilterCounter(filterName: string): Promise<void> {
        const filterCounter = await this.getFilterCounterLocatorByFilterName(filterName);
        await BrowserVisibility.waitUntilElementHasText(filterCounter, '0');
    }

    async checkNotificationCounterValue(filterName: string, counterValue: string): Promise<void> {
        const filterCounter = $(`[data-automation-id="${filterName}_filter-counter"][class*="adf-active"]`);
        await BrowserVisibility.waitUntilElementIsVisible(filterCounter);
        await BrowserVisibility.waitUntilElementHasText(filterCounter, counterValue);
    }

}
