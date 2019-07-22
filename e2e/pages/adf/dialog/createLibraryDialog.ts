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

import { by, element, browser, protractor, ElementFinder, promise, ElementArrayFinder } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class CreateLibraryDialog {
    libraryDialog: ElementFinder = element(by.css('[role="dialog"]'));
    libraryTitle: ElementFinder = element(by.css('.adf-library-dialog>h2'));
    libraryNameField: ElementFinder = element(by.css('input[formcontrolname="title"]'));
    libraryIdField: ElementFinder = element(by.css('input[formcontrolname="id"]'));
    libraryDescriptionField: ElementFinder = element(by.css('textarea[formcontrolname="description"]'));
    publicRadioButton: ElementFinder = element(by.css('[data-automation-id="PUBLIC"]>label'));
    privateRadioButton: ElementFinder = element(by.css('[data-automation-id="PRIVATE"]>label'));
    moderatedRadioButton: ElementFinder = element(by.css('[data-automation-id="MODERATED"]>label'));
    cancelButton: ElementFinder = element(by.css('button[data-automation-id="cancel-library-id"]'));
    createButton: ElementFinder = element(by.css('button[data-automation-id="create-library-id"]'));
    errorMessage: ElementFinder = element(by.css('.mat-dialog-content .mat-error'));
    errorMessages: ElementArrayFinder = element.all(by.css('.mat-dialog-content .mat-error'));
    libraryNameHint: ElementFinder = element(by.css('adf-library-dialog .mat-hint'));

    getSelectedRadio(): Promise<string> {
        const radio: ElementFinder = element(by.css('.mat-radio-button[class*="checked"]'));
        return BrowserActions.getText(radio);
    }

    async waitForDialogToOpen(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsPresent(this.libraryDialog);
    }

    async waitForDialogToClose(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotOnPage(this.libraryDialog);
    }

    isDialogOpen(): promise.Promise<any> {
        return browser.isElementPresent(this.libraryDialog);
    }

    getTitle(): Promise<string> {
        return BrowserActions.getText(this.libraryTitle);
    }

    getLibraryIdText(): promise.Promise<string> {
        return this.libraryIdField.getAttribute('value');
    }

    isErrorMessageDisplayed(): promise.Promise<boolean> {
        return this.errorMessage.isDisplayed();
    }

    getErrorMessage(): Promise<string> {
        return BrowserActions.getText(this.errorMessage);
    }

    getErrorMessages(position): Promise<string> {
        return BrowserActions.getText(this.errorMessages.get(position));
    }

    async waitForLibraryNameHint(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.libraryNameHint);
    }

    getLibraryNameHint(): Promise<string> {
        return BrowserActions.getText(this.libraryNameHint);
    }

    isNameDisplayed(): promise.Promise<boolean> {
        return this.libraryNameField.isDisplayed();
    }

    isLibraryIdDisplayed(): promise.Promise<boolean> {
        return this.libraryIdField.isDisplayed();
    }

    isDescriptionDisplayed(): promise.Promise<boolean> {
        return this.libraryDescriptionField.isDisplayed();
    }

    isPublicDisplayed(): promise.Promise<boolean> {
        return this.publicRadioButton.isDisplayed();
    }

    isModeratedDisplayed(): promise.Promise<boolean> {
        return this.moderatedRadioButton.isDisplayed();
    }

    isPrivateDisplayed(): promise.Promise<boolean> {
        return this.privateRadioButton.isDisplayed();
    }

    isCreateEnabled(): promise.Promise<boolean> {
        return this.createButton.isEnabled();
    }

    isCancelEnabled(): promise.Promise<boolean> {
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

    async typeLibraryId(libraryId): Promise<void> {
        await BrowserActions.clearSendKeys(this.libraryIdField, libraryId);
    }

    async typeLibraryDescription(libraryDescription): Promise<void> {
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
