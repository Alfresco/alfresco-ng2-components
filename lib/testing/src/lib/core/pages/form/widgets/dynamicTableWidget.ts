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
import { by, element, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';

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
        BrowserActions.click(this.addButton);
    }

    clickAddRow() {
        BrowserActions.click(this.addRow);
    }

    clickTableRow(rowNumber) {
        const tableRowByIndex = element(by.id('dynamictable-row-' + rowNumber));
        BrowserActions.click(tableRowByIndex);
    }

    clickEditButton() {
        BrowserActions.click(this.editButton);
    }

    clickCancelButton() {
        BrowserActions.click(this.cancelButton);
    }

    setDatatableInput(text) {
        BrowserVisibility.waitUntilElementIsVisible(this.dataTableInput);
        this.dataTableInput.clear();
        return this.dataTableInput.sendKeys(text);
    }

    getTableRowText(rowNumber) {
        const tableRowByIndex = element(by.id('dynamictable-row-' + rowNumber));
        return BrowserActions.getText(tableRowByIndex);
    }

    checkTableRowIsNotVisible(rowNumber) {
        const tableRowByIndex = element(by.id('dynamictable-row-' + rowNumber));
        return BrowserVisibility.waitUntilElementIsNotVisible(tableRowByIndex);
    }

    clickColumnDateTime() {
        BrowserActions.click(this.columnDateTime);
        BrowserVisibility.waitUntilElementIsVisible(this.calendarHeader);
        BrowserVisibility.waitUntilElementIsVisible(this.calendarContent);
        BrowserActions.closeMenuAndDialogs();
    }

    addRandomStringOnDateTime(randomText) {
        BrowserActions.click(this.columnDateTime);
        BrowserActions.closeMenuAndDialogs();
        this.columnDateTime.sendKeys(randomText);
        this.columnDateTime.sendKeys(protractor.Key.ENTER);
        return this.columnDateTime.getAttribute('value');
    }

    addRandomStringOnDate(randomText) {
        BrowserActions.click(this.columnDate);
        return this.columnDate.sendKeys(randomText);
    }

    clickSaveButton() {
        BrowserActions.click(this.saveButton);
    }

    checkErrorMessage() {
        return BrowserActions.getText(this.errorMessage);
    }

    clickDateWidget() {
        BrowserActions.click(this.dateWidget);
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
