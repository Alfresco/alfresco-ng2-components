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

import { LoginSSOPage, UploadActions, StringUtil, ViewerPage, ApiService } from '@alfresco/adf-testing';
import { MetadataViewPage } from '../../pages/adf/metadata-view.page';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';
import { AcsUserModel } from '../../models/ACS/acs-user.model';
import { FileModel } from '../../models/ACS/file.model';
import { browser } from 'protractor';
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

    const loginPage = new LoginSSOPage();
    const viewerPage = new ViewerPage();
    const metadataViewPage = new MetadataViewPage();
    const navigationBarPage = new NavigationBarPage();

    const consumerUser = new AcsUserModel();
    const collaboratorUser = new AcsUserModel();
    const contributorUser = new AcsUserModel();
    let site;

    const pngFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    });
    const alfrescoJsApi = new ApiService().apiService;

    const uploadActions = new UploadActions(alfrescoJsApi);

    beforeAll(async () => {
        await alfrescoJsApi.login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        await alfrescoJsApi.core.peopleApi.addPerson(consumerUser);
        await alfrescoJsApi.core.peopleApi.addPerson(collaboratorUser);
        await alfrescoJsApi.core.peopleApi.addPerson(contributorUser);

        site = await alfrescoJsApi.core.sitesApi.createSite({
            title: StringUtil.generateRandomString(),
            visibility: 'PUBLIC'
        });

        await alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: consumerUser.id,
            role: CONSTANTS.CS_USER_ROLES.CONSUMER
        });

        await alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: collaboratorUser.id,
            role: CONSTANTS.CS_USER_ROLES.COLLABORATOR
        });

        await alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
            id: contributorUser.id,
            role: CONSTANTS.CS_USER_ROLES.CONTRIBUTOR
        });

        await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, site.entry.guid);
   });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
        await alfrescoJsApi.core.sitesApi.deleteSite(site.entry.id, { permanent: true });
    });

    it('[C274692] Should not be possible edit metadata properties when the user is a consumer user', async () => {
        await loginPage.login(consumerUser.id, consumerUser.password);

        await navigationBarPage.openContentServicesFolder(site.entry.guid);

        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.editIconIsNotDisplayed();
    });

    it('[C279971] Should be possible edit metadata properties when the user is a collaborator user', async () => {
        await loginPage.login(collaboratorUser.id, collaboratorUser.password);

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
        await loginPage.login(collaboratorUser.id, collaboratorUser.password);

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
