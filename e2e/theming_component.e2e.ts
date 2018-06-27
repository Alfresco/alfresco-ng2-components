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

var AdfLoginPage = require('./pages/adf/loginPage.js');
var AdfNavigationBarPage = require('./pages/adf/navigationBarPage.js');
var TestConfig = require('./test.config.js');
var AcsUserModel = require('./models/ACS/acsUserModel.js');
var PeopleAPI = require('./restAPI/ACS/PeopleAPI.js');
var CONSTANTS = require('./util/constants');

xdescribe('Test Theming component', () => {

    var adfNavigationBarPage = new AdfNavigationBarPage();
    var adfLoginPage = new AdfLoginPage();
    var adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminUser,
        'password': TestConfig.adf.adminPassword
    });
    var acsUser = new AcsUserModel();

    beforeAll(function (done) {
        PeopleAPI.createUserViaAPI(adminUserModel, acsUser)
            .then(done());
    });

    it('Theming component', () => {
        adfLoginPage.goToLoginPage();
        adfLoginPage.waitForElements();
        adfLoginPage.getShowPasswordIconColor().then(function (value) {
            expect(value).toEqual(CONSTANTS.THEMING.DEFAULT_PASSWORD_ICON_COLOR);
        });
        adfLoginPage.getSignInButtonColor().then(function (value) {
            expect(value).toEqual(CONSTANTS.THEMING.DEFAULT_LOGIN_BUTTON_COLOR);
        });
        adfLoginPage.getBackgroundColor().then(function (value) {
            expect(value).toEqual(CONSTANTS.THEMING.DEFAULT_BACKGROUND_COLOR);
        });
        adfLoginPage.loginToContentServicesUsingUserModel(acsUser);
        adfNavigationBarPage.clickThemeButton();
        adfNavigationBarPage.clickOnSpecificThemeButton(CONSTANTS.THEMING.PINK_BLUE_DARK);
        adfNavigationBarPage.clickLoginButton();
        adfLoginPage.waitForElements();
        adfLoginPage.enterUsername(acsUser.email);
        adfLoginPage.enterPassword(acsUser.password);
        expect(adfLoginPage.getShowPasswordIconColor()).toEqual(CONSTANTS.THEMING.PINK_BLUE_DARK_PASSWORD_ICON_COLOR);
        adfLoginPage.getSignInButtonColor().then(function (value) {
            expect(value).toEqual(CONSTANTS.THEMING.PINK_BLUE_DARK_LOGIN_BUTTON_COLOR);
        });
        adfLoginPage.getBackgroundColor().then(function (value) {
            expect(value).toEqual(CONSTANTS.THEMING.PINK_BLUE_DARK_BACKGROUND_COLOR);
        });
    });

});
