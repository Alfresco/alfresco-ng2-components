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

import { FormFields } from '../formFields';
import { by, element } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';

export class DropdownWidget {

    formFields: FormFields = new FormFields();

    getSelectedOptionText(fieldId: string = 'dropdown'): Promise<string> {
        return this.formFields.getFieldText(fieldId, by.css(`mat-select[id="${fieldId}"] span span`));
    }

    async selectOption(option: string, locator: string = '#dropdown'): Promise<void> {
        await this.openDropdown(locator);
        const row = element(by.cssContainingText('mat-option span', option));
        await BrowserActions.click(row);
    }

    async openDropdown(locator: string = '#dropdown'): Promise<void> {
        await this.checkDropdownIsDisplayed(locator);
        const dropdown = locator ? element(by.css(`${locator}`)) : element(by.css(`#dropdown`));
        await BrowserVisibility.waitUntilElementIsClickable(dropdown);
        await BrowserActions.click(dropdown);
    }

    async checkDropdownIsDisplayed(locator: string = '#dropdown'): Promise<void> {
        const dropdown = element(by.css(`${locator}`));
        await BrowserVisibility.waitUntilElementIsVisible(dropdown);
    }
}
