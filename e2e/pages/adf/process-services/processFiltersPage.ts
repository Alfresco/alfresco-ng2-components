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

import { element, by, ElementFinder, Locator } from 'protractor';
import { StartProcessPage } from './startProcessPage';
import { DataTableComponentPage } from '@alfresco/adf-testing';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class ProcessFiltersPage {

    dataTable = new DataTableComponentPage();
    runningFilter: ElementFinder = element(by.css('span[data-automation-id="Running_filter"]'));
    completedFilter: ElementFinder = element(by.css('div[class="mat-list-text"] > span[data-automation-id="Completed_filter"]'));
    allFilter: ElementFinder = element(by.css('span[data-automation-id="All_filter"]'));
    createProcessButton: ElementFinder = element(by.css('.adf-processes-menu button[data-automation-id="create-button"] > span'));
    newProcessButton: ElementFinder = element(by.css('div > button[data-automation-id="btn-start-process"]'));
    processesPage: ElementFinder = element(by.css('div[class="adf-grid"] > div[class="adf-grid-item adf-processes-menu"]'));
    accordionMenu: ElementFinder = element(by.css('.adf-processes-menu mat-accordion'));
    buttonWindow: ElementFinder = element(by.css('div > button[data-automation-id="btn-start-process"] > div'));
    noContentMessage: ElementFinder = element.all(by.css('div[class="adf-empty-content__title"]')).first();
    rows: Locator = by.css('adf-process-instance-list div[class="adf-datatable-body"] div[class*="adf-datatable-row"]');
    tableBody: ElementFinder = element.all(by.css('adf-datatable div[class="adf-datatable-body"]')).first();
    nameColumn: Locator = by.css('div[class*="adf-datatable-body"] div[class*="adf-datatable-row"] div[title="Name"] span');
    processIcon: Locator = by.xpath('ancestor::div[@class="mat-list-item-content"]/mat-icon');

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

    async selectFromProcessList(title): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const processName: ElementFinder = element.all(by.css(`div[data-automation-id="text_${title}"]`)).first();
        await BrowserActions.click(processName);
    }

    async checkFilterIsHighlighted(filterName): Promise<void> {
        const processNameHighlighted: ElementFinder = element(by.css(`mat-list-item.adf-active span[data-automation-id='${filterName}_filter']`));
        await BrowserVisibility.waitUntilElementIsVisible(processNameHighlighted);
    }

    async numberOfProcessRows(): Promise<number> {
        return await element.all(this.rows).count();
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
        return await this.dataTable.getAllRowsColumnValues('Name');
    }

    async checkFilterIsDisplayed(name): Promise<void> {
        const filterName: ElementFinder = element(by.css(`span[data-automation-id='${name}_filter']`));
        await BrowserVisibility.waitUntilElementIsVisible(filterName);
    }

    async checkFilterHasNoIcon(name): Promise<void> {
        const filterName: ElementFinder = element(by.css(`span[data-automation-id='${name}_filter']`));
        await BrowserVisibility.waitUntilElementIsVisible(filterName);
        await BrowserVisibility.waitUntilElementIsNotVisible(filterName.element(this.processIcon));
    }

    async getFilterIcon(name): Promise<string> {
        const filterName: ElementFinder = element(by.css(`span[data-automation-id='${name}_filter']`));
        await BrowserVisibility.waitUntilElementIsVisible(filterName);
        const icon = filterName.element(this.processIcon);
        return await BrowserActions.getText(icon);
    }

    async checkFilterIsNotDisplayed(name): Promise<void> {
        const filterName: ElementFinder = element(by.css(`span[data-automation-id='${name}_filter']`));
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
