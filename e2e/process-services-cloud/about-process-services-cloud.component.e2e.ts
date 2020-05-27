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

import { ApiService, IdentityService, AboutPage, LoginSSOPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';

describe('About Process Services Cloud', () => {

    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();
    const aboutPage = new AboutPage();
    let identityService: IdentityService;
    let testUser;
    const apiService = new ApiService(browser.params.testConfig.appConfigoauth2.clientId, browser.params.testConfig.appConfigbpmHost, browser.params.testConfig.appConfigoauth2.host, 'BPM');

    beforeAll(async () => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        identityService = new IdentityService(apiService);
        testUser = await identityService.createIdentityUserWithRole(apiService, [identityService.ROLES.ACTIVITI_USER, identityService.ROLES.ACTIVITI_DEVOPS]);
        await loginSSOPage.loginSSOIdentityService(testUser.email, testUser.password);
        await apiService.login(testUser.email, testUser.password);
        await navigationBarPage.clickAboutButton();
    });

    afterAll(async () => {
        await apiService.login(browser.params.identityAdmin.email, browser.params.identityAdmin.password);
        await identityService.deleteIdentityUser(testUser.idIdentityService);
    });

    it('[C280002] Should be able to view about process services cloud info', async () => {
        await aboutPage.checkAppTitleIsDisplayed();
        await aboutPage.checkSourceCodeTitleIsDisplayed();
        await aboutPage.checkGithubUrlIsDisplayed();
        await aboutPage.checkGithubVersionIsDisplayed();
        await aboutPage.checkBpmHostIsDisplayed();
        await aboutPage.checkEcmHostIsDisplayed();
    });
});
