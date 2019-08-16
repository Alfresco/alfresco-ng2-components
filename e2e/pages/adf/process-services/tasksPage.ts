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

import { StartTaskDialog } from './dialog/startTaskDialog';
import { TaskDetailsPage } from './taskDetailsPage';

import { FiltersPage } from './filtersPage';
import { ChecklistDialog } from './dialog/createChecklistDialog';
import { TasksListPage } from './tasksListPage';
import { element, by, ElementFinder } from 'protractor';
import { BrowserVisibility, BrowserActions, FormFields } from '@alfresco/adf-testing';

export class TasksPage {

    createButton: ElementFinder = element(by.css('button[data-automation-id="create-button"'));
    newTaskButton: ElementFinder = element(by.css('button[data-automation-id="btn-start-task"]'));
    addChecklistButton: ElementFinder = element(by.css('button[class*="adf-add-to-checklist-button"]'));
    rowByRowName = by.xpath('ancestor::mat-chip');
    checklistContainer = by.css('div[class*="checklist-menu"]');
    taskTitle = 'h2[class="adf-activiti-task-details__header"] span';
    rows = by.css('div[class*="adf-datatable-body"] div[class*="adf-datatable-row"] div[class*="adf-datatable-cell"]');
    completeButtonNoForm: ElementFinder = element(by.id('adf-no-form-complete-button'));
    checklistDialog: ElementFinder = element(by.id('checklist-dialog'));
    checklistNoMessage: ElementFinder = element(by.id('checklist-none-message'));
    numberOfChecklists: ElementFinder = element(by.css('[data-automation-id="checklist-label"] mat-chip'));
    sortByName = by.css('div[data-automation-id="auto_id_name"]');

    async createNewTask(): Promise<StartTaskDialog> {
        await this.clickOnCreateButton();
        await BrowserActions.clickExecuteScript('button[data-automation-id="btn-start-task"]');
        return new StartTaskDialog();
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

    getRowsName(name) {
        const row: ElementFinder = element(this.checklistContainer).element(by.cssContainingText('span', name));
        return row;
    }

    getChecklistByName(checklist) {
        const elem = this.getRowsName(checklist);
        const row = elem.element(this.rowByRowName);
        return row;
    }

    async checkChecklistIsDisplayed(checklist): Promise<void> {
        const checklistEle = this.getChecklistByName(checklist);
        await BrowserVisibility.waitUntilElementIsVisible(checklistEle);
    }

    async checkChecklistIsNotDisplayed(checklist): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(element(this.checklistContainer).element(by.cssContainingText('span', checklist)));
    }

    async checkTaskTitle(taskName): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.css(this.taskTitle)));
        const title: ElementFinder = element(by.cssContainingText(this.taskTitle, taskName));
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

    async removeChecklists(checklist): Promise<void> {
        const elem = this.getRowsName(checklist);
        const row = elem.element(this.rowByRowName);
        await BrowserActions.click(row.element(by.css('mat-icon')));
    }

    async checkChecklistsRemoveButtonIsNotDisplayed(checklist): Promise<void> {
        const elem = this.getRowsName(checklist);
        const row = elem.element(this.rowByRowName);
        await BrowserVisibility.waitUntilElementIsNotVisible(row.element(by.css('mat-icon')));
    }

    async clickSortByNameAsc(): Promise<any> {
        return await this.tasksListPage().getDataTable().sortByColumn('ASC', 'name');
    }

    async clickSortByNameDesc(): Promise<any> {
        return await this.tasksListPage().getDataTable().sortByColumn('DESC', 'name');
    }

}
