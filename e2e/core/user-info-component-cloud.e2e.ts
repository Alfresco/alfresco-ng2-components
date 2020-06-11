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

import {
    ApiService,
    LoginSSOPage,
    SettingsPage,
    UserInfoPage,
    getTestConfig
} from '@alfresco/adf-testing';
import { UsersActions } from '../actions/users.actions';

describe('User Info - SSO', () => {
    const testConfig = getTestConfig();
    const settingsPage = new SettingsPage();
    const loginSSOPage = new LoginSSOPage();
    const userInfoPage = new UserInfoPage();

    const apiService = new ApiService({ authType: 'OAUTH', provider: 'ECM' });
    const usersActions = new UsersActions(apiService);

    let identityUser;

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');

        identityUser = await usersActions.createUser();

        await settingsPage.setProviderEcmSso(
            testConfig.adf.url,
            testConfig.appConfig.oauth2.host,
            testConfig.appConfig.identityHost,
            false,
            true,
            testConfig.appConfig.oauth2.clientId
        );

        await loginSSOPage.loginSSOIdentityService(identityUser.email, identityUser.password);
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
