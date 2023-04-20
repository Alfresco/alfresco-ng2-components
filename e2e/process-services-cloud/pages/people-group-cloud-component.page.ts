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

import { by, element, $, $$, browser } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class PeopleGroupCloudComponentPage {

    peopleCloudSingleSelectionChecked = $('mat-radio-button[data-automation-id="app-people-single-mode"][class*="mat-radio-checked"]');
    peopleCloudMultipleSelectionChecked = $('mat-radio-button[data-automation-id="app-people-multiple-mode"][class*="mat-radio-checked"]');
    peopleCloudSingleSelection = $('mat-radio-button[data-automation-id="app-people-single-mode"]');
    peopleCloudMultipleSelection = $('mat-radio-button[data-automation-id="app-people-multiple-mode"]');
    groupCloudSingleSelection = $('mat-radio-button[data-automation-id="app-group-single-mode"]');
    groupCloudMultipleSelection = $('mat-radio-button[data-automation-id="app-group-multiple-mode"]');
    peopleRoleInput = $('input[data-automation-id="app-people-roles-input"]');
    peopleAppInput = $('input[data-automation-id="app-people-app-input"]');
    peoplePreselect = $('input[data-automation-id="app-people-preselect-input"]');
    groupRoleInput = $('input[data-automation-id="app-group-roles-input"]');
    groupAppInput = $('input[data-automation-id="app-group-app-input"]');
    peopleCloudComponentTitle = element(by.cssContainingText('mat-card-title', 'People Cloud Component'));
    groupCloudComponentTitle = element(by.cssContainingText('mat-card-title', 'Groups Cloud Component'));
    preselectValidation = $$('mat-checkbox.app-preselect-value label').first();
    preselectValidationStatus = $$('mat-checkbox.app-preselect-value label input').first();

    async navigateTo() {
        await browser.get('#/cloud/people-group-cloud');
        await browser.waitForAngular();
    }

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

    async enterPeopleRoles(roles: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.peopleRoleInput, roles);
    }

    async enterPeoplePreselect(preselect: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.peoplePreselect, preselect);
    }

    async clearField(locator): Promise<void> {
        await BrowserActions.clearSendKeys(locator, '');
    }

    async clickGroupCloudSingleSelection(): Promise<void> {
        await BrowserActions.click(this.groupCloudSingleSelection);
    }

    async clickGroupCloudMultipleSelection(): Promise<void> {
        await BrowserActions.click(this.groupCloudMultipleSelection);
    }

    async enterGroupRoles(roles): Promise<void> {
        await BrowserActions.clearSendKeys(this.groupRoleInput, roles);
    }

    async clickPreselectValidation(): Promise<void> {
        await BrowserActions.click(this.preselectValidation);
    }

    async getPreselectValidationStatus(): Promise<string> {
        return BrowserActions.getAttribute(this.preselectValidationStatus, 'aria-checked');
    }

    async enterPeopleAppName(appName: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.peopleAppInput, appName);
    }

    async enterGroupAppName(appName: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.groupAppInput, appName);
    }

}
