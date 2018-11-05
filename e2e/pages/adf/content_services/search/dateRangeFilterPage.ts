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

import Util = require('../../../../util/util');
import { element, by, browser, protractor } from 'protractor';
import { DatePickerPage } from '../../material/datePickerPage';

export class DateRangeFilterPage {

    createdRangeFilter = element(by.css('mat-expansion-panel[data-automation-id="expansion-panel-Created Date (range)"]'));
    fromField = element(by.css('input[data-automation-id="date-range-from-input"]'));
    fromDateToggle = element(by.css('mat-datepicker-toggle[data-automation-id="date-range-from-date-toggle"]'));
    toField = element(by.css('input[data-automation-id="date-range-to-input"]'));
    toDateToggle = element(by.css('mat-datepicker-toggle[data-automation-id="date-range-to-date-toggle"]'));
    applyButton = element(by.css('button[data-automation-id="date-range-apply-btn"]'));
    clearButton = element(by.css('button[data-automation-id="date-range-clear-btn"]'));
    fromErrorMessage = element(by.css('mat-error[data-automation-id="date-range-from-error"]'));
    toErrorMessage = element(by.css('mat-error[data-automation-id="date-range-to-error"]'));

    datePicker = new DatePickerPage();

    checkCreatedRangeFilterIsDisplayed() {
        Util.waitUntilElementIsVisible(this.createdRangeFilter);
        return this;
    }

    clickCreatedRangeFilterHeader() {
        let createdRangeFilterHeader = this.createdRangeFilter.element(by.css('mat-expansion-panel-header'));
        Util.waitUntilElementIsClickable(createdRangeFilterHeader);
        createdRangeFilterHeader.click();
        return this;
    }

    checkCreatedRangeFilterIsExpanded() {
        this.createdRangeFilter.getAttribute('class').then((elementClass) => {
            expect(elementClass).toContain('mat-expanded');
        });
        return this;
    }

    getFromDate() {
        return this.fromField.getAttribute('value');
    }

    putFromDate(date) {
        this.checkFromFieldIsDisplayed();
        this.fromField.clear();
        this.fromField.sendKeys(date);
        this.fromField.sendKeys(protractor.Key.ENTER);
        return this;
    }

    getFromCalendarSelectedDate() {
        let selectedDate = this.openFromDatePicker().getSelectedDate();
        this.datePicker.closeDatePicker();
        return selectedDate;
    }

    openFromDatePicker() {
        Util.waitUntilElementIsClickable(this.fromDateToggle);
        this.fromDateToggle.click();
        return new DatePickerPage().checkDatePickerIsDisplayed();
    }

    openToDatePicker() {
        Util.waitUntilElementIsClickable(this.toDateToggle);
        this.toDateToggle.click();
        return new DatePickerPage().checkDatePickerIsDisplayed();
    }

    clickFromField() {
        Util.waitUntilElementIsClickable(this.fromField);
        this.fromField.click();
        return this;
    }

    checkFromErrorMessageIsDisplayed(msg) {
        Util.waitUntilElementIsVisible(this.fromErrorMessage);
        browser.controlFlow().execute(async () => {
            await expect(this.fromErrorMessage.getText()).toEqual(msg);
        });
        return this;
    }

    checkFromErrorMessageIsNotDisplayed() {
        Util.waitUntilElementIsNotVisible(this.fromErrorMessage);
        return this;
    }

    checkFromFieldIsDisplayed() {
        Util.waitUntilElementIsVisible(this.fromField);
        return this;
    }

    checkFromDateToggleIsDisplayed() {
        Util.waitUntilElementIsVisible(this.fromDateToggle);
        return this;
    }

    getToDate() {
        return this.toField.getAttribute('value');
    }

    putToDate(date) {
        this.checkToFieldIsDisplayed();
        this.toField.clear();
        this.toField.sendKeys(date);
        this.toField.sendKeys(protractor.Key.ENTER);
        return this;
    }

    clickToField() {
        Util.waitUntilElementIsClickable(this.toField);
        this.toField.click();
        return this;
    }

    checkToErrorMessageIsDisplayed(msg) {
        Util.waitUntilElementIsVisible(this.toErrorMessage);
        browser.controlFlow().execute(async () => {
            await expect(this.toErrorMessage.getText()).toEqual(msg);
        });
        return this;
    }

    checkToFieldIsDisplayed() {
        Util.waitUntilElementIsVisible(this.toField);
        return this;
    }

    checkToDateToggleIsDisplayed() {
        Util.waitUntilElementIsVisible(this.toDateToggle);
        return this;
    }

    clickApplyButton() {
        Util.waitUntilElementIsClickable(this.applyButton);
        this.applyButton.click();
        return this;
    }

    checkApplyButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.applyButton);
        return this;
    }

    checkApplyButtonIsEnabled() {
        browser.controlFlow().execute(async () => {
            await expect(this.applyButton.isEnabled()).toBe(true);
        });
        return this;
    }

    checkApplyButtonIsDisabled() {
        browser.controlFlow().execute(async () => {
            await expect(this.applyButton.isEnabled()).toBe(false);
        });
        return this;
    }

    checkClearButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.clearButton);
        return this;
    }
}
