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

import { by, element, browser } from 'protractor';
import { LoginPage, UploadActions, BrowserVisibility, BrowserActions } from '@alfresco/adf-testing';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { VersionManagePage } from '../../pages/adf/versionManagerPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';

describe('Version Properties', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const versionManagePage = new VersionManagePage();
    const navigationBarPage = new NavigationBarPage();

    const acsUser = new AcsUserModel();

    const txtFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });

    const fileModelVersionTwo = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    beforeAll(async (done) => {

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        await this.alfrescoJsApi.login(acsUser.id, acsUser.password);

        const txtUploadedFile = await uploadActions.uploadFile(txtFileModel.location, txtFileModel.name, '-my-');

        Object.assign(txtFileModel, txtUploadedFile.entry);

        txtFileModel.update(txtUploadedFile.entry);

        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        navigationBarPage.clickContentServicesButton();
        contentServicesPage.waitForTableBody();
        contentServicesPage.versionManagerContent(txtFileModel.name);

        done();
    });

    it('[C272817] Should NOT be present the download action when allowDownload property is false', () => {
        versionManagePage.disableDownload();

        versionManagePage.clickActionButton('1.0');

        BrowserVisibility.waitUntilElementIsNotVisible(element(by.css(`[id="adf-version-list-action-download-1.0"]`)));

        versionManagePage.closeDisabledActionsMenu();
    });

    it('[C279992] Should be present the download action when allowDownload property is true', () => {
        versionManagePage.enableDownload();

        versionManagePage.clickActionButton('1.0');

        BrowserVisibility.waitUntilElementIsVisible(element(by.css(`[id="adf-version-list-action-download-1.0"]`)));

        versionManagePage.closeActionsMenu();
    });

    it('[C269085] Should show/hide comments when showComments true/false', () => {
        versionManagePage.enableComments();

        BrowserActions.click(versionManagePage.showNewVersionButton);

        versionManagePage.enterCommentText('Example comment text');
        versionManagePage.uploadNewVersionFile(fileModelVersionTwo.location);

        versionManagePage.checkFileVersionExist('1.1');
        expect(versionManagePage.getFileVersionComment('1.1')).toEqual('Example comment text');

        versionManagePage.disableComments();

        BrowserVisibility.waitUntilElementIsNotVisible(element(by.css(`[id="adf-version-list-item-comment-1.1"]`)));
    });

    it('[C277277] Should show/hide actions menu when readOnly is true/false', () => {
        versionManagePage.disableReadOnly();

        BrowserVisibility.waitUntilElementIsVisible(element(by.css(`[id="adf-version-list-action-menu-button-1.0"]`)));

        versionManagePage.enableReadOnly();

        BrowserVisibility.waitUntilElementIsNotVisible(element(by.css(`[id="adf-version-list-action-menu-button-1.0"]`)));
    });

    it('[C279994] Should show/hide upload new version button when readOnly is true/false', () => {
        versionManagePage.disableReadOnly();

        BrowserVisibility.waitUntilElementIsVisible(versionManagePage.showNewVersionButton);

        versionManagePage.enableReadOnly();

        BrowserVisibility.waitUntilElementIsNotVisible(versionManagePage.showNewVersionButton);
        BrowserVisibility.waitUntilElementIsNotVisible(versionManagePage.uploadNewVersionButton);
    });

});
