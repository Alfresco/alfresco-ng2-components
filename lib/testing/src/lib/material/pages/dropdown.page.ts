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

    constructor(dropDownElement: ElementFinder = element.all(by.css('div[class="mat-select-arrow-wrapper"]')).first()) {
        this.dropDownElement = dropDownElement;
    }

    async checkOptionIsVisibleInDropdown(option: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText('mat-option span', option)), 5000);
    }

    async checkOptionIsNotVisible(option: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.cssContainingText('mat-option span', option)), 5000);
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
}
