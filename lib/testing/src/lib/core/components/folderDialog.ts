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

export class CreateOrEditFolderDialog extends Component {
  static selectors = {
    root: 'adf-folder-dialog',

    title: '.mat-dialog-title',
    nameInput: 'input[placeholder="Name" i]',
    descriptionTextArea: 'textarea[placeholder="Description" i]',
    button: '.mat-dialog-actions button',
    validationMessage: '.mat-hint span'
  };

  title: ElementFinder = this.component.element(by.css(CreateOrEditFolderDialog.selectors.title));
  nameInput: ElementFinder = this.component.element(by.css(CreateOrEditFolderDialog.selectors.nameInput));
  descriptionTextArea: ElementFinder = this.component.element(by.css(CreateOrEditFolderDialog.selectors.descriptionTextArea));
  createButton: ElementFinder = this.component.element(by.cssContainingText(CreateOrEditFolderDialog.selectors.button, 'Create'));
  cancelButton: ElementFinder = this.component.element(by.cssContainingText(CreateOrEditFolderDialog.selectors.button, 'Cancel'));
  updateButton: ElementFinder = this.component.element(by.cssContainingText(CreateOrEditFolderDialog.selectors.button, 'Update'));
  validationMessage: ElementFinder = this.component.element(by.css(CreateOrEditFolderDialog.selectors.validationMessage));

  constructor(ancestor?: ElementFinder) {
    super(CreateOrEditFolderDialog.selectors.root, ancestor);
  }

  async waitForDialogToOpen() {
    await browser.wait(EC.presenceOf(this.title), this.waitTimeout);
    await browser.wait(EC.presenceOf(browser.element(by.css('.cdk-overlay-backdrop'))), this.waitTimeout);
  }

  async waitForDialogToClose() {
    await browser.wait(EC.stalenessOf(this.title), this.waitTimeout, '---- timeout waiting for dialog to close ----');
  }

  async isDialogOpen() {
    return await browser.isElementPresent(by.css(CreateOrEditFolderDialog.selectors.root));
  }

  async getTitle() {
    return await this.title.getText();
  }

  async isValidationMessageDisplayed() {
    return await this.validationMessage.isDisplayed();
  }

  async isUpdateButtonEnabled() {
    return this.updateButton.isEnabled();
  }

  async isCreateButtonEnabled() {
    return this.createButton.isEnabled();
  }

  async isCancelButtonEnabled() {
    return this.cancelButton.isEnabled();
  }

  async isNameDisplayed() {
    return await this.nameInput.isDisplayed();
  }

  async isDescriptionDisplayed() {
    return await this.descriptionTextArea.isDisplayed();
  }

  async getValidationMessage() {
    await this.isValidationMessageDisplayed();
    return await this.validationMessage.getText();
  }

  async getName() {
    return await this.nameInput.getAttribute('value');
  }

  async getDescription() {
    return await this.descriptionTextArea.getAttribute('value');
  }

  async enterName(name: string) {
    await this.nameInput.clear();
    await this.typeInField(this.nameInput, name);
  }

  async enterDescription(description: string) {
    await this.descriptionTextArea.clear();
    await this.typeInField(this.descriptionTextArea, description);
  }

  async deleteNameWithBackspace() {
    await this.nameInput.clear();
    await this.nameInput.sendKeys(' ', protractor.Key.CONTROL, 'a', protractor.Key.NULL, protractor.Key.BACK_SPACE);
  }

  async clickCreate() {
    await this.createButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
    await this.waitForDialogToClose();
  }

  async clickUpdate() {
    await this.updateButton.click();
  }

}
