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
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var folderModel_1 = require("../../models/ACS/folderModel");
var js_api_1 = require("@alfresco/js-api");
var adf_testing_1 = require("@alfresco/adf-testing");
var searchDialog_1 = require("../../pages/adf/dialog/searchDialog");
var searchResultsPage_1 = require("../../pages/adf/searchResultsPage");
var searchFiltersPage_1 = require("../../pages/adf/searchFiltersPage");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var search_config_1 = require("../search.config");
describe('Search component - Text widget', function () {
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var searchFiltersPage = new searchFiltersPage_1.SearchFiltersPage();
    var loginPage = new adf_testing_1.LoginPage();
    var searchDialog = new searchDialog_1.SearchDialog();
    var searchResultPage = new searchResultsPage_1.SearchResultsPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var newFolderModel = new folderModel_1.FolderModel({ 'name': 'newFolder', 'description': 'newDescription' });
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'ECM',
                        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
                    });
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.nodes.addNode('-my-', {
                            'name': newFolderModel.name,
                            'nodeType': 'cm:folder',
                            'properties': {
                                'cm:description': newFolderModel.description
                            }
                        }, {}, {})];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(15000)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 6:
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
    it('[C289329] Placeholder should be displayed in the widget when the input string is empty', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + '/search;q=*')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, searchResultPage.tableIsLoaded()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, searchFiltersPage.checkNameFilterIsDisplayed()];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, searchFiltersPage.textFiltersPage().getNamePlaceholder()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('Enter the name')];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('configuration change', function () {
        var jsonFile;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                jsonFile = search_config_1.SearchConfiguration.getConfiguration();
                return [2 /*return*/];
            });
        }); });
        it('[C289330] Should be able to change the Field setting', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + '/search;q=*')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, searchResultPage.tableIsLoaded()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.checkCheckListFilterIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.clickCheckListFilter()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.checkListFiltersPage().clickCheckListOption('Folder')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.checkNameFilterIsDisplayed()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.textFiltersPage().searchByName(newFolderModel.name)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, searchResultPage.checkContentIsDisplayed(newFolderModel.name)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.textFiltersPage().searchByName(newFolderModel.description)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, searchResultPage.checkContentIsNotDisplayed(newFolderModel.name)];
                    case 10:
                        _a.sent();
                        jsonFile.categories[0].component.settings.field = 'cm:description';
                        return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter('*')];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, searchResultPage.tableIsLoaded()];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.checkCheckListFilterIsDisplayed()];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.clickCheckListFilter()];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.checkListFiltersPage().clickCheckListOption('Folder')];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.checkNameFilterIsDisplayed()];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.textFiltersPage().searchByName(newFolderModel.name)];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, searchResultPage.checkContentIsNotDisplayed(newFolderModel.name)];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.textFiltersPage().searchByName(newFolderModel.description)];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, searchResultPage.checkContentIsDisplayed(newFolderModel.name)];
                    case 23:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=search-text.e2e.js.map