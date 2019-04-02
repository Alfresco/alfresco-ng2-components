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

import { EditTaskFilterCloudComponentPage, TaskFiltersCloudComponentPage } from '@alfresco/adf-testing';
import { EditTaskFilterCloudComponent } from '../../process-cloud/editTaskFilterCloudComponent';
import { FormControllersPage } from '@alfresco/adf-testing';

import { element, by, browser } from 'protractor';
import { BrowserVisibility, TaskListCloudComponentPage } from '@alfresco/adf-testing';

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

    editTaskFilterCloud = new EditTaskFilterCloudComponentPage();

    disableDisplayTaskDetails() {
        this.formControllersPage.disableToggle(this.displayTaskDetailsToggle);
        return this;
    }

    enableMultiSelection() {
        this.formControllersPage.enableToggle(this.multiSelectionToggle);
        return this;
    }

    taskFiltersCloudComponent(filter) {
        return new TaskFiltersCloudComponentPage(filter);
    }

    taskListCloudComponent() {
        return new TaskListCloudComponentPage();
    }

    editTaskFilterCloudComponent() {
        return this.editTaskFilterCloud;
    }

    myTasksFilter() {
        return new TaskFiltersCloudComponentPage(this.myTasks);
    }

    completedTasksFilter() {
        return new TaskFiltersCloudComponentPage(this.completedTasks);
    }

    customTaskFilter(filterName) {
        return new TaskFiltersCloudComponentPage(element(by.css(`span[data-automation-id="${filterName}-filter"]`)));
    }

    getActiveFilterName() {
        BrowserVisibility.waitUntilElementIsVisible(this.activeFilter);
        return this.activeFilter.getText();
    }

    getAllRowsByIdColumn() {
        return new TaskListCloudComponentPage().getAllRowsByColumn('Id');
    }

    getAllRowsByProcessDefIdColumn() {
        return new TaskListCloudComponentPage().getAllRowsByColumn('Process Definition Id');
    }

    clickOnTaskFilters() {
        BrowserVisibility.waitUntilElementIsVisible(this.taskFilters);
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
        BrowserVisibility.waitUntilElementIsVisible(this.createButton);
        return this;
    }

    newTaskButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.newTaskButton);
        return this;
    }

    clickOnCreateButton() {
        BrowserVisibility.waitUntilElementIsClickable(this.createButton);
        this.createButton.click();
        return this;
    }

    firstFilterIsActive () {
        return this.defaultActiveFilter.getAttribute('class').then((value) => value.includes('adf-active'));
    }

    clickSettingsButton() {
        this.settingsButton.click();
        browser.driver.sleep(400);
        BrowserVisibility.waitUntilElementIsVisible(this.multiSelectionToggle);
        BrowserVisibility.waitUntilElementIsVisible(this.modeDropDownArrow);
        BrowserVisibility.waitUntilElementIsClickable(this.modeDropDownArrow);
        return this;
    }

    clickAppButton() {
        this.appButton.click();
        this.createButtonIsDisplayed();
        return this;
    }

    selectSelectionMode(mode) {
        this.clickOnSelectionModeDropDownArrow();

        const modeElement = element.all(by.cssContainingText('mat-option span', mode)).first();
        BrowserVisibility.waitUntilElementIsClickable(modeElement);
        BrowserVisibility.waitUntilElementIsVisible(modeElement);
        modeElement.click();
        return this;
    }

    clickOnSelectionModeDropDownArrow() {
        BrowserVisibility.waitUntilElementIsVisible(this.modeDropDownArrow);
        BrowserVisibility.waitUntilElementIsClickable(this.modeDropDownArrow);
        this.modeDropDownArrow.click();
        BrowserVisibility.waitUntilElementIsVisible(this.modeSelector);
    }
}
