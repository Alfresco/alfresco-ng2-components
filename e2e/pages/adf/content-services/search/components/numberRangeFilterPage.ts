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
import { by, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class NumberRangeFilterPage {

    fromInput = by.css('input[data-automation-id="number-range-from-input"]');
    toInput = by.css('input[data-automation-id="number-range-to-input"]');
    applyButton = by.css('button[data-automation-id="number-range-btn-apply"]');
    clearButton = by.css('button[data-automation-id="number-range-btn-clear"]');
    fromErrorInvalid = by.css('mat-error[data-automation-id="number-range-from-error-invalid"]');
    fromErrorRequired = by.css('mat-error[data-automation-id="number-range-from-error-required"]');
    toErrorInvalid = by.css('mat-error[data-automation-id="number-range-to-error-invalid"]');
    toErrorRequired = by.css('mat-error[data-automation-id="number-range-to-error-required"]');
    filter;

    constructor(filter) {
        this.filter = filter;
    }

    clearFromField() {
        BrowserVisibility.waitUntilElementIsClickable(this.filter.element(this.fromInput));
        this.filter.element(this.fromInput).getAttribute('value').then((value) => {
            for (let i = value.length; i >= 0; i--) {
                this.filter.element(this.fromInput).sendKeys(protractor.Key.BACK_SPACE);
            }
        });
        return this;
    }

    getFromNumber() {
        return this.filter.element(this.fromInput).getAttribute('value');
    }

    putFromNumber(value) {
        this.checkFromFieldIsDisplayed();
        this.filter.element(this.fromInput).clear();
        this.filter.element(this.fromInput).sendKeys(value);
        this.filter.element(this.fromInput).sendKeys(protractor.Key.ENTER);
        return this;
    }

    getFromErrorRequired() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.fromErrorRequired));
        return BrowserActions.getText(this.filter.element(this.fromErrorRequired));

    }

    checkFromErrorRequiredIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.fromErrorRequired));
        return this;
    }

    getFromErrorInvalid() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.fromErrorInvalid));
        return BrowserActions.getText(this.filter.element(this.fromErrorInvalid));
    }

    checkFromErrorInvalidIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.fromErrorInvalid));
        return this;
    }

    checkFromFieldIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.fromInput));
        return this;
    }

    clearToField() {
        BrowserVisibility.waitUntilElementIsClickable(this.filter.element(this.toInput));
        this.filter.element(this.toInput).getAttribute('value').then((value) => {
            for (let i = value.length; i >= 0; i--) {
                this.filter.element(this.toInput).sendKeys(protractor.Key.BACK_SPACE);
            }
        });
        return this;
    }

    getToNumber() {
        return this.filter.element(this.toInput).getAttribute('value');
    }

    putToNumber(value) {
        this.checkToFieldIsDisplayed();
        this.filter.element(this.toInput).clear();
        this.filter.element(this.toInput).sendKeys(value);
        this.filter.element(this.toInput).sendKeys(protractor.Key.ENTER);
        return this;
    }

    getToErrorRequired() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.toErrorRequired));
        return BrowserActions.getText(this.filter.element(this.toErrorRequired));
    }

    checkToErrorRequiredIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.toErrorRequired));
        return this;
    }

    getToErrorInvalid() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.toErrorInvalid));
        return BrowserActions.getText(this.filter.element(this.toErrorInvalid));
    }

    checkToErrorInvalidIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.toErrorInvalid));
        return this;
    }

    checkToFieldIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.toInput));
        return this;
    }

    clickApplyButton() {
        BrowserVisibility.waitUntilElementIsClickable(this.filter.element(this.applyButton));
        this.filter.element(this.applyButton).click();
        return this;
    }

    checkApplyButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.applyButton));
        return this;
    }

    checkApplyButtonIsEnabled() {
        return this.filter.element(this.applyButton).isEnabled();
    }

    clickClearButton() {
        BrowserVisibility.waitUntilElementIsClickable(this.filter.element(this.clearButton));
        this.filter.element(this.clearButton).click();
        return this;
    }

    checkClearButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.clearButton));
        return this;
    }

    checkNoErrorMessageIsDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.fromErrorInvalid));
        BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.fromErrorRequired));
        BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.toErrorInvalid));
        BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.toErrorRequired));
        return this;
    }
}
