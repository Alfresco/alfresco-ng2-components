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

import { element, by, browser, ElementFinder, ElementArrayFinder } from 'protractor';
import {
    FormControllersPage,
    TaskFiltersCloudComponentPage,
    EditTaskFilterCloudComponentPage,
    BrowserVisibility,
    TaskListCloudComponentPage,
    BrowserActions
} from '@alfresco/adf-testing';

export class TasksCloudDemoPage {

    myTasks: ElementFinder = element(by.css('span[data-automation-id="my-tasks-filter"]'));
    completedTasks: ElementFinder = element(by.css('span[data-automation-id="completed-tasks-filter"]'));
    activeFilter: ElementFinder = element(by.css("mat-list-item[class*='active'] span"));

    defaultActiveFilter: ElementFinder = element.all(by.css('.adf-filters__entry')).first();

    createButton: ElementFinder = element(by.css('button[data-automation-id="create-button"'));
    newTaskButton: ElementFinder = element(by.css('button[data-automation-id="btn-start-task"]'));
    settingsButton: ElementFinder = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Settings')).first();
    appButton: ElementFinder = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'App')).first();
    modeDropDownArrow: ElementFinder = element(by.css('mat-form-field[data-automation-id="selectionMode"] div[class*="arrow-wrapper"]'));
    modeSelector: ElementFinder = element(by.css("div[class*='mat-select-panel']"));
    displayTaskDetailsToggle: ElementFinder = element(by.css('mat-slide-toggle[data-automation-id="taskDetailsRedirection"]'));
    displayProcessDetailsToggle: ElementFinder = element(by.css('mat-slide-toggle[data-automation-id="processDetailsRedirection"]'));
    actionMenuToggle: ElementFinder = element(by.css('mat-slide-toggle[data-automation-id="actionmenu"]'));
    contextMenuToggle: ElementFinder = element(by.css('mat-slide-toggle[data-automation-id="contextmenu"]'));
    multiSelectionToggle: ElementFinder = element(by.css('mat-slide-toggle[data-automation-id="multiSelection"]'));
    testingModeToggle: ElementFinder = element(by.css('mat-slide-toggle[data-automation-id="testingMode"]'));
    selectedRows: ElementFinder = element(by.xpath("//div[text()=' Selected Rows: ']"));
    noOfSelectedRows: ElementArrayFinder = element.all(by.xpath("//div[text()=' Selected Rows: ']//li"));
    addActionTitle: ElementFinder = element(by.cssContainingText('.mat-card-title', 'Add Action'));
    keyInputField: ElementFinder = element(by.css('input[placeholder="Key"]'));
    titleInputField: ElementFinder = element(by.css('input[placeholder="Title"]'));
    iconInputField: ElementFinder = element(by.css('input[placeholder="Icon"]'));
    addActionButton: ElementFinder = element(by.cssContainingText('button span', 'Add'));
    disableCheckbox: ElementFinder = element(by.css(`mat-checkbox[formcontrolname='disabled']`));
    visibleCheckbox: ElementFinder = element(by.css(`mat-checkbox[formcontrolname='visible']`));
    filter: ElementFinder = element(by.css(`mat-expansion-panel[data-automation-id='Task Filters']`));

    formControllersPage: FormControllersPage = new FormControllersPage();

    editTaskFilterCloud: EditTaskFilterCloudComponentPage = new EditTaskFilterCloudComponentPage();

    async disableDisplayTaskDetails(): Promise<void> {
        await this.formControllersPage.disableToggle(this.displayTaskDetailsToggle);
    }

    async disableDisplayProcessDetails(): Promise<void> {
        await this.formControllersPage.disableToggle(this.displayProcessDetailsToggle);
    }

    async enableMultiSelection(): Promise<void> {
        await this.formControllersPage.enableToggle(this.multiSelectionToggle);
    }

    async enableActionMenu(): Promise<void> {
        await this.formControllersPage.enableToggle(this.actionMenuToggle);
    }

    async enableContextMenu(): Promise<void> {
        await this.formControllersPage.enableToggle(this.contextMenuToggle);
    }

    async enableTestingMode(): Promise<void> {
        await this.formControllersPage.enableToggle(this.testingModeToggle);
    }

    async clickOnTaskFilter(): Promise<void> {
        await BrowserActions.click(this.filter);
    }

    taskListCloudComponent(): TaskListCloudComponentPage {
        return new TaskListCloudComponentPage();
    }

    editTaskFilterCloudComponent(): EditTaskFilterCloudComponentPage {
        return this.editTaskFilterCloud;
    }

    myTasksFilter(): TaskFiltersCloudComponentPage {
        return new TaskFiltersCloudComponentPage(this.myTasks);
    }

    completedTasksFilter(): TaskFiltersCloudComponentPage {
        return new TaskFiltersCloudComponentPage(this.completedTasks);
    }

    async getActiveFilterName(): Promise<string> {
        await browser.sleep(500);
        return BrowserActions.getText(this.activeFilter);
    }

    customTaskFilter(filterName): TaskFiltersCloudComponentPage {
        return new TaskFiltersCloudComponentPage(element(by.css(`span[data-automation-id="${filterName}-filter"]`)));
    }

    async openNewTaskForm(): Promise<void> {
        await BrowserActions.click(this.createButton);
        await BrowserActions.clickExecuteScript('button[data-automation-id="btn-start-task"]');
    }

    async firstFilterIsActive(): Promise<boolean> {
        const value = await this.defaultActiveFilter.getAttribute('class');
        return value.includes('adf-active');
    }

    async clickSettingsButton(): Promise<void> {
        await BrowserActions.click(this.settingsButton);
        await browser.sleep(400);
        await BrowserVisibility.waitUntilElementIsVisible(this.multiSelectionToggle);
        await BrowserVisibility.waitUntilElementIsClickable(this.modeDropDownArrow);
    }

    async clickAppButton(): Promise<void> {
        await BrowserActions.click(this.appButton);
    }

    async selectSelectionMode(mode): Promise<void> {
        await this.clickOnSelectionModeDropDownArrow();

        const modeElement: ElementFinder = element.all(by.cssContainingText('mat-option span', mode)).first();
        await BrowserActions.click(modeElement);
    }

    async clickOnSelectionModeDropDownArrow(): Promise<void> {
        await BrowserActions.click(this.modeDropDownArrow);
        await BrowserVisibility.waitUntilElementIsVisible(this.modeSelector);
    }

    async checkSelectedRowsIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.selectedRows);
    }

    async getNoOfSelectedRows(): Promise<number> {
        await this.checkSelectedRowsIsDisplayed();
        return this.noOfSelectedRows.count();
    }

    async getSelectedTaskRowText(rowNo: string): Promise<string> {
        await this.checkSelectedRowsIsDisplayed();
        const row: ElementFinder = element(by.xpath(`//div[text()=' Selected Rows: ']//li[${rowNo}]`));
        return BrowserActions.getText(row);
    }

    async addActionIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.addActionTitle);
    }

    async addAction(text: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.keyInputField, text);
        await BrowserActions.clearSendKeys(this.titleInputField, text);
        await BrowserActions.clearSendKeys(this.iconInputField, text);
        await BrowserActions.click(this.addActionButton);
    }

    async addDisabledAction(text: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.keyInputField, text);
        await BrowserActions.clearSendKeys(this.titleInputField, text);
        await BrowserActions.clearSendKeys(this.iconInputField, text);
        await BrowserActions.click(this.disableCheckbox);
        await BrowserActions.click(this.addActionButton);
    }

    async addInvisibleAction(text: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.keyInputField, text);
        await BrowserActions.clearSendKeys(this.titleInputField, text);
        await BrowserActions.clearSendKeys(this.iconInputField, text);
        await BrowserActions.click(this.visibleCheckbox);
        await BrowserActions.click(this.addActionButton);
    }

    async actionAdded(action: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText(`mat-chip`, action)));
    }

    async checkActionExecuted(taskId: string, action: string): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText(`span`, 'Action Menu:')));
        await BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText(`span`, 'Context Menu:')));
        await BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText(`span`, 'Task ID: ' + taskId)));
        await BrowserVisibility.waitUntilElementIsVisible(element(by.cssContainingText(`span`, 'Action Type: ' + action)));
    }
}
