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

import { browser } from 'protractor';
import { ContentServicesPage } from '../../pages/adf/content-services.page';
import { NavigationBarPage } from '../../pages/adf/navigation-bar.page';
import { AcsUserModel } from '../../models/ACS/acs-user.model';
import { LoginSSOPage, ErrorPage, StringUtil, BrowserActions, ApiService } from '@alfresco/adf-testing';

describe('Document List Component', () => {

    const loginPage = new LoginSSOPage();
    const contentServicesPage = new ContentServicesPage();
    const errorPage = new ErrorPage();
    const navigationBarPage = new NavigationBarPage();
    const alfrescoJsApi = new ApiService().apiService;

    let privateSite;
    let acsUser = null;

    describe('Permission Message', () => {
        beforeAll(async () => {
            acsUser = new AcsUserModel();
            const siteName = `PRIVATE_TEST_SITE_${StringUtil.generateRandomString(5)}`;
            const privateSiteBody = { visibility: 'PRIVATE', title: siteName };

            await alfrescoJsApi.login(browser.params.testConfig.admin.email, browser.params.testConfig.admin.password);

            await alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            privateSite = await alfrescoJsApi.core.sitesApi.createSite(privateSiteBody);

            await loginPage.login(acsUser.id, acsUser.password);
        });

        afterAll(async () => {
            await navigationBarPage.clickLogoutButton();
            await alfrescoJsApi.core.sitesApi.deleteSite(privateSite.entry.id, { permanent: true });
        });

        it('[C217334] Should display a message when accessing file without permissions', async () => {
            await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/files/' + privateSite.entry.guid);
            await expect(await errorPage.getErrorCode()).toBe('403');
            await expect(await errorPage.getErrorDescription()).toBe('You\'re not allowed access to this resource on the server.');
        });

        it('[C279924] Should display custom message when accessing a file without permissions', async () => {
            await contentServicesPage.goToDocumentList();
            await contentServicesPage.enableCustomPermissionMessage();
            await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/files/' + privateSite.entry.guid);
            await expect(await errorPage.getErrorCode()).toBe('403');
        });
   });
});
