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

import { element, by } from 'protractor';
import { StartProcessPage } from './startProcessPage';
import { DataTableComponentPage } from '@alfresco/adf-testing';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class ProcessFiltersPage {

    dataTable = new DataTableComponentPage();
    runningFilter = element(by.css('span[data-automation-id="Running_filter"]'));
    completedFilter = element(by.css('div[class="mat-list-text"] > span[data-automation-id="Completed_filter"]'));
    allFilter = element(by.css('span[data-automation-id="All_filter"]'));
    createProcessButton = element(by.css('.adf-processes-menu button[data-automation-id="create-button"] > span'));
    newProcessButton = element(by.css('div > button[data-automation-id="btn-start-process"]'));
    processesPage = element(by.css('div[class="adf-grid"] > div[class="adf-grid-item adf-processes-menu"]'));
    accordionMenu = element(by.css('.adf-processes-menu mat-accordion'));
    buttonWindow = element(by.css('div > button[data-automation-id="btn-start-process"] > div'));
    noContentMessage = element.all(by.css('div[class="adf-empty-content__title"]')).first();
    rows = by.css('adf-process-instance-list div[class="adf-datatable-body"] div[class*="adf-datatable-row"]');
    tableBody = element.all(by.css('adf-datatable div[class="adf-datatable-body"]')).first();
    nameColumn = by.css('div[class*="adf-datatable-body"] div[class*="adf-datatable-row"] div[title="Name"] span');
    processIcon = by.xpath('ancestor::div[@class="mat-list-item-content"]/mat-icon');

    startProcess() {
        this.clickCreateProcessButton();
        this.clickNewProcessDropdown();
        return new StartProcessPage();
    }

    clickRunningFilterButton() {
        return BrowserActions.click(this.runningFilter);

    }

    clickCompletedFilterButton() {
        BrowserActions.click(this.completedFilter);
        expect(this.completedFilter.isEnabled()).toBe(true);
    }

    clickAllFilterButton() {
        BrowserActions.click(this.allFilter);
        expect(this.allFilter.isEnabled()).toBe(true);
    }

    clickCreateProcessButton() {
        BrowserActions.closeMenuAndDialogs();
        BrowserVisibility.waitUntilElementIsOnPage(this.accordionMenu);
        BrowserVisibility.waitUntilElementIsVisible(this.processesPage);
        BrowserActions.click(this.createProcessButton);
    }

    clickNewProcessDropdown() {
        BrowserVisibility.waitUntilElementIsOnPage(this.buttonWindow);
        BrowserActions.click(this.newProcessButton);
    }

    checkNoContentMessage() {
        return BrowserVisibility.waitUntilElementIsVisible(this.noContentMessage);
    }

    selectFromProcessList(title) {
        BrowserActions.closeMenuAndDialogs();
        const processName = element.all(by.css(`div[data-automation-id="text_${title}"]`)).first();
        BrowserActions.click(processName);
    }

    checkFilterIsHighlighted(filterName) {
        const processNameHighlighted = element(by.css(`mat-list-item.adf-active span[data-automation-id='${filterName}_filter']`));
        BrowserVisibility.waitUntilElementIsVisible(processNameHighlighted);
    }

    numberOfProcessRows() {
        return element.all(this.rows).count();
    }

    waitForTableBody() {
        BrowserVisibility.waitUntilElementIsVisible(this.tableBody);
    }

    /**
     *  Sort the list by name column.
     *
     * @param sortOrder : 'true' to sort the list ascendant and 'false' for descendant
     */
    sortByName(sortOrder) {
        this.dataTable.sortByColumn(sortOrder, 'name');
    }

    getAllRowsNameColumn() {
        return this.dataTable.getAllRowsColumnValues('Name');
    }

    checkFilterIsDisplayed(name) {
        const filterName = element(by.css(`span[data-automation-id='${name}_filter']`));
        return BrowserVisibility.waitUntilElementIsVisible(filterName);
    }

    checkFilterHasNoIcon(name) {
        const filterName = element(by.css(`span[data-automation-id='${name}_filter']`));
        BrowserVisibility.waitUntilElementIsVisible(filterName);
        return BrowserVisibility.waitUntilElementIsNotOnPage(filterName.element(this.processIcon));
    }

    getFilterIcon(name) {
        const filterName = element(by.css(`span[data-automation-id='${name}_filter']`));
        BrowserVisibility.waitUntilElementIsVisible(filterName);
        const icon = filterName.element(this.processIcon);
        return BrowserActions.getText(icon);
    }

    checkFilterIsNotDisplayed(name) {
        const filterName = element(by.css(`span[data-automation-id='${name}_filter']`));
        return BrowserVisibility.waitUntilElementIsNotVisible(filterName);
    }

    checkProcessesSortedByNameAsc() {
        this.getAllRowsNameColumn().then((list) => {
            for (let i = 1; i < list.length; i++) {
                expect(JSON.stringify(list[i]) > JSON.stringify(list[i - 1])).toEqual(true);
            }
        });
    }

    checkProcessesSortedByNameDesc() {
        this.getAllRowsNameColumn().then((list) => {
            for (let i = 1; i < list.length; i++) {
                expect(JSON.stringify(list[i]) < JSON.stringify(list[i - 1])).toEqual(true);
            }
        });
    }
}
