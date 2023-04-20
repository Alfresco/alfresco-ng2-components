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

import { $$, ElementFinder } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class FolderDialogPage {

    folderDialog = $$('adf-folder-dialog').first();
    folderNameField = this.folderDialog.$('#adf-folder-name-input');
    folderDescriptionField = this.folderDialog.$('#adf-folder-description-input');
    createUpdateButton = this.folderDialog.$('#adf-folder-create-button');
    cancelButton = this.folderDialog.$('#adf-folder-cancel-button');
    folderTitle = this.folderDialog.$('h2.mat-dialog-title');
    validationMessage = this.folderDialog.$('div.mat-form-field-subscript-wrapper mat-hint span');

    async getDialogTitle(): Promise<string> {
        return BrowserActions.getText(this.folderTitle);
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

    async clickOnCancelButton(): Promise<void> {
        await BrowserActions.click(this.cancelButton);
    }

    async addFolderName(folderName): Promise<void> {
        await BrowserActions.clearSendKeys(this.folderNameField, folderName);
    }

    async addFolderDescription(folderDescription): Promise<void> {
        await BrowserActions.clearSendKeys(this.folderDescriptionField, folderDescription);
    }

    async getFolderName(): Promise<string> {
        return BrowserActions.getInputValue(this.folderNameField);
    }

    async getValidationMessage(): Promise<string> {
        return BrowserActions.getText(this.validationMessage);
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

    async checkCreateUpdateBtnIsEnabled(): Promise<boolean> {
        return this.createUpdateButton.isEnabled();
    }

    async checkCancelBtnIsEnabled(): Promise<void> {
        await this.cancelButton.isEnabled();
    }

}
