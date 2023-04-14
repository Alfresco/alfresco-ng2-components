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

import { createApiService, ErrorPage, IdentityService, LoginPage } from '@alfresco/adf-testing';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';

describe('User Access Cloud', () => {
    const loginSSOPage = new LoginPage();
    const navigationBarPage = new NavigationBarPage();
    const errorPage = new ErrorPage();

    const apiService = createApiService();
    const identityService = new IdentityService(apiService);

    let testUser;

    beforeAll( async () => {
        await apiService.loginWithProfile('identityAdmin');
        testUser = await identityService.createIdentityUserWithRole([identityService.ROLES.ACTIVITI_DEVOPS]);

        await loginSSOPage.login(testUser.username, testUser.password);
        await apiService.login(testUser.username, testUser.password);
    });

    afterAll(async () => {
        await apiService.loginWithProfile('identityAdmin');
        await identityService.deleteIdentityUser(testUser.idIdentityService);
    });

    it('[C299206] Should redirect the user without the right access role on a forbidden page', async () => {
        await navigationBarPage.navigateToProcessServicesCloudPage();
        await expect(await errorPage.getErrorCode()).toBe('403');
        await expect(await errorPage.getErrorTitle()).toBe('You don\'t have permission to access this server.');
        await expect(await errorPage.getErrorDescription()).toBe('You\'re not allowed access to this resource on the server.');
    });
});
