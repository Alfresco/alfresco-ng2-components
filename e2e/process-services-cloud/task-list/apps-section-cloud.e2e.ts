/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { createApiService, Application, AppListCloudPage, IdentityService, LocalStorageUtil, LoginPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

describe('Applications list', () => {

    const simpleApp = browser.params.resources.ACTIVITI_CLOUD_APPS.SIMPLE_APP.name;

    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const appListCloudPage = new AppListCloudPage();

    const apiService = createApiService();
    const applicationsService = new Application(apiService);
    const identityService = new IdentityService(apiService);

    let testUser;
    const appNames = [];
    let applications;

    beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');
        testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER, identityService.ROLES.ACTIVITI_DEVOPS]);

        await loginSSOPage.login(testUser.username, testUser.password);
        await apiService.login(testUser.username, testUser.password);

        applications = await applicationsService.getApplicationsByStatus('RUNNING');

        applications.list.entries.forEach(app => {
            appNames.push(app.entry.name.toLowerCase());
        });

        await LocalStorageUtil.setConfigField('alfresco-deployed-apps', '[]');
        await LocalStorageUtil.apiReset();
   });

    afterAll(async () => {
        await apiService.loginWithProfile('identityAdmin');
        await identityService.deleteIdentityUser(testUser.idIdentityService);
   });

    it('[C310373] Should all the app with running state be displayed on dashboard when alfresco-deployed-apps is not used in config file', async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudPage.checkApsContainer();

        const list = await appListCloudPage.getNameOfTheApplications();

        await expect(JSON.stringify(list)).toEqual(JSON.stringify(appNames));
    });

    it('[C289910] Should the app be displayed on dashboard when is deployed on APS', async () => {
        await browser.refresh();
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await appListCloudPage.checkApsContainer();

        await appListCloudPage.checkAppIsDisplayed(simpleApp);
        await appListCloudPage.checkAppIsDisplayed(browser.params.resources.ACTIVITI_CLOUD_APPS.CANDIDATE_BASE_APP.name);
        await appListCloudPage.checkAppIsDisplayed(browser.params.resources.ACTIVITI_CLOUD_APPS.SUB_PROCESS_APP.name);

        await expect(await appListCloudPage.countAllApps()).toEqual(3);
    });
});
