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

import { BrowserActions, BrowserVisibility, DropdownPage, PaginationPage } from '@alfresco/adf-testing';
import { by, element } from 'protractor';
import { TasksListPage } from '../../process-services/tasks-list.page';

export class TaskListDemoPage {

    taskListPage = new TasksListPage();
    appId = element(by.css("input[data-automation-id='appId input']"));
    itemsPerPage = element(by.css("input[data-automation-id='items per page']"));
    itemsPerPageForm = element(by.css("mat-form-field[data-automation-id='items per page']"));
    processDefinitionId = element(by.css("input[data-automation-id='process definition id']"));
    processInstanceId = element(by.css("input[data-automation-id='process instance id']"));
    page = element(by.css("input[data-automation-id='page']"));
    pageForm = element(by.css("mat-form-field[data-automation-id='page']"));
    taskName = element(by.css("input[data-automation-id='task name']"));
    resetButton = element(by.css('.app-reset-button button'));
    dueBefore = element(by.css("input[data-automation-id='due before']"));
    dueAfter = element(by.css("input[data-automation-id='due after']"));
    taskId = element(by.css("input[data-automation-id='task id']"));

    stateDropDownArrow = element(by.css("mat-form-field[data-automation-id='state']"));
    stateDropdown = new DropdownPage(this.stateDropDownArrow);

    taskList(): TasksListPage {
        return this.taskListPage;
    }

    paginationPage(): PaginationPage {
        return new PaginationPage();
    }

    async typeAppId(input: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.appId, input);
    }

    async clickAppId(): Promise<void> {
        await BrowserActions.click(this.appId);
    }

    async getAppId(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.appId);
        return this.appId.getAttribute('value');
    }

    async typeTaskId(input: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.taskId, input);
    }

    async getTaskId(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.taskId);
        return this.taskId.getAttribute('value');
    }

    async typeTaskName(input: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.taskName, input);
    }

    async getTaskName(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.taskName);
        return this.taskName.getAttribute('value');
    }

    async typeItemsPerPage(input: number): Promise<void> {
        await BrowserActions.clearSendKeys(this.itemsPerPage, input.toString());
    }

    async typeProcessDefinitionId(input: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.processDefinitionId, input);
    }

    async getProcessDefinitionId(): Promise<string> {
        await BrowserVisibility.waitUntilElementIsVisible(this.processInstanceId);
        return this.processInstanceId.getAttribute('value');
    }

    async typeProcessInstanceId(input: string): Promise<void> {
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

    async typePage(input: number): Promise<void> {
        await BrowserActions.clearSendKeys(this.page, input.toString());
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

    async typeDueAfter(input: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.dueAfter, input);
    }

    async typeDueBefore(input: string): Promise<void> {
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

    async selectState(state: string): Promise<void> {
        await this.stateDropdown.selectDropdownOption(state);
    }

    getAllProcessDefinitionIds(): Promise<any> {
        return this.taskList().getDataTable().getAllRowsColumnValues('Process Definition Id');
    }

    getAllProcessInstanceIds(): Promise<any> {
        return this.taskList().getDataTable().getAllRowsColumnValues('Process Instance Id');
    }

}
