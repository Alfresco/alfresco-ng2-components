/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { Locator, by, element, $ } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';

export class GroupWidgetPage {

    groupField = $('input[data-automation-id="adf-group-search-input"]');
    firstResult = $('#adf-group-widget-user-0');
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

    insertGroup(fieldId, value): Promise<void> {
        return this.formFields.setValueInInputById(fieldId, value);
    }

    async checkDropDownListIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(this.groupDropDownList));
    }

    async checkGroupIsListed(group): Promise<void> {
        const groupElement = element(by.cssContainingText('[id="adf-group-label-name"]', group));
        await BrowserVisibility.waitUntilElementIsVisible(groupElement);
    }

    async getDropDownList(): Promise<any[]> {
        const user: Locator = by.css('[id="adf-group-label-name"]');
        await BrowserVisibility.waitUntilElementIsVisible(element(user));
        return element.all(user).map((elementFinder) => elementFinder.getText());
    }

    async selectGroupFromDropDown(groupName): Promise<void> {
        const group = element(by.cssContainingText('[id="adf-group-label-name"]', groupName));
        await BrowserActions.click(group);
    }

    async checkGroupFieldIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.groupField);
    }

    async fillGroupField(value): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.groupField);
        await this.groupField.sendKeys(value);
    }

    async selectGroupFromDropdown(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.firstResult);
        await BrowserActions.click(this.firstResult);
    }
}
