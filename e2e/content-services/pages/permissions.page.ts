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

import {
    DataTableComponentPage,
    AddPermissionsDialogPage,
    BrowserVisibility,
    BrowserActions
} from '@alfresco/adf-testing';
import { browser, by, element } from 'protractor';

export class PermissionsPage {

    dataTableComponentPage = new DataTableComponentPage();
    addPermissionsDialog = new AddPermissionsDialogPage();

    addPermissionButton = element(by.css("button[data-automation-id='adf-add-permission-button']"));
    addPermissionDialog = element(by.css('adf-add-permission-dialog'));
    searchUserInput = element(by.id('searchInput'));
    searchResults = element(by.css('#adf-add-permission-authority-results #adf-search-results-content'));
    addButton = element(by.id('add-permission-dialog-confirm-button'));
    permissionInheritedButton = element.all(by.css('.app-inherit_permission_button button')).first();
    noPermissions = element(by.id('adf-no-permissions-template'));
    deletePermissionButton = element(by.css(`button[data-automation-id='adf-delete-permission-button']`));
    permissionDisplayContainer = element(by.id('adf-permission-display-container'));
    closeButton = element(by.id('add-permission-dialog-close-button'));

    async clickCloseButton(): Promise<void> {
        await BrowserActions.click(this.closeButton);
    }

    async changePermission(name: string, role: string): Promise<void> {
        await this.addPermissionsDialog.clickRoleDropdownByUserOrGroupName(name);
        await this.addPermissionsDialog.selectOption(role);
        await browser.sleep(500);
        await this.dataTableComponentPage.checkRowIsNotSelected('Authority ID', name);
    }

    async checkAddPermissionButtonIsDisplayed(): Promise<void> {
        await BrowserVisibility.waitUntilElementIsVisible(this.addPermissionButton);
    }
}
