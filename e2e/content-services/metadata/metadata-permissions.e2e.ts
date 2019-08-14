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

import { LoginPage, UploadActions, StringUtil } from '@alfresco/adf-testing';
import { ViewerPage } from '../../pages/adf/viewerPage';
import { MetadataViewPage } from '../../pages/adf/metadataViewPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { FileModel } from '../../models/ACS/fileModel';
import { browser } from 'protractor';
import resources = require('../../util/resources');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import CONSTANTS = require('../../util/constants');

describe('permissions', () => {

    const METADATA = {
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

    const loginPage = new LoginPage();
    const viewerPage = new ViewerPage();
    const metadataViewPage = new MetadataViewPage();
    const navigationBarPage = new NavigationBarPage();

    const consumerUser = new AcsUserModel();
    const collaboratorUser = new AcsUserModel();
    const contributorUser = new AcsUserModel();
    let site;

    const pngFileModel = new FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    this.alfrescoJsApi = new AlfrescoApi({
        provider: 'ECM',
        hostEcm: browser.params.testConfig.adf_acs.host
    });
    const uploadActions = new UploadActions(this.alfrescoJsApi);

    beforeAll(async () => {

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(consumerUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(collaboratorUser);
        await this.alfrescoJsApi.core.peopleApi.addPerson(contributorUser);

        site = await this.alfrescoJsApi.core.sitesApi.createSite({
            title: StringUtil.generateRandomString(),
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

        await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, site.entry.guid);

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
        await this.alfrescoJsApi.core.sitesApi.deleteSite(site.entry.id);
    });

    it('[C274692] Should not be possible edit metadata properties when the user is a consumer user', async () => {
        await loginPage.loginToContentServicesUsingUserModel(consumerUser);

        await navigationBarPage.openContentServicesFolder(site.entry.guid);

        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.editIconIsNotDisplayed();
    });

    it('[C279971] Should be possible edit metadata properties when the user is a collaborator user', async () => {
        await loginPage.loginToContentServicesUsingUserModel(collaboratorUser);

        await navigationBarPage.openContentServicesFolder(site.entry.guid);

        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.editIconIsDisplayed();

        await expect(await viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);

        await metadataViewPage.clickOnInformationButton();

        await metadataViewPage.clickMetadataGroup('EXIF');

        await metadataViewPage.editIconIsDisplayed();
    });

    it('[C279972] Should be possible edit metadata properties when the user is a contributor user', async () => {
        await loginPage.loginToContentServicesUsingUserModel(collaboratorUser);

        await navigationBarPage.openContentServicesFolder(site.entry.guid);

        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.editIconIsDisplayed();

        await expect(await viewerPage.getActiveTab()).toEqual(METADATA.PROPERTY_TAB);

        await metadataViewPage.clickOnInformationButton();

        await metadataViewPage.clickMetadataGroup('EXIF');

        await metadataViewPage.editIconIsDisplayed();
    });
});
