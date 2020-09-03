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
import { Locator, by, element } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';

export class TypeaheadWidgetPage {

    field = element(by.css('input[data-automation-id="adf-typeahed-search-input"]'));
    firstResult = element(by.id('adf-typeahed-widget-user-0'));
    formFields = new FormFields();
    groupDropDownList: Locator = by.css('.mat-autocomplete-panel');

    getFieldLabel(fieldId: string): Promise<string> {
        return this.formFields.getFieldLabel(fieldId);
    }

    getFieldValue(fieldId: string): Promise<string> {
        return this.formFields.getFieldValue(fieldId);
    }

    getFieldText(fieldId: string): Promise<string> {
        return this.formFields.getFieldText(fieldId);
    }

    insertValue(fieldId: string, value: string): Promise<void> {
        return this.formFields.setValueInInputById(fieldId, value);
    }

    async checkDropDownListIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(this.groupDropDownList));
    }

    async checkOptionIsListed(option: string): Promise<void> {
        const optionElement = element(by.cssContainingText('[id="adf-typeahed-label-name"]', option));
        await BrowserVisibility.waitUntilElementIsVisible(optionElement);
    }

    async getDropDownList(): Promise<any[]> {
        const option: Locator = by.css('[id="adf-typeahed-label-name"]');
        await BrowserVisibility.waitUntilElementIsVisible(element(option));
        return element.all(option).map((elementFinder) => elementFinder.getText());
    }

    async selectOptionFromDropDown(userName: string): Promise<void> {
        const option = element(by.cssContainingText('[id="adf-typeahed-label-name"]', userName));
        await BrowserActions.click(option);
    }

    async checkTypeaheadFieldIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.field);
    }

    async fillTypeaheadField(value: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.field);
        await BrowserActions.clearSendKeys(this.field, value, 10);
    }

    async selectOptionFromDropdown(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.firstResult);
        await BrowserActions.click(this.firstResult);
    }
}
