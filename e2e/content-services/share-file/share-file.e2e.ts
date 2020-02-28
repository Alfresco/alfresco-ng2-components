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
    LoginPage,
    BrowserActions,
    LocalStorageUtil,
    NotificationHistoryPage,
    UploadActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/content-services.page';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';
import { ShareDialogPage } from '../../pages/adf/dialog/share-dialog.page';
import { AcsUserModel } from '../../models/ACS/acs-user.model';
import { FileModel } from '../../models/ACS/file.model';
import { browser } from 'protractor';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { CustomSourcesPage } from '../../pages/adf/demo-shell/custom-sources.page';

describe('Share file', () => {

    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const contentListPage = contentServicesPage.getDocumentList();
    const shareDialog = new ShareDialogPage();
    const navigationBarPage = new NavigationBarPage();
    const customSourcesPage = new CustomSourcesPage();
    const viewerPage = new ViewerPage();
    const notificationHistoryPage = new NotificationHistoryPage();
    const acsUser = new AcsUserModel();
    const uploadActions = new UploadActions(this.alfrescoJsApi);
    const pngFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    let nodeId;

    beforeAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        const pngUploadedFile = await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-');

        nodeId = pngUploadedFile.entry.id;
    });

    afterAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await uploadActions.deleteFileOrFolder(nodeId);
    });

    describe('Shared link dialog', () => {

        beforeAll(async () => {
            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            await navigationBarPage.clickContentServicesButton();
            await contentListPage.selectRow(pngFileModel.name);
            await BrowserActions.closeMenuAndDialogs();
        });

        it('[C286549] Should check automatically toggle button in Share dialog', async () => {
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.shareToggleButtonIsChecked();
            await BrowserActions.closeMenuAndDialogs();
        });

        it('[C286544] Should display notification when clicking URL copy button', async () => {
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.clickShareLinkButton();
            await BrowserActions.closeMenuAndDialogs();
            await notificationHistoryPage.checkNotifyContains('Link copied to the clipboard');
        });

        it('[C286543] Should be possible to close Share dialog', async () => {
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.checkShareLinkIsDisplayed();
            await BrowserActions.closeMenuAndDialogs();
        });

        it('[C286578] Should disable today option in expiration day calendar', async () => {
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.clickDateTimePickerButton();
            await shareDialog.calendarTodayDayIsDisabled();
            await BrowserActions.closeMenuAndDialogs();
        });

        it('[C286548] Should be possible to set expiry date for link', async () => {
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.clickDateTimePickerButton();
            await shareDialog.setDefaultDay();
            await shareDialog.setDefaultHour();
            await shareDialog.setDefaultMinutes();
            await shareDialog.dateTimePickerDialogIsClosed();
            const value = await shareDialog.getExpirationDate();
            await shareDialog.clickCloseButton();
            await shareDialog.dialogIsClosed();
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.expirationDateInputHasValue(value);
            await BrowserActions.closeMenuAndDialogs();
        });

        it('[C286578] Should disable today option in expiration day calendar', async () => {
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.clickDateTimePickerButton();
            await shareDialog.calendarTodayDayIsDisabled();
            await BrowserActions.closeMenuAndDialogs();
        });

        it('[C310329] Should be possible to set expiry date only for link', async () => {
            await LocalStorageUtil.setConfigField('sharedLinkDateTimePickerType', JSON.stringify('date'));
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.clickDateTimePickerButton();
            await shareDialog.setDefaultDay();
            await shareDialog.dateTimePickerDialogIsClosed();
            const value = await shareDialog.getExpirationDate();
            await shareDialog.clickCloseButton();
            await shareDialog.dialogIsClosed();
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.expirationDateInputHasValue(value);
            await BrowserActions.closeMenuAndDialogs();
        });
    });

    describe('Shared link preview', () => {

        beforeEach(async () => {
            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            await navigationBarPage.clickContentServicesButton();
            await contentServicesPage.waitForTableBody();
        });

        it('[C286565] Should open file when logged user access shared link', async () => {
            await contentListPage.selectRow(pngFileModel.name);
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.clickShareLinkButton();
            const sharedLink = await shareDialog.getShareLink();
            await BrowserActions.closeMenuAndDialogs();
            await notificationHistoryPage.checkNotifyContains('Link copied to the clipboard');
            await BrowserActions.getUrl(sharedLink);
            await viewerPage.checkFileNameIsDisplayed(pngFileModel.name);
        });

        it('[C287803] Should the URL be kept the same when opening the share dialog multiple times', async () => {
            await contentListPage.selectRow(pngFileModel.name);
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.clickShareLinkButton();
            const sharedLink = await shareDialog.getShareLink();
            await shareDialog.clickCloseButton();
            await notificationHistoryPage.checkNotifyContains('Link copied to the clipboard');
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.clickShareLinkButton();
            const secondSharedLink = await shareDialog.getShareLink();
            await BrowserActions.closeMenuAndDialogs();
            await notificationHistoryPage.checkNotifyContains('Link copied to the clipboard');
            await expect(sharedLink).toEqual(secondSharedLink);
            await BrowserActions.getUrl(sharedLink);
            await viewerPage.checkFileNameIsDisplayed(pngFileModel.name);
        });

        it('[C286539] Should open file when non-logged user access shared link', async () => {
            await contentListPage.selectRow(pngFileModel.name);
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.checkShareLinkIsDisplayed();
            const sharedLink = await shareDialog.getShareLink();
            await shareDialog.clickCloseButton();
            await navigationBarPage.clickLogoutButton();
            await BrowserActions.getUrl(sharedLink);
            await viewerPage.checkFileNameIsDisplayed(pngFileModel.name);
        });

        it('[C260153] Should shared files listed in share files custom resources', async () => {
            await contentListPage.selectRow(pngFileModel.name);
            await contentServicesPage.clickShareButton();
            await shareDialog.checkDialogIsDisplayed();
            await shareDialog.clickShareLinkButton();

            await BrowserActions.closeMenuAndDialogs();
            await browser.sleep(30000); // it get really long to update the shared link file list

            await customSourcesPage.navigateToCustomSources();
            await customSourcesPage.selectSharedLinksSourceType();
            await customSourcesPage.checkRowIsDisplayed(pngFileModel.name);
        });
    });
});
