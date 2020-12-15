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
import { AboutPage, ApiService, LoginPage, UsersActions } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';

describe('About Process Services', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const aboutPage = new AboutPage();

    let user;

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);

    beforeAll(async() => {
        await apiService.loginWithProfile('admin');
        user = await usersActions.createUser();
        await apiService.login(user.username, user.password);
        await loginPage.login(user.username, user.password);
        await navigationBarPage.clickAboutButton();
    });

    afterAll(async() => {
        await navigationBarPage.clickLogoutButton();
        await apiService.loginWithProfile('admin');
        await apiService.getInstance().activiti.adminTenantsApi.deleteTenant(user.tenantId);
    });

    it('[C280002] Should be able to view about process services info', async () => {
        await aboutPage.checkAppTitleIsDisplayed();
        await aboutPage.checkSourceCodeTitleIsDisplayed();
        await aboutPage.checkGithubUrlIsDisplayed();
        await aboutPage.checkGithubVersionIsDisplayed();
        await aboutPage.checkBpmHostIsDisplayed();
        await aboutPage.checkBpmEditionIsDisplayed();
        await aboutPage.checkBpmVersionIsDisplayed();
        await aboutPage.checkAboutListIsLoaded();
        await aboutPage.checkPackageColumnsIsDisplayed();
    });
});
