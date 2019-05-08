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

import { ErrorPage, LoginSSOPage, SettingsPage, BrowserActions } from '@alfresco/adf-testing';
import TestConfig = require('../../test.config');
import { browser } from 'protractor';

describe('Auth Guard SSO', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();
    const errorPage = new ErrorPage();

    it('[C307058] Should be redirected to 403 when user doesn\'t have permissions', async () => {
        settingsPage.setProviderEcmSso(TestConfig.adf.url, TestConfig.adf.hostSso, TestConfig.adf.hostIdentity, false, true, 'alfresco');
        loginSSOPage.clickOnSSOButton();
        await loginSSOPage.loginSSOIdentityService(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        BrowserActions.getUrl(TestConfig.adf.url + '/cloud/simple-app');
        browser.driver.sleep(1000);
        expect(errorPage.getErrorCode()).toBe('403');
    });

});
