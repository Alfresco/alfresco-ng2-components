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

import { FormFields } from '../form-fields';
import { by, element, $, protractor } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';
import { TestElement } from '../../../test-element';

export class DropdownWidgetPage {

    formFields: FormFields = new FormFields();

    readonly searchElementLocator = TestElement.byCss('[aria-label="Search options"]');

    getSelectedOptionText(fieldId: string = 'dropdown'): Promise<string> {
        return this.formFields.getFieldText(fieldId, by.css(`mat-select[id="${fieldId}"] span span`));
    }

    async selectOption(option: string, locator: string = '#dropdown'): Promise<void> {
        await this.openDropdown(locator);
        const row = element(by.cssContainingText('mat-option span', option));
        await BrowserActions.click(row);
    }

    async selectMultipleOptions(options: string[]): Promise<void> {
        for (const option of options) {
            await this.clickOption(option);
        }
    }

    async closeDropdownFor(dropdownId: string): Promise<void> {
        const dropdownElement = TestElement.byCss(`#${dropdownId}-panel`)
        await $('body').sendKeys(protractor.Key.ESCAPE);
        await dropdownElement.waitNotPresent();
    }

    async openDropdown(locator: string = '#dropdown'): Promise<void> {
        await this.checkDropdownIsDisplayed(locator);
        const dropdown = locator ? $(`${locator}`) : $(`#dropdown`);
        await BrowserActions.click(dropdown);
    }

    async searchAndChooseOptionFromList(name: string): Promise<void> {
        await this.searchElementLocator.typeText(name);
        await this.clickOption(name);
    }

    async searchAndChooseOptionsFromList(...names: string[]): Promise<void> {
        for (const name of names) {
            await this.searchElementLocator.typeText(name);
            await this.clickOption(name);
        }
    }

    async checkDropdownIsDisplayed(locator: string = '#dropdown'): Promise<void> {
        const dropdown = $(`${locator}`);
        await BrowserVisibility.waitUntilElementIsVisible(dropdown);
    }

    async isWidgetVisible(fieldId): Promise<void> {
        await this.formFields.checkWidgetIsVisible(fieldId);
    }

    async isWidgetHidden(fieldId): Promise<void> {
        await this.formFields.checkWidgetIsHidden(fieldId);
    }

    private async clickOption(name: string): Promise<void> {
        const optionLocator = TestElement.byText('mat-option span', name)
        await optionLocator.click();
    }
}
