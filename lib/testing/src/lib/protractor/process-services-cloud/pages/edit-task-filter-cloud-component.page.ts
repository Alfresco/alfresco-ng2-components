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

import { browser, protractor, ElementFinder, $$, $ } from 'protractor';
import { EditTaskFilterDialogPage } from './dialog/edit-task-filter-dialog.page';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { BrowserActions } from '../../core/utils/browser-actions';
import { DropdownPage } from '../../core/pages/material/dropdown.page';
import { DataTableComponentPage } from '../../core/pages/data-table-component.page';
import { PeopleCloudComponentPage } from './people-cloud-component.page';
import { GroupCloudComponentPage } from './group-cloud-component.page';
import { DatePickerPage } from '../../core/pages/material/date-picker.page';

export type StatusType = 'All' | 'Created' | 'Assigned' | 'Cancelled' | 'Suspended' | 'Completed';

export class EditTaskFilterCloudComponentPage {

    rootElement = $$('adf-cloud-edit-task-filter').first();
    customiseFilter = $('#adf-edit-task-filter-sub-title-id');
    assignee = $('input[data-automation-id="adf-cloud-edit-task-property-assignee"]');
    priority = $('[data-automation-id="adf-cloud-edit-task-property-priority"]');
    taskName = $('input[data-automation-id="adf-cloud-edit-task-property-taskName"]');
    id = $('input[data-automation-id="adf-cloud-edit-task-property-taskId"]');
    processDefinitionId = $('input[data-automation-id="adf-cloud-edit-task-property-processDefinitionId"]');
    processInstanceId = $('input[data-automation-id="adf-cloud-edit-task-property-processInstanceId"]');
    lastModifiedFrom = $('input[data-placeholder="LastModifiedFrom"]');
    lastModifiedTo = $('input[data-placeholder="LastModifiedTo"]');
    parentTaskId = $('input[data-automation-id="adf-cloud-edit-task-property-parentTaskId"]');
    owner = $('input[data-automation-id="adf-cloud-edit-task-property-owner"]');
    saveButton = $('[data-automation-id="adf-filter-action-save"]');
    saveAsButton = $('[data-automation-id="adf-filter-action-saveAs"]');
    deleteButton = $('[data-automation-id="adf-filter-action-delete"]');
    filter = $(`adf-cloud-edit-task-filter mat-expansion-panel-header`);

    appNameDropdown = new DropdownPage($(`mat-select[data-automation-id='adf-cloud-edit-task-property-appName']`));
    statusDropdown = new DropdownPage($(`mat-select[data-automation-id='adf-cloud-edit-task-property-status']`));
    sortDropdown = new DropdownPage($(`mat-select[data-automation-id='adf-cloud-edit-task-property-sort']`));
    priorityDropdown = new DropdownPage(this.priority);
    orderDropdown = new DropdownPage($(`mat-select[data-automation-id='adf-cloud-edit-task-property-order']`));
    completedDateDropdown = new DropdownPage($(`mat-select[data-automation-id="adf-cloud-edit-process-property-completedDateRange"]`));
    assignmentDropdown = new DropdownPage($(`.adf-task-assignment-filter`));
    processDefinitionNameDropdown = new DropdownPage($('mat-select[data-automation-id="adf-cloud-edit-task-property-processDefinitionName"]'));
    createdDateRangeDropdown = new DropdownPage($(`mat-select[data-automation-id='adf-cloud-edit-process-property-createdDateRange']`));
    createdDateRangeWithin = new DatePickerPage($(`mat-datepicker-toggle[data-automation-id='adf-cloud-edit-process-property-date-range-createdDateRange']`));
    dueDateRangeDropdown = new DropdownPage($(`mat-select[data-automation-id='adf-cloud-edit-process-property-dueDateRange']`));
    dueDateRangeWithin = new DatePickerPage($(`mat-datepicker-toggle[data-automation-id='adf-cloud-edit-picker-date-range-dueDateRange']`));

    editTaskFilterDialogPage = new EditTaskFilterDialogPage();
    peopleCloudComponent = new PeopleCloudComponentPage();
    groupCloudComponent = new GroupCloudComponentPage();

    dataTable = new DataTableComponentPage( $('adf-cloud-task-list'));

    private expansionPanelExtended = this.rootElement.$('mat-expansion-panel-header.mat-expanded');
    private content = this.rootElement.$('div.mat-expansion-panel-content[style*="visible"]');

    editTaskFilterDialog(): EditTaskFilterDialogPage {
        return this.editTaskFilterDialogPage;
    }

    async isFilterDisplayed(): Promise<boolean> {
        return BrowserVisibility.waitUntilElementIsVisible(this.filter);
    }

    async openFilter(): Promise<void> {
        await this.isFilterDisplayed();
        await BrowserActions.click(this.customiseFilter);
        await this.checkHeaderIsExpanded();
    }

    async closeFilter(): Promise<void> {
        await BrowserActions.click(this.customiseFilter);
        await this.checkHeaderIsCollapsed();
    }

    async checkHeaderIsExpanded(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.expansionPanelExtended);
        await BrowserVisibility.waitUntilElementIsVisible(this.content);
    }

    async checkHeaderIsCollapsed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsNotVisible(this.expansionPanelExtended, 1000);
        await BrowserVisibility.waitUntilElementIsNotVisible(this.content, 1000);
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

    async setCreatedDateRangeDropDown(option: string): Promise<void> {
        await this.createdDateRangeDropdown.checkDropdownIsVisible();
        await this.createdDateRangeDropdown.selectDropdownOption(option);
    }

    async setCreatedDateRangeWithin(start: Date, end: Date): Promise<void> {
        await this.setCreatedDateRangeDropDown('Date within');
        await this.createdDateRangeWithin.setDateRange(start, end);
    }

    async setDueDateRangeDropDown(option: string): Promise<void> {
        await this.dueDateRangeDropdown.checkDropdownIsVisible();
        await this.dueDateRangeDropdown.selectDropdownOption(option);
    }

    async setDueDateRangeWithin(start: Date, end: Date): Promise<void> {
        await this.setDueDateRangeDropDown('Date within');
        await this.dueDateRangeWithin.setDateRange(start, end);
    }

    async setId(option: string): Promise<void> {
        await this.setProperty('taskId', option);
    }

    async getId(): Promise<string> {
        return BrowserActions.getInputValue(this.id);
    }

    async setTaskName(option: string): Promise<void> {
        await this.setProperty('taskName', option);
    }

    async getTaskName(): Promise<string> {
        return BrowserActions.getInputValue(this.taskName);
    }

    async setProcessDefinitionId(option: string): Promise<void> {
        await this.setProperty('processDefinitionId', option);
    }

    async getProcessDefinitionId(): Promise<string> {
        return BrowserActions.getInputValue(this.processDefinitionId);
    }

    async setProcessInstanceId(option: string): Promise<void> {
        await this.setProperty('processInstanceId', option);
    }

    async setProcessDefinitionNameDropDown(option: string): Promise<void> {
        await browser.waitForAngular();
        await this.processDefinitionNameDropdown.checkDropdownIsVisible();
        await this.processDefinitionNameDropdown.selectDropdownOption(option);
    }

    async setProperty(property: string, option: string): Promise<void> {
        const locator = $('input[data-automation-id="adf-cloud-edit-task-property-' + property + '"]');
        await BrowserVisibility.waitUntilElementIsVisible(locator);
        await locator.clear();
        await locator.sendKeys(option);
        await locator.sendKeys(protractor.Key.ENTER);
        await this.dataTable.waitTillContentLoaded();
    }

    async getProcessInstanceId(): Promise<string> {
        return BrowserActions.getInputValue(this.processInstanceId);
    }

}
