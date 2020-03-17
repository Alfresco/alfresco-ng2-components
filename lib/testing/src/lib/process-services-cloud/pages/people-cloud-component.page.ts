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

import { by, element, ElementFinder, Locator, protractor } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { FormFields } from '../../core/pages/form/form-fields';

export class PeopleCloudComponentPage {

    peopleCloudSearch: ElementFinder = element(by.css('input[data-automation-id="adf-people-cloud-search-input"]'));
    assigneeField: ElementFinder = element(by.css('input[data-automation-id="adf-people-cloud-search-input"]'));
    formFields: FormFields = new FormFields();
    labelLocator: Locator = by.css("label[class*='adf-label']");
    inputLocator: Locator = by.css('input');
    assigneeChipList: ElementFinder = element(by.css('mat-chip-list[data-automation-id="adf-cloud-people-chip-list"]'));

    async clearAssignee(): Promise<void> {
        await BrowserActions.clearSendKeys(this.peopleCloudSearch, ' ');
        await this.peopleCloudSearch.sendKeys(protractor.Key.BACK_SPACE);
    }

    async clearAssigneeFromChip(username: string): Promise<void> {
        const assigneeChipRemoveIcon = element(by.css(`[data-automation-id="adf-people-cloud-chip-remove-icon-${username}"]`));
        await assigneeChipRemoveIcon.click();
    }

    async searchAssigneeAndSelect(name: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.peopleCloudSearch, name);
        await this.selectAssigneeFromList(name);
    }

    async searchAssignee(name: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.peopleCloudSearch, name);
    }

    async searchAssigneeToExisting(name: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.peopleCloudSearch, name);
    }

    async selectAssigneeFromList(name: string): Promise<void> {
        const assigneeRow = element.all(by.cssContainingText('mat-option span.adf-people-label-name', name)).first();
        await BrowserActions.click(assigneeRow);
        await BrowserVisibility.waitUntilElementIsNotVisible(assigneeRow);
    }

    async getAssignee(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.peopleCloudSearch);
        return this.peopleCloudSearch.getAttribute('value');
    }

    async getChipAssignee(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.assigneeChipList);
        return this.assigneeChipList.all(by.css('mat-chip')).first().getText();
    }

    async checkUserIsDisplayed(name: string): Promise<void> {
        const assigneeRow = element(by.cssContainingText('mat-option span.adf-people-label-name', name));
        await BrowserVisibility.waitUntilElementIsVisible(assigneeRow);
    }

    async checkUserIsNotDisplayed(name: string): Promise<void> {
        const assigneeRow = element(by.cssContainingText('mat-option span.adf-people-label-name', name));
        await BrowserVisibility.waitUntilElementIsNotVisible(assigneeRow);
    }

    async checkOptionIsDisplayed(): Promise <void> {
        const optionList = element(by.css('.adf-people-cloud-list'));
        await BrowserVisibility.waitUntilElementIsVisible(optionList);
    }

    async checkOptionIsNotDisplayed(): Promise <void> {
        const optionList = element(by.css('.adf-people-cloud-list'));
        await BrowserVisibility.waitUntilElementIsNotVisible(optionList);
    }

    async checkSelectedPeople(person: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText('mat-chip-list mat-chip', person)));
    }

    async getAssigneeFieldContent(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.assigneeField);
        return this.assigneeField.getAttribute('value');
    }

    getFieldLabel(fieldId): Promise<string> {
        return this.formFields.getFieldLabel(fieldId, this.labelLocator);
    }

    getFieldValue(fieldId): Promise<string> {
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
        const hiddenElement = element(by.css(`adf-form-field div[id='field-${fieldId}-container'][hidden]`));
        try {
            await BrowserVisibility.waitUntilElementIsNotVisible(hiddenElement);
            return true;
        } catch {
            return false;
        }
    }

    async clickPeopleInput(fieldId): Promise<void> {
        const peopleInput = element.all(by.css(`div[id="field-${fieldId}-container"] `)).first();
        await BrowserActions.click(peopleInput);
    }

    async checkPeopleWidgetIsReadOnly (): Promise <boolean> {
        const readOnlyAttribute = element(by.css('people-cloud-widget .adf-readonly'));
        try {
            await BrowserVisibility.waitUntilElementIsVisible(readOnlyAttribute);
            return true;
        } catch {
            return false;
        }
    }

    async checkPeopleActiveField(name): Promise <boolean> {
        const activePeopleField = element(by.css('people-cloud-widget .adf-readonly'));
        try {
            await BrowserActions.clearSendKeys(activePeopleField, name);
            return true;
        } catch {
            return false;
        }
    }

    async checkNoResultsFoundError(): Promise<void> {
        const errorLocator = element(by.css('[data-automation-id="adf-people-cloud-no-results"]'));
        await BrowserVisibility.waitUntilElementIsVisible(errorLocator);
    }

}
