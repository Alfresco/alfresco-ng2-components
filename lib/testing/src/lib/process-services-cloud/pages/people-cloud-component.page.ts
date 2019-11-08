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

import { browser, by, element, ElementFinder, protractor } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';

export class PeopleCloudComponentPage {

    peopleCloudSearch: ElementFinder = element(by.css('input[data-automation-id="adf-people-cloud-search-input"]'));
    assigneeField: ElementFinder = element(by.css('input[data-automation-id="adf-people-cloud-search-input"]'));

    async clearAssignee(): Promise<void> {
        await BrowserActions.clearSendKeys(this.peopleCloudSearch, ' ');
        await this.peopleCloudSearch.sendKeys(protractor.Key.BACK_SPACE);
    }

    async searchAssigneeAndSelect(name: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.peopleCloudSearch);
        await BrowserActions.clearSendKeys(this.peopleCloudSearch, name);
        await this.selectAssigneeFromList(name);
    }

    async searchAssignee(name: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.peopleCloudSearch);
        await BrowserVisibility.waitUntilElementIsClickable(this.peopleCloudSearch);
        await browser.sleep(1000);
        await BrowserActions.clearSendKeys(this.peopleCloudSearch, name);
    }

    async searchAssigneeToExisting(name: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.peopleCloudSearch);
        await BrowserActions.clearSendKeys(this.peopleCloudSearch, name);
    }

    async selectAssigneeFromList(name: string): Promise<void> {
        const assigneeRow = element(by.cssContainingText('mat-option span.adf-people-label-name', name));
        await browser.sleep(2000);
        await BrowserActions.click(assigneeRow);
        await BrowserVisibility.waitUntilElementIsNotVisible(assigneeRow);
    }

    async getAssignee(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.peopleCloudSearch);
        return this.peopleCloudSearch.getAttribute('value');
    }

    async checkUserIsDisplayed(name: string): Promise<void> {
        const assigneeRow = element(by.cssContainingText('mat-option span.adf-people-label-name', name));
        await BrowserVisibility.waitUntilElementIsVisible(assigneeRow);
    }

    async checkUserIsNotDisplayed(name: string): Promise<void> {
        const assigneeRow = element(by.cssContainingText('mat-option span.adf-people-label-name', name));
        await BrowserVisibility.waitUntilElementIsNotVisible(assigneeRow);
    }

    async checkSelectedPeople(person: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText('mat-chip-list mat-chip', person)));
    }

    async getAssigneeFieldContent(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.assigneeField);
        await browser.sleep(1000);
        return this.assigneeField.getAttribute('value');

    }

}
