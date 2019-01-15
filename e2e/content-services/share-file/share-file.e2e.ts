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

import { LoginPage } from '../../pages/adf/loginPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { DocumentListPage } from '../../pages/adf/content-services/documentListPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { ShareDialog } from '../../pages/adf/dialog/shareDialog';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { browser } from 'protractor';

describe('Share file', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const contentListPage = new DocumentListPage();
    const shareDialog = new ShareDialog();
    const navigationBarPage = new NavigationBarPage();
    const viewerPage = new ViewerPage();

    let acsUser = new AcsUserModel();
    let uploadActions = new UploadActions();

    let pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    let nodeId;

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        let pngUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, '-my-');

        nodeId = pngUploadedFile.entry.id;

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.navigateToDocumentList();

        done();
    });

    afterAll(async (done) => {
        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, nodeId);
        done();
    });

    describe('Shared link dialog', () => {

        beforeAll(async (done) => {

            loginPage.loginToContentServicesUsingUserModel(acsUser);

            contentServicesPage.navigateToDocumentList();

            contentServicesPage.waitForTableBody();

            contentListPage.clickRowToSelectWithRoot(pngFileModel.name);

            done();
        });

        it('[C286549] Should check automatically toggle button in Share dialog', () => {
            contentListPage.dataTablePage().clickRowToSelect(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.shareToggleButtonIsChecked();
            shareDialog.clickCloseButton();
            shareDialog.dialogIsClosed();
        });

        it('[C286544] Should display notification when clicking URL copy button', () => {
            contentListPage.dataTablePage().clickRowToSelect(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickShareLinkButton();
            shareDialog.checkNotificationWithMessage('Link copied to the clipboard');
            shareDialog.waitForNotificationToClose();
            shareDialog.clickShareLinkButton();
            shareDialog.checkNotificationWithMessage('Link copied to the clipboard');
            shareDialog.clickCloseButton();
            shareDialog.dialogIsClosed();
        });

        it('[C286543] Should be possible to close Share dialog', () => {
            contentListPage.dataTablePage().clickRowToSelect(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.checkShareLinkIsDisplayed();
            shareDialog.clickCloseButton();
            shareDialog.dialogIsClosed();
        });

        it('[C286578] Should disable today option in expiration day calendar', () => {
            contentListPage.dataTablePage().clickRowToSelect(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickDateTimePickerButton();
            shareDialog.calendarTodayDayIsDisabled();
        });

        it('[C286548] Should be possible to set expiry date for link', async () => {
            contentListPage.dataTablePage().clickRowToSelect(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickDateTimePickerButton();
            shareDialog.setDefaultDay();
            shareDialog.setDefaultHour();
            shareDialog.setDefaultMinutes();
            shareDialog.dateTimePickerDialogIsClosed();
            const value = await shareDialog.getExpirationDate();
            shareDialog.clickCloseButton();
            shareDialog.dialogIsClosed();
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.expirationDateInputHasValue(value);
            shareDialog.clickCloseButton();
            shareDialog.dialogIsClosed();
        });

        it('[C286578] Should disable today option in expiration day calendar', () => {
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickDateTimePickerButton();
            shareDialog.calendarTodayDayIsDisabled();
        });
    });

    describe('Shared link preview', () => {
        afterEach( (done) => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            contentServicesPage.navigateToDocumentList();
            done();
        });

        beforeAll(async (done) => {

            loginPage.loginToContentServicesUsingUserModel(acsUser);

            contentServicesPage.navigateToDocumentList();

            contentServicesPage.waitForTableBody();

            done();
        });

        it('[C286565] Should open file when logged user access shared link', async () => {
            contentListPage.dataTablePage().clickRowToSelect(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickShareLinkButton();
            shareDialog.checkNotificationWithMessage('Link copied to the clipboard');
            const sharedLink = await shareDialog.getShareLink();
            browser.get(sharedLink);
            viewerPage.checkFileNameIsDisplayed(pngFileModel.name);
        });

        it('[C287803] Should the URL be kept the same when opening the share dialog multiple times', async () => {
            contentListPage.dataTablePage().clickRowToSelect(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickShareLinkButton();
            shareDialog.checkNotificationWithMessage('Link copied to the clipboard');
            const sharedLink = await shareDialog.getShareLink();
            shareDialog.clickCloseButton();
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickShareLinkButton();
            shareDialog.checkNotificationWithMessage('Link copied to the clipboard');
            const secondSharedLink = await shareDialog.getShareLink();
            expect(sharedLink).toEqual(secondSharedLink);
            browser.get(sharedLink);
            viewerPage.checkFileNameIsDisplayed(pngFileModel.name);
        });

        it('[C286539] Should open file when non-logged user access shared link', async () => {
            contentListPage.dataTablePage().clickRowToSelect(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.checkShareLinkIsDisplayed();
            const sharedLink = await shareDialog.getShareLink();
            shareDialog.clickCloseButton();
            navigationBarPage.clickLogoutButton();
            browser.get(sharedLink);
            viewerPage.checkFileNameIsDisplayed(pngFileModel.name);
        });
    });
});
