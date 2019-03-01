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

import { Util } from '../../../../util/util';
import { DataTableComponentPage } from '../../dataTableComponentPage';
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
        Util.waitUntilElementIsVisible(this.stateSelector);
        this.sortSelector.click();
        let sortLocator = element(by.cssContainingText('mat-option span', sort));
        Util.waitUntilElementIsVisible(sortLocator);
        sortLocator.click();
        return this;
    }

    selectStateFilter(state) {
        Util.waitUntilElementIsVisible(this.stateSelector);
        this.stateSelector.click();
        let stateLocator = element(by.cssContainingText('mat-option span', state));
        Util.waitUntilElementIsVisible(stateLocator);
        stateLocator.click();
        return this;
    }

    addAppId(appId) {
        Util.waitUntilElementIsVisible(this.appIdInput);
        this.appIdInput.click();
        this.appIdInput.sendKeys(protractor.Key.ENTER);
        this.appIdInput.clear();
        return this.appIdInput.sendKeys(appId);
    }

    clickResetButton() {
        Util.waitUntilElementIsVisible(this.resetButton);
        return this.resetButton.click();
    }

    checkErrorMessageIsDisplayed(error) {
        let errorMessage = element(by.cssContainingText('mat-error', error));
        Util.waitUntilElementIsVisible(errorMessage);
    }

    checkNoProcessFoundIsDisplayed() {
        return Util.waitUntilElementIsVisible(this.emptyProcessContent);
    }

    checkProcessIsNotDisplayed(processName) {
        return this.dataTable.checkContentIsNotDisplayed('Name', processName);
    }

    checkProcessIsDisplayed(processName) {
        return this.dataTable.checkContentIsDisplayed('Name', processName);
    }

    checkAppIdFieldIsDisplayed() {
        Util.waitUntilElementIsVisible(this.appIdInput);
        return this;
    }

    checkProcessInstanceIdFieldIsDisplayed() {
        Util.waitUntilElementIsVisible(this.processInstanceInput);
        return this;
    }

    checkStateFieldIsDisplayed() {
        Util.waitUntilElementIsVisible(this.stateSelector);
        return this;
    }

    checkSortFieldIsDisplayed() {
        Util.waitUntilElementIsVisible(this.sortSelector);
        return this;
    }

    addProcessDefinitionId(procDefinitionId) {
        Util.waitUntilElementIsVisible(this.processDefinitionInput);
        this.processDefinitionInput.click();
        this.processDefinitionInput.clear();
        return this.processDefinitionInput.sendKeys(procDefinitionId);
    }

    addProcessInstanceId(procInstanceId) {
        Util.waitUntilElementIsVisible(this.processInstanceInput);
        this.processInstanceInput.click();
        this.processInstanceInput.clear();
        return this.processInstanceInput.sendKeys(procInstanceId);
    }
}
