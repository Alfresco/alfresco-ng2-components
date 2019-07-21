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
import { by, element, ElementFinder, Locator } from 'protractor';
import { BrowserVisibility, BrowserActions } from '../../../utils/public-api';

export class PeopleWidget {

    peopleField: ElementFinder = element(by.css('input[data-automation-id="adf-people-search-input"]'));
    firstResult: ElementFinder = element(by.id('adf-people-widget-user-0'));
    formFields: FormFields = new FormFields();
    labelLocator: Locator = by.css('div[class*="display-text-widget"]');
    inputLocator: Locator = by.id('involvepeople');
    peopleDropDownList: Locator = by.css('div[class*="adf-people-widget-list"]');

    getFieldLabel(fieldId): Promise<string> {
        return this.formFields.getFieldLabel(fieldId, this.labelLocator);
    }

    getFieldValue(fieldId): Promise<string> {
        return this.formFields.getFieldValue(fieldId, this.inputLocator);
    }

    getFieldText(fieldId): Promise<string> {
        return this.formFields.getFieldText(fieldId, this.labelLocator);
    }

    insertUser(fieldId, value): Promise<void> {
        return this.formFields.setValueInInputById(fieldId, value);
    }

    async checkDropDownListIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(this.peopleDropDownList));
    }

    async checkUserIsListed(userName): Promise<void> {
        const user = element(by.cssContainingText('.adf-people-label-name', userName));
        await BrowserVisibility.waitUntilElementIsVisible(user);
    }

    async selectUserFromDropDown(userName): Promise<void> {
        const user = element(by.cssContainingText('.adf-people-label-name', userName));
        await BrowserActions.click(user);
    }

    async checkPeopleFieldIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.peopleField);
    }

    async fillPeopleField(value): Promise<void> {
        await BrowserVisibility.waitUntilElementIsClickable(this.peopleField);
        await this.peopleField.sendKeys(value);
    }

    async selectUserFromDropdown(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.firstResult);
        await BrowserActions.click(this.firstResult);
    }
}
