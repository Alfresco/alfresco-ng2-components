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

import { element, by } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
export class FilterComponent {

  constructor(private filterType: string) {}

  readonly filter = element(by.css(`adf-cloud-edit-${this.filterType}-filter mat-expansion-panel-header`));
  readonly expansionPanel = element(by.css(`adf-cloud-edit-${this.filterType}-filter mat-expansion-panel`));
  readonly expandedFilter = element(by.css(`adf-cloud-edit-${this.filterType}-filter .mat-expansion-panel-spacing`));
  readonly filterPropertyDropdown = `[data-automation-id='adf-cloud-edit-${this.filterType}-property-ITEM']`;
  readonly filterOptionsList = `[data-automation-id='adf-cloud-edit-${this.filterType}-property-options-ITEM']`;

  async isFilterDisplayed(): Promise<Boolean> {
    return await BrowserVisibility.waitUntilElementIsPresent(this.filter);
  }

  async openFilter() {
    await BrowserActions.click(this.expansionPanel);
  }

  async selectFilterValue(filterProperty: string, filterValue: string) {
    const propertyDropdown = this.filterPropertyDropdown.replace('ITEM', filterProperty);
    const dropdownElement = element(by.css(propertyDropdown));
    await BrowserActions.click(dropdownElement);

    const optionsList = this.filterOptionsList.replace('ITEM', filterProperty);
    await BrowserVisibility.waitUntilElementIsPresent(element(by.css(optionsList)));
    await BrowserActions.click(element(by.cssContainingText(`.mat-option-text`, filterValue)));
    await BrowserVisibility.waitUntilElementIsNotPresent(element(by.css(optionsList)));
  }

  async getFilterValue(filterProperty: string): Promise<String> {
    const propertyDropdown = this.filterPropertyDropdown.replace('ITEM', filterProperty);
    const dropdownElement = element(by.css(`${propertyDropdown}`));
    return await dropdownElement.getText();
  }

  async isApplicationListLoaded(): Promise<Boolean> {
    const emptyList = element(by.css(`[data-automation-id='adf-cloud-edit-${this.filterType}-property-appName'] .mat-select-placeholder`));
    return await BrowserVisibility.waitUntilElementIsNotVisible(emptyList);
  }
}
