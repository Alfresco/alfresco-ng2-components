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

import { LoginAPSPage } from '../pages/adf/loginApsPage';
import { SettingsPage } from '../pages/adf/settingsPage';
import TestConfig = require('../test.config');
import { browser } from 'protractor';
import { NavigationBarPage } from '../pages/adf/NavigationBarPage';
import { UserInfoDialog } from '../pages/adf/dialog/userInfoDialog';
import { Identity } from '../actions/APS-cloud/identity';

describe('User Info - SSO', () => {

    const settingsPage = new SettingsPage();
    const loginApsPage = new LoginAPSPage();
    const navigationBarPage = new NavigationBarPage();
    const userInfoDialog = new UserInfoDialog();
    const identityService: Identity = new Identity();
    const path = '/auth/realms/springboot';
    let silentLogin, identityUser ;

    beforeAll(async () => {
        // await identityService.init(TestConfig.adf.adminUser, TestConfig.adf.adminPassword);
        await identityService.init('superadminuser', 'password');
        identityUser = await identityService.createIdentityUser();
        // const a  = identityService.assignRole(identityUser.id, roleId, roleName)

        // console.log(a);
        // browser.ignoreSynchronization = true;

    });

    it('[C290066] Should display UserInfo when login using SSO', async () => {

        silentLogin = false;
        await settingsPage.setProviderBpmSso(TestConfig.adf.hostSso, TestConfig.adf.hostSso + path, silentLogin);
        await loginApsPage.clickOnSSOButton();
        browser.ignoreSynchronization = true;
        await loginApsPage.loginAPS(identityUser['0'].username, identityUser['0'].password);
        navigationBarPage.navigateToProcessServicesCloudPage();
        navigationBarPage.clickUserProfile();

        // expect(userInfoDialog.getSsoHeaderTitle()).toEqual('ADF');
        // expect(userInfoDialog.getSsoTitle()).toEqual('ADF');
        // expect(userInfoDialog.getSsoEmail()).toEqual(TestConfig.adf.adminEmail);

        // userInfoDialog.closeUserProfile();

    });

});
