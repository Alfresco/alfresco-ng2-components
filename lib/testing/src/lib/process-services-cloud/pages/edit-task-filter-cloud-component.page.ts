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

import { browser, by, element, protractor, ElementFinder } from 'protractor';
import { EditTaskFilterDialogPage } from './dialog/edit-task-filter-dialog.page';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { DropdownPage } from '../../material/pages/dropdown.page';

export class EditTaskFilterCloudComponentPage {

    customiseFilter: ElementFinder = element(by.id('adf-edit-task-filter-title-id'));
    assignee: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-assignee"]'));
    priority: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-priority"]'));
    taskName: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-taskName"]'));
    id: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-taskId"]'));
    processDefinitionId: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-processDefinitionId"]'));
    processInstanceId: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-processInstanceId"]'));
    lastModifiedFrom: ElementFinder = element(by.css('input[placeholder="LastModifiedFrom"]'));
    lastModifiedTo: ElementFinder = element(by.css('input[placeholder="LastModifiedTo"]'));
    parentTaskId: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-parentTaskId"]'));
    owner: ElementFinder = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-owner"]'));
    saveButton: ElementFinder = element(by.css('[data-automation-id="adf-filter-action-save"]'));
    saveAsButton: ElementFinder = element(by.css('[data-automation-id="adf-filter-action-saveAs"]'));
    deleteButton: ElementFinder = element(by.css('[data-automation-id="adf-filter-action-delete"]'));
    filter: ElementFinder = element(by.css(`adf-cloud-edit-task-filter mat-expansion-panel-header`));

    private locatorAppNameDropdown = element(by.css(`mat-select[data-automation-id='adf-cloud-edit-task-property-appName']`));
    private locatorStatusDropdown = element(by.css(`mat-select[data-automation-id='adf-cloud-edit-task-property-status']`));
    private locatorSortDropdown = element(by.css(`mat-select[data-automation-id='adf-cloud-edit-task-property-sort']`));
    private locatorOrderDropdown = element(by.css(`mat-select[data-automation-id='adf-cloud-edit-task-property-order']`));

    private appNameDropdown = new DropdownPage(this.locatorAppNameDropdown);
    private statusDropdown = new DropdownPage(this.locatorStatusDropdown);
    private sortDropdown = new DropdownPage(this.locatorSortDropdown);
    private orderDropdown = new DropdownPage(this.locatorOrderDropdown);

    editTaskFilterDialogPage = new EditTaskFilterDialogPage();

    editTaskFilterDialog(): EditTaskFilterDialogPage {
        return this.editTaskFilterDialogPage;
    }

    async isFilterDisplayed(): Promise<boolean> {
        return BrowserVisibility.waitUntilElementIsVisible(this.filter);
    }

    async openFilter(): Promise<void> {
        await BrowserActions.click(this.customiseFilter);
        await browser.driver.sleep(1000);
    }

    async setStatusFilterDropDown(option: string): Promise<void> {
        await this.statusDropdown.clickDropdown();
        await this.statusDropdown.selectOption(option);
    }

    async getStatusFilterDropDownValue(): Promise<string> {
        return this.statusDropdown.getSelectedOptionText();
    }

    async setSortFilterDropDown(option: string): Promise<void> {
        await this.sortDropdown.clickDropdown();
        await this.sortDropdown.selectOption(option);
    }

    async getSortFilterDropDownValue(): Promise<string> {
        return this.sortDropdown.getSelectedOptionText();
    }

    async setOrderFilterDropDown(option: string): Promise<void> {
        await this.orderDropdown.clickDropdown();
        await this.orderDropdown.selectOption(option);
        await browser.sleep(1500);
    }

    async getOrderFilterDropDownValue(): Promise<string> {
        return this.orderDropdown.getSelectedOptionText();
    }

    async setAssignee(option: string): Promise<void> {
        await this.setProperty('assignee', option);
    }

    async getAssignee(): Promise<string> {
        return BrowserActions.getText(this.assignee);
    }

    async setPriority(option): Promise<void> {
        await this.setProperty('priority', option);
    }

    async getPriority(): Promise<string> {
        return BrowserActions.getText(this.priority);
    }

    async setParentTaskId(option: string): Promise<void> {
        await this.setProperty('parentTaskId', option);
    }

    async getParentTaskId(): Promise<string> {
        return BrowserActions.getText(this.parentTaskId);
    }

    async setOwner(option: string): Promise<void> {
        await this.setProperty('owner', option);
    }

    async getOwner(): Promise<string> {
        return BrowserActions.getText(this.owner);
    }

    async setLastModifiedFrom(lastModifiedFromDate: string) {
        await this.clearField(this.lastModifiedFrom);
        await BrowserActions.clearSendKeys(this.lastModifiedFrom, lastModifiedFromDate);
    }

    async getLastModifiedFrom(): Promise<string> {
        return BrowserActions.getText(this.lastModifiedFrom);
    }

    async setLastModifiedTo(lastModifiedToDate: string): Promise<void> {
        await this.clearField(this.lastModifiedTo);
        await BrowserActions.clearSendKeys(this.lastModifiedTo, lastModifiedToDate);
    }

    async getLastModifiedTo(): Promise<string> {
        return BrowserActions.getText(this.lastModifiedTo);
    }

    async checkSaveButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
    }

    async checkSaveAsButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveAsButton);
    }

    async checkDeleteButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.deleteButton);
    }

    async checkSaveButtonIsEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this.saveButton.isEnabled();
    }

    async checkSaveAsButtonIsEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this.saveAsButton.isEnabled();
    }

    async checkDeleteButtonIsEnabled(): Promise<boolean> {
        await BrowserVisibility.waitUntilElementIsVisible(this.saveButton);
        return this.deleteButton.isEnabled();
    }

    async clickSaveAsButton(): Promise<void> {
        const disabledButton = element(by.css(("button[data-automation-id='adf-filter-action-saveAs'][disabled]")));
        await BrowserVisibility.waitUntilElementIsNotVisible(disabledButton);
        await BrowserActions.click(this.saveAsButton);
        await browser.driver.sleep(1000);
    }

    async clickDeleteButton(): Promise<void> {
        await BrowserActions.click(this.deleteButton);
        await browser.driver.sleep(1000);
    }

    async clickSaveButton(): Promise<void> {
        await BrowserActions.click(this.saveButton);
    }

    async clearAssignee(): Promise<void> {
        await BrowserActions.clearWithBackSpace(this.assignee);
        await browser.driver.sleep(1000);
    }

    async clearField(locator: ElementFinder): Promise<void> {
        await BrowserActions.clearSendKeys(locator, ' ');
        await locator.sendKeys(protractor.Key.BACK_SPACE);
    }

    async setAppNameDropDown(option: string): Promise<void> {
        await this.appNameDropdown.clickDropdown();
        await this.appNameDropdown.selectOption(option);
    }

    async getAppNameDropDownValue(): Promise<string> {
        return this.appNameDropdown.getSelectedOptionText();
    }

    async setId(option): Promise<void> {
        await this.setProperty('taskId', option);
    }

    async getId(): Promise<string> {
        return this.id.getAttribute('value');
    }

    async setTaskName(option: string): Promise<void> {
        await this.setProperty('taskName', option);
    }

    async getTaskName(): Promise<string> {
        return this.taskName.getAttribute('value');
    }

    async setProcessDefinitionId(option: string): Promise<void> {
        await this.setProperty('processDefinitionId', option);
    }

    async getProcessDefinitionId(): Promise<string> {
        return this.processDefinitionId.getAttribute('value');
    }

    async setProcessInstanceId(option: string): Promise<void> {
        await this.setProperty('processInstanceId', option);
    }

    async setProperty(property: string, option: string): Promise<void> {
        const locator = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-' + property + '"]'));
        await BrowserVisibility.waitUntilElementIsVisible(locator);
        await locator.clear();
        await locator.sendKeys(option);
        await locator.sendKeys(protractor.Key.ENTER);
    }

    async getProcessInstanceId(): Promise<string> {
        return this.processInstanceId.getAttribute('value');
    }

}
