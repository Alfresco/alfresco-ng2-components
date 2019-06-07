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
import { BrowserVisibility } from '../../utils/browser-visibility';
import { BrowserActions } from '../../utils/browser-actions';

export class CardViewTextItemPage {

    toggleTextLocator = by.css('div[data-automation-id*="card-textitem-edit-toggle"]');
    editInputLocator = by.css('input[data-automation-id*="card-textitem-editinput"]');
    clearIconLocator = by.css('mat-icon[data-automation-id*="card-textitem-reset"]');
    saveIconLocator = by.css('mat-icon[data-automation-id*="card-textitem-update"]');
    textValueLocator = by.css('span[data-automation-id*="card-textitem-value"]');
    errorMessageLocator = by.css(`mat-error[data-automation-id*='card-textitem-error'] li`);
    editIcon = by.css('mat-icon[data-automation-id*="card-textitem-edit-icon"]');
    item;

    constructor(item) {
        this.item = element(by.xpath(`//div[@data-automation-id="card-textitem-label-${item}"]/ancestor::adf-card-view-textitem`));
    }

    getLabelValue() {
        return this.item.element(by.css('div[data-automation-id*="label"]')).getText();
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
        return BrowserActions.getText(this.item.element(this.textValueLocator));
    }

    enterTextField(text) {
        BrowserActions.clearSendKeys(this.item.element(this.editInputLocator), text);
        return this;
    }

    getFieldErrorMessage() {
        return this.item.element(this.errorMessageLocator).getText();
    }

    checkFieldErrorMessageIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.item.element(this.errorMessageLocator));
        return this;
    }

    checkEditIconIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.item.element(this.editIcon));
    }
}
