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

import { ElementFinder, $ } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';

const FILTERS = {
    ALL: 'all-processes',
    COMPLETED: 'completed-processes',
    RUNNING: 'running-processes'
};

export class ProcessFiltersCloudComponentPage {

    processFilters = $(`mat-expansion-panel[data-automation-id='Process Filters']`);
    activeFilter = $('.adf-active [data-automation-id="adf-filter-label"]');
    processFiltersList = $('adf-cloud-process-filters');

    getProcessFilterLocatorByFilterName = (filterName: string): ElementFinder => $(`button[data-automation-id="${filterName}_filter"]`);

    async checkProcessFilterIsDisplayed(filterName: string): Promise<void> {
        const filter = this.getProcessFilterLocatorByFilterName(filterName);
        await BrowserVisibility.waitUntilElementIsVisible(filter);
    }

    async clickProcessFilter(filterName: string): Promise<void> {
        const filter = this.getProcessFilterLocatorByFilterName(filterName);
        await BrowserActions.click(filter);
    }

    async clickAllProcessesFilter(): Promise<void> {
        const filter = this.getProcessFilterLocatorByFilterName(FILTERS.ALL);
        await BrowserActions.click(filter);
    }

    async clickCompletedProcessesFilter(): Promise<void> {
        const filter = this.getProcessFilterLocatorByFilterName(FILTERS.COMPLETED);
        await BrowserActions.click(filter);
    }

    async clickRunningProcessesFilter(): Promise<void> {
        const filter = this.getProcessFilterLocatorByFilterName(FILTERS.RUNNING);
        await BrowserActions.click(filter);
    }

    async checkAllProcessesFilterIsDisplayed(): Promise<void> {
        const filter = this.getProcessFilterLocatorByFilterName(FILTERS.ALL);
        await BrowserVisibility.waitUntilElementIsVisible(filter);
    }

    async checkCompletedProcessesFilterIsDisplayed(): Promise<void> {
        const filter = this.getProcessFilterLocatorByFilterName(FILTERS.COMPLETED);
        await BrowserVisibility.waitUntilElementIsVisible(filter);
    }

    async checkRunningProcessesFilterIsDisplayed(): Promise<void> {
        const filter = this.getProcessFilterLocatorByFilterName(FILTERS.RUNNING);
        await BrowserVisibility.waitUntilElementIsVisible(filter);
    }

    async checkProcessFilterNotDisplayed(filterName: string): Promise<void> {
        const filter = this.getProcessFilterLocatorByFilterName(filterName);
        await BrowserVisibility.waitUntilElementIsNotVisible(filter);
    }

    async clickOnProcessFilters(): Promise<void> {
        await BrowserActions.click(this.processFilters);
    }

    async getActiveFilterName(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.activeFilter);
        return BrowserActions.getText(this.activeFilter);
    }

    async isProcessFiltersListVisible(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.processFiltersList);
    }
}
