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

import { ApiService, IdentityService, AboutPage, LoginPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';

describe('About Process Services Cloud', () => {

    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const aboutPage = new AboutPage();

    const apiService = new ApiService();
    const identityService  = new IdentityService(apiService);

    let testUser;

    beforeAll(async () => {
        await apiService.loginWithProfile('identityAdmin');
        testUser = await identityService.createIdentityUserWithRole( [identityService.ROLES.ACTIVITI_USER, identityService.ROLES.ACTIVITI_DEVOPS]);
        await loginSSOPage.login(testUser.email, testUser.password);
        await apiService.login(testUser.email, testUser.password);
        await navigationBarPage.clickAboutButton();
    });

    afterAll(async () => {
        await apiService.loginWithProfile('identityAdmin');
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
