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

import LoginPage = require('./pages/adf/loginPage');
import NavigationBarPage = require('./pages/adf/navigationBarPage');

import TestConfig = require('./test.config');

import AcsUserModel = require('./models/ACS/acsUserModel');
import CONSTANTS = require('./util/constants');

import AlfrescoApi = require('alfresco-js-api-node');

xdescribe('Test Theming component', () => {

    let navigationBarPage = new NavigationBarPage();
    let loginPage = new LoginPage();
    let adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminUser,
        'password': TestConfig.adf.adminPassword
    });
    let acsUser = new AcsUserModel();

    beforeAll(async (done) => {
        this.alfrescoJsApi = new AlfrescoApi({
            provider: 'ECM',
            hostEcm: TestConfig.adf.url
        });

        await this.alfrescoJsApi.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);

        await this.alfrescoJsApi.core.peopleApi.addPerson(acsUser);

        done();
    });

    it('Theming component', () => {
        loginPage.goToLoginPage();
        loginPage.waitForElements();
        loginPage.getShowPasswordIconColor().then(function (value) {
            expect(value).toEqual(CONSTANTS.THEMING.DEFAULT_PASSWORD_ICON_COLOR);
        });
        loginPage.getSignInButtonColor().then(function (value) {
            expect(value).toEqual(CONSTANTS.THEMING.DEFAULT_LOGIN_BUTTON_COLOR);
        });
        loginPage.getBackgroundColor().then(function (value) {
            expect(value).toEqual(CONSTANTS.THEMING.DEFAULT_BACKGROUND_COLOR);
        });
        loginPage.loginToContentServicesUsingUserModel(acsUser);
        navigationBarPage.clickThemeButton();
        navigationBarPage.clickOnSpecificThemeButton(CONSTANTS.THEMING.PINK_BLUE_DARK);
        navigationBarPage.clickLoginButton();
        loginPage.waitForElements();
        loginPage.enterUsername(acsUser.email);
        loginPage.enterPassword(acsUser.password);
        expect(loginPage.getShowPasswordIconColor()).toEqual(CONSTANTS.THEMING.PINK_BLUE_DARK_PASSWORD_ICON_COLOR);
        loginPage.getSignInButtonColor().then(function (value) {
            expect(value).toEqual(CONSTANTS.THEMING.PINK_BLUE_DARK_LOGIN_BUTTON_COLOR);
        });
        loginPage.getBackgroundColor().then(function (value) {
            expect(value).toEqual(CONSTANTS.THEMING.PINK_BLUE_DARK_BACKGROUND_COLOR);
        });
    });

});
