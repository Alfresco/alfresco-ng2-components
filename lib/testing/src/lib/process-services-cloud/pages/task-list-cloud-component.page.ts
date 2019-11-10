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

import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { DataTableComponentPage } from '../../core/pages/data-table-component.page';
import { element, by, ElementFinder, Locator } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';

const column = {
    id: 'Id',
    name: 'Name',
    processInstanceId: 'ProcessInstanceId',
    processDefinitionId: 'ProcessDefinitionId',
    assignee: 'Assignee',
    parentTaskId: 'ParentTaskId',
    priority: 'Priority',
    standAlone: 'StandAlone',
    owner: 'Owner'
};

export class TaskListCloudComponentPage {

    taskList = element(by.css('adf-cloud-task-list'));
    noTasksFound = element.all(by.css("div[class='adf-empty-content__title']")).first();
    actionMenu: ElementFinder = element(by.css('*[role="menu"]'));
    optionButton: Locator = by.css('button[data-automation-id*="action_menu_"]');

    dataTable = new DataTableComponentPage(this.taskList);

    getDataTable(): DataTableComponentPage {
        return this.dataTable;
    }

    clickCheckbox(taskName: string): Promise<void> {
        return this.dataTable.clickCheckbox(column.name, taskName);
    }

    checkRowIsNotChecked(taskName: string): Promise<void> {
        return this.dataTable.checkRowIsNotChecked(column.name, taskName);
    }

    checkRowIsChecked(taskName: string): Promise<void> {
        return this.dataTable.checkRowIsChecked(column.name, taskName);
    }

    getRowsWithSameName(taskName: string): Promise<string> {
        return this.dataTable.getRowsWithSameColumnValues(column.name, taskName);
    }

    getRowsWithSameId(taskId: string): Promise<string> {
        return this.dataTable.getRowsWithSameColumnValues('Id', taskId);
    }

    checkRowIsSelected(taskName: string): Promise<void> {
        return this.dataTable.checkRowIsSelected(column.name, taskName);
    }

    checkRowIsNotSelected(taskName: string): Promise<void> {
        return this.dataTable.checkRowIsNotSelected(column.name, taskName);
    }

    selectRowWithKeyboard(taskName: string): Promise<void> {
        return this.dataTable.selectRowWithKeyboard(column.name, taskName);
    }

    selectRow(taskName: string): Promise<void> {
        return this.dataTable.selectRow(column.name, taskName);
    }

    selectRowByTaskId(taskId: string): Promise<void> {
        return this.dataTable.selectRow(column.id, taskId);
    }

    getRow(taskName): ElementFinder {
        return this.dataTable.getCellElementByValue(column.name, taskName);
    }

    checkContentIsDisplayedById(taskId: string): Promise<void> {
        return this.dataTable.checkContentIsDisplayed(column.id, taskId);
    }

    async checkContentIsNotDisplayedById(taskId: string): Promise<void> {
        return this.dataTable.checkContentIsNotDisplayed(column.id, taskId);
    }

    async checkContentIsDisplayedByProcessInstanceId(taskName: string): Promise<void> {
        return this.dataTable.checkContentIsDisplayed(column.processInstanceId, taskName);
    }

    async checkContentIsDisplayedByName(taskName: string): Promise<void> {
        return this.dataTable.checkContentIsDisplayed(column.name, taskName);
    }

    async checkContentIsNotDisplayedByName(taskName: string): Promise<void> {
        return this.dataTable.checkContentIsNotDisplayed(column.name, taskName);
    }

    async checkTaskListIsLoaded(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.taskList);
    }

    async getNoTasksFoundMessage(): Promise<string> {
        return BrowserActions.getText(this.noTasksFound);
    }

    async getAllRowsNameColumn() {
        return this.dataTable.getAllRowsColumnValues(column.name);
    }

    async getAllRowsByIdColumn() {
        return this.dataTable.getAllRowsColumnValues(column.id);
    }

    async getAllRowsByProcessDefIdColumn() {
        return this.dataTable.getAllRowsColumnValues(column.processDefinitionId);
    }

    async getAllRowsByProcessInstanceIdColumn() {
        return this.dataTable.getAllRowsColumnValues(column.processInstanceId);
    }

    async getAllRowsByAssigneeColumn() {
        return this.dataTable.getAllRowsColumnValues(column.assignee);
    }

    async getAllRowsByParentTaskIdColumn() {
        return this.dataTable.getAllRowsColumnValues(column.parentTaskId);
    }

    async getAllRowsByPriorityColumn() {
        return this.dataTable.getAllRowsColumnValues(column.priority);
    }

    async getAllRowsByStandAloneColumn() {
        return this.dataTable.getAllRowsColumnValues(column.standAlone);
    }

    async getAllRowsByOwnerColumn() {
        return this.dataTable.getAllRowsColumnValues(column.owner);
    }

    async getIdCellValue(rowName: string): Promise<string> {
        const locator = new DataTableComponentPage().getCellByRowContentAndColumn(column.name, rowName, column.id);
        return BrowserActions.getText(locator);
    }

    async clickOptionsButton(content: string) {
        await BrowserActions.closeMenuAndDialogs();
        const row: ElementFinder = this.dataTable.getRow('Id', content);
        await BrowserActions.click(row.element(this.optionButton));
        await BrowserVisibility.waitUntilElementIsVisible(this.actionMenu);
    }

    async clickOnCustomActionMenu(action: string): Promise<void> {
        const actionButton = element(by.css(`button[data-automation-id*="${action}"]`));
        await BrowserActions.click(actionButton);
    }

    async isCustomActionEnabled(action: string): Promise<boolean> {
        const actionButton = element(by.css(`button[data-automation-id*="${action}"]`));
        return actionButton.isEnabled();
    }

    async rightClickOnRow(taskId: string): Promise<void> {
        await this.dataTable.rightClickOnRow('Id', taskId);
    }

    async clickContextMenuActionNamed(actionName: string): Promise<void> {
        await BrowserActions.clickExecuteScript(`button[data-automation-id="context-${actionName}"]`);
    }

    async getNumberOfOptions(): Promise<number> {
        const options = await this.actionMenu.all(by.css(`button`));
        return options.length;
    }

}
