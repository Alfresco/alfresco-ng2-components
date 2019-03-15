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

import { SettingsPage } from '../pages/adf/settingsPage';
import { LoginPage } from '../pages/adf/loginPage';
import { UserInfoPage } from '@alfresco/adf-testing';

import { AcsUserModel } from '../models/ACS/acsUserModel';
import { FileModel } from '../models/ACS/fileModel';

import PeopleAPI = require('../restAPI/ACS/PeopleAPI');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { UsersActions } from '../actions/users.actions';
import { browser } from 'protractor';

describe('User Info component', () => {

    let settingsPage = new SettingsPage();
    let loginPage = new LoginPage();
    let userInfoPage = new UserInfoPage();
    let processUserModel, contentUserModel;
    let acsAvatarFileModel = new FileModel({
        'name': resources.Files.PROFILE_IMAGES.ECM.file_name,
        'location': resources.Files.PROFILE_IMAGES.ECM.file_location
    });
    let apsAvatarFileModel = new FileModel({
        'name': resources.Files.PROFILE_IMAGES.BPM.file_name,
        'location': resources.Files.PROFILE_IMAGES.BPM.file_location
    });

    beforeAll(async (done) => {
        let users = new UsersActions();

        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ALL',
            hostEcm: TestConfig.adf.url,
            hostBpm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        processUserModel = await users.createTenantAndUser(this.alfrescoJsApi);

        contentUserModel = new AcsUserModel({
            'id': processUserModel.email,
            'password': processUserModel.password,
            'firstName': processUserModel.firstName,
            'lastName': processUserModel.lastName,
            'email': processUserModel.email
        });

        await this.alfrescoJsApi.core.peopleApi.addPerson(contentUserModel);

        done();
    });

    xit('[C260111] Should display UserInfo when Process Services and Content Services are enabled', () => {
        loginPage.goToLoginPage();
        settingsPage.setProviderEcmBpm();
        loginPage.login(contentUserModel.id, contentUserModel.password);
        userInfoPage.clickUserProfile();

        expect(userInfoPage.getContentHeaderTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        expect(userInfoPage.getContentTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        expect(userInfoPage.getContentEmail()).toEqual(contentUserModel.email);
        expect(userInfoPage.getContentJobTitle()).toEqual(contentUserModel.jobTitle);

        userInfoPage.checkInitialImage();
        userInfoPage.APSProfileImageNotDisplayed();
        userInfoPage.ACSProfileImageNotDisplayed();
        userInfoPage.clickOnContentServicesTab();

        expect(userInfoPage.getContentHeaderTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        expect(userInfoPage.getContentTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        expect(userInfoPage.getContentEmail()).toEqual(contentUserModel.email);
        expect(userInfoPage.getContentJobTitle()).toEqual(contentUserModel.jobTitle);

        userInfoPage.checkInitialImage();
        userInfoPage.APSProfileImageNotDisplayed();
        userInfoPage.ACSProfileImageNotDisplayed();
        userInfoPage.clickOnProcessServicesTab();
        userInfoPage.checkProcessServicesTabIsSelected();

        expect(userInfoPage.getProcessHeaderTitle()).toEqual(processUserModel.firstName + ' ' + processUserModel.lastName);
        expect(userInfoPage.getProcessTitle()).toEqual(processUserModel.firstName + ' ' + processUserModel.lastName);
        expect(userInfoPage.getProcessEmail()).toEqual(processUserModel.email);

        userInfoPage.checkInitialImage();
        userInfoPage.APSProfileImageNotDisplayed();
        userInfoPage.ACSProfileImageNotDisplayed();
        userInfoPage.closeUserProfile();
    });

    it('[C260113] Should display UserInfo when Content Services is enabled and Process Services is disabled', () => {
        loginPage.goToLoginPage();
        settingsPage.setProviderEcm();
        loginPage.login(contentUserModel.id, contentUserModel.password);

        userInfoPage.clickUserProfile();
        userInfoPage.dialogIsDisplayed();

        expect(userInfoPage.getContentHeaderTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        expect(userInfoPage.getContentTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        expect(userInfoPage.getContentEmail()).toEqual(contentUserModel.email);
        expect(userInfoPage.getContentJobTitle()).toEqual(contentUserModel.jobTitle);

        userInfoPage.checkInitialImage();
        userInfoPage.APSProfileImageNotDisplayed();
        userInfoPage.ACSProfileImageNotDisplayed();
        userInfoPage.closeUserProfile();
    });

    it('[C260115] Should display UserInfo when Process Services is enabled and Content Services is disabled', () => {
        loginPage.goToLoginPage();
        settingsPage.setProviderBpm();
        loginPage.login(processUserModel.email, processUserModel.password);

        userInfoPage.clickUserProfile();

        userInfoPage.dialogIsDisplayed();

        expect(userInfoPage.getProcessHeaderTitle()).toEqual(processUserModel.firstName + ' ' + processUserModel.lastName);
        expect(userInfoPage.getProcessTitle()).toEqual(processUserModel.firstName + ' ' + processUserModel.lastName);
        expect(userInfoPage.getProcessEmail()).toEqual(processUserModel.email);

        userInfoPage.checkInitialImage();
        userInfoPage.APSProfileImageNotDisplayed();
        userInfoPage.ACSProfileImageNotDisplayed();
        userInfoPage.closeUserProfile();
    });

    it('[C260117] Should display UserInfo with profile image uploaded in ACS', async(done) => {
        browser.controlFlow().execute(async() => {
            await PeopleAPI.updateAvatarViaAPI(contentUserModel, acsAvatarFileModel, '-me-');
            await PeopleAPI.getAvatarViaAPI(4, contentUserModel, '-me-', function (result) {});
        });

        loginPage.goToLoginPage();
        settingsPage.setProviderEcm();
        loginPage.login(contentUserModel.id, contentUserModel.password);
        userInfoPage.clickUserProfile();

        userInfoPage.checkACSProfileImage();
        userInfoPage.APSProfileImageNotDisplayed();
        userInfoPage.closeUserProfile();

        done();
    });

    it('[C260118] Should display UserInfo with profile image uploaded in APS', async () => {
        let users = new UsersActions();
        await this.alfrescoJsApi.login(contentUserModel.email, contentUserModel.password);
        await users.changeProfilePictureAps(this.alfrescoJsApi, apsAvatarFileModel.getLocation());

        loginPage.goToLoginPage();
        settingsPage.setProviderBpm();
        loginPage.login(processUserModel.email, processUserModel.password);
        userInfoPage.clickUserProfile();

        userInfoPage.checkAPSProfileImage();
        userInfoPage.ACSProfileImageNotDisplayed();
        userInfoPage.initialImageNotDisplayed();
        userInfoPage.closeUserProfile();
    });

    it('[C260120] Should not display profile image in UserInfo when deleted in ACS', () => {
        PeopleAPI.deleteAvatarViaAPI(contentUserModel, '-me-');

        loginPage.goToLoginPage();

        settingsPage.setProviderEcm();
        loginPage.login(contentUserModel.id, contentUserModel.password);
        userInfoPage.clickUserProfile();

        userInfoPage.checkInitialImage();
        userInfoPage.APSProfileImageNotDisplayed();
        userInfoPage.ACSProfileImageNotDisplayed();
        userInfoPage.closeUserProfile();
    });
});
