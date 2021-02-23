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
import { DropdownPage } from '../../core/pages/material/dropdown.page';
import { DataTableComponentPage } from '../../core/pages/data-table-component.page';
import { PeopleCloudComponentPage } from './people-cloud-component.page';

export type StatusType = 'All' | 'Created' | 'Assigned' | 'Cancelled' | 'Suspended' | 'Completed';

export class EditTaskFilterCloudComponentPage {

    customiseFilter = element(by.id('adf-edit-task-filter-sub-title-id'));
    assignee = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-assignee"]'));
    priority = element(by.css('[data-automation-id="adf-cloud-edit-task-property-priority"]'));
    taskName = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-taskName"]'));
    id = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-taskId"]'));
    processDefinitionId = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-processDefinitionId"]'));
    processInstanceId = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-processInstanceId"]'));
    lastModifiedFrom = element(by.css('input[data-placeholder="LastModifiedFrom"]'));
    lastModifiedTo = element(by.css('input[data-placeholder="LastModifiedTo"]'));
    parentTaskId = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-parentTaskId"]'));
    owner = element(by.css('input[data-automation-id="adf-cloud-edit-task-property-owner"]'));
    saveButton = element(by.css('[data-automation-id="adf-filter-action-save"]'));
    saveAsButton = element(by.css('[data-automation-id="adf-filter-action-saveAs"]'));
    deleteButton = element(by.css('[data-automation-id="adf-filter-action-delete"]'));
    filter = element(by.css(`adf-cloud-edit-task-filter mat-expansion-panel-header`));

    private locatorAppNameDropdown = element(by.css(`mat-select[data-automation-id='adf-cloud-edit-task-property-appName']`));
    private locatorStatusDropdown = element(by.css(`mat-select[data-automation-id='adf-cloud-edit-task-property-status']`));
    private locatorSortDropdown = element(by.css(`mat-select[data-automation-id='adf-cloud-edit-task-property-sort']`));
    private locatorOrderDropdown = element(by.css(`mat-select[data-automation-id='adf-cloud-edit-task-property-order']`));
    private locatorCompletedDateDropdown = element(by.css(`mat-select[data-automation-id="adf-cloud-edit-process-property-completedDateRange"]`));

    appNameDropdown = new DropdownPage(this.locatorAppNameDropdown);
    statusDropdown = new DropdownPage(this.locatorStatusDropdown);
    sortDropdown = new DropdownPage(this.locatorSortDropdown);
    priorityDropdown = new DropdownPage(this.priority);
    orderDropdown = new DropdownPage(this.locatorOrderDropdown);
    completedDateDropdown = new DropdownPage(this.locatorCompletedDateDropdown);

    editTaskFilterDialogPage = new EditTaskFilterDialogPage();
    peopleCloudComponent = new PeopleCloudComponentPage();

    dataTable = new DataTableComponentPage( element(by.css('adf-cloud-task-list')));

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

    async setStatusFilterDropDown(option: StatusType): Promise<void> {
        await this.statusDropdown.selectDropdownOption(option);
        await this.dataTable.waitTillContentLoaded();
    }

    async getStatusFilterDropDownValue(): Promise<string> {
        return this.statusDropdown.getSelectedOptionText();
    }

    async setSortFilterDropDown(option: string): Promise<void> {
        await this.sortDropdown.selectDropdownOption(option);
        await this.dataTable.waitTillContentLoaded();
    }

    async getSortFilterDropDownValue(): Promise<string> {
        return this.sortDropdown.getSelectedOptionText();
    }

    async setOrderFilterDropDown(option: string): Promise<void> {
        await this.orderDropdown.selectDropdownOption(option);
        await this.dataTable.waitTillContentLoaded();
    }

    async getOrderFilterDropDownValue(): Promise<string> {
        return this.orderDropdown.getSelectedOptionText();
    }

    async setCompleteDateFilterDropDown(option: string): Promise<void> {
        await this.completedDateDropdown.selectDropdownOption(option);
        await this.dataTable.waitTillContentLoaded();
    }

    async setAssignee(option: string): Promise<void> {
        await this.setProperty('assignee', option);
    }

    async getAssignee(): Promise<string> {
        return BrowserActions.getText(this.assignee);
    }

    async setCompletedBy(option: string): Promise<void> {
        await this.peopleCloudComponent.searchAssigneeAndSelect(option);
    }

    async setPriority(option): Promise<void> {
        await this.priorityDropdown.selectDropdownOption(option);
        await this.dataTable.waitTillContentLoaded();
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
        await this.dataTable.waitTillContentLoaded();
    }

    async getLastModifiedFrom(): Promise<string> {
        return BrowserActions.getText(this.lastModifiedFrom);
    }

    async setLastModifiedTo(lastModifiedToDate: string): Promise<void> {
        await this.clearField(this.lastModifiedTo);
        await BrowserActions.clearSendKeys(this.lastModifiedTo, lastModifiedToDate);
        await this.dataTable.waitTillContentLoaded();
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
        await BrowserActions.clearWithBackSpace(this.assignee, 250);
        await this.dataTable.waitTillContentLoaded();
    }

    async clearField(locator: ElementFinder): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(locator);
        await BrowserActions.clearWithBackSpace(locator);
    }

    async setAppNameDropDown(option: string): Promise<void> {
        await this.appNameDropdown.selectDropdownOption(option);
        await this.dataTable.waitTillContentLoaded();
    }

    async getAppNameDropDownValue(): Promise<string> {
        return this.appNameDropdown.getSelectedOptionText();
    }

    async setId(option: string): Promise<void> {
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
        await this.dataTable.waitTillContentLoaded();
    }

    async getProcessInstanceId(): Promise<string> {
        return this.processInstanceId.getAttribute('value');
    }

}
