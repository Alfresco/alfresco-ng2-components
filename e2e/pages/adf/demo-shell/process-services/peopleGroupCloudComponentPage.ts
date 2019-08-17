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

import { by, element, ElementFinder } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class PeopleGroupCloudComponentPage {

    peopleCloudSingleSelectionChecked: ElementFinder = element(by.css('mat-radio-button[data-automation-id="adf-people-single-mode"][class*="mat-radio-checked"]'));
    peopleCloudMultipleSelectionChecked: ElementFinder = element(by.css('mat-radio-button[data-automation-id="adf-people-multiple-mode"][class*="mat-radio-checked"]'));
    peopleCloudSingleSelection: ElementFinder = element(by.css('mat-radio-button[data-automation-id="adf-people-single-mode"]'));
    peopleCloudMultipleSelection: ElementFinder = element(by.css('mat-radio-button[data-automation-id="adf-people-multiple-mode"]'));
    peopleCloudFilterRole: ElementFinder = element(by.css('mat-radio-button[data-automation-id="adf-people-filter-role"]'));
    groupCloudSingleSelection: ElementFinder = element(by.css('mat-radio-button[data-automation-id="adf-group-single-mode"]'));
    groupCloudMultipleSelection: ElementFinder = element(by.css('mat-radio-button[data-automation-id="adf-group-multiple-mode"]'));
    groupCloudFilterRole: ElementFinder = element(by.css('mat-radio-button[data-automation-id="adf-group-filter-role"]'));
    peopleRoleInput: ElementFinder = element(by.css('input[data-automation-id="adf-people-roles-input"]'));
    peopleAppInput: ElementFinder = element(by.css('input[data-automation-id="adf-people-app-input"]'));
    peoplePreselect: ElementFinder = element(by.css('input[data-automation-id="adf-people-preselect-input"]'));
    groupRoleInput: ElementFinder = element(by.css('input[data-automation-id="adf-group-roles-input"]'));
    groupAppInput: ElementFinder = element(by.css('input[data-automation-id="adf-group-app-input"]'));
    peopleCloudComponentTitle: ElementFinder = element(by.cssContainingText('mat-card-title', 'People Cloud Component'));
    groupCloudComponentTitle: ElementFinder = element(by.cssContainingText('mat-card-title', 'Groups Cloud Component'));
    preselectValidation: ElementFinder = element(by.css('mat-checkbox.adf-preselect-value'));
    preselectValidationStatus: ElementFinder = element(by.css('mat-checkbox.adf-preselect-value label input'));
    peopleFilterByAppName: ElementFinder = element(by.css('.people-control-options mat-radio-button[value="appName"]'));
    groupFilterByAppName: ElementFinder = element(by.css('.groups-control-options mat-radio-button[value="appName"]'));

    async checkPeopleCloudComponentTitleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.peopleCloudComponentTitle);
    }

    async checkGroupsCloudComponentTitleIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.groupCloudComponentTitle);
    }

    async clickPeopleCloudSingleSelection(): Promise<void> {
        await BrowserActions.click(this.peopleCloudSingleSelection);
    }

    async clickPeopleCloudMultipleSelection(): Promise<void> {
        await BrowserActions.click(this.peopleCloudMultipleSelection);
    }

    async checkPeopleCloudSingleSelectionIsSelected(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.peopleCloudSingleSelectionChecked);
    }

    async checkPeopleCloudMultipleSelectionIsSelected(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.peopleCloudMultipleSelectionChecked);
    }

    async checkPeopleCloudFilterRole(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.peopleCloudFilterRole);
    }

    async clickPeopleCloudFilterRole(): Promise<void> {
        await BrowserActions.click(this.peopleCloudFilterRole);
    }

    async clickGroupCloudFilterRole(): Promise<void> {
        await BrowserActions.click(this.groupCloudFilterRole);
    }

    async enterPeopleRoles(roles): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.peopleRoleInput);
        await BrowserActions.clearSendKeys(this.peopleRoleInput, roles);
    }

    async enterPeoplePreselect(preselect): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.peoplePreselect);
        await BrowserActions.clearSendKeys(this.peoplePreselect, preselect);
    }

    async clearField(locator): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(locator);
        await BrowserActions.clearSendKeys(locator, '');
    }

    async clickGroupCloudSingleSelection(): Promise<void> {
        await BrowserActions.click(this.groupCloudSingleSelection);
    }

    async clickGroupCloudMultipleSelection(): Promise<void> {
        await BrowserActions.click(this.groupCloudMultipleSelection);
    }

    async enterGroupRoles(roles): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.groupRoleInput);
        await BrowserActions.clearSendKeys(this.groupRoleInput, roles);
    }

    async clickPreselectValidation(): Promise<void> {
        await BrowserActions.click(this.preselectValidation);
    }

    async getPreselectValidationStatus(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.preselectValidationStatus);
        return this.preselectValidationStatus.getAttribute('aria-checked');
    }

    async clickPeopleFilerByApp(): Promise<void> {
        await BrowserActions.click(this.peopleFilterByAppName);
    }

    async clickGroupFilerByApp(): Promise<void> {
        await BrowserActions.click(this.groupFilterByAppName);
    }

    async enterPeopleAppName(appName): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.peopleAppInput);
        await BrowserActions.clearSendKeys(this.peopleAppInput, appName);
    }

    async enterGroupAppName(appName): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.groupAppInput);
        await BrowserActions.clearSendKeys(this.groupAppInput, appName);
    }

}
