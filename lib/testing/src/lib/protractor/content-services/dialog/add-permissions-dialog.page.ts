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

import { $, by, element, $$ } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';
import { DataTableComponentPage } from '../../core/pages/data-table-component.page';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { DropdownPage } from '../../core/pages/material/dropdown.page';
import { TestElement } from '../../core/test-element';

const column = {
    role: 'Role'
};

export class AddPermissionsDialogPage {

    dataTableComponentPage: DataTableComponentPage = new DataTableComponentPage();
    userRoleDataTableComponentPage: DataTableComponentPage = new DataTableComponentPage($('[data-automation-id="adf-user-role-selection-table"]'));

    addPermissionDialog = $('adf-add-permission-dialog');
    searchUserInput = $('#searchInput');
    searchResults = $('#adf-add-permission-authority-results #adf-search-results-content');
    addButton = $('[data-automation-id="add-permission-dialog-confirm-button"]');
    closeButton = $('#add-permission-dialog-close-button');

    getRoleDropdownOptions() {
        return $$('.mat-option-text');
    }

    async clickCloseButton(): Promise<void> {
        await BrowserActions.click(this.closeButton);
    }

    async clickAddPermissionButton(): Promise<void> {
        await BrowserActions.clickExecuteScript('button[data-automation-id="adf-add-permission-button"]');
    }

    async checkAddPermissionDialogIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.addPermissionDialog);
    }

    async checkSearchUserInputIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchUserInput);
    }

    async searchUserOrGroup(name: string): Promise<void> {
        await BrowserActions.clearSendKeys(this.searchUserInput, name);
        await this.dataTableComponentPage.waitTillContentLoaded();
    }

    async checkResultListIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchResults);
    }

    async clickUserOrGroup(name: string): Promise<void> {
        const userOrGroupName = element(by.cssContainingText('mat-list-option .mat-list-text', name));
        await BrowserActions.click(userOrGroupName);
        await BrowserActions.click(this.addButton);
    }

    async checkPermissionsDatatableIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible($('[class*="adf-datatable-permission"]'));
    }

    async getRoleCellValue(rowName: string): Promise<string> {
        const locator = this.dataTableComponentPage.getCellByRowContentAndColumn('Users and Groups', rowName, column.role);
        return BrowserActions.getText(locator);
    }

    async clickRoleDropdownByUserOrGroupName(name: string): Promise<void> {
        const row = this.dataTableComponentPage.getRow('Users and Groups', name);
        await BrowserActions.click(row.$('adf-select-role-permission'));
    }

    async selectOption(name: string): Promise<void> {
        await new DropdownPage().selectOption(name);
    }

    async checkUserOrGroupIsDisplayed(name: string): Promise<void> {
        const userOrGroupName = element(by.cssContainingText('mat-list-option .mat-list-text', name));
        await BrowserVisibility.waitUntilElementIsVisible(userOrGroupName);
    }

    async addButtonIsEnabled(): Promise<boolean> {
        return this.addButton.isEnabled();
    }

    async clickAddButton(): Promise<void> {
        await BrowserActions.click(this.addButton);
    }

    async selectRole(name: string, role: string) {
        const row = this.userRoleDataTableComponentPage.getRow('Users and Groups', name);
        await BrowserActions.click(row.$('[id="adf-select-role-permission"] .mat-select-trigger'));
        await TestElement.byCss('.mat-select-panel').waitVisible();
        await this.selectOption(role);
    }
}
