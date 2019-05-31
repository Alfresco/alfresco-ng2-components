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

import { browser } from 'protractor';
import { ApiService, GroupIdentityService, IdentityService, LoginSSOPage, RolesService, SettingsPage } from '@alfresco/adf-testing';
import { AppListCloudPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';
import resources = require('../util/resources');
import CONSTANTS = require('../util/constants');

describe('Applications list', () => {

    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const settingsPage = new SettingsPage();
    const appListCloudPage = new AppListCloudPage();
    const simpleApp = resources.ACTIVITI7_APPS.SIMPLE_APP.name;
    let identityService: IdentityService;
    let groupIdentityService: GroupIdentityService;
    let rolesService: RolesService;
    let testUser, apsUserRoleId, groupInfo;
    const apiService = new ApiService(browser.params.config.oauth2.clientId, browser.params.config.bpmHost, browser.params.config.oauth2.host, 'BPM');

    beforeAll(async (done) => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        identityService = new IdentityService(apiService);
        groupIdentityService = new GroupIdentityService(apiService);
        rolesService = new RolesService(apiService);
        testUser = await identityService.createIdentityUser();
        apsUserRoleId = await rolesService.getRoleIdByRoleName(CONSTANTS.ROLES.APS_USER);
        await identityService.assignRole(testUser.idIdentityService, apsUserRoleId, CONSTANTS.ROLES.APS_USER);
        groupInfo = await groupIdentityService.getGroupInfoByGroupName('hr');
        await identityService.addUserToGroup(testUser.idIdentityService, groupInfo.id);
        await settingsPage.setProviderBpmSso(
            browser.params.config.bpmHost,
            browser.params.config.oauth2.host,
            browser.params.config.identityHost);
        loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
        done();
    });

    afterAll(async(done) => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        await identityService.deleteIdentityUser(testUser.idIdentityService);
        done();
    });

    it('[C289910] Should the app be displayed on dashboard when is deployed on APS', () => {
        navigationBarPage.navigateToProcessServicesCloudPage();
        appListCloudPage.checkApsContainer();

        appListCloudPage.checkAppIsDisplayed(simpleApp);
        appListCloudPage.goToApp(simpleApp);
    });
});
