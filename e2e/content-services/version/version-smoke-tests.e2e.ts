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

import { browser } from 'protractor';

import { LoginPage, UploadActions, BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { VersionManagePage } from '../../pages/adf/versionManagerPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Version component', () => {

    let txtUploadedFile;
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const versionManagePage = new VersionManagePage();

    const acsUser = new AcsUserModel();

    const txtFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT.file_location
    });

    const fileModelVersionTwo = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    const fileModelVersionThree = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_B.file_location
    });

    const fileModelVersionFor = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG_C.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_C.file_location
    });

    const fileModelVersionFive = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG_D.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_D.file_location
    });
    this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });

    const uploadActions = new UploadActions(this.alfrescoJsApi);

    beforeAll(async () => {
        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        txtUploadedFile = await uploadActions.uploadFile(txtFileModel.location, txtFileModel.name, '-my-');
        Object.assign(txtFileModel, txtUploadedFile.entry);

        txtFileModel.update(txtUploadedFile.entry);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        await navigationBarPage.clickContentServicesButton();
        await contentServicesPage.waitForTableBody();
        await contentServicesPage.versionManagerContent(txtFileModel.name);

    });

    it('[C272768] Should be visible the first file version when you upload a file', async () => {
        await versionManagePage.checkUploadNewVersionsButtonIsDisplayed();

        await versionManagePage.checkFileVersionExist('1.0');
        await expect(await versionManagePage.getFileVersionName('1.0')).toEqual(txtFileModel.name);
        await expect(await versionManagePage.getFileVersionDate('1.0')).not.toBeUndefined();
    });

    it('[C279995] Should show/hide the new upload file options when click on add New version/cancel button', async () => {
        await BrowserActions.click(versionManagePage.showNewVersionButton);

        await BrowserVisibility.waitUntilElementIsVisible(versionManagePage.cancelButton);
        await BrowserVisibility.waitUntilElementIsVisible(versionManagePage.majorRadio);
        await BrowserVisibility.waitUntilElementIsVisible(versionManagePage.minorRadio);
        await BrowserVisibility.waitUntilElementIsVisible(versionManagePage.cancelButton);
        await BrowserVisibility.waitUntilElementIsVisible(versionManagePage.commentText);
        await BrowserVisibility.waitUntilElementIsVisible(versionManagePage.uploadNewVersionButton);

        await BrowserActions.click(versionManagePage.cancelButton);

        await BrowserVisibility.waitUntilElementIsNotVisible(versionManagePage.cancelButton);
        await BrowserVisibility.waitUntilElementIsNotVisible(versionManagePage.majorRadio);
        await BrowserVisibility.waitUntilElementIsNotVisible(versionManagePage.minorRadio);
        await BrowserVisibility.waitUntilElementIsNotVisible(versionManagePage.cancelButton);
        await BrowserVisibility.waitUntilElementIsNotVisible(versionManagePage.commentText);
        await BrowserVisibility.waitUntilElementIsNotVisible(versionManagePage.uploadNewVersionButton);

        await BrowserVisibility.waitUntilElementIsVisible(versionManagePage.showNewVersionButton);
    });

    it('[C260244] Should show the version history when select a file with multiple version', async () => {
        await BrowserActions.click(versionManagePage.showNewVersionButton);
        await versionManagePage.uploadNewVersionFile(fileModelVersionTwo.location);

        await versionManagePage.checkFileVersionExist('1.0');
        await expect(await versionManagePage.getFileVersionName('1.0')).toEqual(txtFileModel.name);
        await expect(await versionManagePage.getFileVersionDate('1.0')).not.toBeUndefined();

        await versionManagePage.checkFileVersionExist('1.1');
        await expect(await versionManagePage.getFileVersionName('1.1')).toEqual(fileModelVersionTwo.name);
        await expect(await versionManagePage.getFileVersionDate('1.1')).not.toBeUndefined();
    });

    it('[C269084] Should be possible add a comment when add a new version', async () => {
        await BrowserActions.click(versionManagePage.showNewVersionButton);
        await versionManagePage.enterCommentText('Example comment text');
        await versionManagePage.uploadNewVersionFile(fileModelVersionThree.location);

        await versionManagePage.checkFileVersionExist('1.2');
        await expect(await versionManagePage.getFileVersionName('1.2')).toEqual(fileModelVersionThree.name);
        await expect(await versionManagePage.getFileVersionDate('1.2')).not.toBeUndefined();
        await expect(await versionManagePage.getFileVersionComment('1.2')).toEqual('Example comment text');
    });

    it('[C275719] Should be possible preview the file when you add a new version', async () => {
        await BrowserActions.click(versionManagePage.showNewVersionButton);
        await versionManagePage.clickMajorChange();

        await versionManagePage.uploadNewVersionFile(fileModelVersionFor.location);

        await versionManagePage.checkFileVersionExist('2.0');
        await expect(await versionManagePage.getFileVersionName('2.0')).toEqual(fileModelVersionFor.name);

        await BrowserActions.click(versionManagePage.showNewVersionButton);
        await versionManagePage.clickMinorChange();

        await versionManagePage.uploadNewVersionFile(fileModelVersionFive.location);

        await versionManagePage.checkFileVersionExist('2.1');
        await expect(await versionManagePage.getFileVersionName('2.1')).toEqual(fileModelVersionFive.name);
    });

});
