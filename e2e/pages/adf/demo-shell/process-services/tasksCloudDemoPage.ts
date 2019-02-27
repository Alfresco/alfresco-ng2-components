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

import { TaskFiltersCloudComponent } from '../../process-cloud/taskFiltersCloudComponent';
import { TaskListCloudComponent } from '../../process-cloud/taskListCloudComponent';
import { EditTaskFilterCloudComponent } from '../../process-cloud/editTaskFilterCloudComponent';
import { FormControllersPage } from '../../material/formControllersPage';

import { element, by } from 'protractor';

export class TasksCloudDemoPage {

    myTasks = element(by.css('span[data-automation-id="my-tasks-filter"]'));
    completedTasks = element(by.css('span[data-automation-id="completed-tasks-filter"]'));
    activeFilter = element(by.css("mat-list-item[class*='active'] span"));

    taskFilters = element(by.css("mat-expansion-panel[data-automation-id='Task Filters']"));
    defaultActiveFilter = element.all(by.css('.adf-filters__entry')).first();

    createButton = element(by.css('button[data-automation-id="create-button"'));
    newTaskButton = element(by.css('button[data-automation-id="btn-start-task"]'));
    settingsButton = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Settings')).first();
    appButton = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'App')).first();
    modeDropDownArrow = element(by.css('mat-form-field[data-automation-id="selectionMode"] div[class*="arrow-wrapper"]'));
    modeSelector = element(by.css("div[class*='mat-select-panel']"));
    displayTaskDetailsToggle = element(by.css('mat-slide-toggle[data-automation-id="taskDetailsRedirection"]'));
    multiSelectionToggle = element(by.css('mat-slide-toggle[data-automation-id="multiSelection"]'));

    formControllersPage = new FormControllersPage();

    editTaskFilterCloud = new EditTaskFilterCloudComponent();

    disableDisplayTaskDetails() {
        this.formControllersPage.disableToggle(this.displayTaskDetailsToggle);
        return this;
    }

    enableMultiSelection() {
        this.formControllersPage.enableToggle(this.multiSelectionToggle);
        return this;
    }

    taskFiltersCloudComponent(filter) {
        return new TaskFiltersCloudComponent(filter);
    }

    taskListCloudComponent() {
        return new TaskListCloudComponent();
    }

    editTaskFilterCloudComponent() {
        return this.editTaskFilterCloud;
    }

    myTasksFilter() {
        return new TaskFiltersCloudComponent(this.myTasks);
    }

    completedTasksFilter() {
        return new TaskFiltersCloudComponent(this.completedTasks);
    }

    customTaskFilter(filterName) {
        return new TaskFiltersCloudComponent(element(by.css(`span[data-automation-id="${filterName}-filter"]`)));
    }

    getActiveFilterName() {
        Util.waitUntilElementIsVisible(this.activeFilter);
        return this.activeFilter.getText();
    }

    getAllRowsByIdColumn() {
        return new TaskListCloudComponent().getAllRowsByColumn('Id');
    }

    getAllRowsByProcessDefIdColumn() {
        return new TaskListCloudComponent().getAllRowsByColumn('Process Definition Id');
    }

    clickOnTaskFilters() {
        Util.waitUntilElementIsVisible(this.taskFilters);
        return this.taskFilters.click();
    }

    openNewTaskForm() {
        this.createButtonIsDisplayed();
        this.clickOnCreateButton();
        this.newTaskButtonIsDisplayed();
        this.newTaskButton.click();
        return this;
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

    firstFilterIsActive () {
        return this.defaultActiveFilter.getAttribute('class').then((value) => value.includes('adf-active'));
    }

    clickSettingsButton() {
        this.settingsButton.click();
        browser.driver.sleep(400);
        Util.waitUntilElementIsVisible(this.multiSelectionToggle);
        Util.waitUntilElementIsVisible(this.modeDropDownArrow);
        Util.waitUntilElementIsClickable(this.modeDropDownArrow);
        return this;
    }

    clickAppButton() {
        this.appButton.click();
        this.createButtonIsDisplayed();
        return this;
    }

    selectSelectionMode(mode) {
        this.clickOnSelectionModeDropDownArrow();

        let modeElement = element.all(by.cssContainingText('mat-option span', mode)).first();
        Util.waitUntilElementIsClickable(modeElement);
        Util.waitUntilElementIsVisible(modeElement);
        modeElement.click();
        return this;
    }

    clickOnSelectionModeDropDownArrow() {
        Util.waitUntilElementIsVisible(this.modeDropDownArrow);
        Util.waitUntilElementIsClickable(this.modeDropDownArrow);
        this.modeDropDownArrow.click();
        Util.waitUntilElementIsVisible(this.modeSelector);
    }
}
