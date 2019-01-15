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

describe('Version Properties', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const contentListPage = new DocumentListPage();
    const versionManagePage = new VersionManagePage();

    let acsUser = new AcsUserModel();

    let txtFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
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

    it('[C272817] Should NOT be present the download action when allowDownload property is false', () => {
        versionManagePage.disableDownload();

        versionManagePage.clickActionButton('1.0');

        Util.waitUntilElementIsNotVisible(element(by.css(`[id="adf-version-list-action-download-1.0"]`)));

        versionManagePage.closeActionButton();
    });

    it('[C279992] Should be present the download action when allowDownload property is true', () => {
        versionManagePage.enableDownload();

        versionManagePage.clickActionButton('1.0');

        Util.waitUntilElementIsVisible(element(by.css(`[id="adf-version-list-action-download-1.0"]`)));

        versionManagePage.closeActionButton();
    });

    it('[C269085] Should show/hide comments when showComments true/false', () => {
        versionManagePage.enableComments();

        versionManagePage.showNewVersionButton.click();
        versionManagePage.enterCommentText('Example comment text');
        versionManagePage.uploadNewVersionFile(fileModelVersionTwo.location);

        versionManagePage.checkFileVersionExist('1.1');
        expect(versionManagePage.getFileVersionComment('1.1')).toEqual('Example comment text');

        versionManagePage.disableComments();

        Util.waitUntilElementIsNotVisible(element(by.css(`[id="adf-version-list-item-comment-1.1"]`)));
    });

    it('[C277277] Should show/hide actions menu when readOnly is true/false', () => {
        versionManagePage.disableReadOnly();

        Util.waitUntilElementIsVisible(element(by.css(`[id="adf-version-list-action-menu-button-1.0"]`)));

        versionManagePage.enableReadOnly();

        Util.waitUntilElementIsNotVisible(element(by.css(`[id="adf-version-list-action-menu-button-1.0"]`)));
    });

    it('[C279994] Should show/hide upload new version button when readOnly is true/false', () => {
        versionManagePage.disableReadOnly();

        Util.waitUntilElementIsVisible(versionManagePage.showNewVersionButton);

        versionManagePage.enableReadOnly();

        Util.waitUntilElementIsNotVisible(versionManagePage.showNewVersionButton);
        Util.waitUntilElementIsNotVisible(versionManagePage.uploadNewVersionButton);
    });

});
