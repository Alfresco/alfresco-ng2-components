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

import { element, by, ElementFinder } from 'protractor';

import { DataTableComponentPage } from '@alfresco/adf-testing';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

const column = {
    role: 'Role'
};

export class PermissionsPage {

    dataTableComponentPage: DataTableComponentPage = new DataTableComponentPage();

    addPermissionButton: ElementFinder = element(by.css("button[data-automation-id='adf-add-permission-button']"));
    addPermissionDialog: ElementFinder = element(by.css('adf-add-permission-dialog'));
    searchUserInput: ElementFinder = element(by.id('searchInput'));
    searchResults: ElementFinder = element(by.css('#adf-add-permission-authority-results #adf-search-results-content'));
    addButton: ElementFinder = element(by.id('add-permission-dialog-confirm-button'));
    permissionInheritedButton: ElementFinder = element.all(by.css("div[class='adf-inherit_permission_button'] button")).first();
    noPermissions: ElementFinder = element(by.css('div[id="adf-no-permissions-template"]'));
    deletePermissionButton: ElementFinder = element(by.css(`button[data-automation-id='adf-delete-permission-button']`));
    permissionDisplayContainer: ElementFinder = element(by.css(`div[id='adf-permission-display-container']`));
    closeButton: ElementFinder = element(by.id('add-permission-dialog-close-button'));

    async clickCloseButton(): Promise<void> {
        await BrowserActions.click(this.closeButton);
    }

    async checkAddPermissionButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.addPermissionButton);
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

    async searchUserOrGroup(name): Promise<void> {
        await BrowserActions.clearSendKeys(this.searchUserInput, name);
    }

    async checkResultListIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.searchResults);
    }

    async clickUserOrGroup(name): Promise<void> {
        const userOrGroupName: ElementFinder = element(by.cssContainingText('mat-list-option .mat-list-text', name));
        await BrowserActions.click(userOrGroupName);
        await BrowserActions.click(this.addButton);
    }

    async checkUserOrGroupIsAdded(name): Promise<void> {
        const userOrGroupName: ElementFinder = element(by.css('div[data-automation-id="text_' + name + '"]'));
        await BrowserVisibility.waitUntilElementIsVisible(userOrGroupName);
    }

    async checkUserOrGroupIsDeleted(name): Promise<void> {
        const userOrGroupName: ElementFinder = element(by.css('div[data-automation-id="text_' + name + '"]'));
        await BrowserVisibility.waitUntilElementIsNotVisible(userOrGroupName);
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

    async getPermissionInheritedButtonText(): Promise<string> {
        return await BrowserActions.getText(this.permissionInheritedButton);
    }

    async checkPermissionsDatatableIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(element(by.css('[class*="adf-datatable-permission"]')));
    }

    async getRoleCellValue(rowName): Promise<string> {
        const locator = this.dataTableComponentPage.getCellByRowContentAndColumn('Authority ID', rowName, column.role);
        return await BrowserActions.getText(locator);
    }

    async clickRoleDropdownByUserOrGroupName(name): Promise<void> {
        const row = this.dataTableComponentPage.getRow('Authority ID', name);
        await BrowserActions.click(row.element(by.id('adf-select-role-permission')));
    }

    getRoleDropdownOptions() {
        return element.all(by.css('.mat-option-text'));
    }

    async selectOption(name): Promise<void> {
        const selectProcessDropdown = element(by.cssContainingText('.mat-option-text', name));
        await BrowserActions.click(selectProcessDropdown);
    }

    async checkPermissionContainerIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.permissionDisplayContainer);
    }

    async checkUserOrGroupIsDisplayed(name): Promise<void> {
        const userOrGroupName: ElementFinder = element(by.cssContainingText('mat-list-option .mat-list-text', name));
        await BrowserVisibility.waitUntilElementIsVisible(userOrGroupName);
    }
}
