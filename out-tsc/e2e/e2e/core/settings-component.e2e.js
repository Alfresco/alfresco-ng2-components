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
var acsUserModel_1 = require("../models/ACS/acsUserModel");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var processServicesPage_1 = require("../pages/adf/process-services/processServicesPage");
var contentServicesPage_1 = require("../pages/adf/contentServicesPage");
var protractor_2 = require("protractor");
describe('Settings component', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var settingsPage = new adf_testing_1.SettingsPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var processServicesPage = new processServicesPage_1.ProcessServicesPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var loginError = 'Request has been terminated ' +
        'Possible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.';
    var adminUserModel = new acsUserModel_1.AcsUserModel({
        'id': protractor_2.browser.params.testConfig.adf.adminUser,
        'password': protractor_2.browser.params.testConfig.adf.adminPassword
    });
    describe('Should be able to change Urls in the Settings', function () {
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, settingsPage.goToSettingsPage()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C245641] Should navigate User from Settings page to Login screen', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, settingsPage.clickBackButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, loginPage.waitForElements()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291948] Should save ALL Settings changes when User clicks Apply button', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                    case 1:
                        _d.sent();
                        return [4 /*yield*/, loginPage.clickSettingsIcon()];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, settingsPage.setProviderEcmBpm()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, loginPage.waitForElements()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, settingsPage.goToSettingsPage()];
                    case 5:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, settingsPage.getSelectedOptionText()];
                    case 6: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toEqual('ALL', 'The Settings changes are not saved')];
                    case 7:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, settingsPage.getBpmHostUrl()];
                    case 8: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual(protractor_2.browser.params.testConfig.adf_aps.host, 'The BPM Settings changes are not saved')];
                    case 9:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, settingsPage.getEcmHostUrl()];
                    case 10: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toEqual(protractor_2.browser.params.testConfig.adf_acs.host, 'The ECM Settings changes are not saved')];
                    case 11:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291949] Should have field validation for Content Services Url', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, settingsPage.setProvider(settingsPage.getEcmAndBpmOption(), 'ALL')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, settingsPage.clearContentServicesURL()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, settingsPage.ecmText.sendKeys(protractor_1.protractor.Key.TAB)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, settingsPage.checkValidationMessageIsDisplayed()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, settingsPage.checkApplyButtonIsDisabled()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291950] Should have field validation for Process Services Url', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, settingsPage.setProvider(settingsPage.getEcmAndBpmOption(), 'ALL')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, settingsPage.clearProcessServicesURL()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, settingsPage.bpmText.sendKeys(protractor_1.protractor.Key.TAB)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, settingsPage.checkValidationMessageIsDisplayed()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, settingsPage.checkApplyButtonIsDisabled()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291951] Should not be able to sign in with invalid Content Services Url', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, settingsPage.setProvider(settingsPage.getEcmOption(), 'ECM')];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, settingsPage.setContentServicesURL('http://localhost:7070')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, settingsPage.clickApply()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, loginPage.waitForElements()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, loginPage.enterUsername(adminUserModel.id)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, loginPage.enterPassword(adminUserModel.password)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, loginPage.clickSignInButton()];
                    case 7:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, loginPage.getLoginError()];
                    case 8: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toMatch(loginError)];
                    case 9:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291952] Should not be able to sign in with invalid Process Services Url', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, settingsPage.setProvider(settingsPage.getBpmOption(), 'BPM')];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, settingsPage.setProcessServicesURL('http://localhost:7070')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, settingsPage.clickApply()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, loginPage.waitForElements()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, loginPage.enterUsername(adminUserModel.id)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, loginPage.enterPassword(adminUserModel.password)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, loginPage.clickSignInButton()];
                    case 7:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, loginPage.getLoginError()];
                    case 8: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toMatch(loginError)];
                    case 9:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Settings Component - Basic Authentication', function () {
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, settingsPage.goToSettingsPage()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, settingsPage.setProvider(settingsPage.getEcmAndBpmOption(), 'ALL')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, settingsPage.setContentServicesURL(protractor_2.browser.params.testConfig.adf_acs.host)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, settingsPage.setProcessServicesURL(protractor_2.browser.params.testConfig.adf_aps.host)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, settingsPage.clickApply()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, loginPage.clickSettingsIcon()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, settingsPage.checkProviderDropdownIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277751] Should allow the User to login to Process Services using the BPM selection on Settings page', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0: return [4 /*yield*/, settingsPage.checkProviderOptions()];
                    case 1:
                        _j.sent();
                        return [4 /*yield*/, settingsPage.checkBasicAuthRadioIsSelected()];
                    case 2:
                        _j.sent();
                        return [4 /*yield*/, settingsPage.checkSsoRadioIsNotSelected()];
                    case 3:
                        _j.sent();
                        _a = expect;
                        return [4 /*yield*/, settingsPage.getEcmHostUrl()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_j.sent()]).toBe(protractor_2.browser.params.testConfig.adf_acs.host)];
                    case 5:
                        _j.sent();
                        _b = expect;
                        return [4 /*yield*/, settingsPage.getBpmHostUrl()];
                    case 6: return [4 /*yield*/, _b.apply(void 0, [_j.sent()]).toBe(protractor_2.browser.params.testConfig.adf_aps.host)];
                    case 7:
                        _j.sent();
                        _c = expect;
                        return [4 /*yield*/, settingsPage.getBackButton().isEnabled()];
                    case 8: return [4 /*yield*/, _c.apply(void 0, [_j.sent()]).toBe(true)];
                    case 9:
                        _j.sent();
                        _d = expect;
                        return [4 /*yield*/, settingsPage.getApplyButton().isEnabled()];
                    case 10: return [4 /*yield*/, _d.apply(void 0, [_j.sent()]).toBe(true)];
                    case 11:
                        _j.sent();
                        return [4 /*yield*/, loginPage.goToLoginPage()];
                    case 12:
                        _j.sent();
                        return [4 /*yield*/, loginPage.clickSettingsIcon()];
                    case 13:
                        _j.sent();
                        return [4 /*yield*/, settingsPage.checkProviderDropdownIsDisplayed()];
                    case 14:
                        _j.sent();
                        return [4 /*yield*/, settingsPage.setProvider(settingsPage.getBpmOption(), 'BPM')];
                    case 15:
                        _j.sent();
                        return [4 /*yield*/, settingsPage.clickBackButton()];
                    case 16:
                        _j.sent();
                        return [4 /*yield*/, loginPage.waitForElements()];
                    case 17:
                        _j.sent();
                        return [4 /*yield*/, loginPage.clickSettingsIcon()];
                    case 18:
                        _j.sent();
                        return [4 /*yield*/, settingsPage.checkProviderDropdownIsDisplayed()];
                    case 19:
                        _j.sent();
                        return [4 /*yield*/, settingsPage.setProviderBpm()];
                    case 20:
                        _j.sent();
                        return [4 /*yield*/, loginPage.waitForElements()];
                    case 21:
                        _j.sent();
                        return [4 /*yield*/, loginPage.enterUsername(adminUserModel.id)];
                    case 22:
                        _j.sent();
                        return [4 /*yield*/, loginPage.enterPassword(adminUserModel.password)];
                    case 23:
                        _j.sent();
                        return [4 /*yield*/, loginPage.clickSignInButton()];
                    case 24:
                        _j.sent();
                        return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                    case 25:
                        _j.sent();
                        return [4 /*yield*/, processServicesPage.checkApsContainer()];
                    case 26:
                        _j.sent();
                        return [4 /*yield*/, processServicesPage.checkAppIsDisplayed('Task App')];
                    case 27:
                        _j.sent();
                        return [4 /*yield*/, navigationBarPage.clickSettingsButton()];
                    case 28:
                        _j.sent();
                        _e = expect;
                        return [4 /*yield*/, settingsPage.getSelectedOptionText()];
                    case 29: return [4 /*yield*/, _e.apply(void 0, [_j.sent()]).toBe('BPM')];
                    case 30:
                        _j.sent();
                        return [4 /*yield*/, settingsPage.checkBasicAuthRadioIsSelected()];
                    case 31:
                        _j.sent();
                        return [4 /*yield*/, settingsPage.checkSsoRadioIsNotSelected()];
                    case 32:
                        _j.sent();
                        _f = expect;
                        return [4 /*yield*/, settingsPage.getBpmHostUrl()];
                    case 33: return [4 /*yield*/, _f.apply(void 0, [_j.sent()]).toBe(protractor_2.browser.params.testConfig.adf_aps.host)];
                    case 34:
                        _j.sent();
                        _g = expect;
                        return [4 /*yield*/, settingsPage.getBackButton().isEnabled()];
                    case 35: return [4 /*yield*/, _g.apply(void 0, [_j.sent()]).toBe(true)];
                    case 36:
                        _j.sent();
                        _h = expect;
                        return [4 /*yield*/, settingsPage.getApplyButton().isEnabled()];
                    case 37: return [4 /*yield*/, _h.apply(void 0, [_j.sent()]).toBe(true)];
                    case 38:
                        _j.sent();
                        return [4 /*yield*/, settingsPage.clickBackButton()];
                    case 39:
                        _j.sent();
                        return [4 /*yield*/, loginPage.waitForElements()];
                    case 40:
                        _j.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_2.browser.params.testConfig.adf.url + '/activiti')];
                    case 41:
                        _j.sent();
                        return [4 /*yield*/, processServicesPage.checkApsContainer()];
                    case 42:
                        _j.sent();
                        return [4 /*yield*/, processServicesPage.checkAppIsDisplayed('Task App')];
                    case 43:
                        _j.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277752] Should allow the User to login to Content Services using the ECM selection on Settings page', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, settingsPage.setProvider(settingsPage.getEcmOption(), 'ECM')];
                    case 1:
                        _e.sent();
                        return [4 /*yield*/, settingsPage.clickBackButton()];
                    case 2:
                        _e.sent();
                        return [4 /*yield*/, loginPage.waitForElements()];
                    case 3:
                        _e.sent();
                        return [4 /*yield*/, loginPage.clickSettingsIcon()];
                    case 4:
                        _e.sent();
                        return [4 /*yield*/, settingsPage.checkProviderDropdownIsDisplayed()];
                    case 5:
                        _e.sent();
                        return [4 /*yield*/, settingsPage.setProviderEcm()];
                    case 6:
                        _e.sent();
                        return [4 /*yield*/, loginPage.waitForElements()];
                    case 7:
                        _e.sent();
                        return [4 /*yield*/, loginPage.enterUsername(adminUserModel.id)];
                    case 8:
                        _e.sent();
                        return [4 /*yield*/, loginPage.enterPassword(adminUserModel.password)];
                    case 9:
                        _e.sent();
                        return [4 /*yield*/, loginPage.clickSignInButton()];
                    case 10:
                        _e.sent();
                        return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 11:
                        _e.sent();
                        return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                    case 12:
                        _e.sent();
                        return [4 /*yield*/, navigationBarPage.clickSettingsButton()];
                    case 13:
                        _e.sent();
                        _a = expect;
                        return [4 /*yield*/, settingsPage.getSelectedOptionText()];
                    case 14: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toBe('ECM')];
                    case 15:
                        _e.sent();
                        return [4 /*yield*/, settingsPage.checkBasicAuthRadioIsSelected()];
                    case 16:
                        _e.sent();
                        return [4 /*yield*/, settingsPage.checkSsoRadioIsNotSelected()];
                    case 17:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, settingsPage.getEcmHostUrl()];
                    case 18: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toBe(protractor_2.browser.params.testConfig.adf_acs.host)];
                    case 19:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, settingsPage.getBackButton().isEnabled()];
                    case 20: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toBe(true)];
                    case 21:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, settingsPage.getApplyButton().isEnabled()];
                    case 22: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toBe(true)];
                    case 23:
                        _e.sent();
                        return [4 /*yield*/, settingsPage.clickBackButton()];
                    case 24:
                        _e.sent();
                        return [4 /*yield*/, loginPage.waitForElements()];
                    case 25:
                        _e.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_2.browser.params.testConfig.adf.url + '/files')];
                    case 26:
                        _e.sent();
                        return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                    case 27:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277753] Should allow the User to login to both Process Services and Content Services using the ALL selection on Settings Page', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, settingsPage.setProvider(settingsPage.getEcmAndBpmOption(), 'ALL')];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, settingsPage.clickBackButton()];
                    case 2:
                        _f.sent();
                        return [4 /*yield*/, loginPage.waitForElements()];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, loginPage.clickSettingsIcon()];
                    case 4:
                        _f.sent();
                        return [4 /*yield*/, settingsPage.checkProviderDropdownIsDisplayed()];
                    case 5:
                        _f.sent();
                        return [4 /*yield*/, settingsPage.setProviderEcmBpm()];
                    case 6:
                        _f.sent();
                        return [4 /*yield*/, loginPage.waitForElements()];
                    case 7:
                        _f.sent();
                        return [4 /*yield*/, loginPage.enterUsername(adminUserModel.id)];
                    case 8:
                        _f.sent();
                        return [4 /*yield*/, loginPage.enterPassword(adminUserModel.password)];
                    case 9:
                        _f.sent();
                        return [4 /*yield*/, loginPage.clickSignInButton()];
                    case 10:
                        _f.sent();
                        return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 11:
                        _f.sent();
                        return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                    case 12:
                        _f.sent();
                        return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                    case 13:
                        _f.sent();
                        return [4 /*yield*/, processServicesPage.checkApsContainer()];
                    case 14:
                        _f.sent();
                        return [4 /*yield*/, processServicesPage.checkAppIsDisplayed('Task App')];
                    case 15:
                        _f.sent();
                        return [4 /*yield*/, navigationBarPage.clickSettingsButton()];
                    case 16:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, settingsPage.getSelectedOptionText()];
                    case 17: return [4 /*yield*/, _a.apply(void 0, [_f.sent()]).toBe('ALL')];
                    case 18:
                        _f.sent();
                        return [4 /*yield*/, settingsPage.checkBasicAuthRadioIsSelected()];
                    case 19:
                        _f.sent();
                        return [4 /*yield*/, settingsPage.checkSsoRadioIsNotSelected()];
                    case 20:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, settingsPage.getEcmHostUrl()];
                    case 21: return [4 /*yield*/, _b.apply(void 0, [_f.sent()]).toBe(protractor_2.browser.params.testConfig.adf_acs.host)];
                    case 22:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, settingsPage.getBpmHostUrl()];
                    case 23: return [4 /*yield*/, _c.apply(void 0, [_f.sent()]).toBe(protractor_2.browser.params.testConfig.adf_aps.host)];
                    case 24:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, settingsPage.getBackButton().isEnabled()];
                    case 25: return [4 /*yield*/, _d.apply(void 0, [_f.sent()]).toBe(true)];
                    case 26:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, settingsPage.getApplyButton().isEnabled()];
                    case 27: return [4 /*yield*/, _e.apply(void 0, [_f.sent()]).toBe(true)];
                    case 28:
                        _f.sent();
                        return [4 /*yield*/, settingsPage.clickBackButton()];
                    case 29:
                        _f.sent();
                        return [4 /*yield*/, loginPage.waitForElements()];
                    case 30:
                        _f.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_2.browser.params.testConfig.adf.url + '/files')];
                    case 31:
                        _f.sent();
                        return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                    case 32:
                        _f.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_2.browser.params.testConfig.adf.url + '/activiti')];
                    case 33:
                        _f.sent();
                        return [4 /*yield*/, processServicesPage.checkApsContainer()];
                    case 34:
                        _f.sent();
                        return [4 /*yield*/, processServicesPage.checkAppIsDisplayed('Task App')];
                    case 35:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=settings-component.e2e.js.map