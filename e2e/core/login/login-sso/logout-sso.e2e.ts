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

import { LoginPage, SettingsPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../pages/navigation-bar.page';

describe('Logout component - SSO', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();

    it('[C280665] Should be possible change the logout redirect URL', async () => {
        await settingsPage.setProviderEcmSso(browser.params.testConfig.appConfig.ecmHost,
            browser.params.testConfig.appConfig.oauth2.host,
            browser.params.testConfig.appConfig.identityHost, false, true, browser.params.testConfig.appConfig.oauth2.clientId, '#/login');
        await loginSSOPage.loginSSOIdentityService(browser.params.testConfig.users.admin.username, browser.params.testConfig.users.admin.password);

        await navigationBarPage.clickLogoutButton();

        const actualUrl = await browser.getCurrentUrl();
        await expect(actualUrl).toEqual(browser.baseUrl + '/login');
    });
});
