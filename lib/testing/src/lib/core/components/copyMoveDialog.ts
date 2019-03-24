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

export class CopyMoveDialog extends Component {
  static selectors = {
    root: '.adf-content-node-selector-dialog',

    title: '.mat-dialog-title',
    content: '.mat-dialog-content',
    locationDropDown: 'site-dropdown-container',
    locationOption: '.mat-option .mat-option-text',

    dataTable: '.adf-datatable-body',
    row: '.adf-datatable-row[role]',
    selectedRow: '.adf-is-selected',

    button: '.mat-dialog-actions button'
  };

  title: ElementFinder = this.component.element(by.css(CopyMoveDialog.selectors.title));
  content: ElementFinder = this.component.element(by.css(CopyMoveDialog.selectors.content));
  dataTable: ElementFinder = this.component.element(by.css(CopyMoveDialog.selectors.dataTable));
  locationDropDown: ElementFinder = this.component.element(by.id(CopyMoveDialog.selectors.locationDropDown));
  locationPersonalFiles: ElementFinder = browser.element(by.cssContainingText(CopyMoveDialog.selectors.locationOption, 'Personal Files'));
  locationFileLibraries: ElementFinder = browser.element(by.cssContainingText(CopyMoveDialog.selectors.locationOption, 'File Libraries'));

  row: ElementFinder = this.component.element(by.css(CopyMoveDialog.selectors.row));

  cancelButton: ElementFinder = this.component.element(by.cssContainingText(CopyMoveDialog.selectors.button, 'Cancel'));
  copyButton: ElementFinder = this.component.element(by.cssContainingText(CopyMoveDialog.selectors.button, 'Copy'));
  moveButton: ElementFinder = this.component.element(by.cssContainingText(CopyMoveDialog.selectors.button, 'Move'));

  constructor(ancestor?: ElementFinder) {
    super(CopyMoveDialog.selectors.root, ancestor);
  }

  async waitForDialogToClose() {
    await browser.wait(EC.stalenessOf(this.title), this.waitTimeout);
  }

  async waitForDropDownToOpen() {
    await browser.wait(EC.presenceOf(this.locationPersonalFiles), this.waitTimeout);
  }

  async waitForDropDownToClose() {
    await browser.wait(EC.stalenessOf(browser.$(CopyMoveDialog.selectors.locationOption)), this.waitTimeout);
  }

  async waitForRowToBeSelected() {
    await browser.wait(EC.presenceOf(this.component.element(by.css(CopyMoveDialog.selectors.selectedRow))), this.waitTimeout);
  }

  async isDialogOpen() {
    return await browser.$(CopyMoveDialog.selectors.root).isDisplayed();
  }

  async getTitle() {
    return await this.title.getText();
  }

  async clickCancel() {
    await this.cancelButton.click();
    await this.waitForDialogToClose();
  }

  async clickCopy() {
    await this.copyButton.click();
  }

  async clickMove() {
    await this.moveButton.click();
  }

  getRow(folderName: string) {
    return this.dataTable.element(by.cssContainingText('.adf-name-location-cell', folderName));
  }

  async doubleClickOnRow(name: string) {
    const item = this.getRow(name);
    await this.waitUntilElementClickable(item);
    await browser.actions().mouseMove(item).perform();
    await browser.actions().click().click().perform();
  }

  async selectLocation(location: 'Personal Files' | 'File Libraries') {
    await this.locationDropDown.click();
    await this.waitForDropDownToOpen();

    if (location === 'Personal Files') {
      await this.locationPersonalFiles.click();
    } else {
      await this.locationFileLibraries.click();
    }

    await this.waitForDropDownToClose();
  }

  async selectDestination(folderName: string) {
    const row = this.getRow(folderName);
    await this.waitUntilElementClickable(row);
    await row.click();
    await this.waitForRowToBeSelected();
  }
}
