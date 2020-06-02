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

import { ApiService, DropActions, LoginSSOPage, NotificationHistoryPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { AcsUserModel } from '../../models/ACS/acs-user.model';
import { FileModel } from '../../models/ACS/file.model';
import { DataTablePage } from '../../pages/adf/demo-shell/data-table.page';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';

describe('Datatable component', () => {

    const apiService = new ApiService();
    const dataTablePage = new DataTablePage('defaultTable');
    const copyContentDataTablePage = new DataTablePage('copyClipboardDataTable');
    const dragAndDropDataTablePage = new DataTablePage();
    const loginPage = new LoginSSOPage();
    const acsUser = new AcsUserModel();
    const navigationBarPage = new NavigationBarPage();
    const notificationHistoryPage = new NotificationHistoryPage();
    const dragAndDrop = new DropActions();
    const pngFile = new FileModel({
        'name': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    beforeAll(async () => {
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        await apiService.getInstance().core.peopleApi.addPerson(acsUser);

        await loginPage.login(acsUser.id, acsUser.password);
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    describe('Datatable component - copyContent', () => {
        beforeAll(async () => {
            await navigationBarPage.navigateToCopyContentDatatable();
            await dataTablePage.dataTable.waitForTableBody();
        });

        it('[C307037] A tooltip is displayed when mouseOver a column with copyContent set to true', async () => {
            await dataTablePage.mouseOverIdColumn('1');
            await expect(await dataTablePage.getCopyContentTooltip()).toEqual('Click to copy');
            await dataTablePage.mouseOverNameColumn('Name 2');
            await dataTablePage.dataTable.copyContentTooltipIsNotDisplayed();
        });

        it('[C307045] No tooltip is displayed when hover over a column with copyContent set to false', async () => {
            await dataTablePage.mouseOverNameColumn('Name 2');
            await dataTablePage.dataTable.copyContentTooltipIsNotDisplayed();
            await dataTablePage.clickOnNameColumn('Name 2');
            await notificationHistoryPage.checkNotifyNotContains('Name 2');
        });

        it('[C307046] No tooltip is displayed when hover over a column that has default value for copyContent property', async () => {
            await dataTablePage.mouseOverCreatedByColumn('Created One');
            await dataTablePage.dataTable.copyContentTooltipIsNotDisplayed();
            await dataTablePage.clickOnCreatedByColumn('Created One');
            await notificationHistoryPage.checkNotifyNotContains('Created One');
        });

        it('[C307040] A column value with copyContent set to true is copied when clicking on it', async () => {
            await dataTablePage.mouseOverIdColumn('1');
            await expect(await dataTablePage.getCopyContentTooltip()).toEqual('Click to copy');
            await dataTablePage.clickOnIdColumn('1');
            await notificationHistoryPage.checkNotifyContains('Text copied to clipboard');
            await dataTablePage.clickOnIdColumn('2');
            await notificationHistoryPage.checkNotifyContains('Text copied to clipboard');
            await dataTablePage.pasteClipboard();
            await expect(await dataTablePage.getClipboardInputText()).toEqual('2');
        });

        it('[C307072] A tooltip is displayed when mouseOver a column with copyContent set to true', async () => {
            await copyContentDataTablePage.mouseOverIdColumn('1');
            await expect(await copyContentDataTablePage.getCopyContentTooltip()).toEqual('Click to copy');
            await copyContentDataTablePage.mouseOverNameColumn('First');
            await copyContentDataTablePage.dataTable.copyContentTooltipIsNotDisplayed();
        });

        it('[C307074] No tooltip is displayed when hover over a column with copyContent set to false', async () => {
            await copyContentDataTablePage.mouseOverNameColumn('Second');
            await copyContentDataTablePage.dataTable.copyContentTooltipIsNotDisplayed();
            await copyContentDataTablePage.clickOnNameColumn('Second');
            await notificationHistoryPage.checkNotifyNotContains('Second');
        });

        it('[C307075] No tooltip is displayed when hover over a column that has default value for copyContent property', async () => {
            await copyContentDataTablePage.mouseOverCreatedByColumn('Created one');
            await copyContentDataTablePage.dataTable.copyContentTooltipIsNotDisplayed();
            await copyContentDataTablePage.clickOnCreatedByColumn('Created one');
            await notificationHistoryPage.checkNotifyNotContains('Created One');
        });

        it('[C307073] A column value with copyContent set to true is copied when clicking on it', async () => {
            await copyContentDataTablePage.mouseOverIdColumn('1');
            await expect(await copyContentDataTablePage.getCopyContentTooltip()).toEqual('Click to copy');
            await copyContentDataTablePage.clickOnIdColumn('1');
            await notificationHistoryPage.checkNotifyContains('Text copied to clipboard');
            await copyContentDataTablePage.clickOnIdColumn('2');
            await notificationHistoryPage.checkNotifyContains('Text copied to clipboard');
            await copyContentDataTablePage.pasteClipboard();
            await expect(await copyContentDataTablePage.getClipboardInputText()).toEqual('2');
        });

        it('[C307100] A column value of type text and with copyContent set to true is copied when clicking on it', async () => {
            await dataTablePage.mouseOverIdColumn('1');
            await expect(await dataTablePage.getCopyContentTooltip()).toEqual('Click to copy');
            await dataTablePage.clickOnIdColumn('1');
            await notificationHistoryPage.checkNotifyContains('Text copied to clipboard');
            await dataTablePage.pasteClipboard();
            await expect(await dataTablePage.getClipboardInputText()).toEqual('1');
        });

        afterAll(async () => {
            await navigationBarPage.clickHomeButton();
        });
    });

    describe('Datatable component - Drag and Drop', () => {
        beforeAll(async () => {
            await navigationBarPage.navigateToDragAndDropDatatable();
            await dragAndDropDataTablePage.dataTable.waitForTableBody();
        });

        it('[C307984] Should trigger the event handling header-drop and cell-drop', async () => {
            const dragAndDropHeader = dragAndDropDataTablePage.getDropTargetIdColumnHeader();
            await dragAndDrop.dropFile(dragAndDropHeader, pngFile.location);
            await notificationHistoryPage.checkNotifyContains('Dropped data on [ id ] header');

            const dragAndDropCell = dragAndDropDataTablePage.getDropTargetIdColumnCell(1);
            await dragAndDrop.dropFile(dragAndDropCell, pngFile.location);
            await notificationHistoryPage.checkNotifyContains('Dropped data on [ id ] cell');
        });
    });
});
