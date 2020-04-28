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

import { by, element, ElementFinder } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';

export class ProcessFiltersCloudComponentPage {

    filter: ElementFinder;
    filterIcon: ElementFinder = element(by.css('.adf-icon'));

    processFilters: ElementFinder = element(by.css("mat-expansion-panel[data-automation-id='Process Filters']"));

    activeFilter: ElementFinder = element(by.css('.adf-active'));
    processFiltersList: ElementFinder = element(by.css('adf-cloud-process-filters'));

    async checkProcessFilterIsDisplayed(filterName: string): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName(filterName);
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
    }

    async getProcessFilterIcon(filterName: string): Promise<string> {
        this.filter = this.getProcessFilterLocatorByFilterName(filterName);
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        const icon = this.filter.element(this.filterIcon);
        await BrowserVisibility.waitUntilElementIsVisible(icon);
        return BrowserActions.getText(icon);
    }

    async checkProcessFilterHasNoIcon(filterName: string): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName(filterName);
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.filterIcon));
    }

    async clickProcessFilter(filterName: string): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName(filterName);
        await BrowserVisibility.waitUntilElementIsClickable(this.filter);
        await BrowserActions.click(this.filter);
    }

    async clickAllProcessesFilter(): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName('all-processes');
        await BrowserVisibility.waitUntilElementIsClickable(this.filter);
        await BrowserActions.click(this.filter);
    }

    async clickCompletedProcessesFilter(): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName('completed-processes');
        await BrowserVisibility.waitUntilElementIsClickable(this.filter);
        await BrowserActions.click(this.filter);
    }

    async clickRunningProcessesFilter(): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName('running-processes');
        await BrowserVisibility.waitUntilElementIsClickable(this.filter);
        await BrowserActions.click(this.filter);
    }

    async checkAllProcessesFilterIsDisplayed(): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName('all-processes');
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
    }

    async checkCompletedProcessesFilterIsDisplayed(): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName('completed-processes');
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
    }

    async checkRunningProcessesFilterIsDisplayed(): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName('running-processes');
        await BrowserVisibility.waitUntilElementIsVisible(this.filter);
    }

    async checkProcessFilterNotDisplayed(filterName: string): Promise<void> {
        this.filter = this.getProcessFilterLocatorByFilterName(filterName);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter);
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

    getProcessFilterLocatorByFilterName(filterName: string): ElementFinder {
        return element(by.css(`button[data-automation-id="${filterName}_filter"]`));
    }
}
