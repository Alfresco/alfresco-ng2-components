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

import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { DataTableComponentPage } from '../../core/pages/data-table-component.page';
import { browser, $, $$ } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';
import { DataTableColumnSelector } from '../../core/pages/data-table/columns-selector';

export class ProcessListCloudComponentPage {

    columns = {
        id: 'Id',
        name: 'Process Name',
        processDefinitionName: 'Process Definition Name'
    };

    processList = $('adf-cloud-process-list');
    noProcessFound = $$('.adf-empty-content__title').first();
    actionMenu = $('*[role="menu"]');
    optionButton = 'button[data-automation-id*="action_menu_"]';

    dataTable = new DataTableComponentPage(this.processList);

    getDataTable(): DataTableComponentPage {
        return this.dataTable;
    }

    selectRow(processName: string): Promise<void> {
        return this.dataTable.selectRow(this.columns.name, processName);
    }

    selectRowById(processId: string): Promise<void> {
        return this.dataTable.selectRow(this.columns.id, processId);
    }

    checkRowIsSelectedById(processId: string): Promise<void> {
        return this.dataTable.checkRowIsSelected(this.columns.id, processId);
    }

    checkRowIsNotSelectedById(processId: string): Promise<void> {
        return this.dataTable.checkRowIsNotSelected(this.columns.id, processId);
    }

    checkRowIsCheckedById(processId: string): Promise<void> {
        return this.dataTable.checkRowIsChecked(this.columns.id, processId);
    }

    checkRowIsNotCheckedById(processId: string): Promise<void> {
        return this.dataTable.checkRowIsNotChecked(this.columns.id, processId);
    }

    checkCheckboxById(processId: string): Promise<void> {
        return this.dataTable.clickCheckbox(this.columns.id, processId);
    }

    checkContentIsDisplayedByName(processName: string): Promise<void> {
        return this.dataTable.checkContentIsDisplayed(this.columns.name, processName);
    }

    checkContentIsNotDisplayedByName(processName: string): Promise<void> {
        return this.dataTable.checkContentIsNotDisplayed(this.columns.name, processName);
    }

    checkContentIsDisplayedByProcessDefinitionName(processDefinition: string): Promise<void> {
        return this.dataTable.checkContentIsDisplayed(this.columns.processDefinitionName, processDefinition);
    }

    checkContentIsDisplayedById(processId: string): Promise<void> {
        return this.dataTable.checkContentIsDisplayed(this.columns.id, processId);
    }

    checkContentIsNotDisplayedById(processId: string): Promise<void> {
        return this.dataTable.checkContentIsNotDisplayed(this.columns.id, processId);
    }

    selectRowWithKeyboard(processId: string): Promise<void> {
        return this.dataTable.selectRowWithKeyboard(this.columns.id, processId);
    }

    async getAllRowsNameColumn() {
        return this.dataTable.getAllRowsColumnValues(this.columns.name);
    }

    async checkProcessListIsLoaded(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.processList);
    }

    async getNoProcessFoundMessage(): Promise<string> {
        return BrowserActions.getText(this.noProcessFound);
    }

    getAllRowsByColumn(column: string) {
        return this.dataTable.getAllRowsColumnValues(column);
    }

    async clickOptionsButton(content: string): Promise<void> {
        await BrowserActions.closeMenuAndDialogs();
        const row = this.dataTable.getRow('Id', content);
        await browser.sleep(1000);
        await BrowserActions.click(row.$(this.optionButton));
        await BrowserVisibility.waitUntilElementIsVisible(this.actionMenu);
    }

    async clickOnCustomActionMenu(action: string): Promise<void> {
        const actionButton = $(`button[data-automation-id*="${action}"]`);
        await BrowserActions.click(actionButton);
    }

    async isCustomActionEnabled(action: string): Promise<boolean> {
        const actionButton = $(`button[data-automation-id*="${action}"]`);
        return actionButton.isEnabled();
    }

    async rightClickOnRow(processInstance: string): Promise<void> {
        await this.dataTable.rightClickOnRow('Id', processInstance);
    }

    async clickContextMenuActionNamed(actionName: string): Promise<void> {
        await BrowserActions.clickExecuteScript(`button[data-automation-id="context-${actionName}"]`);
    }

    async getNumberOfOptions(): Promise<number> {
        const options = await this.actionMenu.$$(`button`);
        return options.length;
    }

    async clickMainMenuButton(): Promise<DataTableColumnSelector> {
        await this.dataTable.mainMenuButton.click();
        const columnsSelector = new DataTableColumnSelector();
        await columnsSelector.columnsSelectorComponent.waitVisible();
        return columnsSelector;
    }

    async waitTillProcessListContentLoaded(): Promise<void> {
        await this.checkProcessListIsLoaded();
        await this.getDataTable().waitForTableBody();
        await this.getDataTable().waitTillContentLoaded();
    }

}
