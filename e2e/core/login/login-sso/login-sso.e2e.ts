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

import { LoginSSOPage, SettingsPage, LoginPage, BrowserVisibility } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../../pages/adf/navigationBarPage';

describe('Login component - SSO', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();
    const loginPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();

    const silentLogin = false;
    let implicitFlow;

    describe('Login component - SSO Grant type password (implicit flow false)', () => {

        it('[C299158] Should be possible to login with SSO, with  grant type password (Implicit Flow false)', async () => {
            implicitFlow = false;
            await settingsPage.setProviderEcmSso(browser.params.testConfig.adf_acs.host,
                browser.params.testConfig.adf.hostSso,
                browser.params.testConfig.adf.hostIdentity, silentLogin, implicitFlow, browser.params.config.oauth2.clientId);

            await loginPage.waitForElements();

            await settingsPage.setProviderEcmSso(browser.params.testConfig.adf_acs.host,
                browser.params.testConfig.adf.hostSso,
                browser.params.testConfig.adf.hostIdentity, silentLogin, implicitFlow, browser.params.config.oauth2.clientId);
            browser.ignoreSynchronization = true;

            await loginPage.enterUsername(browser.params.testConfig.adf.adminEmail);
            await loginPage.enterPassword(browser.params.testConfig.adf.adminPassword);
            await loginPage.clickSignInButton();

            await BrowserVisibility.waitUntilElementIsVisible(loginPage.sidenavLayout);

        });
    });

    describe('Login component - SSO implicit Flow', () => {

        afterEach(async () => {
            await navigationBarPage.clickLogoutButton();
            await browser.executeScript('window.sessionStorage.clear();');
            await browser.executeScript('window.localStorage.clear();');
            await browser.refresh();
        });

        it('[C261050] Should be possible login with SSO', async () => {
            await settingsPage.setProviderEcmSso(browser.params.testConfig.adf_acs.host,
                browser.params.testConfig.adf.hostSso,
                browser.params.testConfig.adf.hostIdentity, false, true, browser.params.config.oauth2.clientId);
            await loginSSOPage.clickOnSSOButton();
            await loginSSOPage.loginSSOIdentityService(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        });

        it('[C280667] Should be redirect directly to keycloak without show the login page with silent login', async () => {
            await settingsPage.setProviderEcmSso(browser.params.testConfig.adf_acs.host,
                browser.params.testConfig.adf.hostSso,
                browser.params.testConfig.adf.hostIdentity, true, true, browser.params.config.oauth2.clientId);
            await loginSSOPage.loginSSOIdentityService(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        });

    });

});
