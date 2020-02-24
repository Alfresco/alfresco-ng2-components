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

import { element, by, ElementFinder } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';

export class DropdownPage {

    dropDownElement: ElementFinder;
    private selectedOption: ElementFinder = element(by.css('span[class*="mat-select-value-text"]'));

    constructor(dropDownElement: ElementFinder = element.all(by.css('div[class="mat-select-arrow-wrapper"]')).first()) {
        this.dropDownElement = dropDownElement;
    }

    async clickDropdown(): Promise<void> {
        await BrowserActions.click(this.dropDownElement);
    }

    async selectOption(option: string): Promise<void> {
        const optionElement = element(by.cssContainingText('mat-option span.mat-option-text', option));
        await BrowserActions.click(optionElement);
    }

    async getValue(): Promise<string> {
        return BrowserActions.getText(element(by.css('mat-form-field span')));
    }

    async getNumberOfOptions(): Promise<number> {
        const dropdownOptions = element.all(by.css('.mat-select-panel mat-option'));
        return dropdownOptions.count();
    }

    async checkDropdownIsVisible(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dropDownElement);
    }

    async checkDropdownIsClickable(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.dropDownElement);
    }

    async checkOptionIsSelected(option: string): Promise<void> {
        const selectedOption = element(by.cssContainingText('.mat-select-value-text span', option));
        await BrowserVisibility.waitUntilElementIsVisible(selectedOption);
    }

    async selectOptionFromIndex(index): Promise<void> {
        const value: ElementFinder = element.all(by.className('mat-option')).get(index);
        await BrowserActions.click(value);
    }

    async checkOptionsPanelIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.css('.mat-select-panel')));
    }

    async getSelectedOptionText(): Promise<string> {
        return BrowserActions.getText(this.selectedOption);
    }

    async checkOptionIsDisplayed(option: string): Promise <void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText('mat-option span.mat-option-text', option)));
    }

    async checkOptionIsNotDisplayed(option: string): Promise <void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.cssContainingText('mat-option span.mat-option-text', option)));
    }
}
