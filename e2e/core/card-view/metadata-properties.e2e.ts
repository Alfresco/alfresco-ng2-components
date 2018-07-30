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

import LoginPage = require('../../pages/adf/loginPage');
import ContentServicesPage = require('../../pages/adf/contentServicesPage');
import ViewerPage = require('../../pages/adf/viewerPage');
import CardViewPage = require('../../pages/adf/metadataViewPage');

import AcsUserModel = require('../../models/ACS/acsUserModel');
import FileModel = require('../../models/ACS/fileModel');

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';

describe('CardView Component - properties', () => {

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
    let metadataViewPage = new CardViewPage();

    let acsUser = new AcsUserModel();

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

        let pdfUploadedFile = await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, '-my-');

        Object.assign(pngFileModel, pdfUploadedFile.entry);

        pngFileModel.update(pdfUploadedFile.entry);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        contentServicesPage.navigateToDocumentList();

        done();
    });

    afterEach(() => {
        viewerPage.clickCloseButton();
    });

    it('[C246516] Should show/hide the empty metadata when the property displayEmpty is true/false', () => {
        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.editIconIsDisplayed();

        expect(viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);

        metadataViewPage.clickOnInformationButton();

        metadataViewPage.clickMetadatGroup('EXIF');

        metadataViewPage.checkPopertyIsVisible('properties.exif:flash', 'boolean');
        metadataViewPage.checkPopertyIsNotVisible('properties.exif:model', 'textitem');

        metadataViewPage.enableDisplayEmpty();

        metadataViewPage.checkPopertyIsVisible('properties.exif:flash', 'boolean');
        metadataViewPage.checkPopertyIsVisible('properties.exif:model', 'textitem');
    });

    it('[C260179] Should not be possible edit the basic property when readOnly is true', () => {
        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.editIconIsDisplayed();

        metadataViewPage.enableReadonly();

        metadataViewPage.editIconIsNotDisplayed();
    });

    it('[C268965] Should multi property allow expand multi accordion at the same time when set', () => {
        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();

        metadataViewPage.clickOnInformationButton();

        metadataViewPage.chekMetadatGroupIsNotExpand('EXIF');
        metadataViewPage.chekMetadatGroupIsNotExpand('properties');

        metadataViewPage.clickMetadatGroup('properties');

        metadataViewPage.chekMetadatGroupIsNotExpand('EXIF');
        metadataViewPage.chekMetadatGroupIsExpand('properties');

        metadataViewPage.clickMetadatGroup('EXIF');

        metadataViewPage.chekMetadatGroupIsExpand('EXIF');
        metadataViewPage.chekMetadatGroupIsNotExpand('properties');

        metadataViewPage.enableMulti();

        metadataViewPage.clickMetadatGroup('properties');

        metadataViewPage.chekMetadatGroupIsExpand('EXIF');
        metadataViewPage.chekMetadatGroupIsExpand('properties');

    });
});
