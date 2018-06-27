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
var AdfContentServicesPage = require('./pages/adf/contentServicesPage.js');
var AdfProcessServicesPage = require('./pages/adf/process_services/processServicesPage.js');
var AdfNavigationBarPage = require('./pages/adf/navigationBarPage.js');
var TestConfig = require('./test.config.js');
var AcsUserModel = require('./models/ACS/acsUserModel.js');
var PeopleAPI = require('./restAPI/ACS/PeopleAPI.js');

var AdfSettingsPage = require('./pages/adf/settingsPage.js');

xdescribe('Test Login component', () => {

    var adfSettingsPage = new AdfSettingsPage();
    var adfProcessServicesPage = new AdfProcessServicesPage();
    var adfNavigationBarPage = new AdfNavigationBarPage();
    var adfContentServicesPage = new AdfContentServicesPage();
    var adfLoginPage = new AdfLoginPage();
    var adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminUser,
        'password': TestConfig.adf.adminPassword
    });
    var adminUser = new AcsUserModel({
        'id': TestConfig.adf.adminEmail,
        'password': TestConfig.adf.adminPassword
    });

    var error_messages = {
        username: 'Your username needs to be at least 2 characters.',
        invalid_credentials: 'You\'ve entered an unknown username or password',
        password: 'Enter your password to sign in',
        required: 'Required'
    };

    beforeAll(function (done) {
        PeopleAPI.createUserViaAPI(adminUserModel, adminUser);
        adfSettingsPage.setProviderEcmBpm();
        done();
    });

    it('1. Username Required', () => {
        adfLoginPage.checkUsernameInactive();
        adfLoginPage.checkSignInButtonIsDisabled();
        adfLoginPage.enterUsername('A');
        adfLoginPage.checkUsernameTooltip(error_messages.username);
        adfLoginPage.clearUsername();
        adfLoginPage.checkUsernameTooltip(error_messages.required);
        adfLoginPage.checkUsernameHighlighted();
        adfLoginPage.checkSignInButtonIsDisabled();
    });


    it('2. Enter Password to sign in', () => {
        adfLoginPage.checkPasswordInactive();
        adfLoginPage.checkSignInButtonIsDisabled();
        adfLoginPage.enterPassword('A');
        adfLoginPage.checkPasswordTooltipIsNotVisible();
        adfLoginPage.clearPassword();
        adfLoginPage.checkPasswordTooltip(error_messages.password);
        adfLoginPage.checkPasswordHighlighted();
        adfLoginPage.checkSignInButtonIsDisabled();
    });

    it('3. Username must be at least 2 characters long', () => {
        adfLoginPage.checkSignInButtonIsDisabled();
        adfLoginPage.enterUsername('A');
        adfLoginPage.checkUsernameTooltip(error_messages.username);
        adfLoginPage.enterUsername('AB');
        adfLoginPage.checkUsernameTooltipIsNotVisible();
        adfLoginPage.checkSignInButtonIsDisabled();
        adfLoginPage.clearUsername();
    });

    it('4. Login button is enabled', () => {
        adfLoginPage.enterUsername(adminUserModel.id);
        adfLoginPage.checkSignInButtonIsDisabled();
        adfLoginPage.enterPassword('a');
        adfLoginPage.checkSignInButtonIsEnabled();
        adfLoginPage.clearUsername(adminUserModel.id);
        adfLoginPage.clearPassword();
    });

    it('5. You have entered an invalid username or password', () => {
        adfLoginPage.checkSignInButtonIsDisabled();
        adfLoginPage.enterUsername('test');
        adfLoginPage.enterPassword('test');
        adfLoginPage.checkSignInButtonIsEnabled();
        adfLoginPage.clickSignInButton();
        adfLoginPage.checkLoginError(error_messages.invalid_credentials);
        adfLoginPage.clearUsername();
        adfLoginPage.clearPassword();
    });

    it('6. Password field is crypted', () => {
        adfLoginPage.checkSignInButtonIsDisabled();
        adfLoginPage.enterPassword('test');
        adfLoginPage.showPassword();
        adfLoginPage.checkPasswordIsShown('test');
        adfLoginPage.hidePassword();
        adfLoginPage.checkPasswordIsHidden();
        adfLoginPage.clearPassword();
    });

    it('7. Remember  Need Help? and Register are displayed and hidden', () => {
        adfLoginPage.enableFooter();
        adfLoginPage.checkRememberIsDisplayed();
        adfLoginPage.checkNeedHelpIsDisplayed();
        adfLoginPage.checkRegisterDisplayed();
        adfLoginPage.disableFooter();
        adfLoginPage.checkRememberIsNotDisplayed();
        adfLoginPage.checkNeedHelpIsNotDisplayed();
        adfLoginPage.checkRegisterIsNotDisplayed();
    });

    it('8. Login to Process Services with Content Services disabled', () => {
        adfLoginPage.checkSignInButtonIsDisabled();
        adfSettingsPage.setProviderBpm();
        adfLoginPage.login(adminUser.id, adminUser.password);
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.checkApsContainer();
        adfNavigationBarPage.clickContentServicesButton();
        adfLoginPage.waitForElements();
    });

    it('9. Login to Content Services with Process Services disabled', () => {
        adfLoginPage.checkSignInButtonIsDisabled();
        adfSettingsPage.setProviderEcm();
        adfLoginPage.login(TestConfig.adf.adminUser, TestConfig.adf.adminPassword);
        adfNavigationBarPage.clickContentServicesButton();
        adfContentServicesPage.checkAcsContainer();
        adfNavigationBarPage.clickProcessServicesButton();
        adfLoginPage.waitForElements();
    });

    it('10. Able to login to both Content Services and Process Services', () => {
        adfLoginPage.checkSignInButtonIsDisabled();
        adfSettingsPage.setProviderEcmBpm();
        adfLoginPage.login(adminUser.id, adminUser.password);
        adfNavigationBarPage.clickProcessServicesButton();
        adfProcessServicesPage.checkApsContainer();
        adfNavigationBarPage.clickContentServicesButton();
        adfContentServicesPage.checkAcsContainer();
        adfNavigationBarPage.clickLoginButton();
        adfLoginPage.waitForElements();
    });
});
