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
import { ContentServicesPage } from '../../pages/adf/contentServicesPage';
import { NavigationBarPage } from '../../pages/adf/navigationBarPage';
import { AcsUserModel } from '../../models/ACS/acsUserModel';
import { LoginPage, ErrorPage, StringUtil, BrowserActions } from '@alfresco/adf-testing';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

describe('Document List Component', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navBar = new NavigationBarPage();
    const errorPage = new ErrorPage();
    const navigationBarPage = new NavigationBarPage();

    let privateSite;
    let acsUser = null;

    beforeAll(() => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });
    });

    describe('Permission Message', () => {

        beforeAll(async () => {
            acsUser = new AcsUserModel();
            const siteName = `PRIVATE_TEST_SITE_${StringUtil.generateRandomString(5)}`;
            const privateSiteBody = { visibility: 'PRIVATE', title: siteName };

            await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            privateSite = await this.alfrescoJsApi.core.sitesApi.createSite(privateSiteBody);

            await loginPage.loginToContentServicesUsingUserModel(acsUser);

        });

        afterAll(async () => {
            await navigationBarPage.clickLogoutButton();
            await this.alfrescoJsApi.core.sitesApi.deleteSite(privateSite.entry.id);
            await navBar.openLanguageMenu();
            await navBar.chooseLanguage('English');

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

        it('[C279925] Should display translated message when accessing a file without permissions if language is changed', async () => {
            await navBar.openLanguageMenu();
            await navBar.chooseLanguage('Italiano');
            await browser.sleep(2000);
            await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/files/' + privateSite.entry.guid);
            await expect(await errorPage.getErrorDescription()).toBe('Accesso alla risorsa sul server non consentito.');
        });

    });

});
