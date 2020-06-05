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

import { BrowserActions, BrowserVisibility, DataTableComponentPage, StartProcessPage } from '@alfresco/adf-testing';
import { by, element } from 'protractor';

export class ProcessFiltersPage {

    dataTable = new DataTableComponentPage();
    runningFilter = element(by.css('button[data-automation-id="Running_filter"]'));
    completedFilter = element(by.css('button[data-automation-id="Completed_filter"]'));
    allFilter = element(by.css('button[data-automation-id="All_filter"]'));
    createProcessButton = element(by.css('.app-processes-menu button[data-automation-id="create-button"] > span'));
    newProcessButton = element(by.css('div > button[data-automation-id="btn-start-process"]'));
    processesPage = element(by.css('.app-grid > .app-grid-item app-processes-menu'));
    accordionMenu = element(by.css('.app-processes-menu mat-accordion'));
    buttonWindow = element(by.css('div > button[data-automation-id="btn-start-process"] > div'));
    noContentMessage = element.all(by.css('.adf-empty-content__title')).first();
    rows = by.css('adf-process-instance-list .adf-datatable-body adf-datatable-row[class*="adf-datatable-row"]');
    tableBody = element.all(by.css('adf-datatable .adf-datatable-body')).first();
    nameColumn = by.css('div[class*="adf-datatable-body"] adf-datatable-row[class*="adf-datatable-row"] div[title="Name"] span');
    processIcon = by.css('adf-icon[data-automation-id="adf-filter-icon"]');

    async startProcess(): Promise<StartProcessPage> {
        await this.clickCreateProcessButton();
        await this.clickNewProcessDropdown();
        return new StartProcessPage();
    }

    async clickRunningFilterButton(): Promise<void> {
        await BrowserActions.click(this.runningFilter);
    }

    async clickCompletedFilterButton(): Promise<void> {
        await BrowserActions.click(this.completedFilter);
        await expect(await this.completedFilter.isEnabled()).toBe(true);
    }

    async clickAllFilterButton(): Promise<void> {
        await BrowserActions.click(this.allFilter);
        await expect(await this.allFilter.isEnabled()).toBe(true);
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

    async checkNoContentMessage(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.noContentMessage);
    }

    async selectFromProcessList(title: string): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const processName = element.all(by.css(`div[data-automation-id="text_${title}"]`)).first();
        await BrowserActions.click(processName);
    }

    async checkFilterIsHighlighted(filterName: string): Promise<void> {
        const processNameHighlighted = element(by.css(`adf-process-instance-filters .adf-active button[data-automation-id='${filterName}_filter']`));
        await BrowserVisibility.waitUntilElementIsVisible(processNameHighlighted);
    }

    async numberOfProcessRows(): Promise<number> {
        return element.all(this.rows).count();
    }

    async waitForTableBody(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.tableBody);
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
        const filterName = element(by.css(`button[data-automation-id='${name}_filter']`));
        await BrowserVisibility.waitUntilElementIsVisible(filterName);
    }

    async checkFilterHasNoIcon(name: string): Promise<void> {
        const filterName = element(by.css(`button[data-automation-id='${name}_filter']`));
        await BrowserVisibility.waitUntilElementIsVisible(filterName);
        await BrowserVisibility.waitUntilElementIsNotVisible(filterName.element(this.processIcon));
    }

    async getFilterIcon(name: string): Promise<string> {
        const filterName = element(by.css(`button[data-automation-id='${name}_filter']`));
        await BrowserVisibility.waitUntilElementIsVisible(filterName);
        const icon = filterName.element(this.processIcon);
        return BrowserActions.getText(icon);
    }

    async checkFilterIsNotDisplayed(name: string): Promise<void> {
        const filterName = element(by.css(`button[data-automation-id='${name}_filter']`));
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
