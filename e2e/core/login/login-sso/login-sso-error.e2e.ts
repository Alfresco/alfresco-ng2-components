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

describe('Login component - SSO', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();

    describe('SSO Login Error for login component', () => {

        afterEach(async () => {
            await browser.executeScript('window.sessionStorage.clear();');
            await browser.executeScript('window.localStorage.clear();');
        });

        it('[C299205] Should display the login error message when the SSO identity service is wrongly configured', async () => {
            await settingsPage.setProviderEcmSso(browser.params.testConfig.adf_acs.host,
                'http://aps22/auth/realms/alfresco',
                browser.params.testConfig.adf.hostIdentity, false, true, browser.params.config.oauth2.clientId);
            await loginSSOPage.clickOnSSOButton();
            await loginSSOPage.checkLoginErrorIsDisplayed();
            await expect(loginSSOPage.getLoginErrorMessage()).toContain('SSO Authentication server unreachable');
        });
    });

});
