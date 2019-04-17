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

import { LoginSSOPage, SettingsPage, ApiService, IdentityService, RolesService, AppListCloudPage } from '@alfresco/adf-testing';
import TestConfig = require('../test.config');
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import { browser } from 'protractor';
import resources = require('../util/resources');
import CONSTANTS = require('../util/CONSTANTS');

describe('Applications list', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudPage = new AppListCloudPage();
    const simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP;

    const apiService = new ApiService('activiti', TestConfig.adf.hostBPM, TestConfig.adf.hostSso, 'BPM');
    const identityService = new IdentityService(apiService);

    let noRoleUser;

    beforeAll( async () => {
        await apiService.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        const rolesService = new RolesService(apiService);

        noRoleUser = await identityService.createIdentityUser();
        const apsUserRoleId = await rolesService.getRoleIdByRoleName(CONSTANTS.ROLES.APS_USER);
        await identityService.assignRole(noRoleUser.idIdentityService, apsUserRoleId, CONSTANTS.ROLES.APS_USER);
    });

    afterEach(async () => {
        navigationBarPage.clickLogoutButton();
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
    });

    afterAll(async () => {
        await identityService.deleteIdentityUser(noRoleUser.idIdentityService);
    });

    it('[C307058] Should be redirected to 403 when user doesn\'t have permissions', async () => {
        settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity);
        loginSSOPage.loginSSOIdentityService(noRoleUser.email, noRoleUser.password);
        await browser.get(TestConfig.adf.url + '/cloud');
        expect(appListCloudPage.IsAppListEmpy()).toBe(true);
    });

    it('[C289910] Should the app be displayed on dashboard when is deployed on APS', () => {
        settingsPage.setProviderBpmSso(TestConfig.adf.hostBPM, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity);
        loginSSOPage.loginSSOIdentityService(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudPage.checkApsContainer();
        appListCloudPage.checkAppIsDisplayed(simpleApp);
        appListCloudPage.goToApp(simpleApp);
    });
});
