/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { LoginAPSPage } from '../../../pages/adf/loginApsPage';
import { SettingsPage } from '../../../pages/adf/settingsPage';
import TestConfig = require('../../../test.config');
import { browser } from 'protractor';
import { NavigationBarPage } from '../../../pages/adf/NavigationBarPage';

describe('Login component - SSO', () => {

    const settingsPage = new SettingsPage();
    const loginApsPage = new LoginAPSPage();
    const navigationBarPage = new NavigationBarPage();
    const path = '/auth/realms/springboot';
    let silentLogin;

    afterEach(() => {
        navigationBarPage.clickLogoutButton();
        browser.executeScript('window.sessionStorage.clear();');
        browser.executeScript('window.localStorage.clear();');
       });

    it('[C261050] Should be possible login in the PS with SSO', async () => {
        silentLogin = false;
        await settingsPage.setProviderBpmSso(TestConfig.adf.hostSso, TestConfig.adf.hostSso + path, silentLogin);
        await loginApsPage.clickOnSSOButton();
        browser.ignoreSynchronization = true;
        await loginApsPage.loginAPS(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    });

    it ('[C280667] Should be redirect directly to keycloak without show the login page with silent login', async () => {
        await settingsPage.setProviderBpmSso(TestConfig.adf.hostSso, TestConfig.adf.hostSso + path);
        browser.ignoreSynchronization = true;
        await loginApsPage.loginAPS(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    });
});
