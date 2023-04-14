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

import { BrowserActions, BrowserVisibility, DataTableComponentPage, StartProcessPage } from '@alfresco/adf-testing';
import { $, $$ } from 'protractor';

export class ProcessFiltersPage {

    dataTable = new DataTableComponentPage();
    createProcessButton = $('.app-processes-menu button[data-automation-id="create-button"] > span');
    newProcessButton = $('div > button[data-automation-id="btn-start-process"]');
    processesPage = $('#app-processes-menu');
    accordionMenu = $('.app-processes-menu mat-accordion');
    buttonWindow = $('div > button[data-automation-id="btn-start-process"] > div');
    noContentMessage = $$('.adf-empty-content__title').first();
    rows = $$('adf-process-instance-list .adf-datatable-body adf-datatable-row[class*="adf-datatable-row"]');
    tableBody = $$('adf-datatable .adf-datatable-body').first();
    processIcon = 'adf-icon[data-automation-id="adf-filter-icon"]';
    startProcessEl = $('adf-start-process .adf-start-process');

    getButtonFilterLocatorByName = (name: string) => $(`button[data-automation-id='${name}_filter']`);

    async startProcess(): Promise<StartProcessPage> {
        await this.clickCreateProcessButton();
        await this.clickNewProcessDropdown();
        return new StartProcessPage();
    }

    async clickRunningFilterButton(): Promise<void> {
        await BrowserActions.click(await this.getButtonFilterLocatorByName('Running'));
    }

    async clickCompletedFilterButton(): Promise<void> {
        const completedFilterButtonLocator = await this.getButtonFilterLocatorByName('Completed');
        await BrowserActions.click(completedFilterButtonLocator);
        await expect(await completedFilterButtonLocator.isEnabled()).toBe(true);
    }

    async clickAllFilterButton(): Promise<void> {
        const allFilterButtonLocator = await this.getButtonFilterLocatorByName('All');
        await BrowserActions.click(allFilterButtonLocator);
        await expect(await allFilterButtonLocator.isEnabled()).toBe(true);
    }

    async clickCreateProcessButton(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserVisibility.waitUntilElementIsVisible(this.accordionMenu);
        await BrowserVisibility.waitUntilElementIsVisible(this.processesPage);
        await BrowserActions.click(this.createProcessButton);
    }

    async clickNewProcessDropdown(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.buttonWindow);
        await BrowserActions.click(this.newProcessButton);
    }

    async checkStartProcessIsDisplay(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.startProcessEl);
    }

    async checkNoContentMessage(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.noContentMessage);
    }

    async selectFromProcessList(title: string): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const processName = $$(`div[data-automation-id="text_${title}"]`).first();
        await BrowserActions.click(processName);
    }

    async checkFilterIsHighlighted(filterName: string): Promise<void> {
        const processNameHighlighted = $(`adf-process-instance-filters .adf-active button[data-automation-id='${filterName}_filter']`);
        await BrowserVisibility.waitUntilElementIsVisible(processNameHighlighted);
    }

    async numberOfProcessRows(): Promise<number> {
        await BrowserVisibility.waitUntilElementIsVisible(await this.rows.first());
        return this.rows.count();
    }

    async waitForTableBody(): Promise<void> {
        await this.dataTable.waitForTableBody();
    }

    /**
     *  Sort the list by name column.
     *
     * @param sortOrder : 'ASC' to sort the list ascendant and 'DESC' for descendant
     */
    async sortByName(sortOrder: string) {
        await this.dataTable.sortByColumn(sortOrder, 'name');
    }

    async getAllRowsNameColumn() {
        return this.dataTable.getAllRowsColumnValues('Name');
    }

    async checkFilterIsDisplayed(name: string): Promise<void> {
        const filterName = await this.getButtonFilterLocatorByName(name);
        await BrowserVisibility.waitUntilElementIsVisible(filterName);
    }

    async checkFilterHasNoIcon(name: string): Promise<void> {
        const filterName = await this.getButtonFilterLocatorByName(name);
        await BrowserVisibility.waitUntilElementIsVisible(filterName);
        await BrowserVisibility.waitUntilElementIsNotVisible(filterName.$(this.processIcon));
    }

    async getFilterIcon(name: string): Promise<string> {
        const filterName = await this.getButtonFilterLocatorByName(name);
        await BrowserVisibility.waitUntilElementIsVisible(filterName);
        const icon = filterName.$(this.processIcon);
        return BrowserActions.getText(icon);
    }

    async checkFilterIsNotDisplayed(name: string): Promise<void> {
        const filterName = await this.getButtonFilterLocatorByName(name);
        await BrowserVisibility.waitUntilElementIsNotVisible(filterName);
    }

    async checkProcessesSortedByNameAsc(): Promise<void> {
        const list = await this.getAllRowsNameColumn();
        for (let i = 1; i < list.length; i++) {
            await expect(JSON.stringify(list[i]) > JSON.stringify(list[i - 1])).toEqual(true);
        }
    }

    async checkProcessesSortedByNameDesc(): Promise<void> {
        const list = await this.getAllRowsNameColumn();
        for (let i = 1; i < list.length; i++) {
            await expect(JSON.stringify(list[i]) < JSON.stringify(list[i - 1])).toEqual(true);
        }
    }
}
