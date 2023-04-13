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

import { FormFields } from '../form-fields';
import { Locator, by, element, protractor, $, $$ } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';

export class DynamicTableWidgetPage {
    formFields = new FormFields();

    labelLocator: Locator = by.css('dynamic-table-widget div div');
    columnNameLocator: Locator = by.css('table[id*="dynamic-table"] th');
    cancelButton = element(by.cssContainingText('button span', 'Cancel'));
    editButton = element(by.cssContainingText('button span', 'edit'));
    columnDateTime = $('#columnDateTime');
    columnDate = $('#columnDate');
    calendarHeader = $('.mat-datetimepicker-calendar-header-date-time');
    calendarContent = $('.mat-datetimepicker-calendar-content');
    saveButton = element(by.cssContainingText('button span', 'Save'));
    errorMessage = $('.adf-error-text');
    dateWidget = $$('mat-datepicker-toggle button').first();
    tableRow = $$('tbody tr');

    getFieldLabel(fieldId: string): Promise<string> {
        return this.formFields.getFieldLabel(fieldId, this.labelLocator);
    }

    getColumnName(fieldId: string): Promise<string> {
        return this.formFields.getFieldText(fieldId, this.columnNameLocator);
    }

    async clickAddRow(id?: string): Promise<void> {
        const rowButton = $(`#${id ? id : 'label'}-add-row`);
        await BrowserActions.click(rowButton);
    }

    async clickTableRow(rowNumber): Promise<void> {
        const tableRowByIndex = this.getTableRowByIndex(rowNumber);
        await BrowserActions.click(tableRowByIndex);
    }

    async clickEditButton(): Promise<void> {
        await BrowserActions.click(this.editButton);
    }

    async clickCancelButton(): Promise<void> {
        await BrowserActions.click(this.cancelButton);
    }

    async setDatatableInput(text, id = 'id'): Promise<void> {
        const dataTableInput = $(`#${id}`);
        await BrowserVisibility.waitUntilElementIsVisible(dataTableInput);
        await BrowserActions.clearSendKeys(dataTableInput, text);
     }

    async getTableRowText(rowNumber): Promise<string> {
        const tableRowByIndex = this.getTableRowByIndex(rowNumber);
        return BrowserActions.getText(tableRowByIndex);
    }

    async checkTableRowIsNotVisible(rowNumber): Promise<void> {
        const tableRowByIndex = this.getTableRowByIndex(rowNumber);
        await BrowserVisibility.waitUntilElementIsNotVisible(tableRowByIndex);
    }

    async clickColumnDateTime(): Promise<void> {
        await BrowserActions.click(this.columnDateTime);
        await BrowserVisibility.waitUntilElementIsVisible(this.calendarHeader);
        await BrowserVisibility.waitUntilElementIsVisible(this.calendarContent);
        await BrowserActions.closeMenuAndDialogs();
    }

    async addRandomStringOnDateTime(randomText: string): Promise<string> {
        await BrowserActions.click(this.columnDateTime);
        await BrowserActions.closeMenuAndDialogs();
        await this.columnDateTime.sendKeys(randomText);
        await this.columnDateTime.sendKeys(protractor.Key.ENTER);
        return BrowserActions.getInputValue(this.columnDateTime);
    }

    async addRandomStringOnDate(randomText: string): Promise<void> {
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

    private getTableRowByIndex = (idx: string) => $(`#dynamictable-row-${idx}`);
}
