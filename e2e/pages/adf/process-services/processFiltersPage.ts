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

import { Util } from '../../../util/util';
import { element, by } from 'protractor';
import { StartProcessPage } from './startProcessPage';
import { DataTableComponentPage } from '../dataTableComponentPage';

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
    noContentMessage = element.all(by.css('p[class="adf-empty-content__title"]')).first();
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
        Util.waitUntilElementIsVisible(this.runningFilter);
        Util.waitUntilElementIsClickable(this.runningFilter);
        return this.runningFilter.click();
    }

    clickCompletedFilterButton() {
        Util.waitUntilElementIsVisible(this.completedFilter);
        Util.waitUntilElementIsClickable(this.completedFilter);
        this.completedFilter.click();
        expect(this.completedFilter.isEnabled()).toBe(true);
    }

    clickAllFilterButton() {
        Util.waitUntilElementIsVisible(this.allFilter);
        Util.waitUntilElementIsClickable(this.allFilter);
        this.allFilter.click();
        expect(this.allFilter.isEnabled()).toBe(true);
    }

    clickCreateProcessButton() {
        Util.waitUntilElementIsOnPage(this.accordionMenu);
        Util.waitUntilElementIsVisible(this.processesPage);
        Util.waitUntilElementIsPresent(this.createProcessButton);
        this.createProcessButton.click();
    }

    clickNewProcessDropdown() {
        Util.waitUntilElementIsOnPage(this.buttonWindow);
        Util.waitUntilElementIsVisible(this.newProcessButton);
        Util.waitUntilElementIsClickable(this.newProcessButton);
        this.newProcessButton.click();
    }

    checkNoContentMessage() {
        return Util.waitUntilElementIsVisible(this.noContentMessage);
    }

    selectFromProcessList(title) {
        let processName = element.all(by.css(`div[data-automation-id="text_${title}"]`)).first();
        Util.waitUntilElementIsVisible(processName);
        processName.click();
    }

    checkFilterIsHighlighted(filterName) {
        let processNameHighlighted = element(by.css(`mat-list-item.adf-active span[data-automation-id='${filterName}_filter']`));
        Util.waitUntilElementIsVisible(processNameHighlighted);
    }

    numberOfProcessRows() {
        return element.all(this.rows).count();
    }

    waitForTableBody() {
        Util.waitUntilElementIsVisible(this.tableBody);
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
        let filterName = element(by.css(`span[data-automation-id='${name}_filter']`));
        return Util.waitUntilElementIsVisible(filterName);
    }

    checkFilterHasNoIcon(name) {
        let filterName = element(by.css(`span[data-automation-id='${name}_filter']`));
        Util.waitUntilElementIsVisible(filterName);
        return Util.waitUntilElementIsNotOnPage(filterName.element(this.processIcon));
    }

    getFilterIcon(name) {
        let filterName = element(by.css(`span[data-automation-id='${name}_filter']`));
        Util.waitUntilElementIsVisible(filterName);
        let icon = filterName.element(this.processIcon);
        Util.waitUntilElementIsVisible(icon);
        return icon.getText();
    }

    checkFilterIsNotDisplayed(name) {
        let filterName = element(by.css(`span[data-automation-id='${name}_filter']`));
        return Util.waitUntilElementIsNotVisible(filterName);
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
