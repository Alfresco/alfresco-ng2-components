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

import { browser } from 'protractor';

import TestConfig = require('../test.config');

import LoginPage = require('../pages/adf/loginPage');
import ContentServicesPage = require('../pages/adf/contentServicesPage');
import ViewerPage = require('../pages/adf/viewerPage');

import resources = require('../util/resources');

import FileModel = require('../models/ACS/fileModel');
import AcsUserModel = require('../models/ACS/acsUserModel');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../actions/ACS/upload.actions';

describe('Viewer - properties', () => {

    let acsUser = new AcsUserModel();
    let viewerPage = new ViewerPage();
    let contentServicesPage = new ContentServicesPage();
    let loginPage = new LoginPage();

    let pngFile = new FileModel({
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

        let pngFileUploaded = await uploadActions.uploadFile(this.alfrescoJsApi, pngFile.location, pngFile.name, '-my-');
        Object.assign(pngFile, pngFileUploaded.entry);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.goToDocumentList();

        contentServicesPage.checkAcsContainer();

        viewerPage.viewFile(pngFile.name);

        viewerPage.clickLeftSidebarButton();
        viewerPage.checkLeftSideBarIsDisplayed();

        done();
    });

    afterAll(async (done) => {
        let uploadActions = new UploadActions();

        await uploadActions.deleteFilesOrFolder(this.alfrescoJsApi, pngFile.getId());

        done();
    });

    it('[C260066] Should Show/Hide viewer toolbar when showToolbar is true/false', () => {
        viewerPage.checkToolbarIsDisplayed();
        viewerPage.disableToolbar();
        viewerPage.checkToolbarIsNotDisplayed();
        viewerPage.enableToolbar();
    });

    it('[C260076] Should Show/Hide back button when allowGoBack is true/false', () => {
        viewerPage.checkGoBackIsDisplayed();
        viewerPage.disableGoBack();
        viewerPage.checkGoBackIsNotDisplayed();
        viewerPage.enableGoBack();
    });

    it('[C260077] Should Show toolbar options dropdown when adf-viewer-open-with directive is used', () => {
        viewerPage.checkToolbarOptionsIsNotDisplayed();
        viewerPage.enableToolbarOptions();
        viewerPage.checkToolbarOptionsIsDisplayed();
        viewerPage.disableToolbarOptions();
    });

    it('[C260079] Should Show/Hide download button when allowDownload is true/false', () => {
        viewerPage.checkDownloadButtonDisplayed();
        viewerPage.disableDownload();
        viewerPage.checkDownloadButtonIsNotDisplayed();
        viewerPage.enableDownload();
    });

    it('[C260082] Should Show/Hide print button when allowPrint is true/false', () => {
        viewerPage.checkPrintButtonIsDisplayed();
        viewerPage.disablePrint();
        viewerPage.checkPrintButtonIsNotDisplayed();
        viewerPage.enablePrint();
    });

    it('[C260087] Should Show/Hide share button when allowShare is true/false', () => {
        viewerPage.checkShareButtonDisplayed();
        viewerPage.disableShare();
        viewerPage.checkShareButtonIsNotDisplayed();
        viewerPage.enableShare();
    });

    it('[C260092] Should show adf-viewer-toolbar-actions directive buttons when adf-viewer-toolbar-actions is used', () => {
        viewerPage.checkMoreActionsDisplayed();

        viewerPage.disableMoreActions();

        viewerPage.checkMoreActionsIsNotDisplayed();

        viewerPage.enableMoreActions();
    });

    it('[C260074] Should show a custom file name when displayName property is used', () => {
        viewerPage.checkFileNameIsDisplayed(pngFile.name);

        viewerPage.enableCustomName();

        viewerPage.enterCustomName('test custom title');
        viewerPage.checkFileNameIsDisplayed('test custom title');

        viewerPage.disableCustomName();
    });

    it('[C260090] Sould showSidebar allow right info-drawer to be shown', () => {
        viewerPage.clickToggleRightSidebar();
        viewerPage.checkInfoSideBarIsDisplayed();

        viewerPage.clickToggleRightSidebar();
        viewerPage.checkInfoSideBarIsNotDisplayed();
    });

    it('[C286442] Sould showLeftSidebar allow left info-drawer to be shown', () => {
        viewerPage.clickToggleLeftSidebar();
        viewerPage.checkLeftSideBarIsNotDisplayed();
        viewerPage.clickLeftSidebarButton();
        viewerPage.checkLeftSideBarIsDisplayed();
    });

    it('[C260089] Should Show/Hide info-drawer if allowSidebar true/false', () => {
        viewerPage.clickInfoButton();

        viewerPage.checkLeftSideBarIsDisplayed();
        viewerPage.checkInfoSideBarIsDisplayed();

        viewerPage.checkInfoButtonIsDisplayed();
        viewerPage.checkLeftSideBarButtonIsDisplayed();

        viewerPage.disableAllowSidebar();

        viewerPage.checkInfoButtonIsNotDisplayed();
        viewerPage.checkLeftSideBarButtonIsNotDisplayed();

        viewerPage.checkLeftSideBarIsNotDisplayed();
        viewerPage.checkInfoSideBarIsNotDisplayed();
    });
});
