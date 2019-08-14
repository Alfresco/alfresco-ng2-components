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
var adf_testing_2 = require("@alfresco/adf-testing");
var adf_testing_3 = require("@alfresco/adf-testing");
describe('User Info - SSO', function () {
    var settingsPage = new adf_testing_1.SettingsPage();
    var loginSSOPage = new adf_testing_1.LoginSSOPage();
    var userInfoPage = new adf_testing_2.UserInfoPage();
    var silentLogin, identityUser;
    var identityService;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var apiService;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apiService = new adf_testing_3.ApiService(protractor_1.browser.params.config.oauth2.clientId, protractor_1.browser.params.testConfig.adf.url, protractor_1.browser.params.testConfig.adf.hostSso, 'ECM');
                    return [4 /*yield*/, apiService.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    identityService = new adf_testing_3.IdentityService(apiService);
                    return [4 /*yield*/, identityService.createIdentityUser()];
                case 2:
                    identityUser = _a.sent();
                    silentLogin = false;
                    return [4 /*yield*/, settingsPage.setProviderEcmSso(protractor_1.browser.params.testConfig.adf.url, protractor_1.browser.params.testConfig.adf.hostSso, protractor_1.browser.params.testConfig.adf.hostIdentity, silentLogin, true, protractor_1.browser.params.config.oauth2.clientId)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, loginSSOPage.clickOnSSOButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, loginSSOPage.loginSSOIdentityService(identityUser.email, identityUser.password)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!identityService) return [3 /*break*/, 2];
                    return [4 /*yield*/, identityService.deleteIdentityUser(identityUser.idIdentityService)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
    it('[C290066] Should display UserInfo when login using SSO', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, userInfoPage.clickUserProfile()];
                case 1:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, userInfoPage.getSsoHeaderTitle()];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toEqual(identityUser.firstName + ' ' + identityUser.lastName)];
                case 3:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, userInfoPage.getSsoTitle()];
                case 4: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual(identityUser.firstName + ' ' + identityUser.lastName)];
                case 5:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, userInfoPage.getSsoEmail()];
                case 6: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toEqual(identityUser.email)];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, userInfoPage.closeUserProfile()];
                case 8:
                    _d.sent();
                    return [4 /*yield*/, userInfoPage.dialogIsNotDisplayed()];
                case 9:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=user-info-component-cloud.e2e.js.map