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

var Util = require('../../util/util');
var TestConfig = require('../../test.config');
var AdfSettingsPage = require('./settingsPage');

var LoginPage = function () {

    var loginURL = TestConfig.adf.url + TestConfig.adf.port + "/login";
    var txtUsername = element(by.css("input[id='username']"));
    var txtPassword = element(by.css("input[id='password']"));
    var logoImg = element(by.css("img[id='adf-login-img-logo']"));
    var successRouteTxt = element(by.css("input[data-automation-id='adf-success-route']"));
    var logoTxt = element(by.css("input[data-automation-id='adf-url-logo']"));
    var usernameTooltip = element(by.css("span[data-automation-id='username-error']"));
    var passwordTooltip = element(by.css("span[data-automation-id='password-required']"));
    var loginTooltip = element(by.css("span[class='login-error-message']"));
    var usernameInactive = element(by.css("input[id='username'][aria-invalid='false']"));
    var passwordInactive = element(by.css("input[id='password'][aria-invalid='false']"));
    var adfLogo = element(by.css("img[class='adf-img-logo ng-star-inserted']"));
    var usernameHighlighted = element(by.css("input[id='username'][aria-invalid='true']"));
    var passwordHighlighted = element(by.css("input[id='password'][aria-invalid='true']"));
    var signInButton = element(by.id('login-button'));
    var showPassword = element(by.css("mat-icon[data-automation-id='show_password']"));
    var hidePassword = element(by.css("mat-icon[data-automation-id='hide_password']"));
    var rememberMe = element(by.css("mat-checkbox[id='adf-login-remember']"));
    var needHelp = element(by.css("div[id='adf-login-action-left']"));
    var register = element(by.css("div[id='adf-login-action-right']"));
    var footerSwitch = element(by.id("switch4"));
    var rememberMeSwitch = element(by.id("adf-toogle-show-rememberme"));
    var successRouteSwitch = element(by.id("adf-toogle-show-successRoute"));
    var logoSwitch = element(by.id("adf-toogle-logo"));
    var userPicture = element(by.id("userinfo_container"));
    var header = element(by.id("adf-header"));
    var cardBackground = element(by.css("mat-card[class*='adf-login-card']"));
    var adfSettingsPage = new AdfSettingsPage();


    /**
     * Provides the longer wait required
     * @property waitForElements
     * @type protractor.Element
     * */
    this.waitForElements = function () {
        var deferred = protractor.promise.defer();

        Util.waitUntilElementIsVisible(txtUsername).then(() => {
            Util.waitUntilElementIsVisible(txtPassword).then(() => {
                deferred.fulfill();
            }, () => {
                deferred.rejected();
            })
        });

        return deferred.promise;

    };

    /**
     * Fills the username input
     * @method enterUsername
     * @param {String} username
     */
    this.enterUsername = function (username) {
        Util.waitUntilElementIsVisible(txtUsername);
        txtUsername.sendKeys('');
        return txtUsername.clear().sendKeys(username);
    };

    /**
     * Fills the password input
     * @method enterPassword
     * @param {String} password
     */
    this.enterPassword = function (password) {
        Util.waitUntilElementIsVisible(txtPassword);
        return txtPassword.clear().sendKeys(password);
    };

    /**
     * clears username input
     * @method clearUsername
     * @param {String} username
     */
    this.clearUsername = function () {
        Util.waitUntilElementIsVisible(txtUsername);
        return txtUsername.click().clear();
    };

    /**
     * clears password input
     * @method clearPassword
     * @param {String} password
     */
    this.clearPassword = function () {
        Util.waitUntilElementIsVisible(txtPassword);
        txtPassword.getAttribute('value').then(function (value) {
            for (var i = value.length; i >= 0; i--) {
                txtPassword.sendKeys(protractor.Key.BACK_SPACE);
            }
        });
    };

    /**
     * checks username tooltips
     * @method checkUsernameTooltip
     * @param {String} message
     */
    this.checkUsernameTooltip = function (message) {
        Util.waitUntilElementIsVisible(usernameTooltip);
    };

    /**
     * checks password tooltips
     * @method checkPasswordTooltip
     * @param {String} message
     */
    this.checkPasswordTooltip = function (message) {
        Util.waitUntilElementIsVisible(passwordTooltip);
    };

    /**
     * checks login error tooltips
     * @method checkLoginError
     * @param {String} message
     */
    this.checkLoginError = function (message) {
        Util.waitUntilElementIsVisible(loginTooltip);
        expect(loginTooltip.getText()).toEqual(message);
    };

    /**
     * checks login error tooltips
     * @method checkLoginError
     * @param {String} message
     */
    this.checkLoginImgURL = function (url) {
        Util.waitUntilElementIsVisible(logoImg);
        expect(logoImg.getAttribute('src')).toEqual(url);
    };

    /**
     * checks username field is inactive
     * @method checkUsernameInactive
     */
    this.checkUsernameInactive = function () {
        Util.waitUntilElementIsVisible(usernameInactive);
    };

    /**
     * checks password field is inactive
     * @method checkPasswordInactive
     */
    this.checkPasswordInactive = function () {
        Util.waitUntilElementIsVisible(passwordInactive);
    };

    /**
     * checks username field is highlighted
     * @method checkUsernameHighlighted
     */
    this.checkUsernameHighlighted = function () {
        adfLogo.click();
        Util.waitUntilElementIsVisible(usernameHighlighted);
    };

    /**
     * checks password field is highlighted
     * @method checkPasswordHighlighted
     */
    this.checkPasswordHighlighted = function () {
        adfLogo.click();
        Util.waitUntilElementIsVisible(passwordHighlighted);
    };

    /**
     * check Username tooltip is not visible
     * @method checkUsernameTooltipIsNotVisible
     */
    this.checkUsernameTooltipIsNotVisible = function () {
        Util.waitUntilElementIsNotVisible(usernameTooltip);
    };

    /**
     * checks password tooltip is not visible
     * @method checkPasswordTooltipIsNotVisible
     */
    this.checkPasswordTooltipIsNotVisible = function () {
        Util.waitUntilElementIsNotVisible(passwordTooltip);
    };

    /**
     * checks sign in button is enabled
     * @method checkSignInButtonIsEnabled
     */
    this.checkSignInButtonIsEnabled = function () {
        Util.waitUntilElementIsVisible(signInButton);
        expect(signInButton.isEnabled()).toBe(true);
    };

    /**
     * Logs into adf using default host config
     * @method defaultLogin
     */
    this.defaultLogin = function () {
        browser.driver.get(TestConfig.adf.url + TestConfig.adf.login);
        this.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    };

    /**
     * Logs into adf using userModel
     * @method loginUsingUserModel
     */
    this.loginUsingUserModel = function (userModel) {
        browser.driver.get(TestConfig.adf.url + TestConfig.adf.login);
        this.waitForElements();
        this.login(userModel.getId(), userModel.getPassword());
    };

    /**
     * Logs into ADF using userModel - only Process Services enabled
     * @method loginUsingUserModel
     */
    this.loginToProcessServicesUsingUserModel = function (userModel) {
        adfSettingsPage.setProviderBpm();
        this.waitForElements();
        this.login(userModel.email, userModel.password);
    };


    this.loginToProcessServicesUsingDefaultUser = function () {
        adfSettingsPage.setProviderBpm();
        this.waitForElements();
        this.login(TestConfig.adf.adminEmail, TestConfig.adf.adminPassword);
    };

    this.loginToContentServicesUsingUserModel = function (userModel) {
        adfSettingsPage.setProviderEcm();
        this.waitForElements();

        this.login(userModel.getId(), userModel.getPassword());
    };

    this.loginToContentServices = function (username, password) {
        adfSettingsPage.setProviderEcm();
        this.waitForElements();

        this.login(username, password);
    };

    /** 
     * Go to adf login page 
     * @method goToLoginPage 
     */
    this.goToLoginPage = function () {
        browser.driver.get(TestConfig.adf.url + TestConfig.adf.port + '/login');
        this.waitForElements();
    };

    /**
     * checks sign in button is disabled
     * @method checkSignInButtonIsDisabled
     */
    this.checkSignInButtonIsDisabled = function () {
        Util.waitUntilElementIsVisible(signInButton);
        expect(signInButton.isEnabled()).toBe(false);
    };

    /**
     * clicks the sign in button
     * @method clickSignInButton
     */
    this.clickSignInButton = function () {
        Util.waitUntilElementIsVisible(signInButton);
        signInButton.click();
    };

    /**
     * clicks the remember me checkbox
     */
    this.clickRememberMe = function () {
        Util.waitUntilElementIsVisible(rememberMe);
        rememberMe.click();
    };

    /**
     * clicks icon to show password
     * @method showPassword
     */
    this.showPassword = function () {
        Util.waitUntilElementIsVisible(showPassword);
        showPassword.click();
    };

    this.getShowPasswordIconColor = function () {
        var deferred = protractor.promise.defer();

        Util.waitUntilElementIsVisible(showPassword);
        showPassword.getCssValue('color').then(function (value) {
            deferred.fulfill(value);
        });

        return deferred.promise;
    };

    this.getSignInButtonColor = function () {
        var deferred = protractor.promise.defer();

        Util.waitUntilElementIsVisible(signInButton);
        signInButton.getCssValue("color").then(function (value) {
            deferred.fulfill(value);
        });

        return deferred.promise;
    };

    this.getBackgroundColor = function () {
        var deferred = protractor.promise.defer();

        Util.waitUntilElementIsVisible(cardBackground);
        cardBackground.getCssValue("color").then(function (value) {
            deferred.fulfill(value);
        });

        return deferred.promise;
    };

    /**
     * clicks icon to hide password
     * @method hidePassword
     */
    this.hidePassword = function () {
        Util.waitUntilElementIsVisible(hidePassword);
        hidePassword.click();
    };

    /**
     * checks if password is shown
     * @method checkPasswordIsShown
     * @param password
     */
    this.checkPasswordIsShown = function (password) {
        txtPassword.getAttribute('value').then(function (text) {
            expect(text).toEqual(password);
        });
    };

    /**
     * checks if password is hidden
     * @method checkPasswordIsHidden
     */
    this.checkPasswordIsHidden = function () {
        Util.waitUntilElementIsVisible(txtPassword);
    };

    /**
     * checks 'Remember me' is displayed
     * @method checkRememberIsDisplayed
     */
    this.checkRememberIsDisplayed = function () {
        Util.waitUntilElementIsVisible(rememberMe);
    };

    /**
     * checks 'Remember me' is not displayed
     * @method checkRememberIsNotDisplayed
     */
    this.checkRememberIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(rememberMe);
    };

    /**
     * checks 'Need help' is Displayed
     * @method checkNeedHelpIsDisplayed
     */
    this.checkNeedHelpIsDisplayed = function () {
        Util.waitUntilElementIsVisible(needHelp);
    };

    /**
     * checks 'Need Help' is not displayed
     * @method checkNeedHelpIsNotDisplayed
     */
    this.checkNeedHelpIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(needHelp);
    };

    /**
     * checks 'Register' is displayed
     * @method checkRegisterDisplayed
     */
    this.checkRegisterDisplayed = function () {
        Util.waitUntilElementIsVisible(register);
    };

    /**
     * checks 'Register' is not displayed
     * @method checkRegisterIsNotDisplayed
     */
    this.checkRegisterIsNotDisplayed = function () {
        Util.waitUntilElementIsNotVisible(register);
    };

    /**
     * enables footer switch
     * @method enableFooter
     */
    this.enableFooter = function () {
        Util.waitUntilElementIsVisible(footerSwitch);
        footerSwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary') {
                footerSwitch.click();
                expect(footerSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary mat-checked');
            }
        })
    };

    /**
     * disables footer switch
     * @method disableFooter
     */
    this.disableFooter = function () {
        Util.waitUntilElementIsVisible(footerSwitch);
        footerSwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary mat-checked') {
                footerSwitch.click();
                expect(footerSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary');
            }
        })
    };

    /**
     * disables RememberMe
     */
    this.disableRememberMe = function () {
        Util.waitUntilElementIsVisible(rememberMeSwitch);
        rememberMeSwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary mat-checked') {
                rememberMeSwitch.click();
                expect(rememberMeSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary');
            }
        })
    };

    /**
     * enables footer switch
     * @method enableFooter
     */
    this.enableRememberMe = function () {
        Util.waitUntilElementIsVisible(rememberMeSwitch);
        rememberMeSwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary') {
                rememberMeSwitch.click();
                expect(rememberMeSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary mat-checked');
            }
        })
    };

    /**
     * disables successRouteSwitch
     */
    this.disableSuccessRouteSwitch = function () {
        Util.waitUntilElementIsVisible(successRouteSwitch);
        successRouteSwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary mat-checked') {
                successRouteSwitch.click();
                expect(successRouteSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary');
            }
        })
    };

    /**
     * enables successRouteSwitch
     * @method enableFooter
     */
    this.enableSuccessRouteSwitch = function () {
        Util.waitUntilElementIsVisible(rememberMeSwitch);
        successRouteSwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary') {
                successRouteSwitch.click();
                expect(successRouteSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary mat-checked');
            }
        })
    };

    /**
     * disables successRouteSwitch
     */
    this.disableLogowitch = function () {
        Util.waitUntilElementIsVisible(logoSwitch);
        logoSwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary mat-checked') {
                logoSwitch.click();
                expect(logoSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary');
            }
        })
    };

    /**
     * enables successRouteSwitch
     * @method enableFooter
     */
    this.enableLogoSwitch = function () {
        Util.waitUntilElementIsVisible(rememberMeSwitch);
        logoSwitch.getAttribute('class').then(function (check) {
            if (check === 'mat-slide-toggle mat-primary') {
                logoSwitch.click();
                expect(logoSwitch.getAttribute('class')).toEqual('mat-slide-toggle mat-primary mat-checked');
            }
        })
    };

    this.enterSuccessRoute = function (route) {
        Util.waitUntilElementIsVisible(successRouteTxt);
        successRouteTxt.sendKeys('');
        return successRouteTxt.clear().sendKeys(route);
    };

    this.enterLogo = function (logo) {
        Util.waitUntilElementIsVisible(logoTxt);
        logoTxt.sendKeys('');
        return logoTxt.clear().sendKeys(logo);
    };

    /**
     * logs in with a valid user
     * @method login
     * @param {String, String} username, password
     */
    this.login = function (username, password) {
        this.waitForElements();
        this.enterUsername(username);
        this.enterPassword(password);
        this.clickSignInButton();
        return Util.waitUntilElementIsVisible(header);
    };

};

module.exports = LoginPage;
