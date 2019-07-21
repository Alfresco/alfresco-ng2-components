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

export class PeopleWidget {

    peopleField = element(by.css('input[data-automation-id="adf-people-search-input"]'));
    firstResult = element(by.id('adf-people-widget-user-0'));

    formFields = new FormFields();
    labelLocator = by.css('div[class*="display-text-widget"]');
    inputLocator = by.id('involvepeople');
    peopleDropDownList = by.css('div[class*="adf-people-widget-list"]');

    getFieldLabel(fieldId) {
        return this.formFields.getFieldLabel(fieldId, this.labelLocator);
    }

    getFieldValue(fieldId) {
        return this.formFields.getFieldValue(fieldId, this.inputLocator);
    }

    getFieldText(fieldId) {
        return this.formFields.getFieldText(fieldId, this.labelLocator);
    }

    insertUser(fieldId, value) {
        return this.formFields.setValueInInputById(fieldId, value);
    }

    async checkDropDownListIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(element(this.peopleDropDownList));
    }

    async checkUserIsListed(userName) {
        const user = element(by.cssContainingText('.adf-people-label-name', userName));
        await BrowserVisibility.waitUntilElementIsVisible(user);
    }

    async selectUserFromDropDown(userName) {
        const user = element(by.cssContainingText('.adf-people-label-name', userName));
        await BrowserActions.click(user);
        return this;
    }

    async checkPeopleFieldIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.peopleField);
    }

    async fillPeopleField(value) {
        await BrowserVisibility.waitUntilElementIsClickable(this.peopleField);
        return this.peopleField.sendKeys(value);
    }

    async selectUserFromDropdown(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.firstResult);
        await BrowserActions.click(this.firstResult);
    }
}
