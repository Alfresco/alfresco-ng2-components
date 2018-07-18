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

import LoginPage = require('../pages/adf/loginPage');
import ContentServicesPage = require('../pages/adf/contentServicesPage');
import ViewerPage = require('../pages/adf/viewerPage');
import CardViewPage = require('../pages/adf/metadataViewPage');

import AcsUserModel = require('../models/ACS/acsUserModel');
import FileModel = require('../models/ACS/fileModel');

import TestConfig = require('../test.config');
import resources = require('../util/resources');
import dateFormat = require('dateformat');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../actions/ACS/upload.actions';

fdescribe('Metadata component', () => {

    let METADATA = {
        DATAFORMAT: 'mmm dd yyyy',
        TITLE: 'Details',
        COMMENTS_TAB: 'COMMENTS',
        PROPERTY_TAB: 'PROPERTIES',
        DEFAULT_ASPECT: 'Properties',
        MORE_INFO_BUTTON: 'More information',
        LESS_INFO_BUTTON: 'Less information',
        ARROW_DOWN: 'keyboard_arrow_down',
        ARROW_UP: 'keyboard_arrow_up',
        EDIT_BUTTON_TOOLTIP: 'Edit'
    };

    let loginPage = new LoginPage();
    let contentServicesPage = new ContentServicesPage();
    let viewerPage = new ViewerPage();
    let cardViewPage = new CardViewPage();

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

        pdfFileModel.update(pdfUploadedFile.entry);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.navigateToDocumentList();

        done();
    });

    afterEach(() => {
        viewerPage.clickCloseButton();
    });

    it('[C245652] Properties', () => {
        viewerPage.viewFile(pdfFileModel.name);

        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        cardViewPage.clickOnPropertiesTab();

        expect(cardViewPage.getTitle()).toEqual(METADATA.TITLE);
        expect(viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);
        expect(cardViewPage.getExpandedAspectName()).toEqual(METADATA.DEFAULT_ASPECT);
        expect(cardViewPage.getName()).toEqual(pdfFileModel.name);
        expect(cardViewPage.getCreator()).toEqual(pdfFileModel.getCreatedByUser().displayName);
        expect(cardViewPage.getCreatedDate()).toEqual(dateFormat(pdfFileModel.createdAt, METADATA.DATAFORMAT));
        expect(cardViewPage.getModifier()).toEqual(pdfFileModel.getCreatedByUser().displayName);
        expect(cardViewPage.getModifiedDate()).toEqual(dateFormat(pdfFileModel.createdAt, METADATA.DATAFORMAT));
        expect(cardViewPage.getMimetypeName()).toEqual(pdfFileModel.getContent().mimeTypeName);
        expect(cardViewPage.getSize()).toEqual(pdfFileModel.getContent().getSizeInBytes());
        expect(cardViewPage.getAuthor()).toEqual(pdfFileModel.properties['cm:author']);

        cardViewPage.editIconIsDisplayed();
        cardViewPage.informationButtonIsDisplayed();
        expect(cardViewPage.getInformationButtonText()).toEqual(METADATA.MORE_INFO_BUTTON);
        expect(cardViewPage.getInformationIconText()).toEqual(METADATA.ARROW_DOWN);
    });

    it('[C272769] Information button', () => {
        viewerPage.viewFile(pdfFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        cardViewPage.clickOnPropertiesTab();
        cardViewPage.informationButtonIsDisplayed();
        cardViewPage.clickOnInformationButton();
        expect(cardViewPage.getInformationButtonText()).toEqual(METADATA.LESS_INFO_BUTTON);
        expect(cardViewPage.getInformationIconText()).toEqual(METADATA.ARROW_UP);
    });

    it('[C270952] Info icon', () => {
        viewerPage.viewFile(pdfFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        cardViewPage.clickOnPropertiesTab().informationButtonIsDisplayed();
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsNotDisplayed();
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        expect(viewerPage.getActiveTab()).toEqual(METADATA.COMMENTS_TAB);
        cardViewPage.clickOnPropertiesTab();
        expect(viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);
        expect(cardViewPage.getEditIconTooltip()).toEqual(METADATA.EDIT_BUTTON_TOOLTIP);
    });

    it('[C270952] Should be possible edit the basic Metadata Info of a Document', () => {
        viewerPage.viewFile(pdfFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        cardViewPage.clickOnPropertiesTab();
        cardViewPage.editIconIsDisplayed();

        expect(viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);
    });

});
