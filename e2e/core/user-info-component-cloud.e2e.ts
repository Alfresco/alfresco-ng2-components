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

import { LoginSSOPage } from '@alfresco/adf-testing';
import { SettingsPage } from '../pages/adf/settingsPage';
import TestConfig = require('../test.config');
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { UserInfoPage } from '@alfresco/adf-testing';
import { IdentityService, ApiService } from '@alfresco/adf-testing';

describe('User Info - SSO', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const userInfoPage = new UserInfoPage();
    let silentLogin, identityUser;
    let identityService: IdentityService;

    beforeAll(async () => {
        const apiService = new ApiService('alfresco', TestConfig.adf.url, TestConfig.adf.hostSso, 'ECM');
        await apiService.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        identityService = new IdentityService(apiService);
        await identityService.createIdentityUser();

        silentLogin = false;
        settingsPage.setProviderEcmSso(TestConfig.adf.url, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin, true, 'alfresco');
        loginSSOPage.clickOnSSOButton();
        loginSSOPage.loginSSOIdentityService(identityUser.username, identityUser.password);
    });

    afterAll(async () => {
        await identityService.deleteIdentityUser(identityUser.id);
    });

    it('[C290066] Should display UserInfo when login using SSO', () => {

        navigationBarPage.navigateToProcessServicesCloudPage();
        userInfoPage.clickUserProfile();
        expect(userInfoPage.getSsoHeaderTitle()).toEqual(identityUser.firstName + ' ' + identityUser.lastName);
        expect(userInfoPage.getSsoTitle()).toEqual(identityUser.firstName + ' ' + identityUser.lastName);
        expect(userInfoPage.getSsoEmail()).toEqual(identityUser.email);
        userInfoPage.closeUserProfile();

    });

});
