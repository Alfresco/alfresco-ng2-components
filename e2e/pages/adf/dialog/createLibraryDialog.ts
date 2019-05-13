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

import { by, element, browser, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class CreateLibraryDialog {
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

    getSelectedRadio() {
        const radio = element(by.css('.mat-radio-button[class*="checked"]'));
        return BrowserActions.getText(radio);
    }

    waitForDialogToOpen() {
        BrowserVisibility.waitUntilElementIsPresent(this.libraryDialog);
        return this;
    }

    waitForDialogToClose() {
        BrowserVisibility.waitUntilElementIsNotOnPage(this.libraryDialog);
        return this;
    }

    isDialogOpen() {
        return browser.isElementPresent(this.libraryDialog);
    }

    getTitle() {
        return BrowserActions.getText(this.libraryTitle);
    }

    getLibraryIdText() {
        return this.libraryIdField.getAttribute('value');
    }

    isErrorMessageDisplayed() {
        return this.errorMessage.isDisplayed();
    }

    getErrorMessage() {
        return BrowserActions.getText(this.errorMessage);
    }

    getErrorMessages(position) {
        return BrowserActions.getText(this.errorMessages.get(position));
    }

    waitForLibraryNameHint() {
        BrowserVisibility.waitUntilElementIsVisible(this.libraryNameHint);
        return this;
    }

    getLibraryNameHint() {
        return BrowserActions.getText(this.libraryNameHint);
    }

    isNameDisplayed() {
        return this.libraryNameField.isDisplayed();
    }

    isLibraryIdDisplayed() {
        return this.libraryIdField.isDisplayed();
    }

    isDescriptionDisplayed() {
        return this.libraryDescriptionField.isDisplayed();
    }

    isPublicDisplayed() {
        return this.publicRadioButton.isDisplayed();
    }

    isModeratedDisplayed() {
        return this.moderatedRadioButton.isDisplayed();
    }

    isPrivateDisplayed() {
        return this.privateRadioButton.isDisplayed();
    }

    isCreateEnabled() {
        return this.createButton.isEnabled();
    }

    isCancelEnabled() {
        return this.cancelButton.isEnabled();
    }

    clickCreate() {
        BrowserActions.click(this.createButton);
    }

    clickCancel() {
        BrowserActions.click(this.cancelButton);
    }

    typeLibraryName(libraryName: string) {
        BrowserActions.clearSendKeys(this.libraryNameField, libraryName);
    }

    typeLibraryId(libraryId) {
        BrowserActions.clearSendKeys(this.libraryIdField, libraryId);
    }

    typeLibraryDescription(libraryDescription) {
        BrowserActions.clearSendKeys(this.libraryDescriptionField, libraryDescription);
    }

    clearLibraryName() {
        this.libraryNameField.clear();
        this.libraryNameField.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
    }

    clearLibraryId() {
        this.libraryIdField.clear();
        this.libraryIdField.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
    }

    selectPublic() {
        BrowserActions.click(this.publicRadioButton);
    }

    selectPrivate() {
        BrowserActions.click(this.privateRadioButton);
    }

    selectModerated() {
        BrowserActions.click(this.moderatedRadioButton);
    }
}
