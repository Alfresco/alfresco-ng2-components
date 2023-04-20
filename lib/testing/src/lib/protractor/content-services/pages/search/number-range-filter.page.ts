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

import { ElementFinder, protractor } from 'protractor';
import { BrowserActions } from '../../../core/utils/browser-actions';
import { BrowserVisibility } from '../../../core/utils/browser-visibility';

export class NumberRangeFilterPage {

    fromInput = 'input[data-automation-id="number-range-from-input"]';
    toInput = 'input[data-automation-id="number-range-to-input"]';
    applyButton = 'button[data-automation-id="number-range-btn-apply"]';
    clearButton = 'button[data-automation-id="number-range-btn-clear"]';
    fromErrorInvalid = 'mat-error[data-automation-id="number-range-from-error-invalid"]';
    fromErrorRequired = 'mat-error[data-automation-id="number-range-from-error-required"]';
    toErrorInvalid = 'mat-error[data-automation-id="number-range-to-error-invalid"]';
    toErrorRequired = 'mat-error[data-automation-id="number-range-to-error-required"]';
    filter: ElementFinder;

    constructor(filter: ElementFinder) {
        this.filter = filter;
    }

    async clearFromField(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.filter.$(this.fromInput));
        await BrowserActions.clearWithBackSpace(this.filter.$(this.fromInput));
    }

    async getFromNumber(): Promise<string> {
        return BrowserActions.getInputValue(this.filter.$(this.fromInput));
    }

    async putFromNumber(value): Promise<void> {
        await this.checkFromFieldIsDisplayed();
        await BrowserActions.clearSendKeys(this.filter.$(this.fromInput), value);
        await this.filter.$(this.fromInput).sendKeys(protractor.Key.ENTER);
    }

    async getFromErrorRequired(): Promise<string> {
        return BrowserActions.getText(this.filter.$(this.fromErrorRequired));
    }

    async checkFromErrorRequiredIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.fromErrorRequired));
    }

    async getFromErrorInvalid(): Promise<string> {
        return BrowserActions.getText(this.filter.$(this.fromErrorInvalid));
    }

    async checkFromErrorInvalidIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.fromErrorInvalid));
    }

    async checkFromFieldIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.fromInput));
    }

    async clearToField(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.filter.$(this.toInput));
        await BrowserActions.clearWithBackSpace(this.filter.$(this.toInput));
    }

    async getToNumber(): Promise<string> {
        return BrowserActions.getInputValue(this.filter.$(this.toInput));
    }

    async putToNumber(value): Promise<void> {
        await this.checkToFieldIsDisplayed();
        await BrowserActions.clearSendKeys(this.filter.$(this.toInput), value);
        await this.filter.$(this.toInput).sendKeys(protractor.Key.ENTER);
    }

    async getToErrorRequired(): Promise<string> {
        return BrowserActions.getText(this.filter.$(this.toErrorRequired));
    }

    async checkToErrorRequiredIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.toErrorRequired));
    }

    async getToErrorInvalid(): Promise<string> {
        return BrowserActions.getText(this.filter.$(this.toErrorInvalid));
    }

    async checkToErrorInvalidIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.toErrorInvalid));
    }

    async checkToFieldIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.toInput));
    }

    async clickApplyButton(): Promise<void> {
        await BrowserActions.click(this.filter.$(this.applyButton));
    }

    async checkApplyButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.applyButton));
    }

    async checkApplyButtonIsEnabled(): Promise<boolean> {
        return this.filter.$(this.applyButton).isEnabled();
    }

    async clickClearButton(): Promise<void> {
        await BrowserActions.click(this.filter.$(this.clearButton));
    }

    async checkClearButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.filter.$(this.clearButton));
    }

    async checkNoErrorMessageIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.$(this.fromErrorInvalid));
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.$(this.fromErrorRequired));
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.$(this.toErrorInvalid));
        await BrowserVisibility.waitUntilElementIsNotVisible(this.filter.$(this.toErrorRequired));
    }
}
