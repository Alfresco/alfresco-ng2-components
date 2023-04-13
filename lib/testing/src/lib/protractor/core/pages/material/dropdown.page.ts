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

import { element, by, ElementFinder, browser, $$, $ } from 'protractor';
import { BrowserVisibility } from '../../utils/browser-visibility';
import { BrowserActions } from '../../utils/browser-actions';
import { Logger } from '../../utils/logger';

export class DropdownPage {

    dropDownElement: ElementFinder;

    constructor(dropDownElement = $$('div[class="mat-select-arrow-wrapper"]').first()) {
        this.dropDownElement = dropDownElement;
    }

    async clickDropdown(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dropDownElement);
        await BrowserActions.click(this.dropDownElement);
    }

    async selectOption(option: string): Promise<void> {
        Logger.log(`Select dropdown option ${option}`);
        const optionElement = element.all(by.cssContainingText('mat-option span.mat-option-text', option)).first();
        await BrowserActions.click(optionElement);
        await browser.waitForAngular();
    }

    async getValue(): Promise<string> {
        return BrowserActions.getText($('mat-form-field span'));
    }

    async getDropdownOptionList(): Promise<string> {
        return BrowserActions.getArrayText(this.dropDownElement.$$(`[role*='option']`));
    }

    async getNumberOfOptions(): Promise<number> {
        const dropdownOptions = $$('.mat-select-panel mat-option');
        return dropdownOptions.count();
    }

    async checkDropdownIsVisible(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dropDownElement);
    }

    async checkDropdownIsNotVisible(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.dropDownElement);
    }

    async checkDropdownIsClickable(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.dropDownElement);
    }

    async checkOptionIsSelected(option: string): Promise<void> {
        const selectedOption = this.dropDownElement.element(by.cssContainingText('.mat-select-value-text span', option));
        await BrowserVisibility.waitUntilElementIsVisible(selectedOption);
    }

    async selectOptionFromIndex(index: number): Promise<void> {
        const value = element.all(by.className('mat-option')).get(index);
        await BrowserActions.click(value);
    }

    async checkOptionsPanelIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible($$(`.mat-select-panel`).first());
    }

    async getSelectedOptionText(): Promise<string> {
        const selectedOption = this.dropDownElement.$('.mat-select-value-text span');
        return BrowserActions.getText(selectedOption);
    }

    async checkOptionIsDisplayed(option: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element.all(by.cssContainingText('mat-option span.mat-option-text', option)).first());
    }

    async checkOptionIsNotDisplayed(option: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(element.all(by.cssContainingText('mat-option span.mat-option-text', option)).first());
    }

    async selectDropdownOption(option: string): Promise<void> {
        await this.clickDropdown();
        await this.checkOptionsPanelIsDisplayed();
        await this.selectOption(option);
    }
}
