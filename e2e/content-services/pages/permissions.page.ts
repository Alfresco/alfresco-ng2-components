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

import {
    AddPermissionsDialogPage,
    BrowserActions,
    DataTableComponentPage,
    DropdownPage,
    TestElement
} from '@alfresco/adf-testing';
import { browser } from 'protractor';

export class PermissionsPage {

    dataTableComponentPage = new DataTableComponentPage();
    addPermissionsDialog = new AddPermissionsDialogPage();

    rootElement = 'adf-permission-manager-card';
    inheritedButton = '[data-automation-id="adf-inherit-toggle-button"]';
    errorElement = TestElement.byId('adf-permission-manager-error');
    localPermissionList = TestElement.byCss('[data-automation-id="adf-locally-set-permission"]');
    addPermissionButton = TestElement.byCss('button[data-automation-id=\'adf-add-permission-button\']');

    async changePermission(name: string, role: string): Promise<void> {
        await browser.sleep(1000);
        await this.clickRoleDropdownByUserOrGroupName(name);
        await new DropdownPage().selectOption(role);
        await this.dataTableComponentPage.checkRowByContentIsNotSelected(name);
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
        await BrowserActions.click(row.$('[id="adf-select-role-permission"] .mat-select-trigger'));
        await TestElement.byCss('.mat-select-panel').waitVisible();
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

    async checkPermissionManagerDisplayed(): Promise<void> {
        await TestElement.byId(this.rootElement).waitVisible();
    }

    async checkPermissionListDisplayed(): Promise<void> {
        await browser.sleep(500);
        await this.localPermissionList.waitVisible();
    }

    async isInherited(): Promise<boolean> {
        const inheritButton = TestElement.byCss(this.inheritedButton);
        await inheritButton.waitVisible();
        return (await inheritButton.getAttribute('class')).indexOf('mat-checked') !== -1;
    }

    async toggleInheritPermission(): Promise<void> {
        const inheritButton = TestElement.byCss(`${this.inheritedButton} label`);
        await inheritButton.click();
    }
}
