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

import { LoginPage, NotificationHistoryPage } from '@alfresco/adf-testing';
import { DataTablePage } from '../../pages/adf/demo-shell/dataTablePage';
import { DataTableComponentPage } from '@alfresco/adf-testing';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { browser } from 'protractor';

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { DropActions } from '../../actions/drop.actions';
import resources = require('../../util/resources');
import { FileModel } from '../../models/ACS/fileModel';

describe('Datatable component', () => {

    const dataTablePage = new DataTablePage('defaultTable');
    const copyContentDataTablePage = new DataTablePage('copyClipboardDataTable');
    const dragAndDropDataTablePage = new DataTablePage();
    const loginPage = new LoginPage();
    const acsUser = new AcsUserModel();
    const navigationBarPage = new NavigationBarPage();
    const dataTableComponent = new DataTableComponentPage();
    const notificationHistoryPage = new NotificationHistoryPage();
    const dragAndDrop = new DropActions();
    const pngFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    describe('Datatable component', () => {

        beforeAll(async () => {
            await navigationBarPage.navigateToDatatable();
            await dataTablePage.dataTable.waitForTableBody();
        });

        beforeEach(async () => {
            await dataTablePage.clickReset();
        });

        it('[C91314] Should be possible add new row to the table', async () => {
            const result = await dataTableComponent.numberOfRows();
            await dataTablePage.addRow();
            await expect(await dataTableComponent.numberOfRows()).toEqual(result + 1);
            await dataTablePage.addRow();
            await expect(await dataTableComponent.numberOfRows()).toEqual(result + 2);
        });

        it('[C260039] Should be possible replace rows', async () => {
            await dataTablePage.replaceRows(1);
        });

        it('[C260041] Should be possible replace columns', async () => {
            await dataTablePage.replaceColumns();
        });

        it('[C277314] Should filter the table rows when the input filter is passed', async () => {
            await dataTablePage.replaceRows(1);
            await dataTablePage.replaceColumns();
            await expect(await dataTableComponent.numberOfRows()).toEqual(4);
            await dataTablePage.insertFilter('Name');
            await expect(await dataTableComponent.numberOfRows()).toEqual(3);
            await dataTablePage.insertFilter('I');
            await expect(await dataTableComponent.numberOfRows()).toEqual(1);
        });
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

        it('[C307101] A column value of type json and with copyContent set to true is copied when clicking on it', async () => {
            const jsonValue = `{   "id": 4 }`;
            await copyContentDataTablePage.mouseOverJsonColumn(2);
            await expect(await copyContentDataTablePage.getCopyContentTooltip()).toEqual('Click to copy');
            await copyContentDataTablePage.clickOnJsonColumn(2);
            await notificationHistoryPage.checkNotifyContains('Text copied to clipboard');
            await copyContentDataTablePage.pasteClipboard();
            await expect(await copyContentDataTablePage.getClipboardInputText()).toContain(jsonValue);
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
