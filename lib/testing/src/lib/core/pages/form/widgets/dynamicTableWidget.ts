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
import { by, element, ElementArrayFinder, ElementFinder, Locator, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';

export class DynamicTableWidget {

    formFields: FormFields = new FormFields();

    labelLocator: Locator = by.css('dynamic-table-widget div div');
    columnNameLocator: Locator = by.css('table[id*="dynamic-table"] th');
    addButton: ElementFinder = element(by.id('label-add-row'));
    cancelButton: ElementFinder = element(by.cssContainingText('button span', 'Cancel'));
    editButton: ElementFinder = element(by.cssContainingText('button span', 'edit'));
    addRow: ElementFinder = element(by.id('dynamictable-add-row'));
    columnDateTime: ElementFinder = element(by.id('columnDateTime'));
    columnDate: ElementFinder = element(by.id('columnDate'));
    calendarHeader: ElementFinder = element(by.css('div[class="mat-datetimepicker-calendar-header-date-time"]'));
    calendarContent: ElementFinder = element(by.css('div[class="mat-datetimepicker-calendar-content"]'));
    saveButton: ElementFinder = element(by.cssContainingText('button span', 'Save'));
    errorMessage: ElementFinder = element(by.css('div[class="adf-error-text"]'));
    dateWidget: ElementFinder = element.all(by.css('mat-datepicker-toggle button')).first();
    tableRow: ElementArrayFinder = element.all(by.css('tbody tr'));
    dataTableInput: ElementFinder = element(by.id('id'));

    getFieldLabel(fieldId): Promise<string> {
        return this.formFields.getFieldLabel(fieldId, this.labelLocator);
    }

    getColumnName(fieldId): Promise<string> {
        return this.formFields.getFieldText(fieldId, this.columnNameLocator);
    }

    async clickAddButton(): Promise<void> {
        await BrowserActions.click(this.addButton);
    }

    async clickAddRow(): Promise<void> {
        await BrowserActions.click(this.addRow);
    }

    async clickTableRow(rowNumber): Promise<void> {
        const tableRowByIndex = element(by.id('dynamictable-row-' + rowNumber));
        await BrowserActions.click(tableRowByIndex);
    }

    async clickEditButton(): Promise<void> {
        await BrowserActions.click(this.editButton);
    }

    async clickCancelButton(): Promise<void> {
        await BrowserActions.click(this.cancelButton);
    }

    async setDatatableInput(text): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dataTableInput);
        await this.dataTableInput.clear();
        await this.dataTableInput.sendKeys(text);
    }

    async getTableRowText(rowNumber): Promise<string> {
        const tableRowByIndex = element(by.id('dynamictable-row-' + rowNumber));
        return BrowserActions.getText(tableRowByIndex);
    }

    async checkTableRowIsNotVisible(rowNumber): Promise<void> {
        const tableRowByIndex = element(by.id('dynamictable-row-' + rowNumber));
        await BrowserVisibility.waitUntilElementIsNotVisible(tableRowByIndex);
    }

    async clickColumnDateTime(): Promise<void> {
        await BrowserActions.click(this.columnDateTime);
        await BrowserVisibility.waitUntilElementIsVisible(this.calendarHeader);
        await BrowserVisibility.waitUntilElementIsVisible(this.calendarContent);
        await BrowserActions.closeMenuAndDialogs();
    }

    async addRandomStringOnDateTime(randomText): Promise<string> {
        await BrowserActions.click(this.columnDateTime);
        await BrowserActions.closeMenuAndDialogs();
        await this.columnDateTime.sendKeys(randomText);
        await this.columnDateTime.sendKeys(protractor.Key.ENTER);
        return this.columnDateTime.getAttribute('value');
    }

    async addRandomStringOnDate(randomText): Promise<void> {
        await BrowserActions.click(this.columnDate);
        await this.columnDate.sendKeys(randomText);
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

    async checkItemIsPresent(item): Promise<void> {
        const row = element(by.cssContainingText('table tbody tr td span', item));
        const present = await BrowserVisibility.waitUntilElementIsVisible(row);
        await expect(present).toBe(true);
    }
}
