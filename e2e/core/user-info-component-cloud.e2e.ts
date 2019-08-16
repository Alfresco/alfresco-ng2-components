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
import { UserInfoPage } from '@alfresco/adf-testing';
import { IdentityService, ApiService } from '@alfresco/adf-testing';

describe('User Info - SSO', () => {

    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();
    const userInfoPage = new UserInfoPage();
    let silentLogin, identityUser;
    let identityService: IdentityService;

    beforeAll(async () => {
        const apiService = new ApiService(browser.params.config.oauth2.clientId, browser.params.testConfig.adf.url, browser.params.testConfig.adf.hostSso, 'ECM');
        await apiService.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

        identityService = new IdentityService(apiService);
        identityUser = await identityService.createIdentityUser();

        silentLogin = false;
        await settingsPage.setProviderEcmSso(browser.params.testConfig.adf.url,
            browser.params.testConfig.adf.hostSso,
            browser.params.testConfig.adf.hostIdentity, silentLogin, true, browser.params.config.oauth2.clientId);

        await loginSSOPage.clickOnSSOButton();

        await loginSSOPage.loginSSOIdentityService(identityUser.email, identityUser.password);

    });

    afterAll(async () => {
        if (identityService) {
            await identityService.deleteIdentityUser(identityUser.idIdentityService);
        }
    });

    it('[C290066] Should display UserInfo when login using SSO', async () => {
        await userInfoPage.clickUserProfile();
        await expect(await userInfoPage.getSsoHeaderTitle()).toEqual(identityUser.firstName + ' ' + identityUser.lastName);
        await expect(await userInfoPage.getSsoTitle()).toEqual(identityUser.firstName + ' ' + identityUser.lastName);
        await expect(await userInfoPage.getSsoEmail()).toEqual(identityUser.email);
        await userInfoPage.closeUserProfile();
        await userInfoPage.dialogIsNotDisplayed();
    });

});
