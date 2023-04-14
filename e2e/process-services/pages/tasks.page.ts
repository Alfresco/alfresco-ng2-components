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

import { StartTaskDialogPage } from './dialog/start-task-dialog.page';
import { TaskDetailsPage } from './task-details.page';

import { FiltersPage } from './filters.page';
import { ChecklistDialog } from './dialog/create-checklist-dialog.page';
import { TasksListPage } from './tasks-list.page';
import { element, by, $ } from 'protractor';
import { BrowserVisibility, BrowserActions, FormFields } from '@alfresco/adf-testing';

export class TasksPage {
    createButton = $('button[data-automation-id="create-button"');
    newTaskButton = $('button[data-automation-id="btn-start-task"]');
    addChecklistButton = $('button[class*="adf-add-to-checklist-button"]');
    rowByRowName = by.xpath('ancestor::mat-chip');
    checklistContainer = $('div[class*="checklist-menu"]');
    taskTitle = '.adf-activiti-task-details__header span';
    completeButtonNoForm = $('#adf-no-form-complete-button');
    checklistDialog = $('#checklist-dialog');
    checklistNoMessage = $('#checklist-none-message');
    numberOfChecklists = $('[data-automation-id="checklist-label"] mat-chip');

    async createNewTask(): Promise<StartTaskDialogPage> {
        await this.clickOnCreateButton();
        await BrowserActions.clickExecuteScript('button[data-automation-id="btn-start-task"]');
        return new StartTaskDialogPage();
    }

    async createTask({ name, description = '', dueDate = '', formName = 'None'}): Promise<void> {
        await this.clickOnCreateButton();
        await BrowserActions.clickExecuteScript('button[data-automation-id="btn-start-task"]');
        const dialog =  new StartTaskDialogPage();
        await dialog.addName(name);
        await dialog.addDescription(description);
        await dialog.addDueDate(dueDate);
        await dialog.selectForm(formName);
        await dialog.clickStartButton();
    }

    async newTaskButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.newTaskButton);
    }

    async clickOnCreateButton(): Promise<void> {
        await BrowserActions.click(this.createButton);
    }

    formFields(): FormFields {
        return new FormFields();
    }

    taskDetails(): TaskDetailsPage {
        return new TaskDetailsPage();
    }

    filtersPage(): FiltersPage {
        return new FiltersPage();
    }

    tasksListPage(): TasksListPage {
        return new TasksListPage();
    }

    usingCheckListDialog(): ChecklistDialog {
        return new ChecklistDialog();
    }

    async clickOnAddChecklistButton(): Promise<ChecklistDialog> {
        await BrowserActions.click(this.addChecklistButton);
        return new ChecklistDialog();
    }

    getRowsName(name: string) {
        return this.checklistContainer.element(by.cssContainingText('span', name));
    }

    getChecklistByName(name: string) {
        const elem = this.getRowsName(name);
        const row = elem.element(this.rowByRowName);
        return row;
    }

    async checkChecklistIsDisplayed(name: string): Promise<void> {
        const checklistEle = this.getChecklistByName(name);
        await BrowserVisibility.waitUntilElementIsVisible(checklistEle);
    }

    async checkChecklistIsNotDisplayed(name: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.checklistContainer.element(by.cssContainingText('span', name)));
    }

    async checkTaskTitle(taskName: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible($(this.taskTitle));
        const title = element(by.cssContainingText(this.taskTitle, taskName));
        await BrowserVisibility.waitUntilElementIsVisible(title);
    }

    async completeTaskNoForm(): Promise<void> {
        await BrowserActions.click(this.completeButtonNoForm);
    }

    async completeTaskNoFormNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.completeButtonNoForm);
    }

    async checkChecklistDialogIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.checklistDialog);
    }

    async checkChecklistDialogIsNotDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.checklistDialog);
    }

    async checkNoChecklistIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.checklistNoMessage);
    }

    getNumberOfChecklists(): Promise<string> {
        return BrowserActions.getText(this.numberOfChecklists);
    }

    async removeChecklists(name: string): Promise<void> {
        const elem = this.getRowsName(name);
        const row = elem.element(this.rowByRowName);
        await BrowserActions.click(row.$('mat-icon'));
    }

    async checkChecklistsRemoveButtonIsNotDisplayed(name: string): Promise<void> {
        const elem = this.getRowsName(name);
        const row = elem.element(this.rowByRowName);
        await BrowserVisibility.waitUntilElementIsNotVisible(row.$('mat-icon'));
    }

    async clickSortByNameAsc(): Promise<any> {
        return this.tasksListPage().getDataTable().sortByColumn('ASC', 'name');
    }

    async clickSortByNameDesc(): Promise<any> {
        return this.tasksListPage().getDataTable().sortByColumn('DESC', 'name');
    }

}
