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

import { element, by } from 'protractor';

import { DataTableComponentPage } from '@alfresco/adf-testing';
import { BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';

const column = {
    role: 'Role'
};

export class PermissionsPage {

    dataTableComponentPage: DataTableComponentPage = new DataTableComponentPage();

    addPermissionButton = element(by.css("button[data-automation-id='adf-add-permission-button']"));
    addPermissionDialog = element(by.css('adf-add-permission-dialog'));
    searchUserInput = element(by.id('searchInput'));
    searchResults = element.all(by.id('adf-search-results-content')).first();
    addButton = element(by.id('add-permission-dialog-confirm-button'));
    permissionInheritedButton = element.all(by.css("div[class='adf-inherit_permission_button'] button")).first();
    permissionInheritedButtonText = this.permissionInheritedButton.element(by.css('span'));
    noPermissions = element(by.css('div[id="adf-no-permissions-template"]'));
    roleDropdown = element(by.id('adf-select-role-permission'));
    roleDropdownOptions = element.all(by.css('.mat-option-text'));
    assignPermissionError = element(by.css('simple-snack-bar'));
    deletePermissionButton = element(by.css(`button[data-automation-id='adf-delete-permission-button']`));
    permissionDisplayContainer = element(by.css(`div[id='adf-permission-display-container']`));
    closeButton = element(by.id('add-permission-dialog-close-button'));

    clickCloseButton() {
        BrowserActions.click(this.closeButton);
    }

    checkAddPermissionButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.addPermissionButton);
    }

    clickAddPermissionButton() {
        BrowserActions.clickExecuteScript('button[data-automation-id="adf-add-permission-button"]');
    }

    checkAddPermissionDialogIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.addPermissionDialog);
    }

    checkSearchUserInputIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.searchUserInput);
    }

    searchUserOrGroup(name) {
        BrowserActions.clearSendKeys(this.searchUserInput, name);
    }

    checkResultListIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.searchResults);
    }

    clickUserOrGroup(name) {
        const userOrGroupName = element(by.cssContainingText('mat-list-option .mat-list-text', name));
        BrowserActions.click(userOrGroupName);
        return BrowserActions.click(this.addButton);
    }

    checkUserOrGroupIsAdded(name) {
        const userOrGroupName = element(by.css('div[data-automation-id="text_' + name + '"]'));
        BrowserVisibility.waitUntilElementIsVisible(userOrGroupName);
    }

    checkUserOrGroupIsDeleted(name) {
        const userOrGroupName = element(by.css('div[data-automation-id="text_' + name + '"]'));
        BrowserVisibility.waitUntilElementIsNotVisible(userOrGroupName);
    }

    checkPermissionInheritedButtonIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.permissionInheritedButton);
    }

    clickPermissionInheritedButton() {
        return BrowserActions.click(this.permissionInheritedButton);

    }

    clickDeletePermissionButton() {
        return BrowserActions.click(this.deletePermissionButton);
    }

    checkNoPermissionsIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.noPermissions);
    }

    getPermissionInheritedButtonText() {
        return BrowserActions.getText(this.permissionInheritedButton);
    }

    checkPermissionsDatatableIsDisplayed() {
        return new DataTableComponentPage(element(by.css('[class*="adf-datatable-permission"]')));
    }

    getRoleCellValue(rowName) {
        const locator = new DataTableComponentPage().getCellByRowContentAndColumn('Authority ID', rowName, column.role);
        return BrowserActions.getText(locator);
    }

    clickRoleDropdownByUserOrGroupName(name) {
        const row = this.dataTableComponentPage.getRow('Authority ID', name);
        return BrowserActions.click(row.element(by.id('adf-select-role-permission')));
    }

    getRoleDropdownOptions() {
        BrowserVisibility.waitUntilElementIsVisible(this.roleDropdownOptions.first());
        return this.roleDropdownOptions;
    }

    selectOption(name) {
        const selectProcessDropdown = element(by.cssContainingText('.mat-option-text', name));
        BrowserActions.click(selectProcessDropdown);
        return this;
    }

    getAssignPermissionErrorText() {
        return BrowserActions.getText(this.assignPermissionError);
    }

    checkPermissionContainerIsDisplayed() {
        BrowserVisibility.waitUntilElementIsVisible(this.permissionDisplayContainer);
    }

    checkUserOrGroupIsDisplayed(name) {
        const userOrGroupName = element(by.cssContainingText('mat-list-option .mat-list-text', name));
        BrowserVisibility.waitUntilElementIsVisible(userOrGroupName);
    }
}
