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

import { ElementFinder, by, browser, ExpectedConditions as EC, ElementArrayFinder } from 'protractor';
import { Component } from './component';

export class MetadataCard extends Component {
  static selectors = {
    root: 'adf-content-metadata-card',
    footer: '.adf-content-metadata-card-footer',
    expandButton: '[data-automation-id="meta-data-card-toggle-expand"]',
    expansionPanel: '.adf-metadata-grouped-properties-container mat-expansion-panel'
  };

  footer: ElementFinder = this.component.element(by.css(MetadataCard.selectors.footer));
  expandButton: ElementFinder = this.component.element(by.css(MetadataCard.selectors.expandButton));
  expansionPanels: ElementArrayFinder = this.component.all(by.css(MetadataCard.selectors.expansionPanel));

  constructor(ancestor?: ElementFinder) {
    super(MetadataCard.selectors.root, ancestor);
  }

  async isExpandPresent() {
    return await this.expandButton.isPresent();
  }

  async clickExpandButton() {
    await this.expandButton.click();
  }

  async waitForFirstExpansionPanel() {
    return await browser.wait(EC.presenceOf(this.expansionPanels.get(0)), this.waitTimeout);
  }

  async isExpansionPanelPresent(index) {
    return await this.expansionPanels.get(index).isPresent();
  }

  async getComponentIdOfPanel(index) {
    return await this.expansionPanels.get(index).getAttribute('data-automation-id');
  }
}
