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

import { browser, by, element } from 'protractor';

import { LoginPage } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { VersionManagePage } from '../../pages/adf/versionManagerPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';

import resources = require('../../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UploadActions } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { BrowserVisibility, FileBrowserUtil, BrowserActions } from '@alfresco/adf-testing';
import { UploadDialog } from '../../pages/adf/dialog/uploadDialog';

describe('Version component actions', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const versionManagePage = new VersionManagePage();
    const navigationBarPage = new NavigationBarPage();
    const uploadDialog = new UploadDialog();

    const acsUser = new AcsUserModel();

    const txtFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT.file_location
    });

    const fileModelVersionTwo = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT.file_location
    });
    let uploadActions;

    const bigFileToCancel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.LARGE_FILE.file_name,
        'location': resources.Files.ADF_DOCUMENTS.LARGE_FILE.file_location
    });

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });
        uploadActions = new UploadActions(this.alfrescoJsApi);
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);
        const txtUploadedFile = await uploadActions.uploadFile(txtFileModel.location, txtFileModel.name, '-my-');
        Object.assign(txtFileModel, txtUploadedFile.entry);
        txtFileModel.update(txtUploadedFile.entry);
        await loginPage.loginToContentServicesUsingUserModel(acsUser);
        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.waitForTableBody();

    });

    beforeEach(async () => {
        await contentServicesPage.versionManagerContent(txtFileModel.name);
    });

    afterEach(async () => {
        await BrowserActions.closeMenuAndDialogs();
    });

    it('[C280003] Should not be possible delete a file version if there is only one version', async () => {
        await versionManagePage.clickActionButton('1.0');
        await expect(await element(by.css(`[id="adf-version-list-action-delete-1.0"]`)).isEnabled()).toBe(false);
        await versionManagePage.closeActionsMenu();
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.css(`[id="adf-version-list-action-delete-1.0"]`)));
    });

    it('[C280004] Should not be possible restore the version if there is only one version', async () => {
        await versionManagePage.clickActionButton('1.0');
        await expect(await element(by.css(`[id="adf-version-list-action-restore-1.0"]`)).isEnabled()).toBe(false);
        await versionManagePage.closeActionsMenu();
        await BrowserVisibility.waitUntilElementIsNotVisible(element(by.css(`[id="adf-version-list-action-restore-1.0"]`)));
    });

    it('[C280005] Should be showed all the default action when you have more then one version', async () => {
        await BrowserActions.click(versionManagePage.showNewVersionButton);

        await versionManagePage.uploadNewVersionFile(fileModelVersionTwo.location);

        await versionManagePage.clickActionButton('1.1');
        await versionManagePage.checkActionsArePresent('1.1');

        await versionManagePage.closeActionsMenu();

        await versionManagePage.closeVersionDialog();

        await uploadDialog.clickOnCloseButton();
    });

    it('[C269081] Should be possible download all the version of a file', async () => {
        await versionManagePage.downloadFileVersion('1.0');
        await expect(await FileBrowserUtil.isFileDownloaded(txtFileModel.name)).toBe(true, `${txtFileModel.name} not downloaded`);
        await versionManagePage.downloadFileVersion('1.1');
        await expect(await FileBrowserUtil.isFileDownloaded(fileModelVersionTwo.name)).toBe(true, `${fileModelVersionTwo.name} not downloaded`);
    });

    it('[C272819] Should be possible delete a version when click on delete version action', async () => {
        await versionManagePage.deleteFileVersion('1.1');

        await versionManagePage.clickAcceptConfirm();

        await versionManagePage.checkFileVersionNotExist('1.1');
        await versionManagePage.checkFileVersionExist('1.0');
    });

    it('[C280006] Should be possible prevent a version to be deleted when click on No on the confirm dialog', async () => {
        await BrowserActions.click(versionManagePage.showNewVersionButton);

        await versionManagePage.uploadNewVersionFile(fileModelVersionTwo.location);

        await versionManagePage.checkFileVersionExist('1.1');

        await versionManagePage.deleteFileVersion('1.1');

        await versionManagePage.clickCancelConfirm();

        await versionManagePage.checkFileVersionExist('1.1');
        await versionManagePage.checkFileVersionExist('1.0');
        await versionManagePage.closeVersionDialog();
    });

    it('[C280007] Should be possible to restore an old version of your file and the document list updated', async () => {
        await contentServicesPage.versionManagerContent(fileModelVersionTwo.name);
        await versionManagePage.restoreFileVersion('1.0');
        await versionManagePage.checkFileVersionExist('2.0');
        await versionManagePage.closeVersionDialog();
        await contentServicesPage.waitForTableBody();
        await contentServicesPage.checkContentIsDisplayed(txtFileModel.name);
    });

    it('[C307033] Should be possible to cancel the upload of a new version', async () => {
        await browser.refresh();
        await contentServicesPage.versionManagerContent(txtFileModel.name);
        await browser.executeScript(' setTimeout(() => {document.querySelector(\'mat-icon[class*="adf-file-uploading-row__action"]\').click();}, 1000)');

        await BrowserActions.click(versionManagePage.showNewVersionButton);

        await versionManagePage.uploadNewVersionFile(bigFileToCancel.location);
        await versionManagePage.closeVersionDialog();

        await expect(await uploadDialog.getTitleText()).toEqual('Upload canceled');

        await browser.refresh();

        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.waitForTableBody();
        await contentServicesPage.checkContentIsDisplayed(txtFileModel.name);
    });

});
