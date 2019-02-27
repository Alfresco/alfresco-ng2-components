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

import { LoginSSOPage } from '../pages/adf/loginSSOPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import TestConfig = require('../test.config');
import { browser } from 'protractor';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { UserInfoDialog } from '../pages/adf/dialog/userInfoDialog';
import { Identity } from '../actions/APS-cloud/identity';

describe('User Info - SSO', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const userInfoDialog = new UserInfoDialog();
    const identityService: Identity = new Identity();
    let silentLogin, identityUser;

    beforeAll(async () => {
        await identityService.init(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        identityUser = await identityService.createIdentityUser();
        silentLogin = false;
        settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin);
        loginSSOPage.clickOnSSOButton();
        browser.ignoreSynchronization = true;
        loginSSOPage.loginAPS(identityUser.username, identityUser.password);
    });

    afterAll (async () => {
        await identityService.deleteIdentityUser(identityUser.id);
    });

    it('[C290066] Should display UserInfo when login using SSO', () => {

        navigationBarPage.navigateToProcessServicesCloudPage();
        navigationBarPage.clickUserProfile();
        expect(userInfoDialog.getSsoHeaderTitle()).toEqual(identityUser.firstName + ' ' + identityUser.lastName);
        expect(userInfoDialog.getSsoTitle()).toEqual(identityUser.firstName + ' ' + identityUser.lastName);
        expect(userInfoDialog.getSsoEmail()).toEqual(identityUser.email);
        userInfoDialog.closeUserProfile();

    });

});
