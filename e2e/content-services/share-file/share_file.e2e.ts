/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import ContentListPage = require('../../pages/adf/dialog/contentList');
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { ShareDialog } from '../../pages/adf/dialog/shareDialog';

import AcsUserModel = require('../../models/ACS/acsUserModel');
import FileModel = require('../../models/ACS/fileModel');

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { browser } from 'protractor';

describe('Share file', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const contentListPage = new ContentListPage();
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
        afterEach(async (done) => {
            await browser.refresh();
            done();
        });

        it('[C286549] Share toggle button is checked automatically', () => {
            contentListPage.clickRowToSelect(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.shareToggleButtonIsChecked();
        });

        it('[C286544] Copy shared link button action shows notification', () => {
            contentListPage.clickRowToSelect(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickShareLinkButton();
            shareDialog.checkNotificationWithMessage('Link copied to the clipboard');
        });

        it('[C286328] User can close the Share dialog', () => {
            contentListPage.clickRowToSelect(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.checkShareLinkIsDisplayed();
            shareDialog.clickCloseButton();
            shareDialog.dialogIsClosed();
        });

        it('[C286578] Expiration day calendar should have today day option disabled', () => {
            contentListPage.clickRowToSelect(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickDateTimePickerButton();
            shareDialog.calendarTodayDayIsDisabled();
        });

        it('[C286548] User can set when the shared file link expires', async () => {
            contentListPage.clickRowToSelect(pngFileModel.name);
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
        });
    });

    describe('Shared link preview', () => {
        afterEach(async (done) => {
            await loginPage.loginToContentServicesUsingUserModel(acsUser);
            await contentServicesPage.navigateToDocumentList();
            done();
        });

        it('[C286565] Logged user can open shared link', async () => {
            contentListPage.clickRowToSelect(pngFileModel.name);
            contentServicesPage.clickShareButton();
            shareDialog.checkDialogIsDisplayed();
            shareDialog.clickShareLinkButton();
            shareDialog.checkNotificationWithMessage('Link copied to the clipboard');
            const sharedLink = await shareDialog.getShareLink();
            browser.get(sharedLink);
            viewerPage.checkFileNameIsDisplayed(pngFileModel.name);
        });

        it('[C286539] A non-logged user should see the shared file in the viewer', async () => {
            contentListPage.clickRowToSelect(pngFileModel.name);
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
