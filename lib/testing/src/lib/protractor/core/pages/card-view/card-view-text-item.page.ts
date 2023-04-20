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

import { element, by, ElementFinder, Key } from 'protractor';
import { BrowserActions, BrowserVisibility } from '../../utils/public-api';
export class CardTextItemPage {

    rootElement: ElementFinder;
    textField = '[data-automation-id*="card-textitem-value"]';
    saveButton = 'button[data-automation-id*="card-textitem-update"]';
    clearButton = 'button[data-automation-id*="card-textitem-reset"]';
    field = '[data-automation-id*="card-textitem-value"]';
    labelLocator = '[data-automation-id*="card-textitem-label"]';
    errorMessage = '.adf-textitem-editable-error';
    clickableElement = '.adf-textitem-clickable';
    readOnlyField = '.adf-property-read-only';

    constructor(label: string = 'assignee') {
        this.rootElement = element(by.xpath(`//mat-label[contains(@data-automation-id, "card-textitem-label-${label}")]//ancestor::adf-card-view-textitem`));
    }

    async getFieldValue(): Promise<string> {
        const fieldElement = this.rootElement.$(this.field);
        return BrowserActions.getInputValue(fieldElement);
    }

    async checkLabelIsPresent(): Promise<void> {
        const labelElement = this.rootElement.$(this.labelLocator);
        await BrowserVisibility.waitUntilElementIsPresent(labelElement);
    }

    async checkLabelIsVisible(): Promise<void> {
        const labelElement = this.rootElement.$(this.labelLocator);
        await BrowserVisibility.waitUntilElementIsVisible(labelElement);
    }

    async enterTextField(text: string, pauseBetweenTypingChars = 500): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.rootElement.$(this.textField));
        await BrowserActions.clearSendKeys(this.rootElement.$(this.textField), text, pauseBetweenTypingChars);
        await this.rootElement.$(this.textField).sendKeys(Key.TAB);
    }

    async clickOnSaveButton(): Promise<void> {
        await BrowserActions.click(this.rootElement.$(this.saveButton));
    }

    async clickOnClearButton(): Promise<void> {
        await BrowserActions.click(this.rootElement.$(this.clearButton));
    }

    async getErrorMessage(): Promise<string> {
        const errorField = this.rootElement.$(this.errorMessage);
        return BrowserActions.getText(errorField);
    }

    async checkElementIsReadonly(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.rootElement.$(this.readOnlyField));
    }

    async checkElementIsClickable(): Promise<void> {
        const clickableElement = this.rootElement.$(this.clickableElement);
        await BrowserVisibility.waitUntilElementIsVisible(clickableElement);
    }

    async clickField(): Promise<void> {
        const clickableElement = this.rootElement.$(this.clickableElement);
        await BrowserActions.click(clickableElement);
    }
}
