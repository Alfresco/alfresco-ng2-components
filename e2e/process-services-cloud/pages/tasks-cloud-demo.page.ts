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
    TogglePage,
    TaskFiltersCloudComponentPage,
    EditTaskFilterCloudComponentPage,
    BrowserVisibility,
    TaskListCloudComponentPage,
    BrowserActions, DropdownPage, Logger
} from '@alfresco/adf-testing';

export class TasksCloudDemoPage {

    createButton = element(by.css('button[data-automation-id="create-button"'));
    newTaskButton = element(by.css('button[data-automation-id="btn-start-task"]'));
    settingsButton = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'Settings')).first();
    appButton = element.all(by.cssContainingText('div[class*="mat-tab-label"] .mat-tab-labels div', 'App')).first();
    displayTaskDetailsToggle = element(by.css('mat-slide-toggle[data-automation-id="taskDetailsRedirection"]'));
    displayProcessDetailsToggle = element(by.css('mat-slide-toggle[data-automation-id="processDetailsRedirection"]'));
    actionMenuToggle = element(by.css('mat-slide-toggle[data-automation-id="actionmenu"]'));
    contextMenuToggle = element(by.css('mat-slide-toggle[data-automation-id="contextmenu"]'));
    multiSelectionToggle = element(by.css('mat-slide-toggle[data-automation-id="multiSelection"]'));
    testingModeToggle = element(by.css('mat-slide-toggle[data-automation-id="testingMode"]'));
    selectedRows = element(by.xpath("//div[text()=' Selected Rows: ']"));
    noOfSelectedRows = element.all(by.xpath("//div[text()=' Selected Rows: ']//li"));
    addActionTitle = element(by.cssContainingText('.mat-card-title', 'Add Action'));
    keyInputField = element(by.css('input[data-placeholder="Key"]'));
    titleInputField = element(by.css('input[data-placeholder="Title"]'));
    iconInputField = element(by.css('input[data-placeholder="Icon"]'));
    addActionButton = element(by.cssContainingText('button span', 'Add'));
    disableCheckbox = element(by.css(`mat-checkbox[formcontrolname='disabled']`));
    visibleCheckbox = element(by.css(`mat-checkbox[formcontrolname='visible']`));

    modeDropdown = new DropdownPage(element(by.css('mat-form-field[data-automation-id="selectionMode"]')));

    togglePage = new TogglePage();

    editTaskFilterCloud = new EditTaskFilterCloudComponentPage();
    taskFilterCloudComponent = new TaskFiltersCloudComponentPage();

    async disableDisplayTaskDetails(): Promise<void> {
        await this.togglePage.disableToggle(this.displayTaskDetailsToggle);
    }

    async disableDisplayProcessDetails(): Promise<void> {
        await this.togglePage.disableToggle(this.displayProcessDetailsToggle);
    }

    async enableMultiSelection(): Promise<void> {
        await this.togglePage.enableToggle(this.multiSelectionToggle);
    }

    async enableActionMenu(): Promise<void> {
        await this.togglePage.enableToggle(this.actionMenuToggle);
    }

    async enableContextMenu(): Promise<void> {
        await this.togglePage.enableToggle(this.contextMenuToggle);
    }

    async enableTestingMode(): Promise<void> {
        await this.togglePage.enableToggle(this.testingModeToggle);
    }

    taskListCloudComponent(): TaskListCloudComponentPage {
        return new TaskListCloudComponentPage();
    }

    async openNewTaskForm(): Promise<void> {
        await BrowserActions.click(this.createButton);
        await BrowserActions.clickExecuteScript('button[data-automation-id="btn-start-task"]');
    }

    async clickSettingsButton(): Promise<void> {
        await BrowserActions.click(this.settingsButton);
        await browser.sleep(400);
        await BrowserVisibility.waitUntilElementIsVisible(this.multiSelectionToggle);
        await this.modeDropdown.checkDropdownIsClickable();
    }

    async clickAppButton(): Promise<void> {
        await BrowserActions.click(this.appButton);
    }

    async selectSelectionMode(mode: string): Promise<void> {
        await this.modeDropdown.clickDropdown();
        await this.modeDropdown.selectOption(mode);
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
        const row = element(by.xpath(`//div[text()=' Selected Rows: ']//li[${rowNo}]`));
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

    async clickStartNewTaskButton() {
        await BrowserActions.click(this.createButton);
        await BrowserActions.click(this.newTaskButton);
    }

    async waitTillContentLoaded(): Promise<void> {
        if (this.isSpinnerPresent()) {
            Logger.log('wait loading spinner disappear');
            await BrowserVisibility.waitUntilElementIsNotPresent(element(by.tagName('mat-progress-spinner')));
        }  else {
            try {
                Logger.log('wait loading spinner is present');
                await BrowserVisibility.waitUntilElementIsPresent(element(by.tagName('mat-progress-spinner')));
            } catch (error) {
            }
        }
    }

    private async isSpinnerPresent(): Promise<boolean> {
        let isSpinnerPresent;

        try {
            isSpinnerPresent = await element(by.tagName('mat-progress-spinner')).isDisplayed();
        } catch (error) {
            isSpinnerPresent = false;
        }

        return isSpinnerPresent;
    }

}
