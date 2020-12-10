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

import {
    ApiService,
    LoginPage,
    StringUtil,
    UploadActions,
    UserModel,
    UsersActions,
    ViewerPage
} from '@alfresco/adf-testing';
import { MetadataViewPage } from '../../core/pages/metadata-view.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
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

    const loginPage = new LoginPage();
    const viewerPage = new ViewerPage();
    const metadataViewPage = new MetadataViewPage();
    const navigationBarPage = new NavigationBarPage();

    const consumerUser = new UserModel();
    const collaboratorUser = new UserModel();
    const contributorUser = new UserModel();
    let site;

    const pngFileModel = new FileModel({
        name: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: browser.params.resources.Files.ADF_DOCUMENTS.PNG.file_path
    });
    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);

    const uploadActions = new UploadActions(apiService);

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        await usersActions.createUser(consumerUser);
        await usersActions.createUser(collaboratorUser);
        await usersActions.createUser(contributorUser);

        site = await apiService.getInstance().core.sitesApi.createSite({
            title: StringUtil.generateRandomString(),
            visibility: 'PUBLIC'
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(site.entry.id, {
            id: consumerUser.username,
            role: CONSTANTS.CS_USER_ROLES.CONSUMER
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(site.entry.id, {
            id: collaboratorUser.username,
            role: CONSTANTS.CS_USER_ROLES.COLLABORATOR
        });

        await apiService.getInstance().core.sitesApi.addSiteMember(site.entry.id, {
            id: contributorUser.username,
            role: CONSTANTS.CS_USER_ROLES.CONTRIBUTOR
        });

        await uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, site.entry.guid);
    });

    afterAll(async () => {
        await apiService.getInstance().core.sitesApi.deleteSite(site.entry.id, { permanent: true });
    });

    afterEach(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    it('[C274692] Should not be possible edit metadata properties when the user is a consumer user', async () => {
        await loginPage.login(consumerUser.email, consumerUser.password);

        await navigationBarPage.openContentServicesFolder(site.entry.guid);

        await viewerPage.viewFile(pngFileModel.name);
        await viewerPage.clickInfoButton();
        await viewerPage.checkInfoSideBarIsDisplayed();
        await metadataViewPage.clickOnPropertiesTab();
        await metadataViewPage.editIconIsNotDisplayed();
    });

    it('[C279971] Should be possible edit metadata properties when the user is a collaborator user', async () => {
        await loginPage.login(collaboratorUser.email, collaboratorUser.password);

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
        await loginPage.login(collaboratorUser.email, collaboratorUser.password);

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
