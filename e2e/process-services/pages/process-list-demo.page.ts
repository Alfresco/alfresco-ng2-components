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

import { BrowserActions, BrowserVisibility, DataTableComponentPage, DropdownPage } from '@alfresco/adf-testing';
import { $, by, element, protractor } from 'protractor';

export class ProcessListDemoPage {

    appIdInput = $('input[data-automation-id="app-id"]');
    resetButton = element(by.cssContainingText('button span', 'Reset'));
    emptyProcessContent = $('.adf-empty-content');
    processDefinitionInput = $('input[data-automation-id="process-definition-id"]');
    processInstanceInput = $('input[data-automation-id="process-instance-id"]');

    stateDropdown = new DropdownPage($('mat-select[data-automation-id="state"'));
    sortDropdown = new DropdownPage($('mat-select[data-automation-id="sort"'));

    dataTable = new DataTableComponentPage();

    getDisplayedProcessesNames(): Promise<any> {
        return this.dataTable.getAllRowsColumnValues('Name');
    }

    async selectSorting(sortingOption: string): Promise<void> {
        await this.sortDropdown.selectDropdownOption(sortingOption);
    }

    async selectStateFilter(stateOption: string): Promise<void> {
        await this.stateDropdown.selectDropdownOption(stateOption);
    }

    async addAppId(appId: string): Promise<void> {
        await BrowserActions.click(this.appIdInput);
        await this.appIdInput.sendKeys(protractor.Key.ENTER);
        await this.appIdInput.clear();
        await this.appIdInput.sendKeys(appId);
    }

    async clickResetButton(): Promise<void> {
        await BrowserActions.click(this.resetButton);
    }

    async checkErrorMessageIsDisplayed(error: string): Promise<void> {
        const errorMessage = element(by.cssContainingText('mat-error', error));
        await BrowserVisibility.waitUntilElementIsVisible(errorMessage);
    }

    async checkNoProcessFoundIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.emptyProcessContent);
    }

    async checkProcessIsNotDisplayed(processName: string): Promise<void> {
        await this.dataTable.checkContentIsNotDisplayed('Name', processName);
    }

    async checkProcessIsDisplayed(processName: string): Promise<void> {
        await this.dataTable.checkContentIsDisplayed('Name', processName);
    }

    async checkAppIdFieldIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.appIdInput);
    }

    async checkProcessInstanceIdFieldIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.processInstanceInput);
    }

    async checkStateDropdownIsDisplayed(): Promise<void> {
        await this.stateDropdown.checkDropdownIsVisible();
    }

    async checkSortDropdownIsDisplayed(): Promise<void> {
        await this.sortDropdown.checkDropdownIsVisible();
    }

    async addProcessDefinitionId(procDefinitionId: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.processDefinitionInput, procDefinitionId);
    }

    async addProcessInstanceId(procInstanceId: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.processInstanceInput, procInstanceId);
    }
}
