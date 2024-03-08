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

import { by, element, $, ElementFinder, $$ } from 'protractor';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { FormFields } from '../../core/pages/form/form-fields';
import { TestElement } from '../../core/test-element';

export class GroupCloudComponentPage {
    groupCloudSearch = $('input[data-automation-id="adf-cloud-group-search-input"]');
    groupField = $('group-cloud-widget .adf-readonly');
    formFields = new FormFields();

    getGroupRowLocatorByName = async (name: string): Promise<ElementFinder> => $$(`mat-option[data-automation-id="adf-cloud-group-chip-${name}"]`).first();

    async searchGroups(name: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.groupCloudSearch, name, 100);
    }

    async searchGroupsToExisting(name: string) {
        await BrowserActions.clearSendKeys(this.groupCloudSearch, name, 100);
    }

    async getGroupsFieldContent(): Promise<string> {
        return BrowserActions.getInputValue(this.groupCloudSearch);
    }

    async selectGroupFromList(name: string): Promise<void> {
        const groupRow = await this.getGroupRowLocatorByName(name);

        await BrowserActions.click(groupRow);
        await BrowserVisibility.waitUntilElementIsNotVisible(groupRow);
    }

    async checkGroupIsDisplayed(name: string): Promise<void> {
        const groupRow = await this.getGroupRowLocatorByName(name);
        await BrowserVisibility.waitUntilElementIsVisible(groupRow);
    }

    async checkGroupIsNotDisplayed(name: string): Promise<void> {
        const groupRow = await this.getGroupRowLocatorByName(name);
        await BrowserVisibility.waitUntilElementIsNotVisible(groupRow);
    }

    async checkSelectedGroup(group: string): Promise<boolean> {
        try {
            await TestElement.byText('mat-chip[data-automation-id*="adf-cloud-group-chip-"]', group).waitVisible();
            return true;
        } catch (e) {
            return false;
        };
    }

    async checkGroupNotSelected(group: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.cssContainingText('mat-chip[data-automation-id*="adf-cloud-group-chip-"]', group)));
    }

    async removeSelectedGroup(group: string): Promise<void> {
        const locator = $(`mat-chip[data-automation-id*="adf-cloud-group-chip-${group}"] mat-icon`);
        await BrowserActions.click(locator);
    }

    async isGroupWidgetVisible(fieldId: string): Promise<boolean> {
        try {
            await this.formFields.checkWidgetIsVisible(fieldId);
            return true;
        } catch {
            return false;
        }
    }

    async checkGroupWidgetIsReadOnly(): Promise <boolean> {
        try {
            await BrowserVisibility.waitUntilElementIsVisible(this.groupField);
            return true;
        } catch {
            return false;
        }
    }

    async checkGroupActiveField(name: string): Promise <boolean> {
        try {
            await BrowserActions.clearSendKeys(this.groupField, name);
            return true;
        } catch {
            return false;
        }
    }

    async checkNoResultsFoundError(): Promise<void> {
        const errorLocator = $('[data-automation-id="adf-cloud-group-no-results"]');
        await BrowserVisibility.waitUntilElementIsVisible(errorLocator);
    }
}
