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

import { browser } from 'protractor';
import { ContentServicesPage } from '../../core/pages/content-services.page';
import { NavigationBarPage } from '../../core/pages/navigation-bar.page';
import { createApiService, BrowserActions, ErrorPage, LoginPage, StringUtil, UsersActions } from '@alfresco/adf-testing';
import { SitesApi } from '@alfresco/js-api';

describe('Document List Component', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const errorPage = new ErrorPage();
    const navigationBarPage = new NavigationBarPage();
    const apiService = createApiService();
    const usersActions = new UsersActions(apiService);

    let privateSite;
    let acsUser = null;

    describe('Permission Message', () => {
        beforeAll(async () => {
            const siteName = `PRIVATE_TEST_SITE_${StringUtil.generateRandomString(5)}`;
            const privateSiteBody = { visibility: 'PRIVATE', title: siteName };

            await apiService.loginWithProfile('admin');

            acsUser = await usersActions.createUser();

            const sitesApi = new SitesApi(apiService.getInstance());
            privateSite = await sitesApi.createSite(privateSiteBody);

            await loginPage.login(acsUser.username, acsUser.password);
        });

        afterAll(async () => {
            await apiService.loginWithProfile('admin');
            await navigationBarPage.clickLogoutButton();

            const sitesApi = new SitesApi(apiService.getInstance());
            await sitesApi.deleteSite(privateSite.entry.id, { permanent: true });
        });

        it('[C217334] Should display a message when accessing file without permissions', async () => {
            await BrowserActions.getUrl(browser.baseUrl + '/files/' + privateSite.entry.guid);
            await expect(await errorPage.getErrorCode()).toBe('403');
            await expect(await errorPage.getErrorDescription()).toBe('You\'re not allowed access to this resource on the server.');
        });

        it('[C279924] Should display custom message when accessing a file without permissions', async () => {
            await contentServicesPage.goToDocumentList();
            await contentServicesPage.enableCustomPermissionMessage();
            await BrowserActions.getUrl(browser.baseUrl + '/files/' + privateSite.entry.guid);
            await expect(await errorPage.getErrorCode()).toBe('403');
        });
   });
});
