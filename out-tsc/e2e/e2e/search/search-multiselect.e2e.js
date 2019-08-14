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
var js_api_1 = require("@alfresco/js-api");
var adf_testing_1 = require("@alfresco/adf-testing");
var resources = require("../util/resources");
var CONSTANTS = require("../util/constants");
var protractor_1 = require("protractor");
var searchDialog_1 = require("../pages/adf/dialog/searchDialog");
var searchResultsPage_1 = require("../pages/adf/searchResultsPage");
var searchFiltersPage_1 = require("../pages/adf/searchFiltersPage");
var acsUserModel_1 = require("../models/ACS/acsUserModel");
var fileModel_1 = require("../models/ACS/fileModel");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
describe('Search Component - Multi-Select Facet', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var searchDialog = new searchDialog_1.SearchDialog();
    var searchResultsPage = new searchResultsPage_1.SearchResultsPage();
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var searchFiltersPage = new searchFiltersPage_1.SearchFiltersPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var site, userOption;
    describe('', function () {
        var jpgFile, jpgFileSite, txtFile, txtFileSite;
        var acsUser = new acsUserModel_1.AcsUserModel();
        var randomName = adf_testing_1.StringUtil.generateRandomString();
        var jpgFileInfo = new fileModel_1.FileModel({
            'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
            'name': randomName + ".jpg"
        });
        var txtFileInfo = new fileModel_1.FileModel({
            'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location,
            'name': randomName + ".txt"
        });
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.createSite({
                                title: adf_testing_1.StringUtil.generateRandomString(8),
                                visibility: 'PUBLIC'
                            })];
                    case 4:
                        site = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(jpgFileInfo.location, jpgFileInfo.name, '-my-')];
                    case 5:
                        jpgFile = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(jpgFileInfo.location, jpgFileInfo.name, site.entry.guid)];
                    case 6:
                        jpgFileSite = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(txtFileInfo.location, txtFileInfo.name, '-my-')];
                    case 7:
                        txtFile = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(txtFileInfo.location, txtFileInfo.name, site.entry.guid)];
                    case 8:
                        txtFileSite = _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(15000)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter("" + randomName)];
                    case 13:
                        _a.sent();
                        userOption = acsUser.firstName + " " + acsUser.lastName;
                        return [4 /*yield*/, searchFiltersPage.checkSearchFiltersIsDisplayed()];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.creatorCheckListFiltersPage().filterBy(userOption)];
                    case 15:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all([
                            uploadActions.deleteFileOrFolder(jpgFile.entry.id),
                            uploadActions.deleteFileOrFolder(jpgFileSite.entry.id),
                            uploadActions.deleteFileOrFolder(txtFile.entry.id),
                            uploadActions.deleteFileOrFolder(txtFileSite.entry.id)
                        ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.deleteSite(site.entry.id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280054] Should be able to select multiple items from a search facet filter', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter("" + randomName)];
                    case 4:
                        _b.sent();
                        userOption = acsUser.firstName + " " + acsUser.lastName;
                        return [4 /*yield*/, searchFiltersPage.checkSearchFiltersIsDisplayed()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, searchFiltersPage.creatorCheckListFiltersPage().filterBy(userOption)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('Plain Text')];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, expect(searchResultsPage.numberOfResultsDisplayed()).toBe(2)];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, searchResultsPage.checkContentIsDisplayed(txtFile.entry.name)];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, searchResultsPage.checkContentIsDisplayed(txtFileSite.entry.name)];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('JPEG Image')];
                    case 11:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, searchResultsPage.numberOfResultsDisplayed()];
                    case 12: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(4)];
                    case 13:
                        _b.sent();
                        return [4 /*yield*/, searchResultsPage.checkContentIsDisplayed(txtFile.entry.name)];
                    case 14:
                        _b.sent();
                        return [4 /*yield*/, searchResultsPage.checkContentIsDisplayed(txtFileSite.entry.name)];
                    case 15:
                        _b.sent();
                        return [4 /*yield*/, searchResultsPage.checkContentIsDisplayed(jpgFile.entry.name)];
                    case 16:
                        _b.sent();
                        return [4 /*yield*/, searchResultsPage.checkContentIsDisplayed(jpgFileSite.entry.name)];
                    case 17:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('', function () {
        var jpgFile, txtFile;
        var userUploadingTxt = new acsUserModel_1.AcsUserModel();
        var userUploadingImg = new acsUserModel_1.AcsUserModel();
        var randomName = adf_testing_1.StringUtil.generateRandomString();
        var jpgFileInfo = new fileModel_1.FileModel({
            'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
            'name': randomName + ".jpg"
        });
        var txtFileInfo = new fileModel_1.FileModel({
            'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location,
            'name': randomName + ".txt"
        });
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(userUploadingTxt)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(userUploadingImg)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.login(userUploadingTxt.id, userUploadingTxt.password)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.createSite({
                                title: adf_testing_1.StringUtil.generateRandomString(8),
                                visibility: 'PUBLIC'
                            })];
                    case 5:
                        site = _b.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.addSiteMember(site.entry.id, {
                                id: userUploadingImg.id,
                                role: CONSTANTS.CS_USER_ROLES.MANAGER
                            })];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(txtFileInfo.location, txtFileInfo.name, site.entry.guid)];
                    case 7:
                        txtFile = _b.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.login(userUploadingImg.id, userUploadingImg.password)];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(jpgFileInfo.location, jpgFileInfo.name, site.entry.guid)];
                    case 9:
                        jpgFile = _b.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(15000)];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(userUploadingImg)];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                    case 12:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 13:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter("*" + randomName + "*")];
                    case 14:
                        _b.sent();
                        return [4 /*yield*/, searchFiltersPage.checkSearchFiltersIsDisplayed()];
                    case 15:
                        _b.sent();
                        return [4 /*yield*/, searchFiltersPage.creatorCheckListFiltersPage().filterBy(userUploadingTxt.firstName + " " + userUploadingTxt.lastName)];
                    case 16:
                        _b.sent();
                        return [4 /*yield*/, searchFiltersPage.creatorCheckListFiltersPage().filterBy(userUploadingImg.firstName + " " + userUploadingImg.lastName)];
                    case 17:
                        _b.sent();
                        return [4 /*yield*/, searchResultsPage.checkContentIsDisplayed(txtFile.entry.name)];
                    case 18:
                        _b.sent();
                        return [4 /*yield*/, searchResultsPage.checkContentIsDisplayed(jpgFile.entry.name)];
                    case 19:
                        _b.sent();
                        return [4 /*yield*/, searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('Plain Text')];
                    case 20:
                        _b.sent();
                        return [4 /*yield*/, searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('JPEG Image')];
                    case 21:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, searchResultsPage.numberOfResultsDisplayed()];
                    case 22: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(2)];
                    case 23:
                        _b.sent();
                        return [4 /*yield*/, searchResultsPage.checkContentIsDisplayed(txtFile.entry.name)];
                    case 24:
                        _b.sent();
                        return [4 /*yield*/, searchResultsPage.checkContentIsDisplayed(jpgFile.entry.name)];
                    case 25:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('', function () {
        var txtFile;
        var acsUser = new acsUserModel_1.AcsUserModel();
        var randomName = adf_testing_1.StringUtil.generateRandomString();
        var txtFileInfo = new fileModel_1.FileModel({
            'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location,
            'name': randomName + ".txt"
        });
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.createSite({
                                title: adf_testing_1.StringUtil.generateRandomString(8),
                                visibility: 'PUBLIC'
                            })];
                    case 4:
                        site = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(txtFileInfo.location, txtFileInfo.name, '-my-')];
                    case 5:
                        txtFile = _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(15000)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter("*" + randomName + "*")];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.checkSearchFiltersIsDisplayed()];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, uploadActions.deleteFileOrFolder(txtFile.entry.id)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280058] Should update filter facets items number when another filter facet item is selected', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter("*" + randomName + "*")];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, searchFiltersPage.checkSearchFiltersIsDisplayed()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, searchFiltersPage.fileTypeCheckListFiltersPage().filterBy('Plain Text')];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, searchFiltersPage.creatorCheckListFiltersPage().filterBy(acsUser.firstName + " " + acsUser.lastName)];
                    case 7:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, searchResultsPage.numberOfResultsDisplayed()];
                    case 8: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(1)];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, searchResultsPage.checkContentIsDisplayed(txtFile.entry.name)];
                    case 10:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=search-multiselect.e2e.js.map