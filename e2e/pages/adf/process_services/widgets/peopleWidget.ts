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

import FormFields = require('../formFields');
import Util = require('../../../../util/util');
import { by, element } from 'protractor';

export class PeopleWidget {

    peopleField = element(by.css('input[data-automation-id="adf-people-search-input"]'));
    firstResult = element(by.id('adf-people-widget-user-0'));

    formFields = new FormFields();
    labelLocator = by.css('div[class*="display-text-widget"]');
    inputLocator = by.id('involvepeople');
    peopleDropDownList = by.css('div[class*="adf-people-widget-list"]');
    userProfileImage = by.css('div[class*="adf-people-widget-pic"');
    userProfileName = by.css('div[class*="adf-people-label-name"');

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

    checkDropDownListIsDisplayed() {
        return Util.waitUntilElementIsVisible(element(this.peopleDropDownList));
    }

    checkUserIsListed(userName) {
        let user = element(by.cssContainingText('.adf-people-label-name', userName));
        return Util.waitUntilElementIsVisible(user);
    }

    checkUserNotListed(userName) {
        let user = element(by.xpath('div[text()="' + userName + '"]'));
        return Util.waitUntilElementIsNotVisible(user);
    }

    selectUserFromDropDown(userName) {
        let user = element(by.cssContainingText('.adf-people-label-name', userName));
        user.click();
        return this;
    }

    checkPeopleFieldIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.peopleField);
    }

    fillPeopleField(value) {
        Util.waitUntilElementIsClickable(this.peopleField);
        return this.peopleField.sendKeys(value);
    }

    selectUserFromDropdown() {
        Util.waitUntilElementIsVisible(this.firstResult);
        return this.firstResult.click();
    }
}
