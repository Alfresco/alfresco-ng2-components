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

import { FormFields } from '../formFields';
import { by, element, browser, protractor } from 'protractor';
import { BrowserVisibility } from '@alfresco/adf-testing';

export class DynamicTableWidget {

    formFields = new FormFields();

    labelLocator = by.css('dynamic-table-widget div div');
    columnNameLocator = by.css('table[id*="dynamic-table"] th');
    addButton = element(by.id('label-add-row'));
    cancelButton = element(by.cssContainingText('button span', 'Cancel'));
    editButton = element(by.cssContainingText('button span', 'edit'));
    addRow = element(by.id('dynamictable-add-row'));
    columnDateTime = element(by.id('columnDateTime'));
    columnDate = element(by.id('columnDate'));
    calendarHeader = element(by.css('div[class="mat-datetimepicker-calendar-header-date-time"]'));
    calendarContent = element(by.css('div[class="mat-datetimepicker-calendar-content"]'));
    saveButton = element(by.cssContainingText('button span', 'Save'));
    errorMessage = element(by.css('div[class="adf-error-text"]'));
    dateWidget = element.all(by.css('mat-datepicker-toggle button')).first();
    tableRow = element.all(by.css('tbody tr'));
    dataTableInput = element(by.id('id'));

    getFieldLabel(fieldId) {
        return this.formFields.getFieldLabel(fieldId, this.labelLocator);
    }

    getColumnName(fieldId) {
        return this.formFields.getFieldText(fieldId, this.columnNameLocator);
    }

    clickAddButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.addButton);
        return this.addButton.click();
    }

    clickAddRow() {
        BrowserVisibility.waitUntilElementIsVisible(this.addRow);
        return this.addRow.click();
    }

    clickTableRow(rowNumber) {
        const tableRowByIndex = element(by.id('dynamictable-row-' + rowNumber));
        BrowserVisibility.waitUntilElementIsVisible(tableRowByIndex);
        return tableRowByIndex.click();
    }

    clickEditButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.editButton);
        return this.editButton.click();
    }

    clickCancelButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.cancelButton);
        return this.cancelButton.click();
    }

    setDatatableInput(text) {
        BrowserVisibility.waitUntilElementIsVisible(this.dataTableInput);
        this.dataTableInput.clear();
        return this.dataTableInput.sendKeys(text);
    }

    getTableRowText(rowNumber) {
        const tableRowByIndex = element(by.id('dynamictable-row-' + rowNumber));
        BrowserVisibility.waitUntilElementIsVisible(tableRowByIndex);
        return tableRowByIndex.getText();
    }

    checkTableRowIsVisible(rowNumber) {
        const tableRowByIndex = element(by.id('dynamictable-row-' + rowNumber));
        return BrowserVisibility.waitUntilElementIsVisible(tableRowByIndex);
    }

    checkTableRowIsNotVisible(rowNumber) {
        const tableRowByIndex = element(by.id('dynamictable-row-' + rowNumber));
        return BrowserVisibility.waitUntilElementIsNotVisible(tableRowByIndex);
    }

    clickColumnDateTime() {
        BrowserVisibility.waitUntilElementIsVisible(this.columnDateTime);
        this.columnDateTime.click();
        BrowserVisibility.waitUntilElementIsVisible(this.calendarHeader);
        BrowserVisibility.waitUntilElementIsVisible(this.calendarContent);
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
    }

    addRandomStringOnDateTime(randomText) {
        BrowserVisibility.waitUntilElementIsVisible(this.columnDateTime);
        this.columnDateTime.click();
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        this.columnDateTime.sendKeys(randomText);
        this.columnDateTime.sendKeys(protractor.Key.ENTER);
        return this.columnDateTime.getAttribute('value');
    }

    addRandomStringOnDate(randomText) {
        BrowserVisibility.waitUntilElementIsVisible(this.columnDate);
        this.columnDate.click();
        return this.columnDate.sendKeys(randomText);
    }

    clickSaveButton() {
        BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this.saveButton.click();
    }

    checkErrorMessage() {
        BrowserVisibility.waitUntilElementIsVisible(this.errorMessage);
        return this.errorMessage.getText();
    }

    clickDateWidget() {
        BrowserVisibility.waitUntilElementIsVisible(this.dateWidget);
        return this.dateWidget.click();
    }

    getTableRow(rowNumber) {
        return BrowserVisibility.waitUntilElementIsVisible(this.tableRow.get(rowNumber));
    }

    checkItemIsPresent(item) {
        const row = element(by.cssContainingText('table tbody tr td span', item));
        const present = BrowserVisibility.waitUntilElementIsVisible(row);
        expect(present).toBe(true);
    }
}
