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

import { ElementFinder, ElementArrayFinder, by, browser, ExpectedConditions as EC } from 'protractor';
import { DateTimePicker } from './dateTimePicker';
import { Component } from './component';

export class ShareDialog extends Component {
  static selectors = {
    root: '.adf-share-dialog',

    title: `[data-automation-id='adf-share-dialog-title']`,
    info: '.adf-share-link__info',
    label: '.adf-share-link__label',
    shareToggle: `[data-automation-id='adf-share-toggle']`,
    linkUrl: `[data-automation-id='adf-share-link']`,
    inputAction: '.adf-input-action',
    expireToggle: `[data-automation-id='adf-expire-toggle']`,
    datetimePickerButton: '.mat-datetimepicker-toggle',
    expirationInput: 'input[formcontrolname="time"]',
    button: `[data-automation-id='adf-share-dialog-close']`
  };

  dateTimePicker = new DateTimePicker();

  title: ElementFinder = this.component.element(by.css(ShareDialog.selectors.title));
  infoText: ElementFinder = this.component.element(by.css(ShareDialog.selectors.info));
  labels: ElementArrayFinder = this.component.all(by.css(ShareDialog.selectors.label));
  shareToggle: ElementFinder = this.component.element(by.css(ShareDialog.selectors.shareToggle));
  url: ElementFinder = this.component.element(by.css(ShareDialog.selectors.linkUrl));
  urlAction: ElementFinder = this.component.element(by.css(ShareDialog.selectors.inputAction));
  expireToggle: ElementFinder = this.component.element(by.css(ShareDialog.selectors.expireToggle));
  expireInput: ElementFinder = this.component.element(by.css(ShareDialog.selectors.expirationInput));
  datetimePickerButton: ElementFinder = this.component.element(by.css(ShareDialog.selectors.datetimePickerButton));
  closeButton: ElementFinder = this.component.element(by.css(ShareDialog.selectors.button));

  constructor(ancestor?: ElementFinder) {
    super(ShareDialog.selectors.root, ancestor);
  }

  async waitForDialogToClose() {
    await browser.wait(EC.stalenessOf(this.title), this.waitTimeout, 'share dialog did not close');
  }

  async waitForDialogToOpen() {
    await browser.wait(EC.presenceOf(this.title), this.waitTimeout);
  }

  async isDialogOpen() {
    return await browser.isElementPresent(by.css(ShareDialog.selectors.root));
  }

  async getTitle() {
    return await this.title.getText();
  }

  async getInfoText() {
    return await this.infoText.getText();
  }

  getLabels() {
    return this.labels;
  }

  async getLinkUrl() {
    return await this.url.getAttribute('value');
  }

  async isUrlReadOnly() {
    return await this.url.getAttribute('readonly');
  }

  async isCloseEnabled() {
    return await this.closeButton.isEnabled();
  }

  async clickClose() {
    await this.closeButton.click();
    await this.waitForDialogToClose();
  }

  getShareToggle() {
    return this.shareToggle;
  }

  getExpireToggle() {
    return this.expireToggle;
  }

  getExpireInput() {
    return this.expireInput;
  }

  async isShareToggleChecked() {
    const toggleClass = await this.getShareToggle().getAttribute('class');
    return toggleClass.includes('checked');
  }

  async isShareToggleDisabled() {
    const toggleClass = await this.getShareToggle().getAttribute('class');
    return toggleClass.includes('mat-disabled');
  }

  async isExpireToggleEnabled() {
    const toggleClass = await this.getExpireToggle().getAttribute('class');
    return toggleClass.includes('checked');
  }

  async copyUrl() {
    return await this.urlAction.click();
  }

  async openDatetimePicker() {
    return await this.datetimePickerButton.click();
  }

  async closeDatetimePicker() {
    if (await this.dateTimePicker.isCalendarOpen()) {
      return await this.datetimePickerButton.click();
    }
  }

  async getExpireDate() {
    return await this.getExpireInput().getAttribute('value');
  }

  async clickExpirationToggle() {
    await this.expireToggle.click();
  }

  async clickShareToggle() {
    await this.shareToggle.click();
  }
}
