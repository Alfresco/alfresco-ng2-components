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

import { ElementFinder, by, browser, ExpectedConditions as EC } from 'protractor';
import { Component } from './component';

export class VersionUploadDialog extends Component {
  static selectors = {
    root: '.aca-node-version-upload-dialog',

    title: '.mat-dialog-title',
    content: '.mat-dialog-content',
    button: '.mat-button',

    radioButton: `.mat-radio-label`,

    descriptionTextArea: 'textarea'
  };

  title: ElementFinder = this.component.element(by.css(VersionUploadDialog.selectors.title));
  content: ElementFinder = this.component.element(by.css(VersionUploadDialog.selectors.content));
  cancelButton: ElementFinder = this.component.element(by.cssContainingText(VersionUploadDialog.selectors.button, 'Cancel'));
  uploadButton: ElementFinder = this.component.element(by.cssContainingText(VersionUploadDialog.selectors.button, 'Upload'));

  majorOption: ElementFinder = this.component.element(by.cssContainingText(VersionUploadDialog.selectors.radioButton, 'Major'));
  minorOption: ElementFinder = this.component.element(by.cssContainingText(VersionUploadDialog.selectors.radioButton, 'Minor'));

  description: ElementFinder = this.component.element(by.css(VersionUploadDialog.selectors.descriptionTextArea));

  constructor(ancestor?: ElementFinder) {
    super(VersionUploadDialog.selectors.root, ancestor);
  }

  async waitForDialogToClose() {
    return await browser.wait(EC.stalenessOf(this.title), this.waitTimeout);
  }

  async isDialogOpen() {
    return await browser.$(VersionUploadDialog.selectors.root).isDisplayed();
  }

  async getTitle() {
    return await this.title.getText();
  }

  async getText() {
    return await this.content.getText();
  }

  async isDescriptionDisplayed() {
    return await this.description.isDisplayed();
  }

  async isMinorOptionDisplayed() {
    return await this.minorOption.isDisplayed();
  }

  async isMajorOptionDisplayed() {
    return await this.majorOption.isDisplayed();
  }

  async isCancelButtonEnabled() {
    return this.cancelButton.isEnabled();
  }

  async isUploadButtonEnabled() {
    return this.uploadButton.isEnabled();
  }

  async clickCancel() {
    await this.cancelButton.click();
    await this.waitForDialogToClose();
  }

  async clickUpload() {
    await this.uploadButton.click();
    await this.waitForDialogToClose();
  }

  async clickMajor() {
    return await this.majorOption.click();
  }

  async clickMinor() {
    return await this.minorOption.click();
  }

  async enterDescription(description: string) {
    await this.description.clear();
    await this.typeInField(this.description, description);
  }

}
