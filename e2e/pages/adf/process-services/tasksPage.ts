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

import { Util } from '../../../util/util';
import { StartTaskDialog } from './dialog/startTaskDialog';
import { FormFields } from './formFields';
import { TaskDetailsPage } from './taskDetailsPage';

import { FiltersPage } from './filtersPage';
import { ChecklistDialog } from './dialog/createChecklistDialog';
import { TasksListPage } from './tasksListPage';
import { element, by } from 'protractor';

export class TasksPage {

    createButton = element(by.css('button[data-automation-id="create-button"'));
    newTaskButton = element(by.css('button[data-automation-id="btn-start-task"]'));
    addChecklistButton = element(by.css('button[class*="adf-add-to-checklist-button"]'));
    rowByRowName = by.xpath('ancestor::mat-chip');
    checklistContainer = by.css('div[class*="checklist-menu"]');
    taskTitle = 'h2[class="adf-activiti-task-details__header"] span';
    rows = by.css('div[class*="adf-datatable-body"] div[class*="adf-datatable-row"] div[class*="adf-datatable-cell"]');
    completeButtonNoForm = element(by.id('adf-no-form-complete-button'));
    checklistDialog = element(by.id('checklist-dialog'));
    checklistNoMessage = element(by.id('checklist-none-message'));
    numberOfChecklists = element(by.css('[data-automation-id="checklist-label"] mat-chip'));
    sortByName = by.css('div[data-automation-id="auto_id_name"]');

    createNewTask() {
        this.createButtonIsDisplayed();
        this.clickOnCreateButton();
        this.newTaskButtonIsDisplayed();
        this.newTaskButton.click();
        return new StartTaskDialog();
    }

    createButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.createButton);
        return this;
    }

    newTaskButtonIsDisplayed() {
        Util.waitUntilElementIsVisible(this.newTaskButton);
        return this;
    }

    clickOnCreateButton() {
        Util.waitUntilElementIsClickable(this.createButton);
        this.createButton.click();
        return this;
    }

    formFields() {
        return new FormFields();
    }

    taskDetails() {
        return new TaskDetailsPage();
    }

    filtersPage() {
        return new FiltersPage();
    }

    tasksListPage() {
        return new TasksListPage();
    }

    usingCheckListDialog() {
        return new ChecklistDialog();
    }

    clickOnAddChecklistButton() {
        Util.waitUntilElementIsClickable(this.addChecklistButton);
        this.addChecklistButton.click();
        return new ChecklistDialog();
    }

    getRowsName(name) {
        let row = element(this.checklistContainer).element(by.cssContainingText('span', name));
        Util.waitUntilElementIsVisible(row);
        return row;
    }

    getChecklistByName(checklist) {
        let row = this.getRowsName(checklist).element(this.rowByRowName);
        Util.waitUntilElementIsVisible(row);
        return row;
    }

    checkChecklistIsDisplayed(checklist) {
        Util.waitUntilElementIsVisible(this.getChecklistByName(checklist));
        return this;
    }

    checkChecklistIsNotDisplayed(checklist) {
        Util.waitUntilElementIsNotOnPage(element(this.checklistContainer).element(by.cssContainingText('span', checklist)));
        return this;
    }

    checkTaskTitle(taskName) {
        Util.waitUntilElementIsVisible(element(by.css(this.taskTitle)));
        let title = element(by.cssContainingText(this.taskTitle, taskName));
        Util.waitUntilElementIsVisible(title);
        return this;
    }

    completeTaskNoForm() {
        Util.waitUntilElementIsClickable(this.completeButtonNoForm);
        this.completeButtonNoForm.click();
    }

    completeTaskNoFormNotDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.completeButtonNoForm);
        return this;
    }

    checkChecklistDialogIsDisplayed() {
        Util.waitUntilElementIsVisible(this.checklistDialog);
        return this;
    }

    checkChecklistDialogIsNotDisplayed() {
        Util.waitUntilElementIsNotOnPage(this.checklistDialog);
        return this;
    }

    checkNoChecklistIsDisplayed() {
        Util.waitUntilElementIsVisible(this.checklistNoMessage);
        return this;
    }

    getNumberOfChecklists() {
        Util.waitUntilElementIsVisible(this.numberOfChecklists);
        return this.numberOfChecklists.getText();
    }

    removeChecklists(checklist) {
        let row = this.getRowsName(checklist).element(this.rowByRowName);
        Util.waitUntilElementIsVisible(row.element(by.css('mat-icon')));
        row.element(by.css('mat-icon')).click();
        return this;
    }

    checkChecklistsRemoveButtonIsNotDisplayed(checklist) {
        let row = this.getRowsName(checklist).element(this.rowByRowName);
        Util.waitUntilElementIsNotOnPage(row.element(by.css('mat-icon')));
        return this;
    }

    clickSortByNameAsc() {
        return this.tasksListPage().getDataTable().sortByColumn(true, 'name');
    }

    clickSortByNameDesc() {
        return this.tasksListPage().getDataTable().sortByColumn(false, 'name');
    }

}
