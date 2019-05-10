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
import TestConfig = require('../../test.config');
import { LoginPage, ErrorPage, StringUtil, BrowserActions } from '@alfresco/adf-testing';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';

describe('Document List Component', () => {

    const loginPage = new LoginPage();
    const contentServicesPage = new ContentServicesPage();
    const navBar = new NavigationBarPage();
    const errorPage = new ErrorPage();
    let privateSite;
    let acsUser = null;

    beforeAll(() => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });
    });

    describe('Permission Message', async () => {

        beforeAll(async (done) => {
            acsUser = new AcsUserModel();
            const siteName = `PRIVATE_TEST_SITE_${StringUtil.generateRandomString(5)}`;
            const privateSiteBody = { visibility: 'PRIVATE', title: siteName };

            await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

            await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

            privateSite = await this.alfrescoJsApi.core.sitesApi.createSite(privateSiteBody);

            await loginPage.loginToContentServicesUsingUserModel(acsUser);

            done();
        });

        afterAll(async (done) => {
            await this.alfrescoJsApi.core.sitesApi.deleteSite(privateSite.entry.id);
            navBar.openLanguageMenu();
            navBar.chooseLanguage('English');
            done();
        });

        it('[C217334] Should display a message when accessing file without permissions', () => {
            BrowserActions.getUrl(TestConfig.adf.url + '/files/' + privateSite.entry.guid);
            expect(errorPage.getErrorCode()).toBe('403');
            expect(errorPage.getErrorDescription()).toBe('You\'re not allowed access to this resource on the server.');
        });

        it('[C279924] Should display custom message when accessing a file without permissions', () => {
            contentServicesPage.goToDocumentList();
            contentServicesPage.enableCustomPermissionMessage();
            BrowserActions.getUrl(TestConfig.adf.url + '/files/' + privateSite.entry.guid);
            expect(errorPage.getErrorCode()).toBe('403');
        });

        it('[C279925] Should display translated message when accessing a file without permissions if language is changed', () => {
            navBar.openLanguageMenu();
            navBar.chooseLanguage('Italiano');
            browser.sleep(2000);
            BrowserActions.getUrl(TestConfig.adf.url + '/files/' + privateSite.entry.guid);
            expect(errorPage.getErrorDescription()).toBe('Accesso alla risorsa sul server non consentito.');
        });

    });

});
