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

import { LoginPage } from '@alfresco/adf-testing';
import { DataTablePage } from '../../pages/adf/demo-shell/dataTablePage';
import { DataTableComponentPage } from '@alfresco/adf-testing';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import TestConfig = require('../../test.config');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { NotificationPage } from '../../pages/adf/notificationPage';
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
    const notificationPage = new NotificationPage();
    const dragAndDrop = new DropActions();
    const pngFile = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();
    });

    describe('Datatable component', () => {

        beforeAll(async (done) => {
            navigationBarPage.navigateToDatatable();

            done();
        });

        beforeEach(async (done) => {
            dataTablePage.clickReset();
            done();
        });

        it('[C91314] Should be possible add new row to the table', () => {
            dataTableComponent.numberOfRows().then((result) => {
                dataTablePage.addRow();
                expect(dataTableComponent.numberOfRows()).toEqual(result + 1);
                dataTablePage.addRow();
                expect(dataTableComponent.numberOfRows()).toEqual(result + 2);
            });
        });

        it('[C260039] Should be possible replace rows', () => {
            dataTablePage.replaceRows(1);
        });

        it('[C260041] Should be possible replace columns', () => {
            dataTablePage.replaceColumns();
        });

        it('[C277314] Should filter the table rows when the input filter is passed', () => {
            dataTablePage.replaceRows(1);
            dataTablePage.replaceColumns();
            expect(dataTableComponent.numberOfRows()).toEqual(4);
            dataTablePage.insertFilter('Name');
            expect(dataTableComponent.numberOfRows()).toEqual(3);
            dataTablePage.insertFilter('I');
            expect(dataTableComponent.numberOfRows()).toEqual(1);
        });
    });

    describe('Datatable component - copyContent', () => {

        beforeAll(async (done) => {
            navigationBarPage.navigateToCopyContentDatatable();
            done();
        });

        it('[C307037] A tooltip is displayed when mouseOver a column with copyContent set to true', () => {
            dataTablePage.mouseOverIdColumn('1');
            expect(dataTablePage.getCopyContentTooltip()).toEqual('Click to copy');
            dataTablePage.mouseOverNameColumn('Name 2');
            dataTablePage.dataTable.copyContentTooltipIsNotDisplayed();
        });

        it('[C307045] No tooltip is displayed when hover over a column with copyContent set to false', () => {
            dataTablePage.mouseOverNameColumn('Name 2');
            dataTablePage.dataTable.copyContentTooltipIsNotDisplayed();
            dataTablePage.clickOnNameColumn('Name 2');
            notificationPage.checkNotificationSnackBarIsNotDisplayed();
        });

        it('[C307046] No tooltip is displayed when hover over a column that has default value for copyContent property', () => {
            dataTablePage.mouseOverCreatedByColumn('Created One');
            dataTablePage.dataTable.copyContentTooltipIsNotDisplayed();
            dataTablePage.clickOnCreatedByColumn('Created One');
            notificationPage.checkNotificationSnackBarIsNotDisplayed();
        });

        xit('[C307040] A column value with copyContent set to true is copied when clicking on it', () => {
            dataTablePage.mouseOverIdColumn('1');
            expect(dataTablePage.getCopyContentTooltip()).toEqual('Click to copy');
            dataTablePage.clickOnIdColumn('1');
            notificationPage.checkNotifyContains('Text copied to clipboard');
            dataTablePage.pasteClipboard();
            expect(dataTablePage.getClipboardInputText()).toEqual('1');
            dataTablePage.clickOnIdColumn('2');
            notificationPage.checkNotifyContains('Text copied to clipboard');
            dataTablePage.clickOnIdColumn('3');
            notificationPage.checkNotifyContains('Text copied to clipboard');
            dataTablePage.pasteClipboard();
            expect(dataTablePage.getClipboardInputText()).toEqual('3');
        });

        it('[C307072] A tooltip is displayed when mouseOver a column with copyContent set to true', () => {
            copyContentDataTablePage.mouseOverIdColumn('1');
            expect(copyContentDataTablePage.getCopyContentTooltip()).toEqual('Click to copy');
            copyContentDataTablePage.mouseOverNameColumn('First');
            copyContentDataTablePage.dataTable.copyContentTooltipIsNotDisplayed();
        });

        it('[C307074] No tooltip is displayed when hover over a column with copyContent set to false', () => {
            copyContentDataTablePage.mouseOverNameColumn('Second');
            copyContentDataTablePage.dataTable.copyContentTooltipIsNotDisplayed();
            copyContentDataTablePage.clickOnNameColumn('Second');
            notificationPage.checkNotificationSnackBarIsNotDisplayed();
        });

        it('[C307075] No tooltip is displayed when hover over a column that has default value for copyContent property', () => {
            copyContentDataTablePage.mouseOverCreatedByColumn('Created one');
            copyContentDataTablePage.dataTable.copyContentTooltipIsNotDisplayed();
            copyContentDataTablePage.clickOnCreatedByColumn('Created one');
            notificationPage.checkNotificationSnackBarIsNotDisplayed();
        });

        xit('[C307073] A column value with copyContent set to true is copied when clicking on it', () => {
            copyContentDataTablePage.mouseOverIdColumn('1');
            expect(copyContentDataTablePage.getCopyContentTooltip()).toEqual('Click to copy');
            copyContentDataTablePage.clickOnIdColumn('1');
            notificationPage.checkNotifyContains('Text copied to clipboard');
            copyContentDataTablePage.pasteClipboard();
            expect(copyContentDataTablePage.getClipboardInputText()).toEqual('1');
            copyContentDataTablePage.clickOnIdColumn('2');
            notificationPage.checkNotifyContains('Text copied to clipboard');
            copyContentDataTablePage.mouseOverIdColumn('3');
            copyContentDataTablePage.clickOnIdColumn('3');
            notificationPage.checkNotifyContains('Text copied to clipboard');
            copyContentDataTablePage.pasteClipboard();
            expect(copyContentDataTablePage.getClipboardInputText()).toEqual('3');
        });

        it('[C307100] A column value of type text and with copyContent set to true is copied when clicking on it', () => {
            dataTablePage.mouseOverIdColumn('1');
            expect(dataTablePage.getCopyContentTooltip()).toEqual('Click to copy');
            dataTablePage.clickOnIdColumn('1');
            notificationPage.checkNotifyContains('Text copied to clipboard');
            dataTablePage.pasteClipboard();
            expect(dataTablePage.getClipboardInputText()).toEqual('1');
        });

        it('[C307101] A column value of type json and with copyContent set to true is copied when clicking on it', () => {
            const jsonValue = `{   "id": 4 }`;
            copyContentDataTablePage.mouseOverJsonColumn(2);
            expect(copyContentDataTablePage.getCopyContentTooltip()).toEqual('Click to copy');
            copyContentDataTablePage.clickOnJsonColumn(2);
            notificationPage.checkNotifyContains('Text copied to clipboard');
            copyContentDataTablePage.pasteClipboard();
            expect(copyContentDataTablePage.getClipboardInputText()).toContain(jsonValue);
        });
    });

    describe('Datatable component - Drag and Drop', () => {

        beforeAll(async (done) => {
            navigationBarPage.navigateToDragAndDropDatatable();
            done();
        });

        it('[C307984] Should trigger the event handling header-drop and cell-drop', () => {
            const dragAndDropHeader = dragAndDropDataTablePage.getDropTargetIdColumnHeader();
            dragAndDrop.dropFile(dragAndDropHeader, pngFile.location);
            notificationPage.checkNotifyContains('Dropped data on [ id ] header');
            notificationPage.checkNotificationSnackBarIsNotDisplayed();

            const dragAndDropCell = dragAndDropDataTablePage.getDropTargetIdColumnCell(1);
            dragAndDrop.dropFile(dragAndDropCell, pngFile.location);
            notificationPage.checkNotifyContains('Dropped data on [ id ] cell');
        });
    });
});
