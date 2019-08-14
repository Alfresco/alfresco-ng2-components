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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var adf_testing_1 = require("@alfresco/adf-testing");
var contentServicesPage_1 = require("../../pages/adf/contentServicesPage");
var processServicesPage_1 = require("../../pages/adf/process-services/processServicesPage");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var adf_testing_2 = require("@alfresco/adf-testing");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var js_api_1 = require("@alfresco/js-api");
var util_1 = require("../../util/util");
describe('Login component', function () {
    var settingsPage = new adf_testing_1.SettingsPage();
    var processServicesPage = new processServicesPage_1.ProcessServicesPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var userInfoPage = new adf_testing_2.UserInfoPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var loginPage = new adf_testing_1.LoginPage();
    var errorPage = new adf_testing_1.ErrorPage();
    var adminUserModel = new acsUserModel_1.AcsUserModel({
        'id': protractor_1.browser.params.testConfig.adf.adminUser,
        'password': protractor_1.browser.params.testConfig.adf.adminPassword
    });
    var userA = new acsUserModel_1.AcsUserModel();
    var userB = new acsUserModel_1.AcsUserModel();
    var errorMessages = {
        username: 'Your username needs to be at least 2 characters.',
        invalid_credentials: 'You\'ve entered an unknown username or password',
        password: 'Enter your password to sign in',
        required: 'Required'
    };
    var invalidUsername = 'invaliduser';
    var invalidPassword = 'invalidpassword';
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'ALL',
                        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host,
                        hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                    });
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(userA)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(userB)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C276746] Should display the right information in user-info when a different users logs in', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(userA)];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, userInfoPage.clickUserProfile()];
                case 2:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, userInfoPage.getContentHeaderTitle()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toEqual(userA.firstName + ' ' + userA.lastName)];
                case 4:
                    _e.sent();
                    _b = expect;
                    return [4 /*yield*/, userInfoPage.getContentEmail()];
                case 5: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toEqual(userA.email)];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(userB)];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, userInfoPage.clickUserProfile()];
                case 8:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, userInfoPage.getContentHeaderTitle()];
                case 9: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toEqual(userB.firstName + ' ' + userB.lastName)];
                case 10:
                    _e.sent();
                    _d = expect;
                    return [4 /*yield*/, userInfoPage.getContentEmail()];
                case 11: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toEqual(userB.email)];
                case 12:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C299206] Should redirect the user without the right access role on a forbidden page', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(userA)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesCloudPage()];
                case 2:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, errorPage.getErrorCode()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe('403')];
                case 4:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, errorPage.getErrorTitle()];
                case 5: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe('You don\'t have permission to access this server.')];
                case 6:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, errorPage.getErrorDescription()];
                case 7: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe('You\'re not allowed access to this resource on the server.')];
                case 8:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260036] Should require username', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, loginPage.checkUsernameInactive()];
                case 2:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, loginPage.getSignInButtonIsEnabled()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toBe(false)];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, loginPage.enterUsername('A')];
                case 5:
                    _e.sent();
                    _b = expect;
                    return [4 /*yield*/, loginPage.getUsernameTooltip()];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toEqual(errorMessages.username)];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, loginPage.clearUsername()];
                case 8:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, loginPage.getUsernameTooltip()];
                case 9: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toEqual(errorMessages.required)];
                case 10:
                    _e.sent();
                    return [4 /*yield*/, loginPage.checkUsernameHighlighted()];
                case 11:
                    _e.sent();
                    _d = expect;
                    return [4 /*yield*/, loginPage.getSignInButtonIsEnabled()];
                case 12: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toBe(false)];
                case 13:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260043] Should require password', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, loginPage.checkPasswordInactive()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, loginPage.checkUsernameInactive()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, loginPage.enterPassword('A')];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, loginPage.checkPasswordTooltipIsNotVisible()];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, loginPage.clearPassword()];
                case 6:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, loginPage.getPasswordTooltip()];
                case 7: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual(errorMessages.password)];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, loginPage.checkPasswordHighlighted()];
                case 9:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, loginPage.getSignInButtonIsEnabled()];
                case 10: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(false)];
                case 11:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260044] Username should be at least 2 characters long', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, loginPage.getSignInButtonIsEnabled()];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe(false)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, loginPage.enterUsername('A')];
                case 4:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, loginPage.getUsernameTooltip()];
                case 5: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual(errorMessages.username)];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, loginPage.enterUsername('AB')];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, loginPage.checkUsernameTooltipIsNotVisible()];
                case 8:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, loginPage.getSignInButtonIsEnabled()];
                case 9: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(false)];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, loginPage.clearUsername()];
                case 11:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260045] Should enable login button after entering a valid username and a password', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, loginPage.enterUsername(adminUserModel.id)];
                case 2:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, loginPage.getSignInButtonIsEnabled()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(false)];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, loginPage.enterPassword('a')];
                case 5:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, loginPage.getSignInButtonIsEnabled()];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, loginPage.clearUsername()];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, loginPage.clearPassword()];
                case 9:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260046] Should NOT be possible to login with an invalid username/password', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, loginPage.getSignInButtonIsEnabled()];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe(false)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, loginPage.enterUsername('test')];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, loginPage.enterPassword('test')];
                case 5:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, loginPage.getSignInButtonIsEnabled()];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe(true)];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, loginPage.clickSignInButton()];
                case 8:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, loginPage.getLoginError()];
                case 9: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toEqual(errorMessages.invalid_credentials)];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, loginPage.clearUsername()];
                case 11:
                    _d.sent();
                    return [4 /*yield*/, loginPage.clearPassword()];
                case 12:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260047] Password should be crypted', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, tooltip;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, loginPage.getSignInButtonIsEnabled()];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(false)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, loginPage.enterPassword('test')];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, loginPage.showPassword()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, loginPage.getShownPassword()];
                case 6:
                    tooltip = _b.sent();
                    return [4 /*yield*/, expect(tooltip).toEqual('test')];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, loginPage.hidePassword()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, loginPage.checkPasswordIsHidden()];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, loginPage.clearPassword()];
                case 10:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260048] Should be possible to enable/disable login footer', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loginPage.enableFooter()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loginPage.checkRememberIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loginPage.checkNeedHelpIsDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, loginPage.checkRegisterDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, loginPage.disableFooter()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, loginPage.checkRememberIsNotDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, loginPage.checkNeedHelpIsNotDisplayed()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, loginPage.checkRegisterIsNotDisplayed()];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260049] Should be possible to login to Process Services with Content Services disabled', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, loginPage.getSignInButtonIsEnabled()];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(false)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, loginPage.clickSettingsIcon()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, settingsPage.setProviderBpm()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, loginPage.login(adminUserModel.id, adminUserModel.password)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, processServicesPage.checkApsContainer()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, loginPage.waitForElements()];
                case 10:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260050] Should be possible to login to Content Services with Process Services disabled', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, loginPage.getSignInButtonIsEnabled()];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(false)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, loginPage.clickSettingsIcon()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, settingsPage.setProviderEcm()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, loginPage.login(protractor_1.browser.params.testConfig.adf.adminUser, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 8:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260051] Should be able to login to both Content Services and Process Services', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, loginPage.clickSettingsIcon()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, settingsPage.setProviderEcmBpm()];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, loginPage.getSignInButtonIsEnabled()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(false)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, loginPage.clickSettingsIcon()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, settingsPage.setProviderEcmBpm()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, loginPage.login(adminUserModel.id, adminUserModel.password)];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, processServicesPage.checkApsContainer()];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, navigationBarPage.clickLoginButton()];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, loginPage.waitForElements()];
                case 14:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277754] Should the user be redirect to the login page when the Content Service session expire', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loginPage.clickSettingsIcon()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, settingsPage.setProviderEcmBpm()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loginPage.login(adminUserModel.id, adminUserModel.password)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.executeScript('window.localStorage.removeItem("ticket-ECM");')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + '/files')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, loginPage.waitForElements()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279932] Should successRoute property change the landing page when the user Login', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loginPage.clickSettingsIcon()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, settingsPage.setProviderEcmBpm()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loginPage.enableSuccessRouteSwitch()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, loginPage.enterSuccessRoute('activiti')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, loginPage.login(adminUserModel.id, adminUserModel.password)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, processServicesPage.checkApsContainer()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279931] Should the user be redirect to the login page when the Process Service session expire', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loginPage.clickSettingsIcon()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, settingsPage.setProviderEcmBpm()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loginPage.login(adminUserModel.id, adminUserModel.password)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.executeScript('window.localStorage.removeItem("ticket-BPM");')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + '/activiti')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, loginPage.waitForElements()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279930] Should a user still be logged-in when open a new tab', function () { return __awaiter(_this, void 0, void 0, function () {
        var handles;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loginPage.clickSettingsIcon()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, settingsPage.setProviderEcmBpm()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loginPage.login(adminUserModel.id, adminUserModel.password)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, util_1.Util.openNewTabInBrowser()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.getAllWindowHandles()];
                case 6:
                    handles = _a.sent();
                    return [4 /*yield*/, protractor_1.browser.switchTo().window(handles[1])];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + '/activiti')];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, processServicesPage.checkApsContainer()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + '/files')];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 11:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279933] Should be possible change the login component logo when logoImageUrl is changed', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loginPage.clickSettingsIcon()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, settingsPage.setProviderEcmBpm()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loginPage.enableLogoSwitch()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, loginPage.enterLogo('https://rawgit.com/Alfresco/alfresco-ng2-components/master/assets/angular2.png')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, loginPage.checkLoginImgURL()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291854] Should be possible login in valid credentials', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url)];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, loginPage.waitForElements()];
                case 2:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, loginPage.getSignInButtonIsEnabled()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toBe(false)];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, loginPage.enterUsername(invalidUsername)];
                case 5:
                    _e.sent();
                    _b = expect;
                    return [4 /*yield*/, loginPage.getSignInButtonIsEnabled()];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toBe(false)];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, loginPage.enterPassword(invalidPassword)];
                case 8:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, loginPage.getSignInButtonIsEnabled()];
                case 9: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toBe(true)];
                case 10:
                    _e.sent();
                    return [4 /*yield*/, loginPage.clickSignInButton()];
                case 11:
                    _e.sent();
                    _d = expect;
                    return [4 /*yield*/, loginPage.getLoginError()];
                case 12: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toEqual(errorMessages.invalid_credentials)];
                case 13:
                    _e.sent();
                    return [4 /*yield*/, loginPage.login(adminUserModel.id, adminUserModel.password)];
                case 14:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=login-component.e2e.js.map