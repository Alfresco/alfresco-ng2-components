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
import AdfContentServicesPage = require('./pages/adf/contentServicesPage');
import ProcessServicesPage = require('./pages/adf/process_services/processServicesPage');
import NavigationBarPage = require('./pages/adf/navigationBarPage');

import TestConfig = require('./test.config');
import AcsUserModel = require('./models/ACS/acsUserModel');

import AdfSettingsPage = require('./pages/adf/settingsPage');

describe('Login component', () => {

    let adfSettingsPage = new AdfSettingsPage();
    let processServicesPage = new ProcessServicesPage();
    let navigationBarPage = new NavigationBarPage();
    let adfContentServicesPage = new AdfContentServicesPage();
    let loginPage = new LoginPage();
    let adminUserModel = new AcsUserModel({
        'id': TestConfig.adf.adminUser,
        'password': TestConfig.adf.adminPassword
    });

    let errorMessages = {
        username: 'Your username needs to be at least 2 characters.',
        invalid_credentials: 'You\'ve entered an unknown username or password',
        password: 'Enter your password to sign in',
        required: 'Required'
    };

    beforeAll( (done) => {
        adfSettingsPage.setProviderEcmBpm();
        done();
    });

    it('1. Username Required', () => {
        loginPage.checkUsernameInactive();
        loginPage.checkSignInButtonIsDisabled();
        loginPage.enterUsername('A');
        loginPage.checkUsernameTooltip(errorMessages.username);
        loginPage.clearUsername();
        loginPage.checkUsernameTooltip(errorMessages.required);
        loginPage.checkUsernameHighlighted();
        loginPage.checkSignInButtonIsDisabled();
    });

    it('2. Enter Password to sign in', () => {
        loginPage.checkPasswordInactive();
        loginPage.checkSignInButtonIsDisabled();
        loginPage.enterPassword('A');
        loginPage.checkPasswordTooltipIsNotVisible();
        loginPage.clearPassword();
        loginPage.checkPasswordTooltip(errorMessages.password);
        loginPage.checkPasswordHighlighted();
        loginPage.checkSignInButtonIsDisabled();
    });

    it('3. Username must be at least 2 characters long', () => {
        loginPage.checkSignInButtonIsDisabled();
        loginPage.enterUsername('A');
        loginPage.checkUsernameTooltip(errorMessages.username);
        loginPage.enterUsername('AB');
        loginPage.checkUsernameTooltipIsNotVisible();
        loginPage.checkSignInButtonIsDisabled();
        loginPage.clearUsername();
    });

    it('4. Login button is enabled', () => {
        loginPage.enterUsername(adminUserModel.id);
        loginPage.checkSignInButtonIsDisabled();
        loginPage.enterPassword('a');
        loginPage.checkSignInButtonIsEnabled();
        loginPage.clearUsername(adminUserModel.id);
        loginPage.clearPassword();
    });

    it('5. You have entered an invalid username or password', () => {
        loginPage.checkSignInButtonIsDisabled();
        loginPage.enterUsername('test');
        loginPage.enterPassword('test');
        loginPage.checkSignInButtonIsEnabled();
        loginPage.clickSignInButton();
        loginPage.checkLoginError(errorMessages.invalid_credentials);
        loginPage.clearUsername();
        loginPage.clearPassword();
    });

    it('6. Password field is crypted', () => {
        loginPage.checkSignInButtonIsDisabled();
        loginPage.enterPassword('test');
        loginPage.showPassword();
        loginPage.checkPasswordIsShown('test');
        loginPage.hidePassword();
        loginPage.checkPasswordIsHidden();
        loginPage.clearPassword();
    });

    it('7. Remember  Need Help? and Register are displayed and hidden', () => {
        loginPage.enableFooter();
        loginPage.checkRememberIsDisplayed();
        loginPage.checkNeedHelpIsDisplayed();
        loginPage.checkRegisterDisplayed();
        loginPage.disableFooter();
        loginPage.checkRememberIsNotDisplayed();
        loginPage.checkNeedHelpIsNotDisplayed();
        loginPage.checkRegisterIsNotDisplayed();
    });

    it('8. Login to Process Services with Content Services disabled', () => {
        loginPage.checkSignInButtonIsDisabled();
        adfSettingsPage.setProviderBpm();
        loginPage.login(adminUserModel.id, adminUserModel.password);
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        navigationBarPage.clickContentServicesButton();
        loginPage.waitForElements();
    });

    it('9. Login to Content Services with Process Services disabled', () => {
        loginPage.checkSignInButtonIsDisabled();
        adfSettingsPage.setProviderEcm();
        loginPage.login(TestConfig.adf.adminUser, TestConfig.adf.adminPassword);
        navigationBarPage.clickContentServicesButton();
        adfContentServicesPage.checkAcsContainer();
        navigationBarPage.clickProcessServicesButton();
        loginPage.waitForElements();
    });

    it('10. Able to login to both Content Services and Process Services', () => {
        loginPage.checkSignInButtonIsDisabled();
        adfSettingsPage.setProviderEcmBpm();
        loginPage.login(adminUserModel.id, adminUserModel.password);
        navigationBarPage.clickProcessServicesButton();
        processServicesPage.checkApsContainer();
        navigationBarPage.clickContentServicesButton();
        adfContentServicesPage.checkAcsContainer();
        navigationBarPage.clickLoginButton();
        loginPage.waitForElements();
    });
});
