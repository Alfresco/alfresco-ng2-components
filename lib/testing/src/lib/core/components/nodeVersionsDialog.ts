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

export class NodeVersionsDialog extends Component {
  static selectors = {
    root: '.aca-node-versions-dialog',

    title: '.mat-dialog-title',
    content: '.mat-dialog-content',
    button: '.mat-button'
  };

  title: ElementFinder = this.component.element(by.css(NodeVersionsDialog.selectors.title));
  content: ElementFinder = this.component.element(by.css(NodeVersionsDialog.selectors.content));
  closeButton: ElementFinder = this.component.element(by.cssContainingText(NodeVersionsDialog.selectors.button, 'Close'));

  constructor(ancestor?: ElementFinder) {
    super(NodeVersionsDialog.selectors.root, ancestor);
  }

  async waitForDialogToClose() {
    return await browser.wait(EC.stalenessOf(this.title), this.waitTimeout);
  }

  async isDialogOpen() {
    return await browser.$(NodeVersionsDialog.selectors.root).isDisplayed();
  }

  async getTitle() {
    return await this.title.getText();
  }

  async getText() {
    return await this.content.getText();
  }

  async clickClose() {
    await this.closeButton.click();
    await this.waitForDialogToClose();
  }
}
