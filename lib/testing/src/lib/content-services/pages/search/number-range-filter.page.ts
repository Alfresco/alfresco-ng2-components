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
import { by, ElementFinder, protractor } from 'protractor';
import { BrowserActions } from '../../../core/utils/browser-actions';
import { BrowserVisibility } from '../../../core/utils/browser-visibility';

export class NumberRangeFilterPage {

    fromInput = by.css('input[data-automation-id="number-range-from-input"]');
    toInput = by.css('input[data-automation-id="number-range-to-input"]');
    applyButton = by.css('button[data-automation-id="number-range-btn-apply"]');
    clearButton = by.css('button[data-automation-id="number-range-btn-clear"]');
    fromErrorInvalid = by.css('mat-error[data-automation-id="number-range-from-error-invalid"]');
    fromErrorRequired = by.css('mat-error[data-automation-id="number-range-from-error-required"]');
    toErrorInvalid = by.css('mat-error[data-automation-id="number-range-to-error-invalid"]');
    toErrorRequired = by.css('mat-error[data-automation-id="number-range-to-error-required"]');
    filter: ElementFinder;

    constructor(filter: ElementFinder) {
        this.filter = filter;
    }

    async clearFromField(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.filter.element(this.fromInput));
        this.filter.element(this.fromInput).getAttribute('value').then((value) => {
            for (let i = value.length; i >= 0; i--) {
                this.filter.element(this.fromInput).sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }

    getFromNumber() {
        return this.filter.element(this.fromInput).getAttribute('value');
    }

    async putFromNumber(value): Promise<void> {
        await this.checkFromFieldIsDisplayed();
        this.filter.element(this.fromInput).clear();
        this.filter.element(this.fromInput).sendKeys(value);
        this.filter.element(this.fromInput).sendKeys(protractor.Key.ENTER);
    }

    async getFromErrorRequired(): Promise<string> {
        return BrowserActions.getText(this.filter.element(this.fromErrorRequired));

    }

    async checkFromErrorRequiredIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.fromErrorRequired));
    }

    async getFromErrorInvalid(): Promise<string> {
        return BrowserActions.getText(this.filter.element(this.fromErrorInvalid));
    }

    async checkFromErrorInvalidIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.fromErrorInvalid));
    }

    async checkFromFieldIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.fromInput));
    }

    async clearToField(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.filter.element(this.toInput));
        this.filter.element(this.toInput).getAttribute('value').then((value) => {
            for (let i = value.length; i >= 0; i--) {
                this.filter.element(this.toInput).sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }

    getToNumber() {
        return this.filter.element(this.toInput).getAttribute('value');
    }

    async putToNumber(value): Promise<void> {
        await this.checkToFieldIsDisplayed();
        this.filter.element(this.toInput).clear();
        this.filter.element(this.toInput).sendKeys(value);
        this.filter.element(this.toInput).sendKeys(protractor.Key.ENTER);
    }

    async getToErrorRequired(): Promise<string> {
        return BrowserActions.getText(this.filter.element(this.toErrorRequired));
    }

    async checkToErrorRequiredIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.toErrorRequired));
    }

    async getToErrorInvalid(): Promise<string> {
        return BrowserActions.getText(this.filter.element(this.toErrorInvalid));
    }

    async checkToErrorInvalidIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.toErrorInvalid));
    }

    async checkToFieldIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.toInput));
    }

    async clickApplyButton(): Promise<void> {
        await BrowserActions.click(this.filter.element(this.applyButton));
    }

    async checkApplyButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.applyButton));
    }

    checkApplyButtonIsEnabled() {
        return this.filter.element(this.applyButton).isEnabled();
    }

    async clickClearButton(): Promise<void> {
        await BrowserActions.click(this.filter.element(this.clearButton));
    }

    async checkClearButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.element(this.clearButton));
    }

    async checkNoErrorMessageIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.fromErrorInvalid));
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.fromErrorRequired));
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.toErrorInvalid));
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.element(this.toErrorRequired));
    }
}
