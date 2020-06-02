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

import { LoginSSOPage, ErrorPage, BrowserActions, ApiService } from '@alfresco/adf-testing';
import { AcsUserModel } from '../models/ACS/acs-user.model';
import { browser } from 'protractor';
import { NavigationBarPage } from '../pages/adf/navigation-bar.page';

describe('Error Component', () => {

    const acsUser = new AcsUserModel();
    const loginPage = new LoginSSOPage();
    const errorPage = new ErrorPage();
    const navigationBarPage = new NavigationBarPage();
    const alfrescoJsApi = new ApiService().apiService;

    beforeAll(async () => {
        await alfrescoJsApi.login(browser.params.testConfig.adf.adminEmail, browser.params.testConfig.adf.adminPassword);
        await alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await loginPage.login(acsUser.email, acsUser.password);
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
