/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import LoginPage = require('../pages/adf/loginPage');
import AcsUserModel = require('../models/ACS/acsUserModel');
import TestConfig = require('../test.config');
import AlfrescoApi = require('alfresco-js-api-node');
import ErrorPage = require('../pages/adf/errorPage');
import { browser } from '../../node_modules/protractor';

describe('Error Component', () => {

    let acsUser = new AcsUserModel();
    let loginPage = new LoginPage();
    let errorPage = new ErrorPage();

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        loginPage.loginToContentServicesUsingUserModel(acsUser);

        done();

    });

    it('[C277302]  Error message displayed without permissions', () => {
        browser.get(TestConfig.adf.url + '/error/403');
        expect(errorPage.getErrorCode()).toBe('403');
        expect(errorPage.getErrorTitle()).toBe('You don\'t have permission to access this server.');
        expect(errorPage.getErrorDescription()).toBe('You\'re not allowed access to this resource on the server.');
    });

});
