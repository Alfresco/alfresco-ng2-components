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
import { Util } from '../../../util/util';

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
        let radio = element(by.css('.mat-radio-button[class*="checked"]'));
        Util.waitUntilElementIsVisible(radio);
        return radio.getText();
    }

    waitForDialogToOpen() {
        Util.waitUntilElementIsPresent(this.libraryDialog);
        return this;
    }

    waitForDialogToClose() {
        Util.waitUntilElementIsNotOnPage(this.libraryDialog);
        return this;
    }

    isDialogOpen() {
        return browser.isElementPresent(this.libraryDialog);
    }

    getTitle() {
        return this.libraryTitle.getText();
    }

    getLibraryIdText() {
        return this.libraryIdField.getAttribute('value');
    }

    isErrorMessageDisplayed() {
        return this.errorMessage.isDisplayed();
    }

    getErrorMessage() {
        Util.waitUntilElementIsVisible(this.errorMessage);
        return this.errorMessage.getText();
    }

    getErrorMessages(position) {
        Util.waitUntilElementIsVisible(this.errorMessages);
        return this.errorMessages.get(position).getText();
    }

    waitForLibraryNameHint() {
        Util.waitUntilElementIsVisible(this.libraryNameHint);
        return this;
    }
    getLibraryNameHint() {
        Util.waitUntilElementIsVisible(this.libraryNameHint);
        return this.libraryNameHint.getText();
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
        Util.waitUntilElementIsClickable(this.createButton);
        this.createButton.click();
    }

    clickCancel() {
        this.cancelButton.click();
    }

    typeLibraryName(libraryName: string) {
        this.libraryNameField.clear();
        this.libraryNameField.sendKeys(libraryName);
    }

    typeLibraryId(libraryId) {
        this.libraryIdField.clear();
        this.libraryIdField.sendKeys(libraryId);
    }

    typeLibraryDescription(libraryDescription) {
        this.libraryDescriptionField.clear();
        this.libraryDescriptionField.sendKeys(libraryDescription);
    }

    clearLibraryName() {
        this.libraryNameField.clear();
        this.libraryNameField.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
    }

    clearLibraryId() {
        this.libraryIdField.clear();
        this.libraryIdField.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
    }

    clearLibraryDescription() {
        this.libraryDescriptionField.clear();
        this.libraryDescriptionField.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
    }

    selectPublic() {
        this.publicRadioButton.click();
    }

    selectPrivate() {
        this.privateRadioButton.click();
    }

    selectModerated() {
        this.moderatedRadioButton.click();
    }
}
