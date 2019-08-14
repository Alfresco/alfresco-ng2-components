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
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var js_api_1 = require("@alfresco/js-api");
var logoutPage_1 = require("../../pages/adf/demo-shell/logoutPage");
describe('Login component - Redirect', function () {
    var settingsPage = new adf_testing_1.SettingsPage();
    var processServicesPage = new processServicesPage_1.ProcessServicesPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var loginPage = new adf_testing_1.LoginPage();
    var user = new acsUserModel_1.AcsUserModel();
    var userFolderOwner = new acsUserModel_1.AcsUserModel();
    var adminUserModel = new acsUserModel_1.AcsUserModel({
        'id': protractor_1.browser.params.testConfig.adf.adminUser,
        'password': protractor_1.browser.params.testConfig.adf.adminPassword
    });
    var uploadedFolder;
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host,
        hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var logoutPage = new logoutPage_1.LogoutPage();
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(user)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(userFolderOwner)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(user.id, user.password)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder('protecteFolder' + adf_testing_1.StringUtil.generateRandomString(), '-my-')];
                case 5:
                    uploadedFolder = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C213838] Should after login in CS be redirect to Login page when try to access to PS', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loginPage.clickSettingsIcon()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, settingsPage.setProviderEcm()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loginPage.login(user.id, user.password)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, loginPage.waitForElements()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260085] Should after login in PS be redirect to Login page when try to access to CS', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loginPage.clickSettingsIcon()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, settingsPage.setProviderBpm()];
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
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, processServicesPage.checkApsContainer()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, loginPage.waitForElements()];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260081] Should after login in BOTH not be redirect to Login page when try to access to CS or PS', function () { return __awaiter(_this, void 0, void 0, function () {
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
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, processServicesPage.checkApsContainer()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260088] Should be re-redirect to the request URL after login when try to access to a protect URL ', function () { return __awaiter(_this, void 0, void 0, function () {
        var actualUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loginPage.clickSettingsIcon()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, settingsPage.setProviderEcm()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loginPage.login(user.id, user.password)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.openContentServicesFolder(uploadedFolder.entry.id)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                case 6:
                    actualUrl = _a.sent();
                    return [4 /*yield*/, expect(actualUrl).toEqual(protractor_1.browser.params.testConfig.adf.url + '/files/' + uploadedFolder.entry.id)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, logoutPage.checkLogoutSectionIsDisplayed()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.openContentServicesFolder(uploadedFolder.entry.id)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, loginPage.waitForElements()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, loginPage.login(user.id, user.password)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                case 14:
                    actualUrl = _a.sent();
                    return [4 /*yield*/, expect(actualUrl).toEqual(protractor_1.browser.params.testConfig.adf.url + '/files/' + uploadedFolder.entry.id)];
                case 15:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C299161] Should redirect user to requested URL after reloading login page', function () { return __awaiter(_this, void 0, void 0, function () {
        var currentUrl, actualUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loginPage.goToLoginPage()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loginPage.clickSettingsIcon()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, settingsPage.setProviderEcm()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loginPage.login(user.id, user.password)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.openContentServicesFolder(uploadedFolder.entry.id)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                case 6:
                    currentUrl = _a.sent();
                    return [4 /*yield*/, expect(currentUrl).toEqual(protractor_1.browser.params.testConfig.adf.url + '/files/' + uploadedFolder.entry.id)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, logoutPage.checkLogoutSectionIsDisplayed()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.openContentServicesFolder(uploadedFolder.entry.id)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, loginPage.waitForElements()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.refresh()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, loginPage.waitForElements()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, loginPage.enterUsername(user.id)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, loginPage.enterPassword(user.password)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, loginPage.clickSignInButton()];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.checkMenuButtonIsDisplayed()];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.getCurrentUrl()];
                case 19:
                    actualUrl = _a.sent();
                    return [4 /*yield*/, expect(actualUrl).toEqual(protractor_1.browser.params.testConfig.adf.url + '/files/' + uploadedFolder.entry.id)];
                case 20:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=redirection.e2e.js.map