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

import { LoginPage, SettingsPage, BrowserVisibility } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../../core/pages/navigation-bar.page';
import { LoginShellPage } from '../../../core/pages/login-shell.page';

describe('Login component - SSO', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginPage();
    const loginPage = new LoginShellPage();
    const navigationBarPage = new NavigationBarPage();

    describe('Login component - SSO implicit Flow', () => {
        afterEach(async () => {
            await navigationBarPage.clickLogoutButton();
            await browser.executeScript('window.sessionStorage.clear();');
            await browser.executeScript('window.localStorage.clear();');
            await browser.refresh();
        });

        it('[C261050] Should be possible login with SSO', async () => {
            await settingsPage.setProviderEcmSso(browser.params.testConfig.appConfig.ecmHost,
                browser.params.testConfig.appConfig.oauth2.host,
                browser.params.testConfig.appConfig.identityHost,
                false,
                true,
                browser.params.testConfig.appConfig.oauth2.clientId,
                browser.params.testConfig.appConfig.oauth2.redirectUriLogout);

            await loginSSOPage.loginSSOIdentityService(browser.params.testConfig.users.admin.username, browser.params.testConfig.users.admin.password);
        });

        it('[C280667] Should be redirect directly to keycloak without show the login page with silent login', async () => {
            await settingsPage.setProviderEcmSso(
                browser.params.testConfig.appConfig.ecmHost,
                browser.params.testConfig.appConfig.oauth2.host,
                browser.params.testConfig.appConfig.identityHost,
                true,
                true,
                browser.params.testConfig.appConfig.oauth2.clientId,
                browser.params.testConfig.appConfig.oauth2.redirectUriLogout);

            await loginSSOPage.loginSSOIdentityService(browser.params.testConfig.users.admin.username, browser.params.testConfig.users.admin.password);
        });
    });

    describe('Login component - SSO Grant type password (implicit flow false)', () => {
        it('[C299158] Should be possible to login with SSO, with  grant type password (Implicit Flow false)', async () => {
            await settingsPage.setProviderEcmSso(browser.params.testConfig.appConfig.ecmHost,
                browser.params.testConfig.appConfig.oauth2.host,
                browser.params.testConfig.appConfig.identityHost,
                false,
                false,
                browser.params.testConfig.appConfig.oauth2.clientId,
                browser.params.testConfig.appConfig.oauth2.redirectUriLogout);

            await loginPage.waitForElements();

            await loginPage.enterUsername(browser.params.testConfig.users.admin.username);
            await loginPage.enterPassword(browser.params.testConfig.users.admin.password);
            await loginPage.clickSignInButton();

            await BrowserVisibility.waitUntilElementIsVisible(loginPage.sidenavLayout);
        });
    });
});
