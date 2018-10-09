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

import { LoginPage } from '../../pages/adf/LoginPage';
import { ViewerPage } from '../../pages/adf/viewerPage';
import CardViewPage = require('../../pages/adf/metadataViewPage');
import NavigationBarPage = require('../../pages/adf/navigationBarPage');

import AcsUserModel = require('../../models/ACS/acsUserModel');
import FileModel = require('../../models/ACS/fileModel');

import TestConfig = require('../../test.config');
import resources = require('../../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UploadActions } from '../../actions/ACS/upload.actions';

import Util = require('../../util/util');
import CONSTANTS = require('../../util/constants');

describe('permissions', () => {

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
    const viewerPage = new ViewerPage();
    const metadataViewPage = new CardViewPage();
    const navigationBarPage = new NavigationBarPage();

    let consumerUser = new AcsUserModel();
    let collaboratorUser = new AcsUserModel();
    let contributorUser = new AcsUserModel();
    let site;

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

        await this.alfrescoJsApi.core.peopleApi.addPerson(consumerUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(collaboratorUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(contributorUser);

        site = await this.alfrescoJsApi.core.sitesApi.createSite({
            title: Util.generateRandomString(),
            visibility: 'PUBLIC'
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: consumerUser.id,
            role: CONSTANTS.CS_USER_ROLES.CONSUMER
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: collaboratorUser.id,
            role: CONSTANTS.CS_USER_ROLES.COLLABORATOR
        });

        await this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: contributorUser.id,
            role: CONSTANTS.CS_USER_ROLES.CONTRIBUTOR
        });

        await uploadActions.uploadFile(this.alfrescoJsApi, pngFileModel.location, pngFileModel.name, site.entry.guid);

        done();
    });

    afterAll(async(done) => {
        await this.alfrescoJsApi.core.sitesApi.deleteSite(site.entry.id);
        done();
    });

    it('[C274692] Should not be possible edit metadata properties when the user is a consumer user', () => {
        loginPage.loginToContentServicesUsingUserModel(consumerUser);

        navigationBarPage.openContentServicesFolder(site.entry.guid);

        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.editIconIsNotDisplayed();
    });

    it('[C279971] Should be possible edit metadata properties when the user is a collaborator user', () => {
        loginPage.loginToContentServicesUsingUserModel(collaboratorUser);

        navigationBarPage.openContentServicesFolder(site.entry.guid);

        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.editIconIsDisplayed();

        expect(viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);

        metadataViewPage.clickOnInformationButton();

        metadataViewPage.clickMetadatGroup('EXIF');

        metadataViewPage.editIconIsDisplayed();
    });

    it('[C279972] Should be possible edit metadata properties when the user is a contributor user', () => {
        loginPage.loginToContentServicesUsingUserModel(collaboratorUser);

        navigationBarPage.openContentServicesFolder(site.entry.guid);

        viewerPage.viewFile(pngFileModel.name);
        viewerPage.clickInfoButton();
        viewerPage.checkInfoSideBarIsDisplayed();
        metadataViewPage.clickOnPropertiesTab();
        metadataViewPage.editIconIsDisplayed();

        expect(viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);

        metadataViewPage.clickOnInformationButton();

        metadataViewPage.clickMetadatGroup('EXIF');

        metadataViewPage.editIconIsDisplayed();
    });
});
