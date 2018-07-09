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

var Page = require('astrolabe').Page;
var Util = require('../../../util/util');

/**
 * Provides activiti
 * @module pages
 * @submodule share
 * @class pages.share.LoginPage
 */
module.exports = Page.create({

    /**
     * Provides the task App
     * @property taskApp
     * @type protractor.Element
     */
    taskApp: {
        get: function () {
            return element(by.cssContainingText("h1[class*='mdl-card__title-text']", "Task App"));
        }
    },

    /**
     * clicks the activiti option
     * @property clickActiviti
     * */
    clickActiviti: {
        value: function() {
            var activitiButton = element(by.css("a[data-automation-id='activiti']"));
            Util.waitUntilElementIsVisible(activitiButton);
            activitiButton.click();
        }
    },

    /**
     * Provides the wait required for the page
     * @property waitForElements
     * @type protractor.Element
     * */
    waitForElements: {
        value: function () {
            Util.waitUntilElementIsVisible(this.taskApp);
            Util.waitUntilElementIsVisible(element(by.css("i[class='material-icons']")));
        }
    },

    /**
     * Fills the username input
     * @method enterUsername
     * @param {String} username
     */
    enterUsername: {
        value: function (username) {
            Util.waitUntilElementIsVisible(this.txtUsername);
            this.txtUsername.clear();
            this.txtUsername.sendKeys(username);
        }
    },

    /**
     * Fills the password input
     * @method enterPassword
     * @param {String} password
     */
    enterPassword: {
        value: function (password) {
            Util.waitUntilElementIsVisible(this.txtPassword);
            this.txtPassword.clear();
            this.txtPassword.sendKeys(password);
        }
    },

    /**
     * Logs into adf
     * @method login
     * @param {String} username, {String} password
     */
    login: {
        value: function (username, password) {
            this.waitForElements();
            this.enterUsername(username);
            this.enterPassword(password);
            Util.waitUntilElementIsVisible(element(by.css("ol[data-automation-id='breadcrumb']")));
        }
    },

    /**
     * Logs out
     * @method logout
     */
    logout: {
        value: function () {
            var menuButton = element(by.css("button[data-automation-id='right-action-menu']"));
            var logoutOption = element(by.cssContainingText("li[class*='mdl-menu__item'] > label", "Logout"));

            Util.waitUntilElementIsVisible(menuButton);
            menuButton.click();
            Util.waitUntilElementIsVisible(logoutOption);
            logoutOption.click();
            this.waitForElements();
        }
    },



    /**
     * Enable ECM
     * @method enableECM
     */
    enableECM: {
        value: function () {
            Util.waitUntilElementIsVisible(this.ecmSwitch);
            this.ecmSwitch.click();
            Util.waitUntilElementIsVisible(element(by.css("label[class*='is-checked'][for='switch1']")));

            element(by.css("label[class*='is-checked'][for='switch2']")).isPresent().then(function(check) {
                if(check) {
                    Util.waitUntilElementIsVisible(element(by.css("alfresco-login[ng-reflect-providers*='ALL']")));
                }
                else {
                    Util.waitUntilElementIsVisible(element(by.css("alfresco-login[ng-reflect-providers='ECM']")));
                }
            });
        }
    },

    /**
     * Disable ECM
     * @method enableECM
     */
    disableECM: {
        value: function () {
            Util.waitUntilElementIsVisible(this.ecmSwitch);
            this.ecmSwitch.click();

            element(by.css("label[class*='is-checked'][for='switch2']")).isPresent().then(function(check) {
               if(check) {
                   Util.waitUntilElementIsVisible(element(by.css("alfresco-login[ng-reflect-providers*='BPM']")));
               }
               else {
                   Util.waitUntilElementIsVisible(element(by.css("alfresco-login[ng-reflect-providers='']")));
               }
            });
        }
    },

    /**
     * Enable BPM
     * @method enableBPM
     */
    enableBPM: {
        value: function () {
            Util.waitUntilElementIsVisible(this.bpmSwitch);
            this.bpmSwitch.click();
            Util.waitUntilElementIsVisible(element(by.css("label[class*='is-checked'][for='switch2']")));

            element(by.css("label[class*='is-checked'][for='switch1']")).isPresent().then(function(check) {
                if(check) {
                    Util.waitUntilElementIsVisible(element(by.css("alfresco-login[ng-reflect-providers*='ALL']")));
                }
                else {
                    Util.waitUntilElementIsVisible(element(by.css("alfresco-login[ng-reflect-providers='BPM']")));
                }
            });
        }
    },

    /**
     * Disable BPM
     * @method enableBPM
     */
    disableBPM: {
        value: function () {
            Util.waitUntilElementIsVisible(this.bpmSwitch);
            this.bpmSwitch.click();

            element(by.css("label[class*='is-checked'][for='switch1']")).isPresent().then(function(check) {
                if(check) {
                    Util.waitUntilElementIsVisible(element(by.css("alfresco-login[ng-reflect-providers*='ECM']")));
                }
                else {
                    Util.waitUntilElementIsVisible(element(by.css("alfresco-login[ng-reflect-providers='']")));
                }
            });
        }
    },

    /**
     * Enable CSRF
     * @method enableBPM
     */
    enableCSRF: {
        value: function () {
            Util.waitUntilElementIsVisible(this.csrfSwitch);
            this.csrfSwitch.click();
            Util.waitUntilElementIsVisible(element(by.css("label[class*='is-checked'][for='switch3']")));
        }
    },

    /**
     * Disable BPM
     * @method enableBPM
     */
    disableBPM: {
        value: function () {
            Util.waitUntilElementIsVisible(this.bpmSwitch);
            this.bpmSwitch.click();
            Util.waitUntilElementIsVisible(element(by.css("alfresco-login[ng-reflect-disable-csrf='true']")));

        }
    },

    /**
     * clears the username input
     * @method clearUsername
     */
    clearUsername: {
        value: function () {
            Util.waitUntilElementIsVisible(this.txtUsername);
            this.txtUsername.clear();
        }
    },

    /**
     * Check username tooltip
     * @method checkUsernameTooltip
     * @param {String} message
     */
    checkUsernameTooltip: {
        value: function (message) {
            Util.waitUntilElementIsPresent(element(by.css("span[data-automation-id='username-error']")));
            Util.waitUntilElementIsPresent(element(by.cssContainingText("span[data-automation-id='username-error']"), message));
        }
    },

    /**
     * Check username tooltip not visible
     * @method checkUsernameTooltipNotVisible
     */
    checkUsernameTooltipNotVisible: {
        value: function () {
            var error = "span[data-automation-id='username-error']";
            Util.waitUntilElementIsNotVisible(element(by.css(error)));
        }
    },

    /**
     * Check sign in button disabled
     * @method checkSignInButtonIsDisabled
     */
    checkSignInButtonIsDisabled: {
        value: function () {
            Util.waitUntilElementIsVisible(element(by.css("button[data-automation-id='login-button'][ng-reflect-disabled='true']")));
      }
    },

    /**
     * Check sign in button enabled
     * @method checkSignInButtonIsEnabled
     */
    checkSignInButtonIsEnabled: {
        value: function () {
            Util.waitUntilElementIsNotVisible(element(by.css("button[data-automation-id='login-button'][ng-reflect-disabled='true']")));
        }
    },

    /**
     * Click sign in button
     * @method clickSignInButton
     */
    clickSignInButton: {
        value: function () {
            Util.waitUntilElementIsVisible(this.signInButton);
            this.signInButton.click();
        }
    },

    /**
     * Check login error
     * @method checkLoginError
     * * @param {String} message
     */
    checkLoginError: {
        value: function (message) {
            Util.waitUntilElementIsVisible(element(by.cssContainingText("div[data-automation-id='login-error']", message)));
        }
    },

    /**
     * Check password is hidden
     * @method checkPasswordIsHidden
     */
    checkPasswordIsHidden: {
        value: function () {
            Util.waitUntilElementIsVisible(element(by.css("input[data-automation-id='password'][type='password']")));
        }
    },

    /**
     * Click show password
     * @method showPassword
     */
    showPassword: {
        value: function () {
            Util.waitUntilElementIsVisible(element(by.css("i[data-automation-id='show_password']")));
            element(by.css("i[data-automation-id='show_password']")).click();
        }
    },

    /**
     * Click hide password
     * @method hidePassword
     */
    hidePassword: {
        value: function () {
            Util.waitUntilElementIsVisible(element(by.css("i[data-automation-id='hide_password']")));
            element(by.css("i[data-automation-id='hide_password']")).click();
        }
    },

    /**
     * Check password is shown
     * @method checkPasswordIsShown
     * @param {String} password
     */
    checkPasswordIsShown: {
        value: function (password) {
            var passwordText = element(by.css("input[data-automation-id='password']"));

            passwordText.getAttribute('value').then(function (text) {
                expect(passwordText.getAttribute('value')).toEqual(password);
            });
        }
    },

    /**
     * Check 'Remember' is displayed
     * @method checkRememberIsDisplayed
     */
    checkRememberIsDisplayed: {
        value: function () {
            Util.waitUntilElementIsVisible(element(by.css("span[id='login-remember']")));
        }
    },

    /**
     * Check 'Need Help' is displayed
     * @method checkNeedHelpIsDisplayed
     */
    checkNeedHelpIsDisplayed: {
        value: function () {
            Util.waitUntilElementIsVisible(element(by.css("div[id='login-action-help']")));
        }
    },

    /**
     * Check 'Register' is displayed
     * @method checkRegisterDisplayed
     */
    checkRegisterDisplayed: {
        value: function () {
            Util.waitUntilElementIsVisible(element(by.css("div[id='login-action-register']")));
        }
    },
});
