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

import { LoginPage } from '@alfresco/adf-testing';
import { UserInfoPage } from '@alfresco/adf-testing';

import { AcsUserModel } from '../models/ACS/acsUserModel';
import { FileModel } from '../models/ACS/fileModel';

import PeopleAPI = require('../restAPI/ACS/PeopleAPI');

import { browser } from 'protractor';
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

describe('User Info component', () => {

    const loginPage = new LoginPage();
    const userInfoPage = new UserInfoPage();
    let processUserModel, contentUserModel;
    const navigationBarPage = new NavigationBarPage();

    const acsAvatarFileModel = new FileModel({
        'name': resources.Files.PROFILE_IMAGES.ECM.file_name,
        'location': resources.Files.PROFILE_IMAGES.ECM.file_location
    });
    const apsAvatarFileModel = new FileModel({
        'name': resources.Files.PROFILE_IMAGES.BPM.file_name,
        'location': resources.Files.PROFILE_IMAGES.BPM.file_location
    });

    beforeAll(async () => {
        const users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ALL',
            hostEcm: browser.params.testConfig.adf_acs.host,
            hostBpm: browser.params.testConfig.adf_aps.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        processUserModel = await users.createTenantAndUser(this.alfrescoJsApi);

        contentUserModel = new AcsUserModel({
            'id': processUserModel.email,
            'password': processUserModel.password,
            'firstName': processUserModel.firstName,
            'lastName': processUserModel.lastName,
            'email': processUserModel.email
        });

        await this.alfrescoJsApi.core.peopleApi.addPerson(contentUserModel);

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    it('[C260111] Should display UserInfo when Process Services and Content Services are enabled', async () => {
        await loginPage.loginToAllUsingUserModel(contentUserModel);

        await userInfoPage.clickUserProfile();

        await expect(await userInfoPage.getContentHeaderTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        await expect(await userInfoPage.getContentTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        await expect(await userInfoPage.getContentEmail()).toEqual(contentUserModel.email);
        await expect(await userInfoPage.getContentJobTitle()).toEqual('N/A');

        await userInfoPage.checkInitialImage();
        await userInfoPage.APSProfileImageNotDisplayed();
        await userInfoPage.ACSProfileImageNotDisplayed();
        await userInfoPage.clickOnContentServicesTab();

        await expect(await userInfoPage.getContentHeaderTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        await expect(await userInfoPage.getContentTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        await expect(await userInfoPage.getContentEmail()).toEqual(contentUserModel.email);
        await expect(await userInfoPage.getContentJobTitle()).toEqual('N/A');

        await userInfoPage.checkInitialImage();
        await userInfoPage.APSProfileImageNotDisplayed();
        await userInfoPage.ACSProfileImageNotDisplayed();
        await userInfoPage.clickOnProcessServicesTab();
        await userInfoPage.checkProcessServicesTabIsSelected();

        await expect(await userInfoPage.getProcessHeaderTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        await expect(await userInfoPage.getProcessTitle()).toEqual(contentUserModel.firstName + ' ' + processUserModel.lastName);
        await expect(await userInfoPage.getProcessEmail()).toEqual(contentUserModel.email);

        await userInfoPage.checkInitialImage();
        await userInfoPage.APSProfileImageNotDisplayed();
        await userInfoPage.ACSProfileImageNotDisplayed();
        await userInfoPage.closeUserProfile();
    });

    it('[C260113] Should display UserInfo when Content Services is enabled and Process Services is disabled', async () => {
        await loginPage.loginToContentServicesUsingUserModel(contentUserModel);

        await userInfoPage.clickUserProfile();
        await userInfoPage.dialogIsDisplayed();

        await expect(await userInfoPage.getContentHeaderTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        await expect(await userInfoPage.getContentTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        await expect(await userInfoPage.getContentEmail()).toEqual(contentUserModel.email);
        await expect(await userInfoPage.getContentJobTitle()).toEqual('N/A');

        await userInfoPage.checkInitialImage();
        await userInfoPage.APSProfileImageNotDisplayed();
        await userInfoPage.ACSProfileImageNotDisplayed();
        await userInfoPage.closeUserProfile();
        await userInfoPage.dialogIsNotDisplayed();
    });

    it('[C260115] Should display UserInfo when Process Services is enabled and Content Services is disabled', async () => {
        await loginPage.loginToProcessServicesUsingUserModel(contentUserModel);

        await userInfoPage.clickUserProfile();

        await userInfoPage.dialogIsDisplayed();

        await expect(await userInfoPage.getProcessHeaderTitle()).toEqual(processUserModel.firstName + ' ' + processUserModel.lastName);
        await expect(await userInfoPage.getProcessTitle()).toEqual(processUserModel.firstName + ' ' + processUserModel.lastName);
        await expect(await userInfoPage.getProcessEmail()).toEqual(processUserModel.email);

        await userInfoPage.checkInitialImage();
        await userInfoPage.APSProfileImageNotDisplayed();
        await userInfoPage.ACSProfileImageNotDisplayed();
        await userInfoPage.closeUserProfile();
    });

    it('[C260117] Should display UserInfo with profile image uploaded in ACS', async () => {
        await PeopleAPI.updateAvatarViaAPI(contentUserModel, acsAvatarFileModel, '-me-');
        await PeopleAPI.getAvatarViaAPI(4, contentUserModel, '-me-',  async() => {
        });

        await loginPage.loginToContentServicesUsingUserModel(contentUserModel);

        await userInfoPage.clickUserProfile();

        await userInfoPage.checkACSProfileImage();
        await userInfoPage.APSProfileImageNotDisplayed();
        await userInfoPage.closeUserProfile();
    });

    it('[C260118] Should display UserInfo with profile image uploaded in APS', async () => {
        const users = new UsersActions();
        await this.alfrescoJsApi.login(contentUserModel.email, contentUserModel.password);
        await users.changeProfilePictureAps(this.alfrescoJsApi, apsAvatarFileModel.getLocation());

        await loginPage.loginToProcessServicesUsingUserModel(contentUserModel);

        await userInfoPage.clickUserProfile();

        await userInfoPage.checkAPSProfileImage();
        await userInfoPage.ACSProfileImageNotDisplayed();
        await userInfoPage.initialImageNotDisplayed();
        await userInfoPage.closeUserProfile();
    });

    it('[C260120] Should not display profile image in UserInfo when deleted in ACS', async () => {
        await PeopleAPI.deleteAvatarViaAPI(contentUserModel, '-me-');

        await loginPage.loginToContentServicesUsingUserModel(contentUserModel);

        await userInfoPage.clickUserProfile();

        await userInfoPage.checkInitialImage();
        await userInfoPage.APSProfileImageNotDisplayed();
        await userInfoPage.ACSProfileImageNotDisplayed();
        await userInfoPage.closeUserProfile();
    });
});
