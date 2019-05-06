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
import TestConfig = require('../test.config');
import { AlfrescoApiCompatibility as AlfrescoApi } from '@alfresco/js-api';
import { browser } from 'protractor';

describe('Error Component', () => {

    const acsUser = new AcsUserModel();
    const loginPage = new LoginPage();
    const errorPage = new ErrorPage();

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);
        await loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();

    });

    it('[C277302] Should display the error 403 when access to unauthorized page - My Change', () => {
        BrowserActions.getUrl(TestConfig.adf.url + '/error/403');
        expect(errorPage.getErrorCode()).toBe('403');
        expect(errorPage.getErrorTitle()).toBe('You don\'t have permission to access this server.');
        expect(errorPage.getErrorDescription()).toBe('You\'re not allowed access to this resource on the server.');
    });

    it('[C280563] Should back home button navigate to the home page', () => {
        BrowserActions.getUrl(TestConfig.adf.url + '/error/404');

        errorPage.clickBackButton();

        expect(browser.getCurrentUrl()).toBe(TestConfig.adf.url + '/');
    });

    it('[C280564] Should secondary button by default redirect to report-issue URL', () => {
        BrowserActions.getUrl(TestConfig.adf.url + '/error/403');

        errorPage.clickSecondButton();

        expect(browser.getCurrentUrl()).toBe(TestConfig.adf.url + '/report-issue');
    });

    it('[C277304] Should display the error 404 when access to not found page', () => {
        BrowserActions.getUrl(TestConfig.adf.url + '/error/404');
        expect(errorPage.getErrorCode()).toBe('404');
        expect(errorPage.getErrorTitle()).toBe('An error occurred.');
        expect(errorPage.getErrorDescription()).toBe('We couldn’t find the page you were looking for.');
    });

    it('[C307029] Should display Unknown message when error is undefined', () => {
        BrowserActions.getUrl(TestConfig.adf.url + '/error/501');
        expect(errorPage.getErrorCode()).toBe('UNKNOWN');
        expect(errorPage.getErrorTitle()).toBe('We hit a problem.');
        expect(errorPage.getErrorDescription()).toBe('Looks like something went wrong.');
    });

});
