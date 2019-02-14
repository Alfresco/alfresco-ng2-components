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

import { LoginPage } from '../../pages/adf/loginPage';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { MetadataViewPage } from '../../pages/adf/metadataViewPage';

import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';
import { check, uncheck } from '../../util/material';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';

describe('CardView Component - properties', () => {

    let METADATA = {
        DATA_FORMAT: 'mmm dd yyyy',
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
    let navigationBarPage = new NavigationBarPage();
    let viewerPage = new ViewerPage();
    let metadataViewPage = new MetadataViewPage();
    const contentServicesPage = new ContentServicesPage();

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

        navigationBarPage.clickContentServicesButton();
        contentServicesPage.waitForTableBody();

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

        metadataViewPage.clickMetadataGroup('EXIF');

        metadataViewPage.checkPropertyIsVisible('properties.exif:flash', 'boolean');
        metadataViewPage.checkPropertyIsNotVisible('properties.exif:model', 'textitem');

        check(metadataViewPage.displayEmptySwitch);

        metadataViewPage.checkPropertyIsVisible('properties.exif:flash', 'boolean');
        metadataViewPage.checkPropertyIsVisible('properties.exif:model', 'textitem');
    });

    it('[C260179] Should not be possible edit the basic property when readOnly is true', () => {
        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.editIconIsDisplayed();

        check(metadataViewPage.readonlySwitch);

        metadataViewPage.editIconIsNotDisplayed();
    });

    it('[C268965] Should multi property allow expand multi accordion at the same time when set', () => {
        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();

        metadataViewPage.clickOnInformationButton();

        metadataViewPage.checkMetadataGroupIsNotExpand('EXIF');
        metadataViewPage.checkMetadataGroupIsNotExpand('properties');

        metadataViewPage.clickMetadataGroup('properties');

        metadataViewPage.checkMetadataGroupIsNotExpand('EXIF');
        metadataViewPage.checkMetadataGroupIsExpand('properties');

        metadataViewPage.clickMetadataGroup('EXIF');

        metadataViewPage.checkMetadataGroupIsExpand('EXIF');
        metadataViewPage.checkMetadataGroupIsNotExpand('properties');

        check(metadataViewPage.multiSwitch);

        metadataViewPage.clickMetadataGroup('properties');

        metadataViewPage.checkMetadataGroupIsExpand('EXIF');
        metadataViewPage.checkMetadataGroupIsExpand('properties');

    });

    it('[C280559] Should show/hide the default metadata properties when displayDefaultProperties is true/false', () => {
        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();

        uncheck(metadataViewPage.defaultPropertiesSwitch);

        metadataViewPage.checkMetadataGroupIsNotPresent('properties');
        metadataViewPage.checkMetadataGroupIsPresent('EXIF');
        metadataViewPage.checkMetadataGroupIsExpand('EXIF');

        check(metadataViewPage.defaultPropertiesSwitch);

        metadataViewPage.checkMetadataGroupIsPresent('properties');
        metadataViewPage.checkMetadataGroupIsExpand('properties');
    });

    it('[C280560] Should show/hide the more properties button when displayDefaultProperties is true/false', () => {
        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();

        metadataViewPage.informationButtonIsDisplayed();

        uncheck(metadataViewPage.defaultPropertiesSwitch);

        metadataViewPage.informationButtonIsNotDisplayed();
    });
});
