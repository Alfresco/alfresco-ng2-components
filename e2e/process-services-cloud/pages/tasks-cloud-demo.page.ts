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

import { element, by, browser, $ } from 'protractor';
import {
    TogglePage,
    TaskFiltersCloudComponentPage,
    EditTaskFilterCloudComponentPage,
    TaskListCloudComponentPage,
    BrowserActions, DropdownPage, TestElement, DataTableComponentPage
} from '@alfresco/adf-testing';

export class TasksCloudDemoPage {
    createButton = TestElement.byCss('button[data-automation-id="create-button"');
    newTaskButton = TestElement.byCss('button[data-automation-id="btn-start-task"]');
    settingsButton = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Settings')).first();
    appButton = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'App')).first();
    displayTaskDetailsToggle = $('mat-slide-toggle[data-automation-id="taskDetailsRedirection"]');
    displayProcessDetailsToggle = $('mat-slide-toggle[data-automation-id="processDetailsRedirection"]');
    multiSelectionToggle = $('mat-slide-toggle[data-automation-id="multiSelection"]');
    testingModeToggle = $('mat-slide-toggle[data-automation-id="testingMode"]');
    selectedRows = element(by.xpath('//div[text()=\' Selected Rows: \']'));
    noOfSelectedRows = element.all(by.xpath('//div[text()=\' Selected Rows: \']//li'));
    spinner = TestElement.byTag('mat-progress-spinner');
    modeDropdown = new DropdownPage($('mat-form-field[data-automation-id="selectionMode"]'));

    togglePage = new TogglePage();

    editTaskFilterCloud = new EditTaskFilterCloudComponentPage();
    taskFilterCloudComponent = new TaskFiltersCloudComponentPage();
    dataTableComponentPage = new DataTableComponentPage();

    async disableDisplayTaskDetails(): Promise<void> {
        await this.togglePage.disableToggle(this.displayTaskDetailsToggle);
    }

    async disableDisplayProcessDetails(): Promise<void> {
        await this.togglePage.disableToggle(this.displayProcessDetailsToggle);
    }

    async enableMultiSelection(): Promise<void> {
        await this.togglePage.enableToggle(this.multiSelectionToggle);
    }

    async enableTestingMode(): Promise<void> {
        await this.togglePage.enableToggle(this.testingModeToggle);
    }

    taskListCloudComponent(): TaskListCloudComponentPage {
        return new TaskListCloudComponentPage();
    }

    async openNewTaskForm(): Promise<void> {
        await this.createButton.click();
        await BrowserActions.clickExecuteScript('button[data-automation-id="btn-start-task"]');
    }

    async clickSettingsButton(): Promise<void> {
        await BrowserActions.click(this.settingsButton);
        await browser.sleep(400);
        await new TestElement(this.multiSelectionToggle).waitVisible();
        await this.modeDropdown.checkDropdownIsClickable();
    }

    async clickAppButton(): Promise<void> {
        await BrowserActions.click(this.appButton);
    }

    async selectSelectionMode(mode: string): Promise<void> {
        await this.modeDropdown.clickDropdown();
        await this.modeDropdown.selectOption(mode);
    }

    checkSelectedRowsIsDisplayed(): Promise<void> {
        return new TestElement(this.selectedRows).waitVisible();
    }

    async getNoOfSelectedRows(): Promise<number> {
        await this.checkSelectedRowsIsDisplayed();
        return this.noOfSelectedRows.count();
    }

    async getSelectedTaskRowText(rowNo: string): Promise<string> {
        await this.checkSelectedRowsIsDisplayed();
        const row = element(by.xpath(`//div[text()=' Selected Rows: ']//li[${rowNo}]`));
        return BrowserActions.getText(row);
    }

    async clickStartNewTaskButton() {
        await this.createButton.click();
        await this.newTaskButton.click();
    }

    async waitTillContentLoaded(): Promise<void> {
        await this.dataTableComponentPage.waitTillContentLoaded();
    }
}
