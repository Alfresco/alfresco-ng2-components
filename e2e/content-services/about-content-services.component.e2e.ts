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
import { AboutPage, ApiService, LoginPage, UserModel, UsersActions } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';

describe('About Content Services', () => {

    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const aboutPage = new AboutPage();
    let acsUser: UserModel;
    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);

    beforeAll(async() => {
        await apiService.loginWithProfile('admin');
        acsUser = await usersActions.createUser();
        await apiService.login(acsUser.username, acsUser.password);
        await loginPage.login(acsUser.username, acsUser.password);
        await navigationBarPage.clickAboutButton();
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    it('[C280002] Should be able to view about content services info', async () => {
        await aboutPage.checkAppTitleIsDisplayed();
        await aboutPage.checkSourceCodeTitleIsDisplayed();
        await aboutPage.checkGithubUrlIsDisplayed();
        await aboutPage.checkGithubVersionIsDisplayed();
        await aboutPage.checkEcmHostIsDisplayed();
        await aboutPage.checkEcmEditionIsDisplayed();
        await aboutPage.checkEcmVersionIsDisplayed();
        await aboutPage.checkAboutListIsLoaded();
        await aboutPage.checkPackageColumnsIsDisplayed();
        await aboutPage.checkEcmStatusTitleIsDisplayed();
        await aboutPage.checkStatusColumnsIsDisplayed();
        await aboutPage.checkEcmLicenseTitleIsDisplayed();
        await aboutPage.checkLicenseColumnsIsDisplayed();
        await aboutPage.checkEcmModulesTitleIsDisplayed();
        await aboutPage.checkModulesColumnsIsDisplayed();
    });
});
