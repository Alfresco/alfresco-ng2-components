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
var adf_testing_2 = require("@alfresco/adf-testing");
var acsUserModel_1 = require("../models/ACS/acsUserModel");
var fileModel_1 = require("../models/ACS/fileModel");
var PeopleAPI = require("../restAPI/ACS/PeopleAPI");
var protractor_1 = require("protractor");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var users_actions_1 = require("../actions/users.actions");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
describe('User Info component', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var userInfoPage = new adf_testing_2.UserInfoPage();
    var processUserModel, contentUserModel;
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var acsAvatarFileModel = new fileModel_1.FileModel({
        'name': resources.Files.PROFILE_IMAGES.ECM.file_name,
        'location': resources.Files.PROFILE_IMAGES.ECM.file_location
    });
    var apsAvatarFileModel = new fileModel_1.FileModel({
        'name': resources.Files.PROFILE_IMAGES.BPM.file_name,
        'location': resources.Files.PROFILE_IMAGES.BPM.file_location
    });
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    users = new users_actions_1.UsersActions();
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'ALL',
                        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host,
                        hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                    });
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, users.createTenantAndUser(this.alfrescoJsApi)];
                case 2:
                    processUserModel = _a.sent();
                    contentUserModel = new acsUserModel_1.AcsUserModel({
                        'id': processUserModel.email,
                        'password': processUserModel.password,
                        'firstName': processUserModel.firstName,
                        'lastName': processUserModel.lastName,
                        'email': processUserModel.email
                    });
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(contentUserModel)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260111] Should display UserInfo when Process Services and Content Services are enabled', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0: return [4 /*yield*/, loginPage.loginToAllUsingUserModel(contentUserModel)];
                case 1:
                    _m.sent();
                    return [4 /*yield*/, userInfoPage.clickUserProfile()];
                case 2:
                    _m.sent();
                    _a = expect;
                    return [4 /*yield*/, userInfoPage.getContentHeaderTitle()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_m.sent()]).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName)];
                case 4:
                    _m.sent();
                    _b = expect;
                    return [4 /*yield*/, userInfoPage.getContentTitle()];
                case 5: return [4 /*yield*/, _b.apply(void 0, [_m.sent()]).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName)];
                case 6:
                    _m.sent();
                    _c = expect;
                    return [4 /*yield*/, userInfoPage.getContentEmail()];
                case 7: return [4 /*yield*/, _c.apply(void 0, [_m.sent()]).toEqual(contentUserModel.email)];
                case 8:
                    _m.sent();
                    _d = expect;
                    return [4 /*yield*/, userInfoPage.getContentJobTitle()];
                case 9: return [4 /*yield*/, _d.apply(void 0, [_m.sent()]).toEqual('N/A')];
                case 10:
                    _m.sent();
                    return [4 /*yield*/, userInfoPage.checkInitialImage()];
                case 11:
                    _m.sent();
                    return [4 /*yield*/, userInfoPage.APSProfileImageNotDisplayed()];
                case 12:
                    _m.sent();
                    return [4 /*yield*/, userInfoPage.ACSProfileImageNotDisplayed()];
                case 13:
                    _m.sent();
                    return [4 /*yield*/, userInfoPage.clickOnContentServicesTab()];
                case 14:
                    _m.sent();
                    _e = expect;
                    return [4 /*yield*/, userInfoPage.getContentHeaderTitle()];
                case 15: return [4 /*yield*/, _e.apply(void 0, [_m.sent()]).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName)];
                case 16:
                    _m.sent();
                    _f = expect;
                    return [4 /*yield*/, userInfoPage.getContentTitle()];
                case 17: return [4 /*yield*/, _f.apply(void 0, [_m.sent()]).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName)];
                case 18:
                    _m.sent();
                    _g = expect;
                    return [4 /*yield*/, userInfoPage.getContentEmail()];
                case 19: return [4 /*yield*/, _g.apply(void 0, [_m.sent()]).toEqual(contentUserModel.email)];
                case 20:
                    _m.sent();
                    _h = expect;
                    return [4 /*yield*/, userInfoPage.getContentJobTitle()];
                case 21: return [4 /*yield*/, _h.apply(void 0, [_m.sent()]).toEqual('N/A')];
                case 22:
                    _m.sent();
                    return [4 /*yield*/, userInfoPage.checkInitialImage()];
                case 23:
                    _m.sent();
                    return [4 /*yield*/, userInfoPage.APSProfileImageNotDisplayed()];
                case 24:
                    _m.sent();
                    return [4 /*yield*/, userInfoPage.ACSProfileImageNotDisplayed()];
                case 25:
                    _m.sent();
                    return [4 /*yield*/, userInfoPage.clickOnProcessServicesTab()];
                case 26:
                    _m.sent();
                    return [4 /*yield*/, userInfoPage.checkProcessServicesTabIsSelected()];
                case 27:
                    _m.sent();
                    _j = expect;
                    return [4 /*yield*/, userInfoPage.getProcessHeaderTitle()];
                case 28: return [4 /*yield*/, _j.apply(void 0, [_m.sent()]).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName)];
                case 29:
                    _m.sent();
                    _k = expect;
                    return [4 /*yield*/, userInfoPage.getProcessTitle()];
                case 30: return [4 /*yield*/, _k.apply(void 0, [_m.sent()]).toEqual(contentUserModel.firstName + ' ' + processUserModel.lastName)];
                case 31:
                    _m.sent();
                    _l = expect;
                    return [4 /*yield*/, userInfoPage.getProcessEmail()];
                case 32: return [4 /*yield*/, _l.apply(void 0, [_m.sent()]).toEqual(contentUserModel.email)];
                case 33:
                    _m.sent();
                    return [4 /*yield*/, userInfoPage.checkInitialImage()];
                case 34:
                    _m.sent();
                    return [4 /*yield*/, userInfoPage.APSProfileImageNotDisplayed()];
                case 35:
                    _m.sent();
                    return [4 /*yield*/, userInfoPage.ACSProfileImageNotDisplayed()];
                case 36:
                    _m.sent();
                    return [4 /*yield*/, userInfoPage.closeUserProfile()];
                case 37:
                    _m.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260113] Should display UserInfo when Content Services is enabled and Process Services is disabled', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(contentUserModel)];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, userInfoPage.clickUserProfile()];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, userInfoPage.dialogIsDisplayed()];
                case 3:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, userInfoPage.getContentHeaderTitle()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName)];
                case 5:
                    _e.sent();
                    _b = expect;
                    return [4 /*yield*/, userInfoPage.getContentTitle()];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toEqual(contentUserModel.firstName + ' ' + contentUserModel.lastName)];
                case 7:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, userInfoPage.getContentEmail()];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toEqual(contentUserModel.email)];
                case 9:
                    _e.sent();
                    _d = expect;
                    return [4 /*yield*/, userInfoPage.getContentJobTitle()];
                case 10: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toEqual('N/A')];
                case 11:
                    _e.sent();
                    return [4 /*yield*/, userInfoPage.checkInitialImage()];
                case 12:
                    _e.sent();
                    return [4 /*yield*/, userInfoPage.APSProfileImageNotDisplayed()];
                case 13:
                    _e.sent();
                    return [4 /*yield*/, userInfoPage.ACSProfileImageNotDisplayed()];
                case 14:
                    _e.sent();
                    return [4 /*yield*/, userInfoPage.closeUserProfile()];
                case 15:
                    _e.sent();
                    return [4 /*yield*/, userInfoPage.dialogIsNotDisplayed()];
                case 16:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260115] Should display UserInfo when Process Services is enabled and Content Services is disabled', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(contentUserModel)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, userInfoPage.clickUserProfile()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, userInfoPage.dialogIsDisplayed()];
                case 3:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, userInfoPage.getProcessHeaderTitle()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toEqual(processUserModel.firstName + ' ' + processUserModel.lastName)];
                case 5:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, userInfoPage.getProcessTitle()];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual(processUserModel.firstName + ' ' + processUserModel.lastName)];
                case 7:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, userInfoPage.getProcessEmail()];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toEqual(processUserModel.email)];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, userInfoPage.checkInitialImage()];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, userInfoPage.APSProfileImageNotDisplayed()];
                case 11:
                    _d.sent();
                    return [4 /*yield*/, userInfoPage.ACSProfileImageNotDisplayed()];
                case 12:
                    _d.sent();
                    return [4 /*yield*/, userInfoPage.closeUserProfile()];
                case 13:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260117] Should display UserInfo with profile image uploaded in ACS', function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, PeopleAPI.updateAvatarViaAPI(contentUserModel, acsAvatarFileModel, '-me-')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, PeopleAPI.getAvatarViaAPI(4, contentUserModel, '-me-', function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/];
                            });
                        }); })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(contentUserModel)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, userInfoPage.clickUserProfile()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, userInfoPage.checkACSProfileImage()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, userInfoPage.APSProfileImageNotDisplayed()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, userInfoPage.closeUserProfile()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260118] Should display UserInfo with profile image uploaded in APS', function () { return __awaiter(_this, void 0, void 0, function () {
        var users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    users = new users_actions_1.UsersActions();
                    return [4 /*yield*/, this.alfrescoJsApi.login(contentUserModel.email, contentUserModel.password)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, users.changeProfilePictureAps(this.alfrescoJsApi, apsAvatarFileModel.getLocation())];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(contentUserModel)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, userInfoPage.clickUserProfile()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, userInfoPage.checkAPSProfileImage()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, userInfoPage.ACSProfileImageNotDisplayed()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, userInfoPage.initialImageNotDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, userInfoPage.closeUserProfile()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260120] Should not display profile image in UserInfo when deleted in ACS', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, PeopleAPI.deleteAvatarViaAPI(contentUserModel, '-me-')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(contentUserModel)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, userInfoPage.clickUserProfile()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, userInfoPage.checkInitialImage()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, userInfoPage.APSProfileImageNotDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, userInfoPage.ACSProfileImageNotDisplayed()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, userInfoPage.closeUserProfile()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=user-info-component.e2e.js.map