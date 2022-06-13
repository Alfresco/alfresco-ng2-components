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

import { createApiService,
    BrowserActions,
    LocalStorageUtil,
    UserInfoPage,
    UserModel,
    UsersActions
} from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { LoginShellPage } from '../../core/pages/login-shell.page';

describe('Login component', () => {

    const navigationBarPage = new NavigationBarPage();
    const userInfoPage = new UserInfoPage();
    const contentServicesPage = new ContentServicesPage();
    const loginPage = new LoginShellPage();

    const userA = new UserModel();
    const userB = new UserModel();

    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    beforeAll(async () => {
        await LocalStorageUtil.setStorageItem('authType', 'BASIC');

        await apiService.loginWithProfile('admin');

        await usersActions.createUser(userA);
        await usersActions.createUser(userB);
    });

    afterEach(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    it('[C276746] Should display the right information in user-info when a different users logs in', async () => {
        await LocalStorageUtil.setStorageItem('providers', 'ECM');

        await loginPage.login(userA.username, userA.password);
        await userInfoPage.clickUserProfile();
        await expect(await userInfoPage.getContentHeaderTitle()).toEqual(`${userA.firstName} ${userA.lastName}`);

        await navigationBarPage.clickLogoutButton();
        await loginPage.login(userB.username, userB.password);
        await userInfoPage.clickUserProfile();
        await expect(await userInfoPage.getContentHeaderTitle()).toEqual(`${userB.firstName} ${userB.lastName}`);
    });

    it('[C260048] Should be possible to enable/disable login footer', async () => {
        await loginPage.goToLoginPage();
        await loginPage.enableFooter();
        await loginPage.checkRememberIsDisplayed();
        await loginPage.checkNeedHelpIsDisplayed();
        await loginPage.checkRegisterDisplayed();
        await loginPage.disableFooter();
        await loginPage.checkRememberIsNotDisplayed();
        await loginPage.checkNeedHelpIsNotDisplayed();
        await loginPage.checkRegisterIsNotDisplayed();
    });

    it('[C260050] Should be possible to login to Content Services with Process Services disabled', async () => {
        await LocalStorageUtil.setStorageItem('providers', 'ECM');

        await loginPage.goToLoginPage();
        await expect(await loginPage.getSignInButtonIsEnabled()).toBe(false);
        await loginPage.loginWithProfile('admin');
        await navigationBarPage.navigateToContentServices();
        await contentServicesPage.checkAcsContainer();
    });

    it('[C277754] Should the user be redirect to the login page when the Content Service session expire', async () => {
        await LocalStorageUtil.setStorageItem('providers', 'ECM');

        await loginPage.goToLoginPage();
        await loginPage.loginWithProfile('admin');
        await browser.executeScript('window.localStorage.removeItem("ADF_ticket-ECM");');
        await BrowserActions.getUrl(browser.baseUrl + '/files');
        await loginPage.waitForElements();

        await LocalStorageUtil.setStorageItem('providers', 'ALL');
    });

    it('[C279933] Should be possible change the login component logo when logoImageUrl is changed', async () => {
        await loginPage.goToLoginPage();
        await loginPage.enableLogoSwitch();
        await loginPage.enterLogo('https://rawgit.com/Alfresco/alfresco-ng2-components/master/assets/angular2.png');
        await loginPage.checkLoginImgURL();
    });
});
