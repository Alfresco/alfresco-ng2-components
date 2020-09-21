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

import { by, element, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class CreateLibraryDialogPage {
    libraryDialog = element(by.css('[role="dialog"]'));
    libraryTitle = element(by.css('.adf-library-dialog>h2'));
    libraryNameField = element(by.css('input[formcontrolname="title"]'));
    libraryIdField = element(by.css('input[formcontrolname="id"]'));
    libraryDescriptionField = element(by.css('textarea[formcontrolname="description"]'));
    publicRadioButton = element(by.css('[data-automation-id="PUBLIC"]>label'));
    privateRadioButton = element(by.css('[data-automation-id="PRIVATE"]>label'));
    moderatedRadioButton = element(by.css('[data-automation-id="MODERATED"]>label'));
    cancelButton = element(by.css('button[data-automation-id="cancel-library-id"]'));
    createButton = element(by.css('button[data-automation-id="create-library-id"]'));
    errorMessage = element(by.css('.mat-dialog-content .mat-error'));
    errorMessages = element.all(by.css('.mat-dialog-content .mat-error'));
    libraryNameHint = element(by.css('adf-library-dialog .mat-hint'));

    async getSelectedRadio(): Promise<string> {
        const radio = element(by.css('.mat-radio-button[class*="checked"]'));
        return BrowserActions.getText(radio);
    }

    async waitForDialogToOpen(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsPresent(this.libraryDialog);
    }

    async waitForDialogToClose(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotPresent(this.libraryDialog);
    }

    async isDialogOpen(): Promise<any> {
        return BrowserVisibility.waitUntilElementIsVisible(this.libraryDialog);
    }

    async getTitle(): Promise<string> {
        return BrowserActions.getText(this.libraryTitle);
    }

    async getLibraryIdText(): Promise<string> {
        return this.libraryIdField.getAttribute('value');
    }

    async isErrorMessageDisplayed(): Promise<boolean> {
        return this.errorMessage.isDisplayed();
    }

    async getErrorMessage(): Promise<string> {
        return BrowserActions.getText(this.errorMessage);
    }

    async getErrorMessages(position: number): Promise<string> {
        return BrowserActions.getText(this.errorMessages.get(position));
    }

    async waitForLibraryNameHint(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.libraryNameHint);
    }

    async getLibraryNameHint(): Promise<string> {
        return BrowserActions.getText(this.libraryNameHint);
    }

    async isNameDisplayed(): Promise<boolean> {
        return this.libraryNameField.isDisplayed();
    }

    async isLibraryIdDisplayed(): Promise<boolean> {
        return this.libraryIdField.isDisplayed();
    }

    async isDescriptionDisplayed(): Promise<boolean> {
        return this.libraryDescriptionField.isDisplayed();
    }

    async isPublicDisplayed(): Promise<boolean> {
        return this.publicRadioButton.isDisplayed();
    }

    async isModeratedDisplayed(): Promise<boolean> {
        return this.moderatedRadioButton.isDisplayed();
    }

    async isPrivateDisplayed(): Promise<boolean> {
        return this.privateRadioButton.isDisplayed();
    }

    async isCreateEnabled(): Promise<boolean> {
        return this.createButton.isEnabled();
    }

    async isCancelEnabled(): Promise<boolean> {
        return this.cancelButton.isEnabled();
    }

    async clickCreate(): Promise<void> {
        await BrowserActions.click(this.createButton);
    }

    async clickCancel(): Promise<void> {
        await BrowserActions.click(this.cancelButton);
    }

    async typeLibraryName(libraryName: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.libraryNameField, libraryName);
    }

    async typeLibraryId(libraryId: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.libraryIdField, libraryId);
    }

    async typeLibraryDescription(libraryDescription: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.libraryDescriptionField, libraryDescription);
    }

    async clearLibraryName(): Promise<void> {
        await this.libraryNameField.clear();
        await this.libraryNameField.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
    }

    async clearLibraryId(): Promise<void> {
        await this.libraryIdField.clear();
        await this.libraryIdField.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
    }

    async selectPublic(): Promise<void> {
        await BrowserActions.click(this.publicRadioButton);
    }

    async selectPrivate(): Promise<void> {
        await BrowserActions.click(this.privateRadioButton);
    }

    async selectModerated(): Promise<void> {
        await BrowserActions.click(this.moderatedRadioButton);
    }
}
