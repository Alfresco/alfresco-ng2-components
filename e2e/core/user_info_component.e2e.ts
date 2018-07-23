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
import AdfSettingsPage = require('../pages/adf/settingsPage');
import LoginPage = require('../pages/adf/loginPage');
import UserInfoDialog = require('../pages/adf/dialog/userInfoDialog');
import NavigationBarPage = require('../pages/adf/navigationBarPage');

import AcsUserModel = require('../models/ACS/acsUserModel');
import FileModel = require('../models/ACS/fileModel');

import PeopleAPI = require('../restAPI/ACS/PeopleAPI');

import TestConfig = require('../test.config');
import resources = require('../util/resources');

import AlfrescoApi = require('alfresco-js-api-node');
import { UsersActions } from '../actions/users.actions';

fdescribe('User Info component', () => {

    let adfSettingsPage = new AdfSettingsPage();
    let loginPage = new LoginPage();
    let navigationBarPage = new NavigationBarPage();
    let userInfoDialog = new UserInfoDialog();
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

        loginPage.goToLoginPage();
        adfSettingsPage.setProviderEcmBpm();
        loginPage.login(contentUserModel.id, contentUserModel.password);

        done();
    });

    it('1. Enable Process Services and Content Services ', () => {
        navigationBarPage.clickUserProfile();
        userInfoDialog.dialogIsDisplayed().contentServicesTabIsDisplayed().processServicesTabIsDisplayed();
        expect(userInfoDialog.getContentHeaderTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        expect(userInfoDialog.getContentTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        expect(userInfoDialog.getContentEmail()).toEqual(contentUserModel.email);
        expect(userInfoDialog.getContentJobTitle()).toEqual(contentUserModel.jobTitle);
        userInfoDialog.checkInitialImage();
        userInfoDialog.APSProfileImageNotDisplayed();
        userInfoDialog.ACSProfileImageNotDisplayed();
        userInfoDialog.clickOnContentServicesTab();
        expect(userInfoDialog.getContentHeaderTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        expect(userInfoDialog.getContentTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        expect(userInfoDialog.getContentEmail()).toEqual(contentUserModel.email);
        expect(userInfoDialog.getContentJobTitle()).toEqual(contentUserModel.jobTitle);
        userInfoDialog.checkInitialImage();
        userInfoDialog.APSProfileImageNotDisplayed();
        userInfoDialog.ACSProfileImageNotDisplayed();
        userInfoDialog.clickOnProcessServicesTab().processServicesTabIsDisplayed();
        expect(userInfoDialog.getProcessHeaderTitle()).toEqual(processUserModel.firstName + ' ' + processUserModel.lastName);
        expect(userInfoDialog.getProcessTitle()).toEqual(processUserModel.firstName + ' ' + processUserModel.lastName);
        expect(userInfoDialog.getProcessEmail()).toEqual(processUserModel.email);
        userInfoDialog.checkInitialImage();
        userInfoDialog.APSProfileImageNotDisplayed();
        userInfoDialog.ACSProfileImageNotDisplayed();
        userInfoDialog.closeUserProfile();
    });

    it('2. Enable Content Services and disable Process Services ', () => {
        navigationBarPage.clickLoginButton();
        adfSettingsPage.setProviderEcm();
        loginPage.login(contentUserModel.id, contentUserModel.password);
        navigationBarPage.clickUserProfile();
        userInfoDialog.dialogIsDisplayed().contentServicesTabIsNotDisplayed().processServicesTabIsNotDisplayed();
        expect(userInfoDialog.getContentHeaderTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        expect(userInfoDialog.getContentTitle()).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName);
        expect(userInfoDialog.getContentEmail()).toEqual(contentUserModel.email);
        expect(userInfoDialog.getContentJobTitle()).toEqual(contentUserModel.jobTitle);
        userInfoDialog.checkInitialImage();
        userInfoDialog.APSProfileImageNotDisplayed();
        userInfoDialog.ACSProfileImageNotDisplayed();
        userInfoDialog.closeUserProfile();
    });

    it('3. Enable Process Services and disable Content Services ', () => {
        navigationBarPage.clickLoginButton();

        adfSettingsPage.setProviderBpm();

        loginPage.login(processUserModel.email, processUserModel.password);

        navigationBarPage.clickUserProfile();

        userInfoDialog.dialogIsDisplayed().contentServicesTabIsNotDisplayed().processServicesTabIsNotDisplayed();

        expect(userInfoDialog.getProcessHeaderTitle()).toEqual(processUserModel.firstName + ' ' + processUserModel.lastName);
        expect(userInfoDialog.getProcessTitle()).toEqual(processUserModel.firstName + ' ' + processUserModel.lastName);
        expect(userInfoDialog.getProcessEmail()).toEqual(processUserModel.email);

        userInfoDialog.checkInitialImage();
        userInfoDialog.APSProfileImageNotDisplayed();
        userInfoDialog.ACSProfileImageNotDisplayed();
        userInfoDialog.closeUserProfile();
    });

    it('4. Enable Process Services and Content Services ', () => {
        let flow = protractor.promise.controlFlow();
        flow.execute(() => {
            PeopleAPI.updateAvatarViaAPI(contentUserModel, acsAvatarFileModel, '-me-');
            PeopleAPI.getAvatarViaAPI(4, contentUserModel, '-me-', function (result) {
            });
        });

        navigationBarPage.clickLoginButton();
        adfSettingsPage.setProviderEcm();
        loginPage.login(contentUserModel.id, contentUserModel.password);
        navigationBarPage.clickUserProfile();
        userInfoDialog.checkACSProfileImage();
        userInfoDialog.APSProfileImageNotDisplayed();
        userInfoDialog.closeUserProfile();
    });

    it('5. The profile picture is changed from APS', async () => {
        let users = new UsersActions();
        navigationBarPage.clickLoginButton();

        await this.alfrescoJsApi.login(contentUserModel.email, contentUserModel.password);
        await users.changeProfilePictureAps(this.alfrescoJsApi, apsAvatarFileModel.getLocation());

        adfSettingsPage.setProviderBpm();
        loginPage.login(processUserModel.email, processUserModel.password);
        navigationBarPage.clickUserProfile();
        userInfoDialog.checkAPSProfileImage();
        userInfoDialog.ACSProfileImageNotDisplayed();
        userInfoDialog.initialImageNotDisplayed();
        userInfoDialog.closeUserProfile();
    });

    it('6. Delete the profile picture from ACS', () => {
        navigationBarPage.clickLoginButton();
        PeopleAPI.deleteAvatarViaAPI(contentUserModel, '-me-');
        adfSettingsPage.setProviderEcm();
        loginPage.login(contentUserModel.id, contentUserModel.password);
        navigationBarPage.clickUserProfile();
        userInfoDialog.checkInitialImage();
        userInfoDialog.APSProfileImageNotDisplayed();
        userInfoDialog.ACSProfileImageNotDisplayed();
        userInfoDialog.closeUserProfile();
    });
});
