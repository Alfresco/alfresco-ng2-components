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

import { element, by, browser } from 'protractor';
import {
    FormControllersPage,
    TaskFiltersCloudComponentPage,
    EditTaskFilterCloudComponentPage,
    BrowserVisibility,
    TaskListCloudComponentPage,
    BrowserActions
} from '@alfresco/adf-testing';

export class TasksCloudDemoPage {

    myTasks = element(by.css('span[data-automation-id="my-tasks-filter"]'));
    completedTasks = element(by.css('span[data-automation-id="completed-tasks-filter"]'));
    activeFilter = element(by.css("mat-list-item[class*='active'] span"));

    defaultActiveFilter = element.all(by.css('.adf-filters__entry')).first();

    createButton = element(by.css('button[data-automation-id="create-button"'));
    newTaskButton = element(by.css('button[data-automation-id="btn-start-task"]'));
    settingsButton = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Settings')).first();
    appButton = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'App')).first();
    modeDropDownArrow = element(by.css('mat-form-field[data-automation-id="selectionMode"] div[class*="arrow-wrapper"]'));
    modeSelector = element(by.css("div[class*='mat-select-panel']"));
    displayTaskDetailsToggle = element(by.css('mat-slide-toggle[data-automation-id="taskDetailsRedirection"]'));
    displayProcessDetailsToggle = element(by.css('mat-slide-toggle[data-automation-id="processDetailsRedirection"]'));
    multiSelectionToggle = element(by.css('mat-slide-toggle[data-automation-id="multiSelection"]'));

    formControllersPage = new FormControllersPage();

    editTaskFilterCloud = new EditTaskFilterCloudComponentPage();

    disableDisplayTaskDetails() {
        this.formControllersPage.disableToggle(this.displayTaskDetailsToggle);
        return this;
    }

    disableDisplayProcessDetails() {
        this.formControllersPage.disableToggle(this.displayProcessDetailsToggle);
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

    getActiveFilterName() {
        return BrowserActions.getText(this.activeFilter);
    }

    customTaskFilter(filterName) {
        return new TaskFiltersCloudComponentPage(element(by.css(`span[data-automation-id="${filterName}-filter"]`)));
    }

    openNewTaskForm() {
        BrowserActions.click(this.createButton);
        BrowserActions.click(this.newTaskButton);
        return this;
    }

    clickOnCreateButton() {
        BrowserActions.click(this.createButton);
        return this;
    }

    firstFilterIsActive() {
        return this.defaultActiveFilter.getAttribute('class').then((value) => value.includes('adf-active'));
    }

    clickSettingsButton() {
        BrowserActions.click(this.settingsButton);
        browser.driver.sleep(400);
        BrowserVisibility.waitUntilElementIsVisible(this.multiSelectionToggle);
        BrowserVisibility.waitUntilElementIsVisible(this.modeDropDownArrow);
        BrowserVisibility.waitUntilElementIsClickable(this.modeDropDownArrow);
        return this;
    }

    clickAppButton() {
        BrowserActions.click(this.appButton);
        return this;
    }

    selectSelectionMode(mode) {
        this.clickOnSelectionModeDropDownArrow();

        const modeElement = element.all(by.cssContainingText('mat-option span', mode)).first();
        BrowserActions.click(modeElement);
        return this;
    }

    clickOnSelectionModeDropDownArrow() {
        BrowserActions.click(this.modeDropDownArrow);
        BrowserVisibility.waitUntilElementIsVisible(this.modeSelector);
    }
}
