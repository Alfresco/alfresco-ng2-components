/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { Util } from '../../../util/util';
import { DataTable } from '../dataTablePage';
import { element, by, browser, protractor } from 'protractor';

export class TaskListSinglePage {

    appId = element(by.css("input[data-automation-id='appId input']"));
    itemsPerPage = element(by.css("input[data-automation-id='items per page']"));
    itemsPerPageForm = element(by.css("mat-form-field[data-automation-id='items per page']"));
    processDefinitionId = element(by.css("input[data-automation-id='process definition id']"));
    processInstanceId = element(by.css("input[data-automation-id='process instance id']"));
    page = element(by.css("input[data-automation-id='page']"));
    pageForm = element(by.css("mat-form-field[data-automation-id='page']"));
    taskName = element(by.css("input[data-automation-id='task name']"));
    noTasksFound = element(by.css("p[class='adf-empty-content__title']"));
    resetButton = element(by.css("div[class='adf-reset-button'] button"));
    emptyPagination = element(by.css("adf-pagination[class*='adf-pagination__empty']"));
    dueBefore = element(by.css("input[data-automation-id='due before']"));
    dueAfter = element(by.css("input[data-automation-id='due after']"));
    taskId = element(by.css("input[data-automation-id='task id']"));
    stateDropDownArrow = element(by.css("mat-form-field[data-automation-id='state'] div[class*='arrow']"));
    stateSelector = element(by.css("div[class*='mat-select-content']"));
    sortDropDownArrow = element(by.css("mat-form-field[data-automation-id='sort'] div[class*='arrow']"));
    sortSelector = element(by.css("div[class*='mat-select-content']"));
    processDefinitionIdColumn = by.css("adf-datatable div[class*='adf-datatable-body'] div[class*='adf-datatable-row'] div[title='Process Definition Id'] span");
    processInstanceIdColumn = by.css("adf-datatable div[class*='adf-datatable-body'] div[class*='adf-datatable-row'] div[title='Process Instance Id'] span");

    typeAppId(input) {
        Util.waitUntilElementIsVisible(this.appId);
        this.clearText(this.appId);
        this.appId.sendKeys(input);
        return this;
    }

    clickAppId() {
        Util.waitUntilElementIsVisible(this.appId);
        this.appId.click();
        return this;
    }

    getAppId() {
        Util.waitUntilElementIsVisible(this.appId);
        return this.appId.getAttribute('value');
    }

    typeTaskId(input) {
        Util.waitUntilElementIsVisible(this.taskId);
        this.clearText(this.taskId);
        this.taskId.sendKeys(input);
        return this;
    }

    getTaskId() {
        Util.waitUntilElementIsVisible(this.taskId);
        return this.taskId.getAttribute('value');
    };

    typeTaskName(input) {
        Util.waitUntilElementIsVisible(this.taskName);
        this.clearText(this.taskName);
        this.taskName.sendKeys(input);
        return this;
    };

    getTaskName() {
        Util.waitUntilElementIsVisible(this.taskName);
        return this.taskName.getAttribute('value');
    }

    typeItemsPerPage(input) {
        Util.waitUntilElementIsVisible(this.itemsPerPage);
        this.clearText(this.itemsPerPage);
        this.itemsPerPage.sendKeys(input);
        return this;
    }

    getItemsPerPage() {
        Util.waitUntilElementIsVisible(this.itemsPerPage);
        return this.itemsPerPage.getAttribute('value');
    }

    typeProcessDefinitionId(input) {
        Util.waitUntilElementIsVisible(this.processDefinitionId);
        this.clearText(this.processDefinitionId);
        this.processDefinitionId.sendKeys(input);
        return this;
    }

    getProcessDefinitionId() {
        Util.waitUntilElementIsVisible(this.processInstanceId);
        return this.processInstanceId.getAttribute('value');
    }

    typeProcessInstanceId(input) {
        Util.waitUntilElementIsVisible(this.processInstanceId);
        this.clearText(this.processInstanceId);
        this.processInstanceId.sendKeys(input);
        return this;
    }

    getProcessInstanceId() {
        Util.waitUntilElementIsVisible(this.processInstanceId);
        return this.processInstanceId.getAttribute('value');
    }

    getItemsPerPageFieldErrorMessage() {
        Util.waitUntilElementIsVisible(this.itemsPerPageForm);
        var errorMessage = this.itemsPerPageForm.element(by.css("mat-error"));
        Util.waitUntilElementIsVisible(errorMessage);
        return errorMessage.getText();
    }

    typePage = function(input) {
        Util.waitUntilElementIsVisible(this.page);
        this.clearText(this.page);
        this.page.sendKeys(input);
        return this;
    }

    getPage() {
        Util.waitUntilElementIsVisible(this.page);
        return this.page.getAttribute('value');
    }

    getPageFieldErrorMessage() {
        Util.waitUntilElementIsVisible(this.pageForm);
        var errorMessage = this.pageForm.element(by.css("mat-error"));
        Util.waitUntilElementIsVisible(errorMessage);
        return errorMessage.getText();
    }

    typeDueAfter(input) {
        Util.waitUntilElementIsVisible(this.dueAfter);
        this.clearText(this.dueAfter);
        this.dueAfter.sendKeys(input);
        return this;
    }

    getDueAfter() {
        Util.waitUntilElementIsVisible(this.dueAfter);
        return this.dueAfter.getAttribute('value');
    };

    typeDueBefore(input) {
        Util.waitUntilElementIsVisible(this.dueBefore);
        this.clearText(this.dueBefore);
        this.dueBefore.sendKeys(input);
        return this;
    }

    getDueBefore() {
        Util.waitUntilElementIsVisible(this.dueBefore);
        return this.dueBefore.getAttribute('value');
    }

    clearText(input) { 
        Util.waitUntilElementIsVisible(input);
        return input.clear(); 
    }

    usingDataTable() {
        return new DataTable();
    }

    getNoTasksFoundMessage() {
        Util.waitUntilElementIsVisible(this.noTasksFound);
        return this.noTasksFound.getText();
    }

    clickResetButton() {
        Util.waitUntilElementIsVisible(this.resetButton);
        this.resetButton.click();
    }

    checkPaginationIsNotDisplayed() {
        Util.waitUntilElementIsVisible(this.emptyPagination);
    }

    clickOnStateDropDownArrow() {
        Util.waitUntilElementIsVisible(this.stateDropDownArrow);
        this.stateDropDownArrow.click();
        Util.waitUntilElementIsVisible(this.stateSelector);
    }

    selectState(state) {
        this.clickOnStateDropDownArrow();

        var stateElement = element.all(by.cssContainingText("mat-option span", state)).first();
        Util.waitUntilElementIsClickable(stateElement);
        Util.waitUntilElementIsVisible(stateElement);
        stateElement.click();
        return this;
    }

    clickOnSortDropDownArrow() {
        Util.waitUntilElementIsVisible(this.sortDropDownArrow);
        this.sortDropDownArrow.click();
        Util.waitUntilElementIsVisible(this.sortSelector);
    }

    selectSort(sort) {
        this.clickOnSortDropDownArrow();

        var sortElement = element.all(by.cssContainingText("mat-option span", sort)).first();
        Util.waitUntilElementIsClickable(sortElement);
        Util.waitUntilElementIsVisible(sortElement);
        sortElement.click();
        return this;
    }

    getAllProcessDefinitionIds() {
        return new DataTable().getAllRowsColumnValues(this.processDefinitionIdColumn);
    }

    getAllProcessInstanceIds() {
        return new DataTable().getAllRowsColumnValues(this.processInstanceIdColumn);
    }

}


