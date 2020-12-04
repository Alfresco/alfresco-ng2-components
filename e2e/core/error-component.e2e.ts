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

import { ApiService, BrowserActions, ErrorPage, LoginPage, UserModel, UsersActions } from '@alfresco/adf-testing';
import { browser } from 'protractor';
import { NavigationBarPage } from '../core/pages/navigation-bar.page';
import { ContentServicesPage } from './pages/content-services.page';

describe('Error Component', () => {

    const acsUser = new UserModel();
    const loginPage = new LoginPage();
    const errorPage = new ErrorPage();
    const navigationBarPage = new NavigationBarPage();

    const apiService = new ApiService();
    const usersActions = new UsersActions(apiService);
    const contentServicesPage = new ContentServicesPage();

    beforeAll(async () => {
        await apiService.loginWithProfile('admin');
        await usersActions.createUser(acsUser);
        await loginPage.login(acsUser.email, acsUser.password);
        await contentServicesPage.goToDocumentList();
    });

    afterAll(async () => {
        await navigationBarPage.clickLogoutButton();
    });

    it('[C277302] Should display the error 403 when access to unauthorized page - My Change', async () => {
        await BrowserActions.getUrl(browser.baseUrl + '/error/403');
        await expect(await errorPage.getErrorCode()).toBe('403');
        await expect(await errorPage.getErrorTitle()).toBe('You don\'t have permission to access this server.');
        await expect(await errorPage.getErrorDescription()).toBe('You\'re not allowed access to this resource on the server.');
    });

    it('[C277304] Should display the error 404 when access to not found page', async () => {
        await BrowserActions.getUrl(browser.baseUrl + '/error/404');
        await expect(await errorPage.getErrorCode()).toBe('404');
        await expect(await errorPage.getErrorTitle()).toBe('An error occurred.');
        await expect(await errorPage.getErrorDescription()).toBe('We couldn’t find the page you were looking for.');
    });

    it('[C307029] Should display Unknown message when error is undefined', async () => {
        await BrowserActions.getUrl(browser.baseUrl + '/error/501');
        await browser.sleep(2000);
        await expect(await errorPage.getErrorCode()).toBe('UNKNOWN');
        await expect(await errorPage.getErrorTitle()).toBe('We hit a problem.');
        await expect(await errorPage.getErrorDescription()).toBe('Looks like something went wrong.');
    });
});
