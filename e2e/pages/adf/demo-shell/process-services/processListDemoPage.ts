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

import { BrowserVisibility } from '@alfresco/adf-testing';
import { DataTableComponentPage, BrowserActions } from '@alfresco/adf-testing';
import { element, by, protractor } from 'protractor';

export class ProcessListDemoPage {

    appIdInput = element(by.css('input[data-automation-id="app-id"]'));
    resetButton = element(by.cssContainingText('button span', 'Reset'));
    emptyProcessContent = element(by.css('div[class="adf-empty-content"]'));
    processDefinitionInput = element(by.css('input[data-automation-id="process-definition-id"]'));
    processInstanceInput = element(by.css('input[data-automation-id="process-instance-id"]'));
    stateSelector = element(by.css('mat-select[data-automation-id="state"'));
    sortSelector = element(by.css('mat-select[data-automation-id="sort"'));

    dataTable = new DataTableComponentPage();

    getDisplayedProcessesNames() {
        return this.dataTable.getAllRowsColumnValues('Name');
    }

    selectSorting(sort) {
        BrowserActions.click(this.sortSelector);
        const sortLocator = element(by.cssContainingText('mat-option span', sort));
        BrowserActions.click(sortLocator);
        return this;
    }

    selectStateFilter(state) {
        BrowserActions.click(this.stateSelector);
        const stateLocator = element(by.cssContainingText('mat-option span', state));
        BrowserActions.click(stateLocator);
        return this;
    }

    addAppId(appId) {
        BrowserActions.click(this.appIdInput);
        this.appIdInput.sendKeys(protractor.Key.ENTER);
        this.appIdInput.clear();
        return this.appIdInput.sendKeys(appId);
    }

    clickResetButton() {
        return BrowserActions.click(this.resetButton);

    }

    checkErrorMessageIsDisplayed(error) {
        const errorMessage = element(by.cssContainingText('mat-error', error));
        BrowserVisibility.waitUntilElementIsVisible(errorMessage);
    }

    checkNoProcessFoundIsDisplayed() {
        return BrowserVisibility.waitUntilElementIsVisible(this.emptyProcessContent);
    }

    checkProcessIsNotDisplayed(processName) {
        return this.dataTable.checkContentIsNotDisplayed('Name', processName);
    }

    checkProcessIsDisplayed(processName) {
        return this.dataTable.checkContentIsDisplayed('Name', processName);
    }

    checkAppIdFieldIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.appIdInput);
        return this;
    }

    checkProcessInstanceIdFieldIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.processInstanceInput);
        return this;
    }

    checkStateFieldIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.stateSelector);
        return this;
    }

    checkSortFieldIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.sortSelector);
        return this;
    }

    addProcessDefinitionId(procDefinitionId) {
        BrowserActions.click(this.processDefinitionInput);
        this.processDefinitionInput.clear();
        return this.processDefinitionInput.sendKeys(procDefinitionId);
    }

    addProcessInstanceId(procInstanceId) {
        BrowserActions.click(this.processInstanceInput);
        this.processInstanceInput.clear();
        return this.processInstanceInput.sendKeys(procInstanceId);
    }
}
