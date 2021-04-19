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

import { by, element } from 'protractor';
import { BrowserActions } from '../../core/utils/browser-actions';
import { DataTableComponentPage } from '../../core/pages/data-table-component.page';
import { BrowserVisibility } from '../../core/utils/browser-visibility';
import { DropdownPage } from '../../core/pages/material/dropdown.page';

const column = {
    role: 'Role'
};

export class AddPermissionsDialogPage {

    dataTableComponentPage: DataTableComponentPage = new DataTableComponentPage();
    userRoleDataTableComponentPage: DataTableComponentPage = new DataTableComponentPage(element(by.css('[data-automation-id="adf-user-role-selection-table"]')));

    addPermissionDialog = element(by.css('adf-add-permission-dialog'));
    searchUserInput = element(by.id('searchInput'));
    searchResults = element(by.css('#adf-add-permission-authority-results #adf-search-results-content'));
    addButton = element(by.css('[data-automation-id="add-permission-dialog-confirm-button"]'));
    permissionInheritedButton = element(by.css('mat-slide-toggle[data-automation-id="adf-inherit-toggle-button"]'));
    noPermissions = element(by.id('adf-no-permissions-template'));
    deletePermissionButton = element(by.css('button[data-automation-id="adf-delete-permission-button"]'));
    permissionDisplayContainer = element(by.id('adf-permission-display-container'));
    closeButton = element(by.id('add-permission-dialog-close-button'));

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

    async checkPermissionInheritedButtonIsDisplayed() {
        await BrowserVisibility.waitUntilElementIsVisible(this.permissionInheritedButton);
    }

    async clickPermissionInheritedButton(): Promise<void> {
        await BrowserActions.click(this.permissionInheritedButton);
    }

    async clickDeletePermissionButton(): Promise<void> {
        await BrowserActions.click(this.deletePermissionButton);
    }

    async checkNoPermissionsIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.noPermissions);
    }

    async getPermissionInheritedButtonText(text: string): Promise<void> {
        await BrowserVisibility.waitUntilElementHasText(this.permissionInheritedButton, text);
    }

    async checkPermissionsDatatableIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.css('[class*="adf-datatable-permission"]')));
    }

    async getRoleCellValue(rowName: string): Promise<string> {
        const locator = this.dataTableComponentPage.getCellByRowContentAndColumn('Users and Groups', rowName, column.role);
        return BrowserActions.getText(locator);
    }

    async clickRoleDropdownByUserOrGroupName(name: string): Promise<void> {
        const row = this.dataTableComponentPage.getRow('Users and Groups', name);
        await BrowserActions.click(row.element(by.id('adf-select-role-permission')));
    }

    getRoleDropdownOptions() {
        return element.all(by.css('.mat-option-text'));
    }

    async selectOption(name: string): Promise<void> {
        await new DropdownPage().selectOption(name);
    }

    async checkPermissionContainerIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.permissionDisplayContainer);
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

    async selectRole(name: string, role) {
        const row = this.userRoleDataTableComponentPage.getRow('Users and Groups', name);
        await BrowserActions.click(row.element(by.css('[id="adf-select-role-permission"] .mat-select-trigger')));
        await this.getRoleDropdownOptions();
        await this.selectOption(role);
    }
}
