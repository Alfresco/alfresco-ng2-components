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

import { TasksListPage } from '../../process-services/tasksListPage';
import { PaginationPage } from '@alfresco/adf-testing';
import { element, by, ElementFinder } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class TaskListDemoPage {

    taskListPage: TasksListPage = new TasksListPage();
    appId: ElementFinder = element(by.css("input[data-automation-id='appId input']"));
    itemsPerPage: ElementFinder = element(by.css("input[data-automation-id='items per page']"));
    itemsPerPageForm: ElementFinder = element(by.css("mat-form-field[data-automation-id='items per page']"));
    processDefinitionId: ElementFinder = element(by.css("input[data-automation-id='process definition id']"));
    processInstanceId: ElementFinder = element(by.css("input[data-automation-id='process instance id']"));
    page: ElementFinder = element(by.css("input[data-automation-id='page']"));
    pageForm: ElementFinder = element(by.css("mat-form-field[data-automation-id='page']"));
    taskName: ElementFinder = element(by.css("input[data-automation-id='task name']"));
    resetButton: ElementFinder = element(by.css("div[class='adf-reset-button'] button"));
    dueBefore: ElementFinder = element(by.css("input[data-automation-id='due before']"));
    dueAfter: ElementFinder = element(by.css("input[data-automation-id='due after']"));
    taskId: ElementFinder = element(by.css("input[data-automation-id='task id']"));
    stateDropDownArrow: ElementFinder = element(by.css("mat-form-field[data-automation-id='state'] div[class*='arrow']"));
    stateSelector: ElementFinder = element(by.css("div[class*='mat-select-panel']"));

    taskList(): TasksListPage {
        return this.taskListPage;
    }

    paginationPage(): PaginationPage {
        return new PaginationPage();
    }

    async typeAppId(input): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.appId);
        await BrowserActions.clearSendKeys(this.appId, input);
    }

    async clickAppId(): Promise<void> {
        await BrowserActions.click(this.appId);
    }

    async getAppId(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.appId);
        return this.appId.getAttribute('value');
    }

    async typeTaskId(input): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.taskId);
        await BrowserActions.clearSendKeys(this.taskId, input);
    }

    async getTaskId(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.taskId);
        return this.taskId.getAttribute('value');
    }

    async typeTaskName(input): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.taskName);
        await BrowserActions.clearSendKeys(this.taskName, input);
    }

    async getTaskName(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.taskName);
        return this.taskName.getAttribute('value');
    }

    async typeItemsPerPage(input): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.itemsPerPage);
        await BrowserActions.clearSendKeys(this.itemsPerPage, input);
    }

    async typeProcessDefinitionId(input): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.processDefinitionId);
        await BrowserActions.clearSendKeys(this.processDefinitionId, input);
    }

    async getProcessDefinitionId(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.processInstanceId);
        return this.processInstanceId.getAttribute('value');
    }

    async typeProcessInstanceId(input): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.processInstanceId);
        await BrowserActions.clearSendKeys(this.processInstanceId, input);
    }

    async getProcessInstanceId(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.processInstanceId);
        return this.processInstanceId.getAttribute('value');
    }

    async getItemsPerPageFieldErrorMessage(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.itemsPerPageForm);
        const errorMessage = this.itemsPerPageForm.element(by.css('mat-error'));
        return BrowserActions.getText(errorMessage);
    }

    async typePage(input): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.page);
        await BrowserActions.clearSendKeys(this.page, input);
    }

    async getPage(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.page);
        return this.page.getAttribute('value');
    }

    async getPageFieldErrorMessage(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.pageForm);
        const errorMessage = this.pageForm.element(by.css('mat-error'));
        return BrowserActions.getText(errorMessage);
    }

    async typeDueAfter(input): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dueAfter);
        await BrowserActions.clearSendKeys(this.dueAfter, input);
    }

    async typeDueBefore(input): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.dueBefore);
        await BrowserActions.clearSendKeys(this.dueBefore, input);
    }

    async clearText(input): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(input);
        await input.clear();
    }

    async clickResetButton(): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        await BrowserActions.click(this.resetButton);
    }

    async selectState(state): Promise<void> {
        await this.clickOnStateDropDownArrow();

        const stateElement: ElementFinder = element.all(by.cssContainingText('mat-option span', state)).first();
        await BrowserActions.click(stateElement);
    }

    async clickOnStateDropDownArrow(): Promise<void> {
        await BrowserActions.click(this.stateDropDownArrow);
        await BrowserVisibility.waitUntilElementIsVisible(this.stateSelector);
    }

    getAllProcessDefinitionIds(): Promise<any> {
        return this.taskList().getDataTable().getAllRowsColumnValues('Process Definition Id');
    }

    getAllProcessInstanceIds(): Promise<any> {
        return this.taskList().getDataTable().getAllRowsColumnValues('Process Instance Id');
    }

}
