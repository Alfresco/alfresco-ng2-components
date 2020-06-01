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

import { PeopleApi } from '@alfresco/js-api';
import { ApiService, LoginSSOPage, UserInfoPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { UsersActions } from '../actions/users.actions';
import { FileModel } from '../models/ACS/file.model';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';
import path = require('path');
import fs = require('fs');

describe('User Info component', () => {

    const loginPage = new LoginSSOPage();
    const userInfoPage = new UserInfoPage();
    const navigationBarPage = new NavigationBarPage();

    const apiService = new ApiService({ provider: 'ALL' });
    const usersActions = new UsersActions(apiService);
    const peopleApi: PeopleApi = new PeopleApi(apiService.getInstance());

    let user;

    const acsAvatarFileModel = new FileModel({
        'name': browser.params.resources.Files.PROFILE_IMAGES.ECM.file_name,
        'location': browser.params.resources.Files.PROFILE_IMAGES.ECM.file_location
    });
    const apsAvatarFileModel = new FileModel({
        'name': browser.params.resources.Files.PROFILE_IMAGES.BPM.file_name,
        'location': browser.params.resources.Files.PROFILE_IMAGES.BPM.file_location
    });

    beforeAll(async () => {
        await apiService.getInstance().login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

        user = await usersActions.createUser();
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    it('[C260111] Should display UserInfo when Process Services and Content Services are enabled', async () => {
        await loginPage.login(user.email, user.password);

        await userInfoPage.clickUserProfile();
        await userInfoPage.dialogIsDisplayed();
        await userInfoPage.checkContentServicesTabIsSelected();

        await expect(await userInfoPage.getContentHeaderTitle()).toEqual(user.firstName + ' ' + user.lastName);
        await expect(await userInfoPage.getContentTitle()).toEqual(user.firstName + ' ' + user.lastName);
        await expect(await userInfoPage.getContentEmail()).toEqual(user.email);
        await expect(await userInfoPage.getContentJobTitle()).toEqual('N/A');

        await userInfoPage.checkInitialImage();
        await userInfoPage.APSProfileImageNotDisplayed();
        await userInfoPage.ACSProfileImageNotDisplayed();

        await userInfoPage.clickOnProcessServicesTab();
        await userInfoPage.checkProcessServicesTabIsSelected();

        await browser.sleep(1000);

        await expect(await userInfoPage.getProcessHeaderTitle()).toEqual(user.firstName + ' ' + user.lastName);
        await expect(await userInfoPage.getProcessTitle()).toEqual(user.firstName + ' ' + user.lastName);
        await expect(await userInfoPage.getProcessEmail()).toEqual(user.email);

        await userInfoPage.closeUserProfile();
    });

    it('[C260113] Should display UserInfo when Content Services is enabled and Process Services is disabled', async () => {
        await loginPage.login(user.email, user.password);

        await userInfoPage.clickUserProfile();
        await userInfoPage.dialogIsDisplayed();

        await expect(await userInfoPage.getContentHeaderTitle()).toEqual(user.firstName + ' ' + user.lastName);
        await expect(await userInfoPage.getContentTitle()).toEqual(user.firstName + ' ' + user.lastName);
        await expect(await userInfoPage.getContentEmail()).toEqual(user.email);
        await expect(await userInfoPage.getContentJobTitle()).toEqual('N/A');

        await userInfoPage.checkInitialImage();
        await userInfoPage.APSProfileImageNotDisplayed();
        await userInfoPage.ACSProfileImageNotDisplayed();
        await userInfoPage.closeUserProfile();
        await userInfoPage.dialogIsNotDisplayed();
    });

    it('[C260115] Should display UserInfo when Process Services is enabled and Content Services is disabled', async () => {
        browser.params.testConfig.appConfig.provider = 'BPM';

        await loginPage.login(user.email, user.password);

        await userInfoPage.clickUserProfile();

        await userInfoPage.dialogIsDisplayed();

        await expect(await userInfoPage.getProcessHeaderTitle()).toEqual(user.firstName + ' ' + user.lastName);
        await expect(await userInfoPage.getProcessTitle()).toEqual(user.firstName + ' ' + user.lastName);
        await expect(await userInfoPage.getProcessEmail()).toEqual(user.email);

        await userInfoPage.checkInitialImage();
        await userInfoPage.APSProfileImageNotDisplayed();
        await userInfoPage.ACSProfileImageNotDisplayed();
        await userInfoPage.closeUserProfile();
    });

    it('[C260117] Should display UserInfo with profile image uploaded in ACS', async () => {
        browser.params.testConfig.appConfig.provider = 'ECM';

        await updateAvatarACS();

        await loginPage.login(user.email, user.password);

        await userInfoPage.clickUserProfile();

        await userInfoPage.checkACSProfileImage();
        await userInfoPage.APSProfileImageNotDisplayed();
        await userInfoPage.closeUserProfile();
    });

    it('[C260118] Should display UserInfo with profile image uploaded in APS', async () => {
        browser.params.testConfig.appConfig.provider = 'BPM';

        const users = new UsersActions(apiService);
        await apiService.getInstance().login(user.email, user.password);
        await users.changeProfilePictureAps(apsAvatarFileModel.getLocation());

        await loginPage.login(user.email, user.password);

        await userInfoPage.clickUserProfile();

        await userInfoPage.checkAPSProfileImage();
        await userInfoPage.ACSProfileImageNotDisplayed();
        await userInfoPage.initialImageNotDisplayed();
        await userInfoPage.closeUserProfile();
    });

    it('[C260120] Should not display profile image in UserInfo when deleted in ACS', async () => {
        browser.params.testConfig.appConfig.provider = 'ECM';

        await peopleApi.deleteAvatarImage(user.email);

        await loginPage.login(user.email, user.password);

        await userInfoPage.clickUserProfile();

        await userInfoPage.checkInitialImage();
        await userInfoPage.ACSProfileImageNotDisplayed();
        await userInfoPage.closeUserProfile();
    });

    const updateAvatarACS = async function () {
        await apiService.getInstance().login(user.email, user.password);
        const absolutePath = path.resolve(path.join(browser.params.testConfig.main.rootPath, acsAvatarFileModel.getLocation()));
        const file: any = fs.readFileSync(absolutePath);
        await peopleApi.updateAvatarImage('-me-', file);
    };
});
