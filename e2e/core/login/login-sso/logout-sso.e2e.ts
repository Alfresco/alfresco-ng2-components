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

import { LoginSSOPage, SettingsPage } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { NavigationBarPage } from '../../../pages/adf/navigationBarPage';

describe('Logout component - SSO', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();
    const navigationBarPage = new NavigationBarPage();

    it('[C280665] Should be possible change the logout redirect URL', async () => {
        await settingsPage.setProviderEcmSso(browser.params.testConfig.adf.url,
            browser.params.testConfig.adf.hostSso,
            browser.params.testConfig.adf.hostIdentity, false, true, browser.params.config.oauth2.clientId, '/login');
        await loginSSOPage.clickOnSSOButton();
        await loginSSOPage.loginSSOIdentityService(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await navigationBarPage.clickLogoutButton();

        await browser.sleep(2000);

        const actualUrl = await browser.getCurrentUrl();
        await expect(actualUrl).toEqual(browser.params.testConfig.adf.url + '/login');
    });

});
