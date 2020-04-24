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
    textField: Locator = by.css('[data-automation-id*="card-textitem-value"]');
    saveButton: Locator = by.css('button[data-automation-id*="card-textitem-update"]');
    clearButton: Locator = by.css('button[data-automation-id*="card-textitem-reset"]');
    field: Locator = by.css('[data-automation-id*="card-textitem-value"]');
    labelLocator: Locator = by.css('div[data-automation-id*="card-textitem-label"]');
    errorMessage: Locator = by.css('.adf-textitem-editable-error');
    clickableElement: Locator = by.css('.adf-textitem-clickable');
    readOnlyField: Locator = by.css('.adf-property-read-only');

    constructor(label: string = 'assignee') {
        this.rootElement = element(by.xpath(`//div[contains(@data-automation-id, "label-${label}")]/ancestor::adf-card-view-textitem`));
    }

    async getFieldValue(): Promise<string> {
        const fieldElement = this.rootElement.all(this.field).first();
        return BrowserActions.getInputValue(fieldElement);
    }

    async checkLabelIsPresent(): Promise<void> {
        const labelElement: ElementFinder = this.rootElement.element(this.labelLocator);
        await BrowserVisibility.waitUntilElementIsPresent(labelElement);
    }

    async enterTextField(text: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.rootElement.element(this.textField));
        await BrowserActions.clearSendKeys(this.rootElement.element(this.textField), text);
    }

    async clickOnSaveButton(): Promise<void> {
        await BrowserActions.click(this.rootElement.element(this.saveButton));
    }

    async clickOnClearButton(): Promise<void> {
        await BrowserActions.click(this.rootElement.element(this.clearButton));
    }

    async getErrorMessage(): Promise<string> {
        const errorField = this.rootElement.element(this.errorMessage);
        return BrowserActions.getText(errorField);
    }

    async checkElementIsReadonly(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.rootElement.element(this.readOnlyField));
    }
}
