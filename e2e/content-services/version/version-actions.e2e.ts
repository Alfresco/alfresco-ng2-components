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

import { by, element } from 'protractor';

import { LoginPage } from '../../pages/adf/loginPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { DocumentListPage } from '../../pages/adf/content-services/documentListPage';
import { VersionManagePage } from '../../pages/adf/versionManagerPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { Util } from '../../util/util';
import path = require('path');

describe('Version component actions', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const contentListPage = new DocumentListPage();
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

    beforeAll(async (done) => {

        let uploadActions = new UploadActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        let txtUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, txtFileModel.location, txtFileModel.name, '-my-');

        Object.assign(txtFileModel, txtUploadedFile.entry);

        txtFileModel.update(txtUploadedFile.entry);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.navigateToDocumentList();
        contentListPage.versionManagerContent(txtFileModel.name);

        done();
    });

    it('[C280003] Should not be possible delete a file version if there is only one version', () => {
        versionManagePage.clickActionButton('1.0');
        expect(element(by.css(`[id="adf-version-list-action-delete-1.0"]`)).isEnabled()).toBe(false);
        versionManagePage.closeActionButton();
        Util.waitUntilElementIsNotOnPage(element(by.css(`[id="adf-version-list-action-delete-1.0"]`)));
    });

    it('[C280004] Should not be possible restore the version if there is only one version', () => {
        versionManagePage.clickActionButton('1.0');
        expect(element(by.css(`[id="adf-version-list-action-restore-1.0"]`)).isEnabled()).toBe(false);
        versionManagePage.closeActionButton();
        Util.waitUntilElementIsNotOnPage(element(by.css(`[id="adf-version-list-action-restore-1.0"]`)));
    });

    it('[C280005] Should be showed all the default action when you have more then one version', () => {
        versionManagePage.showNewVersionButton.click();

        versionManagePage.uploadNewVersionFile(fileModelVersionTwo.location);

        versionManagePage.clickActionButton('1.1').checkActionsArePresent('1.1');

        versionManagePage.closeActionButton();
    });

    it('[C269081] Should be possible download all the version of a file', () => {
        versionManagePage.downloadFileVersion('1.0');

        expect(Util.fileExists(path.join(__dirname, 'downloads', txtFileModel.name), 20)).toBe(true);

        versionManagePage.downloadFileVersion('1.1');

        expect(Util.fileExists(path.join(__dirname, 'downloads', fileModelVersionTwo.name), 20)).toBe(true);
    });

    it('[C272819] Should be possible delete a version when click on delete version action', () => {
        versionManagePage.deleteFileVersion('1.1');

        versionManagePage.clickAcceptConfirm();

        versionManagePage.checkFileVersionNotExist('1.1');
        versionManagePage.checkFileVersionExist('1.0');
    });

    it('[C280006] Should be possible prevent a version to be deleted when click on No on the confirm dialog', () => {
        versionManagePage.showNewVersionButton.click();

        versionManagePage.uploadNewVersionFile(fileModelVersionTwo.location);

        versionManagePage.checkFileVersionExist('1.1');

        versionManagePage.deleteFileVersion('1.1');

        versionManagePage.clickCancelConfirm();

        versionManagePage.checkFileVersionExist('1.1');
        versionManagePage.checkFileVersionExist('1.0');
    });

    it('[C280007] Should be possible restore an old version of your file', () => {
        versionManagePage.restoreFileVersion('1.0');

        versionManagePage.checkFileVersionExist('2.0');
    });

});
