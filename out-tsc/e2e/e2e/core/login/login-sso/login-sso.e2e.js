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
var adf_testing_1 = require("@alfresco/adf-testing");
var protractor_1 = require("protractor");
var navigationBarPage_1 = require("../../../pages/adf/navigationBarPage");
var browser_visibility_1 = require("../../../../lib/testing/src/lib/core/utils/browser-visibility");
describe('Login component - SSO', function () {
    var settingsPage = new adf_testing_1.SettingsPage();
    var loginSSOPage = new adf_testing_1.LoginSSOPage();
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var silentLogin = false;
    var implicitFlow;
    describe('Login component - SSO Grant type password (implicit flow false)', function () {
        it('[C299158] Should be possible to login with SSO, with  grant type password (Implicit Flow false)', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        implicitFlow = false;
                        return [4 /*yield*/, settingsPage.setProviderEcmSso(protractor_1.browser.params.testConfig.adf_acs.host, protractor_1.browser.params.testConfig.adf.hostSso, protractor_1.browser.params.testConfig.adf.hostIdentity, silentLogin, implicitFlow, protractor_1.browser.params.config.oauth2.clientId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, loginPage.waitForElements()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, settingsPage.setProviderEcmSso(protractor_1.browser.params.testConfig.adf_acs.host, protractor_1.browser.params.testConfig.adf.hostSso, protractor_1.browser.params.testConfig.adf.hostIdentity, silentLogin, implicitFlow, protractor_1.browser.params.config.oauth2.clientId)];
                    case 3:
                        _a.sent();
                        protractor_1.browser.ignoreSynchronization = true;
                        return [4 /*yield*/, loginPage.enterUsername(protractor_1.browser.params.testConfig.adf.adminEmail)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, loginPage.enterPassword(protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, loginPage.clickSignInButton()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, browser_visibility_1.BrowserVisibility.waitUntilElementIsVisible(loginPage.sidenavLayout)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Login component - SSO implicit Flow', function () {
        afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.executeScript('window.sessionStorage.clear();')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.executeScript('window.localStorage.clear();')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.refresh()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C261050] Should be possible login with SSO', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, settingsPage.setProviderEcmSso(protractor_1.browser.params.testConfig.adf_acs.host, protractor_1.browser.params.testConfig.adf.hostSso, protractor_1.browser.params.testConfig.adf.hostIdentity, false, true, protractor_1.browser.params.config.oauth2.clientId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, loginSSOPage.clickOnSSOButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280667] Should be redirect directly to keycloak without show the login page with silent login', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, settingsPage.setProviderEcmSso(protractor_1.browser.params.testConfig.adf_acs.host, protractor_1.browser.params.testConfig.adf.hostSso, protractor_1.browser.params.testConfig.adf.hostIdentity, true, true, protractor_1.browser.params.config.oauth2.clientId)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=login-sso.e2e.js.map