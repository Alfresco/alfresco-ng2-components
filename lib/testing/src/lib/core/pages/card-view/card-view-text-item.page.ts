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

import { element, by, ElementFinder, Locator } from 'protractor';
import { BrowserActions, BrowserVisibility } from '../../utils/public-api';

export class CardTextItemPage {

    rootElement: ElementFinder;
    textField: Locator = by.css('input[data-automation-id*="card-textitem-editinput"]');
    saveIcon: Locator = by.css('button[data-automation-id*="card-textitem-update"]');
    clearIcon: Locator = by.css('button[data-automation-id*="card-textitem-reset"]');
    field: Locator = by.css('span[data-automation-id*="card-textitem-value"] span');
    labelLocator: Locator = by.css('div[data-automation-id*="card-textitem-label"]');
    toggle: Locator = by.css('div[data-automation-id*="card-textitem-edit-toggle"]');

    constructor(label: string = 'assignee') {
        this.rootElement = element(by.xpath(`//adf-card-view-textitem/div[data-automation-id*="label-${label}"]/ancestor`));
    }

    async getFieldValue(): Promise<string> {
        const fieldElement = this.rootElement.element(this.field);
        return BrowserActions.getText(fieldElement);
    }

    async checkLabelIsPresent(): Promise<void> {
        const labelElement: ElementFinder = this.rootElement.element(this.labelLocator);
        await BrowserVisibility.waitUntilElementIsPresent(labelElement);
    }

    async clickOnToggleTextField(): Promise<void> {
        const toggleText: ElementFinder = this.rootElement.element(this.toggle);
        await BrowserActions.click(toggleText);
        await BrowserVisibility.waitUntilElementIsVisible(this.rootElement.element(this.textField));
    }

    async enterTextField(text: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.rootElement.element(this.textField));
        await BrowserActions.clearSendKeys(this.rootElement.element(this.textField), text);
    }

    async clickOnTextSaveIcon(): Promise<void> {
        await BrowserActions.click(this.rootElement.element(this.saveIcon));
    }

    async clickOnTextClearIcon(): Promise<void> {
        await BrowserActions.click(this.rootElement.element(this.clearIcon));
    }
}
