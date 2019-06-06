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
import { by, element } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class CardViewTextItemPage {

    toggleTextLocator = by.css('div[data-automation-id*="card-textitem-edit-toggle"]');
    editInputLocator = by.css('input[data-automation-id*="card-textitem-editinput"]');
    clearIconLocator = by.css('mat-icon[data-automation-id*="card-textitem-reset"]');
    saveIconLocator = by.css('mat-icon[data-automation-id*="card-textitem-update"]');
    textValueLocator = by.css('span[data-automation-id*="card-textitem-value"]');
    errorMessageLocator = by.css(`mat-error[data-automation-id*='card-textitem-error'] li`);
    item;

    constructor(item) {
        this.item = element(by.xpath(`//div[@data-automation-id="card-textitem-label-${item}"]/ancestor::adf-card-view-textitem`));
    }

    clickOnTextField() {
        BrowserActions.click(this.item.element(this.toggleTextLocator));
        BrowserVisibility.waitUntilElementIsVisible(this.item.element(this.editInputLocator));
        return this;
    }

    clickOnTextClearIcon() {
        BrowserActions.click(this.item.element(this.clearIconLocator));
        return this;
    }

    clickOnTextSaveIcon() {
        BrowserActions.click(this.item.element(this.saveIconLocator));
        return this;
    }

    getTextFieldText() {
        BrowserVisibility.waitUntilElementIsVisible(this.item);
        return BrowserActions.getText(this.item.element(this.textValueLocator));
    }

    enterTextField(text) {
        const input = this.item.element(this.editInputLocator);
        BrowserVisibility.waitUntilElementIsVisible(input);
        BrowserActions.clearSendKeys(input, text);
        return this;
    }

    getFieldErrorMessage() {
        const errorMessage = this.item.element(this.errorMessageLocator);
        BrowserVisibility.waitUntilElementIsVisible(errorMessage);
        return errorMessage.getText();
    }

    checkFieldErrorMessageIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.item.element(this.errorMessageLocator));
        return this;
    }
}
