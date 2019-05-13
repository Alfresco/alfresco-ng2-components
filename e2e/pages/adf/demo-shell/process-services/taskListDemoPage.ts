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
import { element, by } from 'protractor';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

export class TaskListDemoPage {

    taskListPage: TasksListPage = new TasksListPage();
    appId = element(by.css("input[data-automation-id='appId input']"));
    itemsPerPage = element(by.css("input[data-automation-id='items per page']"));
    itemsPerPageForm = element(by.css("mat-form-field[data-automation-id='items per page']"));
    processDefinitionId = element(by.css("input[data-automation-id='process definition id']"));
    processInstanceId = element(by.css("input[data-automation-id='process instance id']"));
    page = element(by.css("input[data-automation-id='page']"));
    pageForm = element(by.css("mat-form-field[data-automation-id='page']"));
    taskName = element(by.css("input[data-automation-id='task name']"));
    resetButton = element(by.css("div[class='adf-reset-button'] button"));
    dueBefore = element(by.css("input[data-automation-id='due before']"));
    dueAfter = element(by.css("input[data-automation-id='due after']"));
    taskId = element(by.css("input[data-automation-id='task id']"));
    stateDropDownArrow = element(by.css("mat-form-field[data-automation-id='state'] div[class*='arrow']"));
    stateSelector = element(by.css("div[class*='mat-select-panel']"));
    sortDropDownArrow = element(by.css("mat-form-field[data-automation-id='sort'] div[class*='arrow']"));
    sortSelector = element(by.css("div[class*='mat-select-panel']"));

    taskList(): TasksListPage {
        return this.taskListPage;
    }

    paginationPage() {
        return new PaginationPage();
    }

    typeAppId(input) {
        BrowserVisibility.waitUntilElementIsVisible(this.appId);
        this.clearText(this.appId);
        this.appId.sendKeys(input);
        return this;
    }

    clickAppId() {
        BrowserActions.click(this.appId);
        return this;
    }

    getAppId() {
        BrowserVisibility.waitUntilElementIsVisible(this.appId);
        return this.appId.getAttribute('value');
    }

    typeTaskId(input) {
        BrowserVisibility.waitUntilElementIsVisible(this.taskId);
        this.clearText(this.taskId);
        this.taskId.sendKeys(input);
        return this;
    }

    getTaskId() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskId);
        return this.taskId.getAttribute('value');
    }

    typeTaskName(input) {
        BrowserVisibility.waitUntilElementIsVisible(this.taskName);
        this.clearText(this.taskName);
        this.taskName.sendKeys(input);
        return this;
    }

    getTaskName() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskName);
        return this.taskName.getAttribute('value');
    }

    typeItemsPerPage(input) {
        BrowserVisibility.waitUntilElementIsVisible(this.itemsPerPage);
        this.clearText(this.itemsPerPage);
        this.itemsPerPage.sendKeys(input);
        return this;
    }

    typeProcessDefinitionId(input) {
        BrowserVisibility.waitUntilElementIsVisible(this.processDefinitionId);
        this.clearText(this.processDefinitionId);
        this.processDefinitionId.sendKeys(input);
        return this;
    }

    getProcessDefinitionId() {
        BrowserVisibility.waitUntilElementIsVisible(this.processInstanceId);
        return this.processInstanceId.getAttribute('value');
    }

    typeProcessInstanceId(input) {
        BrowserVisibility.waitUntilElementIsVisible(this.processInstanceId);
        this.clearText(this.processInstanceId);
        this.processInstanceId.sendKeys(input);
        return this;
    }

    getProcessInstanceId() {
        BrowserVisibility.waitUntilElementIsVisible(this.processInstanceId);
        return this.processInstanceId.getAttribute('value');
    }

    getItemsPerPageFieldErrorMessage() {
        BrowserVisibility.waitUntilElementIsVisible(this.itemsPerPageForm);
        const errorMessage = this.itemsPerPageForm.element(by.css('mat-error'));
        return BrowserActions.getText(errorMessage);
    }

    typePage(input) {
        BrowserVisibility.waitUntilElementIsVisible(this.page);
        this.clearText(this.page);
        this.page.sendKeys(input);
        return this;
    }

    getPage() {
        BrowserVisibility.waitUntilElementIsVisible(this.page);
        return this.page.getAttribute('value');
    }

    getPageFieldErrorMessage() {
        BrowserVisibility.waitUntilElementIsVisible(this.pageForm);
        const errorMessage = this.pageForm.element(by.css('mat-error'));
        return BrowserActions.getText(errorMessage);
    }

    typeDueAfter(input) {
        BrowserVisibility.waitUntilElementIsVisible(this.dueAfter);
        this.clearText(this.dueAfter);
        this.dueAfter.sendKeys(input);
        return this;
    }

    typeDueBefore(input) {
        BrowserVisibility.waitUntilElementIsVisible(this.dueBefore);
        this.clearText(this.dueBefore);
        this.dueBefore.sendKeys(input);
        return this;
    }

    clearText(input) {
        BrowserVisibility.waitUntilElementIsVisible(input);
        return input.clear();
    }

    clickResetButton() {
        BrowserActions.click(this.resetButton);
    }

    selectSort(sort) {
        this.clickOnSortDropDownArrow();

        const sortElement = element.all(by.cssContainingText('mat-option span', sort)).first();
        BrowserActions.click(sortElement);
        return this;
    }

    clickOnSortDropDownArrow() {
        BrowserActions.click(this.sortDropDownArrow);
        BrowserVisibility.waitUntilElementIsVisible(this.sortSelector);
    }

    selectState(state) {
        this.clickOnStateDropDownArrow();

        const stateElement = element.all(by.cssContainingText('mat-option span', state)).first();
        BrowserActions.click(stateElement);
        return this;
    }

    clickOnStateDropDownArrow() {
        BrowserActions.click(this.stateDropDownArrow);
        BrowserVisibility.waitUntilElementIsVisible(this.stateSelector);
    }

    getAllProcessDefinitionIds() {
        return this.taskList().getDataTable().getAllRowsColumnValues('Process Definition Id');
    }

    getAllProcessInstanceIds() {
        return this.taskList().getDataTable().getAllRowsColumnValues('Process Instance Id');
    }

}
