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

import { LoginSSOPage, SettingsPage, LoginPage } from '@alfresco/adf-testing';
import TestConfig = require('../../../test.config');
import { browser } from 'protractor';
import { NavigationBarPage } from '../../../pages/adf/navigationBarPage';

describe('Login component - SSO', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();
    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();

    const silentLogin = false;
    let implicitFlow;

    describe('Login component - SSO implicit Flow', () => {

        afterEach(() => {
            navigationBarPage.clickLogoutButton();
            browser.executeScript('window.sessionStorage.clear();');
            browser.executeScript('window.localStorage.clear();');
        });

        it('[C261050] Should be possible login with SSO', () => {
            settingsPage.setProviderEcmSso(TestConfig.adf.url, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, false, true, 'alfresco');
            loginSSOPage.clickOnSSOButton();
            loginSSOPage.loginSSOIdentityService(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        });

        it('[C280667] Should be redirect directly to keycloak without show the login page with silent login', () => {
            settingsPage.setProviderEcmSso(TestConfig.adf.url, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, true, true, 'alfresco');
            loginSSOPage.loginSSOIdentityService(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        });
    });

    describe('SSO Login Error for login component', () => {

        it('[C299205] Should display the login error message when the SSO identity service is wrongly configured', async() => {
            await settingsPage.setProviderEcmSso(TestConfig.adf.url, 'http://aps22/auth/realms/alfresco', TestConfig.adf.hostIdentity, false, true, 'alfresco');
            await loginSSOPage.clickOnSSOButton();
            await loginSSOPage.checkLoginErrorIsDisplayed();
            expect(loginSSOPage.getLoginErrorMessage()).toContain('SSO Authentication server unreachable');
        });
    });

    describe('Login component - SSO Grant type password (implicit flow false)', () => {

        it('[C299158] Should be possible to login with SSO, with  grant type password (Implicit Flow false)', () => {
            implicitFlow = false;
            settingsPage.setProviderEcmSso(TestConfig.adf.url, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin, implicitFlow, 'alfresco');

            loginPage.waitForElements();

            settingsPage.setProviderEcmSso(TestConfig.adf.url, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, silentLogin, implicitFlow, 'alfresco');
            browser.ignoreSynchronization = true;

            loginPage.enterUsername(TestConfig.adf.adminEmail);
            loginPage.enterPassword(TestConfig.adf.adminPassword);
            loginPage.clickSignInButton();

            let isDisplayed = false;

            browser.wait(() => {
                loginPage.header.isDisplayed().then(
                    () => {
                        isDisplayed = true;
                    },
                    () => {
                        isDisplayed = false;
                    }
                );
                return isDisplayed;
            }, TestConfig.main.timeout, 'Element is not visible ' + loginPage.header.locator());
        });
    });

    it('[C280665] Should be possible change the logout redirect URL', () => {
        settingsPage.setProviderEcmSso(TestConfig.adf.url, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, false, true, 'alfresco', '/login');
        loginSSOPage.clickOnSSOButton();
        loginSSOPage.loginSSOIdentityService(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        navigationBarPage.clickLogoutButton();

        browser.getCurrentUrl().then((actualUrl) => {
            expect(actualUrl).toEqual(TestConfig.adf.url + '/login');
        });

    });
});
