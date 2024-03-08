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

import { element, by, ElementFinder } from 'protractor';
import { BrowserActions, BrowserVisibility } from '../../utils/public-api';
import { DropdownPage } from '../material/dropdown.page';

export class CardSelectItemPage {

    rootElement: ElementFinder;
    labelLocator = 'div[data-automation-id*="card-select-label"]';
    readOnlyField = '[data-automation-class="read-only-value"]';
    dropdown: DropdownPage;

    constructor(label: string = 'fileSource') {
        this.rootElement = element(by.xpath(`//div[contains(@data-automation-id, "label-${label}")]/ancestor::adf-card-view-selectitem`));
        this.dropdown = new DropdownPage(this.rootElement.$('mat-select'));
    }

    async checkLabelIsPresent(): Promise<void> {
        const labelElement = this.rootElement.$(this.labelLocator);
        await BrowserVisibility.waitUntilElementIsPresent(labelElement);
    }

    async getSelectedOptionText(): Promise<string> {
        return this.dropdown.getSelectedOptionText();
    }

    async getReadonlyValue(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.rootElement.$(this.readOnlyField));
        return BrowserActions.getText(this.rootElement.$(this.readOnlyField));
    }

    async selectDropdownOption(option: string): Promise<void> {
        await this.dropdown.selectDropdownOption(option);
    }

    async checkElementIsReadonly(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.rootElement.$(this.readOnlyField));
    }
}
