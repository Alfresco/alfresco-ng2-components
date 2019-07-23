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

import { by, element, ElementFinder } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class FolderDialog {
    folderDialog: ElementFinder = element(by.css('adf-folder-dialog'));
    folderNameField: ElementFinder = this.folderDialog.element(by.id('adf-folder-name-input'));
    folderDescriptionField: ElementFinder = this.folderDialog.element(by.id('adf-folder-description-input'));
    createUpdateButton: ElementFinder = this.folderDialog.element(by.id('adf-folder-create-button'));
    cancelButton: ElementFinder = this.folderDialog.element(by.id('adf-folder-cancel-button'));
    folderTitle: ElementFinder = this.folderDialog.element((by.css('h2.mat-dialog-title')));
    validationMessage: ElementFinder = this.folderDialog.element(by.css('div.mat-form-field-subscript-wrapper mat-hint span'));

    async getDialogTitle(): Promise<string> {
        return await BrowserActions.getText(this.folderTitle);
    }

    async checkFolderDialogIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.folderDialog);
    }

    async checkFolderDialogIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.folderDialog);
    }

    async clickOnCreateUpdateButton(): Promise<void> {
        await BrowserActions.click(this.createUpdateButton);
    }

    async checkCreateUpdateBtnIsDisabled(): Promise<void> {
        await BrowserActions.checkIsDisabled(this.createUpdateButton);
    }

    async clickOnCancelButton(): Promise<void> {
        await BrowserActions.click(this.cancelButton);
    }

    async addFolderName(folderName): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.folderNameField);
        await BrowserActions.clearSendKeys(this.folderNameField, folderName);
    }

    async addFolderDescription(folderDescription): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.folderDescriptionField);
        await BrowserActions.clearSendKeys(this.folderDescriptionField, folderDescription);
    }

    async getFolderName(): Promise<string> {
        return await this.folderNameField.getAttribute('value');
    }

    async getValidationMessage(): Promise<string> {
        return await BrowserActions.getText(this.validationMessage);
    }

    async checkValidationMessageIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.validationMessage);
    }

    getFolderNameField(): ElementFinder {
        return this.folderNameField;
    }

    getFolderDescriptionField(): ElementFinder {
        return this.folderDescriptionField;
    }

    async checkCreateUpdateBtnIsEnabled(): Promise<void> {
        await this.createUpdateButton.isEnabled();
    }

    async checkCancelBtnIsEnabled(): Promise<void> {
        await this.cancelButton.isEnabled();
    }

}
