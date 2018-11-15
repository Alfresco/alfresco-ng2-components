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
import Util = require('../../../../../util/util');
import { by, browser, protractor } from 'protractor';

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
        Util.waitUntilElementIsClickable(this.filter.element(this.fromInput));
        this.filter.element(this.fromInput).getAttribute('value').then((value) => {
            for (let i = value.length; i >= 0; i--) {
                this.filter.element(this.fromInput).sendKeys(protractor.Key.BACK_SPACE);
            }
        });
        return this;
    }
    checkFromFieldIsEmpty() {
        browser.controlFlow().execute(async () => {
            await expect(this.getFromNumber()).toEqual('');
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
    checkFromErrorRequiredIsDisplayed() {
        Util.waitUntilElementIsVisible(this.filter.element(this.fromErrorRequired));
        browser.controlFlow().execute(async () => {
            await expect(this.filter.element(this.fromErrorRequired).getText()).toEqual('Required value');
        });
        return this;
    }
    checkFromErrorInvalidIsDisplayed() {
        Util.waitUntilElementIsVisible(this.filter.element(this.fromErrorInvalid));
        browser.controlFlow().execute(async () => {
            await expect(this.filter.element(this.fromErrorInvalid).getText()).toEqual('Invalid Format');
        });
        return this;
    }
    checkFromFieldIsDisplayed() {
        Util.waitUntilElementIsVisible(this.filter.element(this.fromInput));
        return this;
    }
    clearToField() {
        Util.waitUntilElementIsClickable(this.filter.element(this.toInput));
        this.filter.element(this.toInput).getAttribute('value').then((value) => {
            for (let i = value.length; i >= 0; i--) {
                this.filter.element(this.toInput).sendKeys(protractor.Key.BACK_SPACE);
            }
        });
        return this;
    }
    checkToFieldIsEmpty() {
        browser.controlFlow().execute(async () => {
            await expect(this.getToNumber()).toEqual('');
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
    clickToField() {
        Util.waitUntilElementIsClickable(this.filter.element(this.toInput));
        this.filter.element(this.toInput).click();
        return this;
    }
    checkToErrorRequiredIsDisplayed() {
        Util.waitUntilElementIsVisible(this.filter.element(this.toErrorRequired));
        browser.controlFlow().execute(async () => {
            await expect(this.filter.element(this.toErrorRequired).getText()).toEqual('Required value');
        });
        return this;
    }
    checkToErrorInvalidIsDisplayed() {
        Util.waitUntilElementIsVisible(this.filter.element(this.toErrorInvalid));
        browser.controlFlow().execute(async () => {
            await expect(this.filter.element(this.toErrorInvalid).getText()).toEqual('Invalid Format');
        });
        return this;
    }
    checkToFieldIsDisplayed() {
        Util.waitUntilElementIsVisible(this.filter.element(this.toInput));
        return this;
    }
    clickApplyButton() {
        Util.waitUntilElementIsClickable(this.filter.element(this.applyButton));
        this.filter.element(this.applyButton).click();
        return this;
    }
    checkApplyButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.filter.element(this.applyButton));
        return this;
    }
    checkApplyButtonIsEnabled() {
        browser.controlFlow().execute(async () => {
            await expect(this.filter.element(this.applyButton).isEnabled()).toBe(true);
        });
        return this;
    }
    checkApplyButtonIsDisabled() {
        browser.controlFlow().execute(async () => {
            await expect(this.filter.element(this.applyButton).isEnabled()).toBe(false);
        });
        return this;
    }
    clickClearButton() {
        Util.waitUntilElementIsClickable(this.filter.element(this.clearButton));
        this.filter.element(this.clearButton).click();
        return this;
    }
    checkClearButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.filter.element(this.clearButton));
        return this;
    }
    checkNoErrorMessageIsDisplayed() {
        Util.waitUntilElementIsNotVisible(this.filter.element(this.fromErrorInvalid));
        Util.waitUntilElementIsNotVisible(this.filter.element(this.fromErrorRequired));
        Util.waitUntilElementIsNotVisible(this.filter.element(this.toErrorInvalid));
        Util.waitUntilElementIsNotVisible(this.filter.element(this.toErrorRequired));
        return this;
    }
}
