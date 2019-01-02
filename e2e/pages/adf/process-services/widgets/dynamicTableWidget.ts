/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { Util } from '../../../../util/util';
import { by, element, browser, protractor } from 'protractor';

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
    dateWidget = element.all(by.css('button[aria-label="Open calendar"]')).first();
    calendarNumber = element.all(by.css('td div'));
    tableRow = element.all(by.css('tbody tr'));
    dataTableInput = element(by.id('id'));

    getFieldLabel(fieldId) {
        return this.formFields.getFieldLabel(fieldId, this.labelLocator);
    }

    getColumnName(fieldId) {
        return this.formFields.getFieldText(fieldId, this.columnNameLocator);
    }

    clickAddButton() {
        Util.waitUntilElementIsVisible(this.addButton);
        return this.addButton.click();
    }

    clickAddRow() {
        Util.waitUntilElementIsVisible(this.addRow);
        return this.addRow.click();
    }

    clickTableRow(rowNumber) {
        let tableRowByIndex = element(by.id('dynamictable-row-' + rowNumber));
        Util.waitUntilElementIsVisible(tableRowByIndex);
        return tableRowByIndex.click();
    }

    clickEditButton() {
        Util.waitUntilElementIsVisible(this.editButton);
        return this.editButton.click();
    }

    clickCancelButton() {
        Util.waitUntilElementIsVisible(this.cancelButton);
        return this.cancelButton.click();
    }

    setDatatableInput(text) {
        Util.waitUntilElementIsVisible(this.dataTableInput);
        this.dataTableInput.clear();
        return this.dataTableInput.sendKeys(text);
    }

    getTableRowText(rowNumber) {
        let tableRowByIndex = element(by.id('dynamictable-row-' + rowNumber));
        Util.waitUntilElementIsVisible(tableRowByIndex);
        return tableRowByIndex.getText();
    }

    checkTableRowIsVisible(rowNumber) {
        let tableRowByIndex = element(by.id('dynamictable-row-' + rowNumber));
        return Util.waitUntilElementIsVisible(tableRowByIndex);
    }

    checkTableRowIsNotVisible(rowNumber) {
        let tableRowByIndex = element(by.id('dynamictable-row-' + rowNumber));
        return Util.waitUntilElementIsNotVisible(tableRowByIndex);
    }

    clickColumnDateTime() {
        Util.waitUntilElementIsVisible(this.columnDateTime);
        this.columnDateTime.click();
        Util.waitUntilElementIsVisible(this.calendarHeader);
        Util.waitUntilElementIsVisible(this.calendarContent);
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
    }

    addRandomStringOnDateTime(randomText) {
        Util.waitUntilElementIsVisible(this.columnDateTime);
        this.columnDateTime.click();
        browser.actions().sendKeys(protractor.Key.ESCAPE).perform();
        this.columnDateTime.sendKeys(randomText);
        this.columnDateTime.sendKeys(protractor.Key.ENTER);
        return this.columnDateTime.getAttribute('value');
    }

    addRandomStringOnDate(randomText) {
        Util.waitUntilElementIsVisible(this.columnDate);
        this.columnDate.click();
        return this.columnDate.sendKeys(randomText);
    }

    clickSaveButton() {
        Util.waitUntilElementIsVisible(this.saveButton);
        return this.saveButton.click();
    }

    checkErrorMessage() {
        Util.waitUntilElementIsVisible(this.errorMessage);
        return this.errorMessage.getText();
    }

    clickDateWidget() {
        Util.waitUntilElementIsVisible(this.dateWidget);
        return this.dateWidget.click();
    }

    getDateCalendarNumber(date) {
        return this.calendarNumber.get(date).click();
    }

    getTableRow(rowNumber) {
        return Util.waitUntilElementIsVisible(this.tableRow.get(rowNumber));
    }

    waitForCalendarToDisappear() {
        Util.waitUntilElementIsNotVisible(this.calendarNumber);
    }

    checkItemIsPresent(item) {
        let row = element(by.cssContainingText('table tbody tr td span', item));
        let present = Util.waitUntilElementIsVisible(row);
        expect(present).toBe(true);
    }
}
