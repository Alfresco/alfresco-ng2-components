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

import { browser, by, element } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class FolderDialog {
    folderDialog = element(by.css('adf-folder-dialog'));
    folderNameField = this.folderDialog.element(by.id('adf-folder-name-input'));
    folderDescriptionField = this.folderDialog.element(by.id('adf-folder-description-input'));
    createUpdateButton = this.folderDialog.element(by.id('adf-folder-create-button'));
    cancelButton = this.folderDialog.element(by.id('adf-folder-cancel-button'));
    folderTitle = this.folderDialog.element((by.css('h2.mat-dialog-title')));
    validationMessage = this.folderDialog.element(by.css('div.mat-form-field-subscript-wrapper mat-hint span'));

    getDialogTitle() {
        return BrowserActions.getText(this.folderTitle);
    }

    checkFolderDialogIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.folderDialog);
        return this;
    }

    checkFolderDialogIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.folderDialog);
        return this;
    }

    clickOnCreateUpdateButton() {
        BrowserActions.click(this.createUpdateButton);
    }

    checkCreateUpdateBtnIsDisabled() {
        BrowserVisibility.waitUntilElementIsVisible(this.createUpdateButton);
        expect(this.createUpdateButton.getAttribute('disabled')).toEqual('true');
        return this;
    }

    checkCreateUpdateBtnIsEnabled() {
        this.createUpdateButton.isEnabled();
        return this;
    }

    checkCancelBtnIsEnabled() {
        this.cancelButton.isEnabled();
        return this;
    }

    clickOnCancelButton() {
        BrowserActions.click(this.cancelButton);
    }

    addFolderName(folderName) {
        BrowserVisibility.waitUntilElementIsVisible(this.folderNameField);
        BrowserActions.clearSendKeys(this.folderNameField, folderName);
        browser.driver.sleep(500);
        return this;
    }

    addFolderDescription(folderDescription) {
        BrowserVisibility.waitUntilElementIsVisible(this.folderDescriptionField);
        BrowserActions.clearSendKeys(this.folderDescriptionField, folderDescription);
        return this;
    }

    getFolderName() {
        return this.folderNameField.getAttribute('value');
    }

    getValidationMessage() {
        return BrowserActions.getText(this.validationMessage);
    }

    checkValidationMessageIsNotDisplayed() {
        BrowserVisibility.waitUntilElementIsNotVisible(this.validationMessage);
        return this;
    }

    getFolderNameField() {
        return this.folderNameField;
    }

    getFolderDescriptionField() {
        return this.folderDescriptionField;
    }

}
