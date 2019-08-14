"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var form_controller_page_1 = require("./form-controller.page");
var protractor_1 = require("protractor");
var browser_visibility_1 = require("../utils/browser-visibility");
var local_storage_util_1 = require("../utils/local-storage.util");
var browser_actions_1 = require("../utils/browser-actions");
var LoginPage = /** @class */ (function () {
    function LoginPage() {
        this.loginURL = protractor_1.browser.baseUrl + '/login';
        this.formControllersPage = new form_controller_page_1.FormControllersPage();
        this.txtUsername = protractor_1.element(protractor_1.by.css('input[id="username"]'));
        this.txtPassword = protractor_1.element(protractor_1.by.css('input[id="password"]'));
        this.logoImg = protractor_1.element(protractor_1.by.css('img[id="adf-login-img-logo"]'));
        this.successRouteTxt = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-success-route"]'));
        this.logoTxt = protractor_1.element(protractor_1.by.css('input[data-automation-id="adf-url-logo"]'));
        this.usernameTooltip = protractor_1.element(protractor_1.by.css('span[data-automation-id="username-error"]'));
        this.passwordTooltip = protractor_1.element(protractor_1.by.css('span[data-automation-id="password-required"]'));
        this.loginTooltip = protractor_1.element(protractor_1.by.css('span[class="adf-login-error-message"]'));
        this.usernameInactive = protractor_1.element(protractor_1.by.css('input[id="username"][aria-invalid="false"]'));
        this.passwordInactive = protractor_1.element(protractor_1.by.css('input[id="password"][aria-invalid="false"]'));
        this.adfLogo = protractor_1.element(protractor_1.by.css('img[class="adf-img-logo ng-star-inserted"]'));
        this.usernameHighlighted = protractor_1.element(protractor_1.by.css('input[id="username"][aria-invalid="true"]'));
        this.passwordHighlighted = protractor_1.element(protractor_1.by.css('input[id="password"][aria-invalid="true"]'));
        this.signInButton = protractor_1.element(protractor_1.by.id('login-button'));
        this.showPasswordElement = protractor_1.element(protractor_1.by.css('button[data-automation-id="show_password"]'));
        this.hidePasswordElement = protractor_1.element(protractor_1.by.css('button[data-automation-id="hide_password"]'));
        this.rememberMe = protractor_1.element(protractor_1.by.css('mat-checkbox[id="adf-login-remember"]'));
        this.needHelp = protractor_1.element(protractor_1.by.css('div[id="adf-login-action-left"]'));
        this.register = protractor_1.element(protractor_1.by.css('div[id="adf-login-action-right"]'));
        this.footerSwitch = protractor_1.element(protractor_1.by.id('switch4'));
        this.rememberMeSwitch = protractor_1.element(protractor_1.by.id('adf-toggle-show-rememberme'));
        this.successRouteSwitch = protractor_1.element(protractor_1.by.id('adf-toggle-show-successRoute'));
        this.logoSwitch = protractor_1.element(protractor_1.by.id('adf-toggle-logo'));
        this.header = protractor_1.element(protractor_1.by.id('adf-header'));
        this.settingsIcon = protractor_1.element(protractor_1.by.cssContainingText('a[data-automation-id="settings"] mat-icon', 'settings'));
        this.sidenavLayout = protractor_1.element(protractor_1.by.css("[data-automation-id=\"sidenav-layout\"]"));
    }
    LoginPage.prototype.goToLoginPage = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.get(this.loginURL)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.waitForElements()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.waitForElements = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.txtUsername)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.txtPassword)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.enterUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.txtUsername, username)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.enterPassword = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.txtPassword, password)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.clearUsername = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.txtUsername)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearWithBackSpace(this.txtUsername)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.clearPassword = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.txtPassword)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_actions_1.BrowserActions.clearWithBackSpace(this.txtPassword)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.getUsernameTooltip = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.usernameTooltip)];
            });
        });
    };
    LoginPage.prototype.getPasswordTooltip = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.passwordTooltip)];
            });
        });
    };
    LoginPage.prototype.getLoginError = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, browser_actions_1.BrowserActions.getText(this.loginTooltip)];
            });
        });
    };
    LoginPage.prototype.checkLoginImgURL = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.logoImg)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.logoImg.getAttribute('src')];
                }
            });
        });
    };
    LoginPage.prototype.checkUsernameInactive = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.usernameInactive)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.checkPasswordInactive = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.passwordInactive)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.checkUsernameHighlighted = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.adfLogo)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.usernameHighlighted)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.checkPasswordHighlighted = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.adfLogo)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.passwordHighlighted)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.checkUsernameTooltipIsNotVisible = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.usernameTooltip)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.checkPasswordTooltipIsNotVisible = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.passwordTooltip)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.getSignInButtonIsEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.signInButton)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.signInButton.isEnabled()];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoginPage.prototype.loginToAllUsingUserModel = function (userModel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.goToLoginPage()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, local_storage_util_1.LocalStorageUtil.clearStorage()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, local_storage_util_1.LocalStorageUtil.setStorageItem('providers', 'ALL')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, local_storage_util_1.LocalStorageUtil.apiReset()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.login(userModel.email, userModel.password)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.loginToProcessServicesUsingUserModel = function (userModel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.goToLoginPage()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, local_storage_util_1.LocalStorageUtil.clearStorage()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, local_storage_util_1.LocalStorageUtil.setStorageItem('providers', 'BPM')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, local_storage_util_1.LocalStorageUtil.apiReset()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.login(userModel.email, userModel.password)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.loginToContentServicesUsingUserModel = function (userModel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.goToLoginPage()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, local_storage_util_1.LocalStorageUtil.clearStorage()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, local_storage_util_1.LocalStorageUtil.setStorageItem('providers', 'ECM')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, local_storage_util_1.LocalStorageUtil.apiReset()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.login(userModel.getId(), userModel.getPassword())];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.loginToContentServices = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.goToLoginPage()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, local_storage_util_1.LocalStorageUtil.clearStorage()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, local_storage_util_1.LocalStorageUtil.setStorageItem('providers', 'ECM')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, local_storage_util_1.LocalStorageUtil.apiReset()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.login(username, password)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.clickSignInButton = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.signInButton)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.clickSettingsIcon = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.settingsIcon)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.showPassword = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.showPasswordElement)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.hidePassword = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.click(this.hidePasswordElement)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.getShownPassword = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.txtPassword.getAttribute('value')];
            });
        });
    };
    LoginPage.prototype.checkPasswordIsHidden = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.txtPassword)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.checkRememberIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.rememberMe)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.checkRememberIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.rememberMe)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.checkNeedHelpIsDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.needHelp)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.checkNeedHelpIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.needHelp)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.checkRegisterDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.register)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.checkRegisterIsNotDisplayed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsNotVisible(this.register)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.enableFooter = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.footerSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.disableFooter = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(this.footerSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.disableRememberMe = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.disableToggle(this.rememberMeSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.enableSuccessRouteSwitch = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.successRouteSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.enableLogoSwitch = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.formControllersPage.enableToggle(this.logoSwitch)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.enterSuccessRoute = function (route) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.successRouteTxt, route)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.enterLogo = function (logo) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, browser_actions_1.BrowserActions.clearSendKeys(this.logoTxt, logo)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.login = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.enterUsername(username)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.enterPassword(password)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.clickSignInButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(this.sidenavLayout)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return LoginPage;
}());
exports.LoginPage = LoginPage;
//# sourceMappingURL=login.page.js.map