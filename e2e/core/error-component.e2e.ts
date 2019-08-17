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

import { LoginPage, ErrorPage, BrowserActions } from '@alfresco/adf-testing';
import { AcsUserModel } from '../models/ACS/acsUserModel';
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser } from 'protractor';
import { NavigationBarPage } from '../pages/adf/navigationBarPage';

describe('Error Component', () => {

    const acsUser = new AcsUserModel();
    const loginPage = new LoginPage();
    const errorPage = new ErrorPage();
    const navigationBarPage = new NavigationBarPage();

    beforeAll(async () => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: browser.params.testConfig.adf_acs.host
        });

        await this.alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await loginPage.loginToContentServicesUsingUserModel(acsUser);

    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    it('[C277302] Should display the error 403 when access to unauthorized page - My Change', async () => {
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/error/403');
        await expect(await errorPage.getErrorCode()).toBe('403');
        await expect(await errorPage.getErrorTitle()).toBe('You don\'t have permission to access this server.');
        await expect(await errorPage.getErrorDescription()).toBe('You\'re not allowed access to this resource on the server.');
    });

    it('[C280563] Should back home button navigate to the home page', async () => {
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/error/404');

        await errorPage.clickBackButton();

        await expect(await browser.getCurrentUrl()).toBe(browser.params.testConfig.adf.url + '/');
    });

    it('[C280564] Should secondary button by default redirect to report-issue URL', async () => {
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/error/403');

        await errorPage.clickSecondButton();

        await expect(await browser.getCurrentUrl()).toBe(browser.params.testConfig.adf.url + '/report-issue');
    });

    it('[C277304] Should display the error 404 when access to not found page', async () => {
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/error/404');
        await expect(await errorPage.getErrorCode()).toBe('404');
        await expect(await errorPage.getErrorTitle()).toBe('An error occurred.');
        await expect(await errorPage.getErrorDescription()).toBe('We couldn’t find the page you were looking for.');
    });

    it('[C307029] Should display Unknown message when error is undefined', async () => {
        await BrowserActions.getUrl(browser.params.testConfig.adf.url + '/error/501');
        await expect(await errorPage.getErrorCode()).toBe('UNKNOWN');
        await expect(await errorPage.getErrorTitle()).toBe('We hit a problem.');
        await expect(await errorPage.getErrorDescription()).toBe('Looks like something went wrong.');
    });

});
