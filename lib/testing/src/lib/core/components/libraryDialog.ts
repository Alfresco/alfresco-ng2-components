/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { ElementFinder, by, browser, protractor, ExpectedConditions as EC } from 'protractor';
import { Component } from './component';

export class LibraryDialog extends Component {
  static selectors = {
    root: 'adf-library-dialog',

    title: '.mat-dialog-title',
    nameInput: 'input[placeholder="Name" i]',
    libraryIdInput: 'input[placeholder="Library ID" i]',
    descriptionTextArea: 'textarea[placeholder="Description" i]',
    button: '.mat-dialog-actions button',
    radioButton: '.mat-radio-label',
    radioChecked: 'mat-radio-checked',
    errorMessage: '.mat-error'
  };

  title: ElementFinder = this.component.element(by.css(LibraryDialog.selectors.title));
  nameInput: ElementFinder = this.component.element(by.css(LibraryDialog.selectors.nameInput));
  libraryIdInput: ElementFinder = this.component.element(by.css(LibraryDialog.selectors.libraryIdInput));
  descriptionTextArea: ElementFinder = this.component.element(by.css(LibraryDialog.selectors.descriptionTextArea));
  visibilityPublic: ElementFinder = this.component.element(by.cssContainingText(LibraryDialog.selectors.radioButton, 'Public'));
  visibilityModerated: ElementFinder = this.component.element(by.cssContainingText(LibraryDialog.selectors.radioButton, 'Moderated'));
  visibilityPrivate: ElementFinder = this.component.element(by.cssContainingText(LibraryDialog.selectors.radioButton, 'Private'));
  createButton: ElementFinder = this.component.element(by.cssContainingText(LibraryDialog.selectors.button, 'Create'));
  cancelButton: ElementFinder = this.component.element(by.cssContainingText(LibraryDialog.selectors.button, 'Cancel'));
  errorMessage: ElementFinder = this.component.element(by.css(LibraryDialog.selectors.errorMessage));

  constructor(ancestor?: ElementFinder) {
    super(LibraryDialog.selectors.root, ancestor);
  }

  async waitForDialogToOpen() {
    await browser.wait(EC.presenceOf(this.title), this.waitTimeout);
    await browser.wait(EC.presenceOf(browser.element(by.css('.cdk-overlay-backdrop'))), this.waitTimeout);
  }

  async waitForDialogToClose() {
    await browser.wait(EC.stalenessOf(this.title), this.waitTimeout);
  }

  async isDialogOpen() {
    return await browser.isElementPresent(by.css(LibraryDialog.selectors.root));
  }

  async getTitle() {
    return await this.title.getText();
  }

  async isErrorMessageDisplayed() {
    return await this.errorMessage.isDisplayed();
  }

  async getErrorMessage() {
    await this.isErrorMessageDisplayed();
    return await this.errorMessage.getText();
  }

  async isNameDisplayed() {
    return await this.nameInput.isDisplayed();
  }

  async isLibraryIdDisplayed() {
    return await this.libraryIdInput.isDisplayed();
  }

  async isDescriptionDisplayed() {
    return await this.descriptionTextArea.isDisplayed();
  }

  async isPublicDisplayed() {
    return await this.visibilityPublic.isDisplayed();
  }

  async isModeratedDisplayed() {
    return await this.visibilityModerated.isDisplayed();
  }

  async isPrivateDisplayed() {
    return await this.visibilityPrivate.isDisplayed();
  }

  async enterName(name: string) {
    await this.nameInput.clear();
    await this.typeInField(this.nameInput, name);
  }

  async enterLibraryId(id: string) {
    await this.libraryIdInput.clear();
    await this.typeInField(this.libraryIdInput, id);
  }

  async enterDescription(description: string) {
    await this.descriptionTextArea.clear();
    await this.typeInField(this.descriptionTextArea, description);
  }

  async deleteNameWithBackspace() {
    await this.nameInput.clear();
    await this.nameInput.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
  }

  async isCreateEnabled() {
    return await this.createButton.isEnabled();
  }

  async isCancelEnabled() {
    return await this.cancelButton.isEnabled();
  }

  async clickCreate() {
    await this.createButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
    await this.waitForDialogToClose();
  }

  async isPublicChecked() {
    const elemClass = await this.visibilityPublic.element(by.xpath('..')).getAttribute('class');
    return await elemClass.includes(LibraryDialog.selectors.radioChecked);
  }

  async isModeratedChecked() {
    const elemClass = await this.visibilityModerated.element(by.xpath('..')).getAttribute('class');
    return await elemClass.includes(LibraryDialog.selectors.radioChecked);
  }

  async isPrivateChecked() {
    const elemClass = await this.visibilityPrivate.element(by.xpath('..')).getAttribute('class');
    return await elemClass.includes(LibraryDialog.selectors.radioChecked);
  }

  async selectPublic() {
    await this.visibilityPublic.click();
  }

  async selectModerated() {
    await this.visibilityModerated.click();
  }

  async selectPrivate() {
    await this.visibilityPrivate.click();
  }
}
