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
import ContentListPage = require('../pages/adf/dialog/contentList');

import AcsUserModel = require('../models/ACS/acsUserModel');
import FileModel = require('../models/ACS/fileModel');

import TestConfig = require('../test.config');
import resources = require('../util/resources');
import dateFormat = require('dateformat');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../actions/ACS/upload.actions';

import fs = require('fs');
import path = require('path');

describe('Metadata component', () => {

    const METADATA = {
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

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const viewerPage = new ViewerPage();
    const metadataViewPage = new CardViewPage();
    const contentListPage = new ContentListPage();

    let acsUser = new AcsUserModel();

    let folderName = 'Metadata Folder';

    let pdfFileModel = new FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
    });

    let pngFileModel = new FileModel({
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

        await uploadActions.uploadFolder(this.alfrescoJsApi, folderName, '-my-');

        let pdfUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pdfFileModel.location, pdfFileModel.name, '-my-');
        await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, '-my-');

        Object.assign(pdfFileModel, pdfUploadedFile.entry);

        pdfFileModel.update(pdfUploadedFile.entry);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.navigateToDocumentList();

        done();
    });

    it('[C245652] Properties', () => {
        viewerPage.viewFile(pdfFileModel.name);

        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();

        expect(metadataViewPage.getTitle()).toEqual(METADATA.TITLE);
        expect(viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);
        expect(metadataViewPage.getExpandedAspectName()).toEqual(METADATA.DEFAULT_ASPECT);
        expect(metadataViewPage.getName()).toEqual(pdfFileModel.name);
        expect(metadataViewPage.getCreator()).toEqual(pdfFileModel.getCreatedByUser().displayName);
        expect(metadataViewPage.getCreatedDate()).toEqual(dateFormat(pdfFileModel.createdAt, METADATA.DATAFORMAT));
        expect(metadataViewPage.getModifier()).toEqual(pdfFileModel.getCreatedByUser().displayName);
        expect(metadataViewPage.getModifiedDate()).toEqual(dateFormat(pdfFileModel.createdAt, METADATA.DATAFORMAT));
        expect(metadataViewPage.getMimetypeName()).toEqual(pdfFileModel.getContent().mimeTypeName);
        expect(metadataViewPage.getSize()).toEqual(pdfFileModel.getContent().getSizeInBytes());
        expect(metadataViewPage.getAuthor()).toEqual(pdfFileModel.properties['cm:author']);

        metadataViewPage.editIconIsDisplayed();
        metadataViewPage.informationButtonIsDisplayed();
        expect(metadataViewPage.getInformationButtonText()).toEqual(METADATA.MORE_INFO_BUTTON);
        expect(metadataViewPage.getInformationIconText()).toEqual(METADATA.ARROW_DOWN);

        viewerPage.clickCloseButton();
    });

    it('[C272769] Information button', () => {
        viewerPage.viewFile(pdfFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.informationButtonIsDisplayed();
        metadataViewPage.clickOnInformationButton();
        expect(metadataViewPage.getInformationButtonText()).toEqual(METADATA.LESS_INFO_BUTTON);
        expect(metadataViewPage.getInformationIconText()).toEqual(METADATA.ARROW_UP);

        viewerPage.clickCloseButton();
    });

    it('[C270952] Info icon', () => {
        viewerPage.viewFile(pdfFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab().informationButtonIsDisplayed();
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsNotDisplayed();
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        expect(viewerPage.getActiveTab()).toEqual(METADATA.COMMENTS_TAB);
        metadataViewPage.clickOnPropertiesTab();
        expect(viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);
        expect(metadataViewPage.getEditIconTooltip()).toEqual(METADATA.EDIT_BUTTON_TOOLTIP);

        viewerPage.clickCloseButton();
    });

    it('[C245654] Should be possible edit the basic Metadata Info of a Document', () => {
        viewerPage.viewFile(pdfFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.editIconIsDisplayed();

        expect(viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);

        metadataViewPage.editIconClick();

        metadataViewPage.editPropertyIconIsDisplayed('name');
        metadataViewPage.editPropertyIconIsDisplayed('properties.cm:title');
        metadataViewPage.editPropertyIconIsDisplayed('properties.cm:author');
        metadataViewPage.editPropertyIconIsDisplayed('properties.cm:description');

        expect(metadataViewPage.getPropertyIconTooltip('name', 'edit')).toEqual('Edit');
        expect(metadataViewPage.getPropertyIconTooltip('properties.cm:title', 'edit')).toEqual('Edit');
        expect(metadataViewPage.getPropertyIconTooltip('properties.cm:author', 'edit')).toEqual('Edit');
        expect(metadataViewPage.getPropertyIconTooltip('properties.cm:description', 'edit')).toEqual('Edit');

        metadataViewPage.clickEditPropertyIcons('name');
        metadataViewPage.updatePropertyIconIsDisplayed('name');
        metadataViewPage.clearPropertyIconIsDisplayed('name');

        metadataViewPage.enterText('name', 'exampleText');
        metadataViewPage.clickClearPropertyIcon('name');
        expect(metadataViewPage.getText('name')).toEqual(resources.Files.ADF_DOCUMENTS.PDF.file_name);

        metadataViewPage.clickEditPropertyIcons('name');
        metadataViewPage.enterText('name', 'exampleText.pdf');
        metadataViewPage.clickUpdatePropertyIcon('name');
        expect(metadataViewPage.getText('name')).toEqual('exampleText.pdf');

        metadataViewPage.clickEditPropertyIcons('properties.cm:title');
        metadataViewPage.enterText('properties.cm:title', 'example title');
        metadataViewPage.clickUpdatePropertyIcon('properties.cm:title');
        expect(metadataViewPage.getText('properties.cm:title')).toEqual('example title');

        metadataViewPage.clickEditPropertyIcons('properties.cm:author');
        metadataViewPage.enterText('properties.cm:author', 'example author');
        metadataViewPage.clickUpdatePropertyIcon('properties.cm:author');
        expect(metadataViewPage.getText('properties.cm:author')).toEqual('example author');

        metadataViewPage.clickEditPropertyIcons('properties.cm:description');
        metadataViewPage.enterDescriptionText('example description');
        metadataViewPage.clickUpdatePropertyIcon('properties.cm:description');
        expect(metadataViewPage.getText('properties.cm:description')).toEqual('example description');

        viewerPage.checkFileContent('1', pdfFile.firstPageText);

        viewerPage.clickCloseButton();

        viewerPage.viewFile('exampleText.pdf');
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.editIconIsDisplayed();

        expect(metadataViewPage.getText('name')).toEqual('exampleText.pdf');
        expect(metadataViewPage.getText('properties.cm:title')).toEqual('example title');
        expect(metadataViewPage.getText('properties.cm:author')).toEqual('example author');
        expect(metadataViewPage.getText('properties.cm:description')).toEqual('example description');

        metadataViewPage.editIconClick();

        metadataViewPage.clickEditPropertyIcons('name');
        metadataViewPage.enterText('name', resources.Files.ADF_DOCUMENTS.PDF.file_name);
        metadataViewPage.clickUpdatePropertyIcon('name');
        expect(metadataViewPage.getText('name')).toEqual(resources.Files.ADF_DOCUMENTS.PDF.file_name);

        viewerPage.clickCloseButton();
    });

    it('[C279960] Should show the last username modifier when modify a File', () => {
        let fileUrl;

        viewerPage.viewFile(pdfFileModel.name);

        browser.getCurrentUrl().then((currentUrl) => {
            fileUrl = currentUrl;
        });

        loginPage.goToLoginPage();

        loginPage.loginToContentServices(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        browser.controlFlow().execute(() => {
            browser.get(fileUrl);
        });

        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.editIconIsDisplayed();

        expect(viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);

        metadataViewPage.editIconClick();

        metadataViewPage.clickEditPropertyIcons('properties.cm:description');
        metadataViewPage.enterDescriptionText('check author example description');
        metadataViewPage.clickUpdatePropertyIcon('properties.cm:description');
        expect(metadataViewPage.getText('properties.cm:description')).toEqual('check author example description');

        loginPage.goToLoginPage();

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        browser.controlFlow().execute(() => {
            browser.get(fileUrl);
        });

        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();

        expect(metadataViewPage.getText('modifiedByUser.displayName')).toEqual('Administrator');

        viewerPage.clickCloseButton();
    });

    it('[C261157] Should be possible use the metadata component When the node is a Folder', () => {
        contentListPage.metadataContent(folderName);

        expect(metadataViewPage.getText('name')).toEqual(folderName);
        expect(metadataViewPage.getText('createdByUser.displayName')).toEqual(acsUser.firstName + ' ' + acsUser.lastName);
    });

    it('[C261158] Should be possible edit the metadata When the node is a Folder', () => {
        contentListPage.metadataContent(folderName);

        metadataViewPage.editIconClick();

        metadataViewPage.clickEditPropertyIcons('name');
        metadataViewPage.enterText('name', 'newnameFolder');
        metadataViewPage.clickClearPropertyIcon('name');
        expect(metadataViewPage.getText('name')).toEqual(folderName);

        metadataViewPage.clickEditPropertyIcons('name');
        metadataViewPage.enterText('name', 'newnameFolder');
        metadataViewPage.clickUpdatePropertyIcon('name');
        expect(metadataViewPage.getText('name')).toEqual('newnameFolder');

        metadataViewPage.clickEditPropertyIcons('name');
        metadataViewPage.enterText('name', folderName);
        metadataViewPage.clickUpdatePropertyIcon('name');
        expect(metadataViewPage.getText('name')).toEqual(folderName);
    });

    it('[C260181] Should be possible edit all the metadata aspect', () => {
        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.editIconIsDisplayed();

        expect(viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);

        metadataViewPage.clickOnInformationButton();

        metadataViewPage.clickMetadatGroup('EXIF');

        metadataViewPage.editIconClick();

        metadataViewPage.clickEditPropertyIcons('properties.exif:software');
        metadataViewPage.enterText('properties.exif:software', 'test custom text software');
        metadataViewPage.clickUpdatePropertyIcon('properties.exif:software');
        expect(metadataViewPage.getText('properties.exif:software')).toEqual('test custom text software');

        metadataViewPage.clickEditPropertyIcons('properties.exif:isoSpeedRatings');
        metadataViewPage.enterText('properties.exif:isoSpeedRatings', 'test custom text isoSpeedRatings');
        metadataViewPage.clickUpdatePropertyIcon('properties.exif:isoSpeedRatings');
        expect(metadataViewPage.getText('properties.exif:isoSpeedRatings')).toEqual('test custom text isoSpeedRatings');

        metadataViewPage.clickEditPropertyIcons('properties.exif:fNumber');
        metadataViewPage.enterText('properties.exif:fNumber', 22);
        metadataViewPage.clickUpdatePropertyIcon('properties.exif:fNumber');
        expect(metadataViewPage.getText('properties.exif:fNumber')).toEqual('22');
    });
});
