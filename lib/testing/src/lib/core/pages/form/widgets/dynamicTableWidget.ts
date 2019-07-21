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

    async clickAddButton() {
        await BrowserActions.click(this.addButton);
    }

    async clickAddRow() {
        await BrowserActions.click(this.addRow);
    }

    async clickTableRow(rowNumber) {
        const tableRowByIndex = element(by.id('dynamictable-row-' + rowNumber));
        await BrowserActions.click(tableRowByIndex);
    }

    async clickEditButton() {
        await BrowserActions.click(this.editButton);
    }

    async clickCancelButton() {
        await BrowserActions.click(this.cancelButton);
    }

    async setDatatableInput(text) {
        await BrowserVisibility.waitUntilElementIsVisible(this.dataTableInput);
        this.dataTableInput.clear();
        return this.dataTableInput.sendKeys(text);
    }

    async getTableRowText(rowNumber): Promise<string> {
        const tableRowByIndex = element(by.id('dynamictable-row-' + rowNumber));
        return BrowserActions.getText(tableRowByIndex);
    }

    async checkTableRowIsNotVisible(rowNumber): Promise<void> {
        const tableRowByIndex = element(by.id('dynamictable-row-' + rowNumber));
        await BrowserVisibility.waitUntilElementIsNotVisible(tableRowByIndex);
    }

    async clickColumnDateTime() {
        await BrowserActions.click(this.columnDateTime);
        await BrowserVisibility.waitUntilElementIsVisible(this.calendarHeader);
        await BrowserVisibility.waitUntilElementIsVisible(this.calendarContent);
        await BrowserActions.closeMenuAndDialogs();
    }

    async addRandomStringOnDateTime(randomText) {
        await BrowserActions.click(this.columnDateTime);
        await BrowserActions.closeMenuAndDialogs();
        this.columnDateTime.sendKeys(randomText);
        this.columnDateTime.sendKeys(protractor.Key.ENTER);
        return this.columnDateTime.getAttribute('value');
    }

    async addRandomStringOnDate(randomText) {
        await BrowserActions.click(this.columnDate);
        return this.columnDate.sendKeys(randomText);
    }

    async clickSaveButton(): Promise<void> {
        await BrowserActions.click(this.saveButton);
    }

    async checkErrorMessage(): Promise<string> {
        return BrowserActions.getText(this.errorMessage);
    }

    async clickDateWidget(): Promise<void> {
        await BrowserActions.click(this.dateWidget);
    }

    async getTableRow(rowNumber): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.tableRow.get(rowNumber));
    }

    async getTableCellText(rowNumber: number, columnNumber: number): Promise<string> {
        return BrowserActions.getText(this.tableRow.get(rowNumber).element(by.xpath(`td[${columnNumber}]`)));
    }

    async checkItemIsPresent(item) {
        const row = element(by.cssContainingText('table tbody tr td span', item));
        const present = await BrowserVisibility.waitUntilElementIsVisible(row);
        expect(present).toBe(true);
    }
}
