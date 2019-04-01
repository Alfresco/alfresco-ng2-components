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

import { by, element, protractor } from 'protractor';
import { BrowserVisibility } from '@alfresco/adf-testing';

export class PeopleGroupCloudComponentPage {

    peopleCloudSingleSelection = element(by.css('mat-radio-button[data-automation-id="adf-people-single-mode"]'));
    peopleCloudMultipleSelection = element(by.css('mat-radio-button[data-automation-id="adf-people-multiple-mode"]'));
    peopleCloudFilterRole = element(by.css('mat-radio-button[data-automation-id="adf-people-filter-role"]'));
    groupCloudSingleSelection = element(by.css('mat-radio-button[data-automation-id="adf-group-single-mode"]'));
    groupCloudMultipleSelection = element(by.css('mat-radio-button[data-automation-id="adf-group-multiple-mode"]'));
    groupCloudFilterRole = element(by.css('mat-radio-button[data-automation-id="adf-group-filter-role"]'));
    peopleRoleInput = element(by.css('input[data-automation-id="adf-people-roles-input"]'));
    peoplePreselect = element(by.css('input[data-automation-id="adf-people-preselect-input"]'));
    groupRoleInput = element(by.css('input[data-automation-id="adf-group-roles-input"]'));
    groupPreselect = element(by.css('input[data-automation-id="adf-group-preselect-input"]'));
    peopleCloudComponentTitle = element(by.cssContainingText('mat-card-title', 'People Cloud Component'));
    groupCloudComponentTitle = element(by.cssContainingText('mat-card-title', 'Groups Cloud Component'));
    preselectValidation = element(by.css('mat-checkbox.adf-preselect-value'));
    assigneeField = element(by.css('input[data-automation-id="adf-people-cloud-search-input"]'));

    checkPeopleCloudComponentTitleIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.peopleCloudComponentTitle);
        return this;
    }

    checkGroupsCloudComponentTitleIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.groupCloudComponentTitle);
        return this;
    }

    clickPeopleCloudMultipleSelection() {
        BrowserVisibility.waitUntilElementIsVisible(this.peopleCloudMultipleSelection);
        this.peopleCloudMultipleSelection.click();
    }

    clickPeopleCloudSingleSelection() {
        BrowserVisibility.waitUntilElementIsVisible(this.peopleCloudSingleSelection);
        this.peopleCloudSingleSelection.click();
    }

    clickPeopleCloudFilterRole() {
        BrowserVisibility.waitUntilElementIsVisible(this.peopleCloudFilterRole);
        this.peopleCloudFilterRole.click();
    }

    clickGroupCloudFilterRole() {
        BrowserVisibility.waitUntilElementIsVisible(this.groupCloudFilterRole);
        this.groupCloudFilterRole.click();
    }

    enterPeopleRoles(roles) {
        BrowserVisibility.waitUntilElementIsVisible(this.peopleRoleInput);
        this.peopleRoleInput.clear();
        this.peopleRoleInput.sendKeys(roles);
        return this;
    }

    enterPeoplePreselect(preselect) {
        BrowserVisibility.waitUntilElementIsVisible(this.peoplePreselect);
        this.peoplePreselect.clear();
        this.peoplePreselect.sendKeys(preselect);
        return this;
    }

    clearField(locator) {
        BrowserVisibility.waitUntilElementIsVisible(locator);
        locator.getAttribute('value').then((result) => {
            for (let i = result.length; i >= 0; i--) {
                locator.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    }

    clickGroupCloudMultipleSelection() {
        BrowserVisibility.waitUntilElementIsVisible(this.groupCloudMultipleSelection);
        this.groupCloudMultipleSelection.click();
    }

    enterGroupRoles(roles) {
        BrowserVisibility.waitUntilElementIsVisible(this.groupRoleInput);
        this.groupRoleInput.clear();
        this.groupRoleInput.sendKeys(roles);
        return this;
    }

    clickPreselectValidation() {
        BrowserVisibility.waitUntilElementIsVisible(this.preselectValidation);
        this.preselectValidation.click();
    }

    checkPreselectValidationIsChecked() {
        BrowserVisibility.waitUntilElementIsVisible(this.preselectValidation);
        this.preselectValidation.getAttribute('class').then((text) => {
            return text.includes('checked');
        });
    }

    checkPreselectValidationIsUnchecked() {
        BrowserVisibility.waitUntilElementIsVisible(this.preselectValidation);
        this.preselectValidation.getAttribute('class').then((text) => {
            return text.includes('focused');
        });
    }

    getAssigneeFieldContent() {
        BrowserVisibility.waitUntilElementIsVisible(this.assigneeField);
        return this.assigneeField.getAttribute('value');

    }

}
