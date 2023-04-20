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

import { Locator, by, element, protractor, $, $$, ElementFinder } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { FormFields } from '../../core/pages/form/form-fields';
import { TestElement } from '../../core/test-element';

export class PeopleCloudComponentPage {
    peopleCloudSearch = $('input[data-automation-id="adf-people-cloud-search-input"]');
    assigneeField = $('input[data-automation-id="adf-people-cloud-search-input"]');
    selectionReady = $('div[data-automation-id="adf-people-cloud-row"]');
    formFields = new FormFields();
    labelLocator: Locator = by.css(`label[class*='adf-label']`);
    inputLocator: Locator = by.css('input');
    assigneeChipList = $('mat-chip-list[data-automation-id="adf-cloud-people-chip-list"]');
    noOfUsersDisplayed = $$('mat-option span.adf-people-label-name');

    getAssigneeRowLocatorByContainingName = async (name: string): Promise<ElementFinder> => element.all(by.cssContainingText('mat-option span.adf-people-label-name', name)).first();

    async clearAssignee(): Promise<void> {
        await BrowserActions.clearSendKeys(this.peopleCloudSearch, ' ');
        await this.peopleCloudSearch.sendKeys(protractor.Key.BACK_SPACE);
    }

    async clearAssigneeFromChip(username: string): Promise<void> {
        const assigneeChipRemoveIcon = TestElement.byCss(`[data-automation-id="adf-people-cloud-chip-remove-icon-${username}"]`);
        await assigneeChipRemoveIcon.click();
    }

    async searchAssigneeAndSelect(name: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.peopleCloudSearch, name, 100);
        await this.selectAssigneeFromList(name);
    }

    async searchAssignee(name: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.peopleCloudSearch, name, 100);
    }

    async selectAssigneeFromList(name: string): Promise<void> {
        const assigneeRow = await this.getAssigneeRowLocatorByContainingName(name);
        await BrowserActions.click(assigneeRow);
        await BrowserVisibility.waitUntilElementIsNotVisible(assigneeRow);
    }

    async getAssignee(): Promise<string> {
        return BrowserActions.getInputValue(this.peopleCloudSearch);
    }

    async getChipAssignee(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.assigneeChipList);
        return this.assigneeChipList.all(by.css('mat-chip')).first().getText();
    }

    async getChipAssigneeCount(): Promise<number> {
        await BrowserVisibility.waitUntilElementIsVisible(this.assigneeChipList);
        return this.assigneeChipList.all(by.css('mat-chip')).count();
    }

    async checkUserIsDisplayed(name: string): Promise<boolean> {
        try {
            const assigneeRow = await this.getAssigneeRowLocatorByContainingName(name);
            await BrowserVisibility.waitUntilElementIsVisible(assigneeRow);
            return true;
        } catch {
            return false;
        }
    }

    async checkUserIsNotDisplayed(name: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.selectionReady);
        const assigneeRow = await this.getAssigneeRowLocatorByContainingName(name);
        await BrowserVisibility.waitUntilElementIsNotVisible(assigneeRow);
    }

    async getUsersDisplayedCount(): Promise<number> {
        return this.noOfUsersDisplayed.count();
    }

    async checkOptionIsDisplayed(): Promise<void> {
        const optionList = $('.adf-people-cloud-list');
        await BrowserVisibility.waitUntilElementIsVisible(optionList);
    }

    async checkOptionIsNotDisplayed(): Promise<void> {
        const optionList = $('.adf-people-cloud-list');
        await BrowserVisibility.waitUntilElementIsNotVisible(optionList);
    }

    async checkSelectedPeople(person: string): Promise<boolean> {
        try {
        	await BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText('mat-chip-list mat-chip', person)));
            return true;
        } catch (e) {
            return false;
        }
    }

    async getAssigneeFieldContent(): Promise<string> {
        return BrowserActions.getInputValue(this.assigneeField);
    }

    getFieldLabel(fieldId: string): Promise<string> {
        return this.formFields.getFieldLabel(fieldId, this.labelLocator);
    }

    getFieldValue(fieldId: string): Promise<string> {
        return this.formFields.getFieldValue(fieldId, this.inputLocator);
    }

    async isPeopleWidgetVisible(fieldId: string): Promise<boolean> {
        try {
            await this.formFields.checkWidgetIsVisible(fieldId);
            return true;
        } catch {
            return false;
        }
    }

    async checkPeopleWidgetIsHidden(fieldId: string): Promise<boolean> {
        const hiddenElement = $(`adf-form-field div[id='field-${fieldId}-container'][hidden]`);
        try {
            await BrowserVisibility.waitUntilElementIsNotVisible(hiddenElement);
            return true;
        } catch {
            return false;
        }
    }

    async clickPeopleInput(fieldId: string): Promise<void> {
        const peopleInput = element.all(by.css(`div[id="field-${fieldId}-container"] `)).first();
        await BrowserActions.click(peopleInput);
    }

    async checkPeopleWidgetIsReadOnly(): Promise<boolean> {
        const readOnlyAttribute = $('people-cloud-widget .adf-readonly');
        try {
            await BrowserVisibility.waitUntilElementIsVisible(readOnlyAttribute);
            return true;
        } catch {
            return false;
        }
    }

    async checkPeopleActiveField(name: string): Promise<boolean> {
        const activePeopleField = $('people-cloud-widget .adf-readonly');
        try {
            await BrowserActions.clearSendKeys(activePeopleField, name);
            return true;
        } catch {
            return false;
        }
    }

    async checkNoResultsFoundError(): Promise<boolean> {
        try {
            await TestElement.byCss('[data-automation-id="adf-people-cloud-no-results"]').waitVisible();
            return true;
        } catch (e) {
            return false;
        }
    }

}
