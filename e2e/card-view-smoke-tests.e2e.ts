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

import LoginPage = require('./pages/adf/loginPage');
import ContentServicesPage = require('./pages/adf/contentServicesPage');
import AdfViewerPage = require('./pages/adf/viewerPage');

import AcsUserModel = require('./models/ACS/acsUserModel');
import FileModel = require('./models/ACS/fileModel');

import TestConfig = require('./test.config');
import resources = require('./util/resources');
import dateFormat = require('dateformat');
import CONSTANTS = require('./util/constants');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from './actions/ACS/upload.actions';

describe('Metadata component', () => {

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let adfViewerPage = new AdfViewerPage();
    let cardViewPage;

    let acsUser = new AcsUserModel();

    let pdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF_ALL.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF_ALL.file_location
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

        let pdfUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pdfFileModel.location, pdfFileModel.name, '-my-');

        Object.assign(pdfFileModel, pdfUploadedFile.entry);

        pdfFileModel.update( pdfUploadedFile.entry);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();
    });

    it('Properties', () => {
        contentServicesPage.navigateToDocumentList();
        adfViewerPage.viewFile(pdfFileModel.name);

        cardViewPage = adfViewerPage.clickInfoButton();
        adfViewerPage.checkInfoSideBarIsDisplayed();
        cardViewPage.clickOnPropertiesTab();

        expect(cardViewPage.getTitle()).toEqual(CONSTANTS.METADATA.TITLE);
        expect(cardViewPage.getActiveTab()).toEqual(CONSTANTS.METADATA.PROPERTY_TAB);
        expect(cardViewPage.getExpandedAspectName()).toEqual(CONSTANTS.METADATA.DEFAULT_ASPECT);
        expect(cardViewPage.getName()).toEqual(pdfFileModel.name);
        expect(cardViewPage.getCreator()).toEqual(pdfFileModel.getCreatedByUser().displayName);
        expect(cardViewPage.getCreatedDate()).toEqual(dateFormat(pdfFileModel.createdAt, CONSTANTS.METADATA.DATAFORMAT));
        expect(cardViewPage.getModifier()).toEqual(pdfFileModel.getCreatedByUser().displayName);
        expect(cardViewPage.getModifiedDate()).toEqual(dateFormat(pdfFileModel.createdAt, CONSTANTS.METADATA.DATAFORMAT));
        expect(cardViewPage.getMimetypeName()).toEqual(pdfFileModel.getContent().mimeTypeName);
        expect(cardViewPage.getSize()).toEqual(pdfFileModel.getContent().getSizeInBytes());
        expect(cardViewPage.getAuthor()).toEqual(pdfFileModel.properties['cm:author']);

        cardViewPage.editIconIsDisplayed();
        cardViewPage.informationButtonIsDisplayed();
        expect(cardViewPage.getInformationButtonText()).toEqual(CONSTANTS.METADATA.MORE_INFO_BUTTON);
        expect(cardViewPage.getInformationIconText()).toEqual(CONSTANTS.METADATA.ARROW_DOWN);
    });

    it('Information button', () => {
        contentServicesPage.navigateToDocumentList();
        adfViewerPage.viewFile(pdfFileModel.name);
        cardViewPage = adfViewerPage.clickInfoButton();
        adfViewerPage.checkInfoSideBarIsDisplayed();
        cardViewPage.clickOnPropertiesTab();
        cardViewPage.informationButtonIsDisplayed();
        cardViewPage.clickOnInformationButton();
        expect(cardViewPage.getInformationButtonText()).toEqual(CONSTANTS.METADATA.LESS_INFO_BUTTON);
        expect(cardViewPage.getInformationIconText()).toEqual(CONSTANTS.METADATA.ARROW_UP);
    });

    it('Versions', () => {
        contentServicesPage.navigateToDocumentList();
        adfViewerPage.viewFile(pdfFileModel.name);
        cardViewPage = adfViewerPage.clickInfoButton();
        adfViewerPage.checkInfoSideBarIsDisplayed();
        cardViewPage.clickOnVersionsTab().checkUploadVersionsButtonIsDisplayed();
        expect(cardViewPage.getActiveTab()).toEqual(CONSTANTS.METADATA.VERSIONS_TAB);
        cardViewPage.checkVersionIsDisplayed(pdfFileModel.name);
    });

    it('Info icon', () => {
        contentServicesPage.navigateToDocumentList();
        adfViewerPage.viewFile(pdfFileModel.name);
        cardViewPage = adfViewerPage.clickInfoButton();
        adfViewerPage.checkInfoSideBarIsDisplayed();
        cardViewPage.clickOnVersionsTab().checkUploadVersionsButtonIsDisplayed();
        expect(cardViewPage.getActiveTab()).toEqual(CONSTANTS.METADATA.VERSIONS_TAB);
        cardViewPage.clickOnPropertiesTab().informationButtonIsDisplayed();
        adfViewerPage.clickInfoButton();
        adfViewerPage.checkInfoSideBarIsNotDisplayed();
        adfViewerPage.clickInfoButton();
        adfViewerPage.checkInfoSideBarIsDisplayed();
        expect(cardViewPage.getActiveTab()).toEqual(CONSTANTS.METADATA.COMMENTS_TAB);
        cardViewPage.clickOnPropertiesTab();
        expect(cardViewPage.getActiveTab()).toEqual(CONSTANTS.METADATA.PROPERTY_TAB);
        expect(cardViewPage.getEditIconTooltip()).toEqual(CONSTANTS.METADATA.EDIT_BUTTON_TOOLTIP);
    });

});
