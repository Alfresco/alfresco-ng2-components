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

import { AddPermissionsDialogPage, BrowserActions, DataTableComponentPage, Logger, TestElement } from '@alfresco/adf-testing';
import { browser, by, element } from 'protractor';

export class PermissionsPage {

    dataTableComponentPage = new DataTableComponentPage();
    addPermissionsDialog = new AddPermissionsDialogPage();

    rootElement = TestElement.byId('adf-permission-manager-card');
    emptyElement = new TestElement(this.rootElement.elementFinder.element(by.css('.adf-no-permission__template')));
    addPermissionButton = TestElement.byCss("button[data-automation-id='adf-add-permission-button']");
    addPermissionDialog = element(by.css('adf-add-permission-dialog'));
    searchUserInput = element(by.id('searchInput'));
    searchResults = element(by.css('#adf-add-permission-authority-results #adf-search-results-content'));
    addButton = element(by.css('[data-automation-id="add-permission-dialog-confirm-button"]'));
    permissionInheritedButton = element.all(by.css('.app-inherit_permission_button button')).first();
    noPermissions = element(by.id('adf-no-permissions-template'));
    deletePermissionButton = element(by.css(`button[data-automation-id='adf-delete-permission-button']`));
    permissionDisplayContainer = element(by.id('adf-permission-display-container'));
    closeButton = TestElement.byCss('#add-permission-dialog-close-button');

    async changePermission(name: string, role: string): Promise<void> {
        await this.clickRoleDropdownByUserOrGroupName(name);
        await this.addPermissionsDialog.selectOption(role);
        await browser.sleep(500);
        await this.dataTableComponentPage.checkRowIsNotSelected('Users and Groups', name);
    }

    async checkUserIsAdded(id: string) {
        const userOrGroupName = TestElement.byCss('div[data-automation-id="' + id + '"]');
        await userOrGroupName.waitPresent();
    }

    async getRoleCellValue(username: string): Promise<string> {
        const locator = this.dataTableComponentPage.getCellByRowContentAndColumn('Users and Groups', username, 'Role');
        return BrowserActions.getText(locator);
    }

    async clickRoleDropdownByUserOrGroupName(name: string): Promise<void> {
        const row = this.dataTableComponentPage.getRow('Users and Groups', name);
        await row.click();
        await BrowserActions.click(row.element(by.css('[id="adf-select-role-permission"] .mat-form-field-infix')));
    }

    async clickDeletePermissionButton(username: string): Promise<void> {
        const userOrGroupName = TestElement.byCss(`[data-automation-id="adf-delete-permission-button-${username}"]`);
        await userOrGroupName.waitPresent();
        await userOrGroupName.click();

    }

    async checkUserIsDeleted(username: string): Promise<void> {
        const userOrGroupName = TestElement.byCss('div[data-automation-id="' + username + '"]');
        await userOrGroupName.waitNotPresent();
    }

    async noPermissionContent(): Promise<string> {
        const noPermission = TestElement.byCss('.adf-no-permission__template--text');
        return noPermission.getText();
    }

    async waitVisible(): Promise<void> {
        await this.rootElement.waitPresent();
    }

    async isErrored(): Promise<boolean> {
        return this.emptyElement.isPresent();
    }

    async waitForError(): Promise<void> {
        await this.emptyElement.waitPresent();
    }

    async waitTillContentLoads(): Promise<void> {
        await browser.sleep(500);
        const loader = new TestElement(this.rootElement.elementFinder.element(by.css('adf-permission-loader')));
        let isNotDisplayed;
        try {
            isNotDisplayed = await loader.waitNotPresent();
            if (await this.isErrored()) {
                Logger.log(`Error page reached`);
            }
        } catch (error) {
            isNotDisplayed = false;
        }
        Logger.log(`loader isNotDisplayed ${isNotDisplayed}`);
    }
}
