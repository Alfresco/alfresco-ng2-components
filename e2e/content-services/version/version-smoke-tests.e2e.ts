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

import { LoginPage } from '../../pages/adf/loginPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { VersionManagePage } from '../../pages/adf/versionManagerPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { Util } from '../../util/util';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Version component', () => {

    let txtUploadedFile;
    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navigationBarPage = new NavigationBarPage();
    const versionManagePage = new VersionManagePage();

    let acsUser = new AcsUserModel();

    let txtFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT.file_location
    });

    let fileModelVersionTwo = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });

    let fileModelVersionThree = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_B.file_location
    });

    let fileModelVersionFor = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG_C.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_C.file_location
    });

    let fileModelVersionFive = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG_D.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_D.file_location
    });

    beforeAll(async (done) => {

        let uploadActions = new UploadActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        txtUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, txtFileModel.location, txtFileModel.name, '-my-');
        Object.assign(txtFileModel, txtUploadedFile.entry);

        txtFileModel.update(txtUploadedFile.entry);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        navigationBarPage.clickContentServicesButton();
        contentServicesPage.waitForTableBody();
        contentServicesPage.versionManagerContent(txtFileModel.name);

        done();
    });

    it('[C272768] Should be visible the first file version when you upload a file', () => {
        versionManagePage.checkUploadNewVersionsButtonIsDisplayed();

        versionManagePage.checkFileVersionExist('1.0');
        expect(versionManagePage.getFileVersionName('1.0')).toEqual(txtFileModel.name);
        expect(versionManagePage.getFileVersionDate('1.0')).not.toBeUndefined();
    });

    it('[C279995] Should show/hide the new upload file options when click on add New version/cancel button', () => {
        versionManagePage.showNewVersionButton.click();

        browser.driver.sleep(300);

        Util.waitUntilElementIsVisible(versionManagePage.cancelButton);
        Util.waitUntilElementIsVisible(versionManagePage.majorRadio);
        Util.waitUntilElementIsVisible(versionManagePage.minorRadio);
        Util.waitUntilElementIsVisible(versionManagePage.cancelButton);
        Util.waitUntilElementIsVisible(versionManagePage.commentText);
        Util.waitUntilElementIsVisible(versionManagePage.uploadNewVersionButton);

        versionManagePage.cancelButton.click();

        browser.driver.sleep(300);

        Util.waitUntilElementIsNotVisible(versionManagePage.cancelButton);
        Util.waitUntilElementIsNotVisible(versionManagePage.majorRadio);
        Util.waitUntilElementIsNotVisible(versionManagePage.minorRadio);
        Util.waitUntilElementIsNotVisible(versionManagePage.cancelButton);
        Util.waitUntilElementIsNotVisible(versionManagePage.commentText);
        Util.waitUntilElementIsNotVisible(versionManagePage.uploadNewVersionButton);

        Util.waitUntilElementIsVisible(versionManagePage.showNewVersionButton);
    });

    it('[C260244] Should show the version history when select a file with multiple version', () => {
        versionManagePage.showNewVersionButton.click();
        versionManagePage.uploadNewVersionFile(fileModelVersionTwo.location);

        versionManagePage.checkFileVersionExist('1.0');
        expect(versionManagePage.getFileVersionName('1.0')).toEqual(txtFileModel.name);
        expect(versionManagePage.getFileVersionDate('1.0')).not.toBeUndefined();

        versionManagePage.checkFileVersionExist('1.1');
        expect(versionManagePage.getFileVersionName('1.1')).toEqual(fileModelVersionTwo.name);
        expect(versionManagePage.getFileVersionDate('1.1')).not.toBeUndefined();
    });

    it('[C269084] Should be possible add a comment when add a new version', () => {
        versionManagePage.showNewVersionButton.click();
        versionManagePage.enterCommentText('Example comment text');
        versionManagePage.uploadNewVersionFile(fileModelVersionThree.location);

        versionManagePage.checkFileVersionExist('1.2');
        expect(versionManagePage.getFileVersionName('1.2')).toEqual(fileModelVersionThree.name);
        expect(versionManagePage.getFileVersionDate('1.2')).not.toBeUndefined();
        expect(versionManagePage.getFileVersionComment('1.2')).toEqual('Example comment text');
    });

    it('[C275719] Should be possible preview the file when you add a new version', () => {
        versionManagePage.showNewVersionButton.click();
        versionManagePage.clickMajorChange();

        versionManagePage.uploadNewVersionFile(fileModelVersionFor.location);

        versionManagePage.checkFileVersionExist('2.0');
        expect(versionManagePage.getFileVersionName('2.0')).toEqual(fileModelVersionFor.name);

        versionManagePage.showNewVersionButton.click();
        versionManagePage.clickMinorChange();

        versionManagePage.uploadNewVersionFile(fileModelVersionFive.location);

        versionManagePage.checkFileVersionExist('2.1');
        expect(versionManagePage.getFileVersionName('2.1')).toEqual(fileModelVersionFive.name);
    });

});
