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

import { LoginPage, BrowserActions, LocalStorageUtil, NotificationHistoryPage, UploadActions } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { ShareDialog } from '../../pages/adf/dialog/shareDialog';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import { browser } from 'protractor';
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

describe('Share file', () => {

    this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const contentListPage = contentServicesPage.getDocumentList();
    const shareDialog = new ShareDialog();
    const navigationBarPage = new NavigationBarPage();
    const viewerPage = new ViewerPage();
    const notificationHistoryPage = new NotificationHistoryPage();
    const acsUser = new AcsUserModel();
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    const pngFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    let nodeId;

    beforeAll(async (done) => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        const pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-');

        nodeId = pngUploadedFile.entry.id;

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        navigationBarPage.clickContentServicesButton();

        done();
    });

    afterAll(async (done) => {
        try {
            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
            await uploadActions.deleteFileOrFolder(nodeId);
        } catch (error) {
        }
        done();
    });

    describe('Shared link dialog', () => {

        beforeAll(() => {
            contentListPage.selectRow(pngFileModel.name);
        });

        afterEach(() => {
            BrowserActions.closeMenuAndDialogs();
        });

        it('[C286549] Should check automatically toggle button in Share dialog', () => {
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.shareToggleButtonIsChecked();
        });

        it('[C286544] Should display notification when clicking URL copy button', () => {
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickShareLinkButton();
            notificationHistoryPage.checkNotifyContains('Link copied to the clipboard');
        });

        it('[C286543] Should be possible to close Share dialog', () => {
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.checkShareLinkIsDisplayed();
        });

        it('[C286578] Should disable today option in expiration day calendar', () => {
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickDateTimePickerButton();
            shareDialog.calendarTodayDayIsDisabled();
        });

        it('[C286548] Should be possible to set expiry date for link', async () => {
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
            BrowserActions.closeMenuAndDialogs();
        });

        it('[C286578] Should disable today option in expiration day calendar', () => {
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickDateTimePickerButton();
            shareDialog.calendarTodayDayIsDisabled();
        });

        it('[C310329] Should be possible to set expiry date only for link', async () => {
            await LocalStorageUtil.setConfigField('sharedLinkDateTimePickerType', JSON.stringify('date'));
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickDateTimePickerButton();
            shareDialog.setDefaultDay();
            shareDialog.dateTimePickerDialogIsClosed();
            const value = await shareDialog.getExpirationDate();
            shareDialog.clickCloseButton();
            shareDialog.dialogIsClosed();
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.expirationDateInputHasValue(value);
            BrowserActions.closeMenuAndDialogs();
        });
    });

    describe('Shared link preview', () => {
        afterEach((done) => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);
            navigationBarPage.clickContentServicesButton();
            done();
        });

        beforeAll(async (done) => {
            loginPage.loginToContentServicesUsingUserModel(acsUser);

            navigationBarPage.clickContentServicesButton();
            contentServicesPage.waitForTableBody();

            done();
        });

        it('[C286565] Should open file when logged user access shared link', async () => {
            contentListPage.selectRow(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickShareLinkButton();
            notificationHistoryPage.checkNotifyContains('Link copied to the clipboard');
            const sharedLink = await shareDialog.getShareLink();
            BrowserActions.getUrl(sharedLink);
            viewerPage.checkFileNameIsDisplayed(pngFileModel.name);
        });

        it('[C287803] Should the URL be kept the same when opening the share dialog multiple times', async () => {
            contentListPage.selectRow(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickShareLinkButton();
            notificationHistoryPage.checkNotifyContains('Link copied to the clipboard');
            const sharedLink = await shareDialog.getShareLink();
            shareDialog.clickCloseButton();
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickShareLinkButton();
            notificationHistoryPage.checkNotifyContains('Link copied to the clipboard');
            const secondSharedLink = await shareDialog.getShareLink();
            expect(sharedLink).toEqual(secondSharedLink);
            BrowserActions.getUrl(sharedLink);
            viewerPage.checkFileNameIsDisplayed(pngFileModel.name);
        });

        it('[C286539] Should open file when non-logged user access shared link', async () => {
            contentListPage.selectRow(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.checkShareLinkIsDisplayed();
            const sharedLink = await shareDialog.getShareLink();
            shareDialog.clickCloseButton();
            navigationBarPage.clickLogoutButton();
            BrowserActions.getUrl(sharedLink);
            viewerPage.checkFileNameIsDisplayed(pngFileModel.name);
        });
    });
});
