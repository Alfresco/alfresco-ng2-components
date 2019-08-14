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
var searchFiltersPage_1 = require("../../pages/adf/searchFiltersPage");
var searchResultsPage_1 = require("../../pages/adf/searchResultsPage");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var searchDialog_1 = require("../../pages/adf/dialog/searchDialog");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var search_config_1 = require("../search.config");
var js_api_1 = require("@alfresco/js-api");
var protractor_1 = require("protractor");
describe('Search Radio Component', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var searchFiltersPage = new searchFiltersPage_1.SearchFiltersPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var searchDialog = new searchDialog_1.SearchDialog();
    var searchResults = new searchResultsPage_1.SearchResultsPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var filterType = {
        none: 'None',
        all: 'All',
        folder: 'Folder',
        document: 'Document',
        custom: 'TEST_NAME'
    };
    var randomName = adf_testing_1.StringUtil.generateRandomString();
    var nodeNames = {
        document: randomName + ".txt",
        folder: randomName + "Folder"
    };
    var createdFile, createdFolder;
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
                    return [4 /*yield*/, this.alfrescoJsApi.nodes.addNode('-my-', {
                            name: nodeNames.folder,
                            nodeType: 'cm:folder'
                        })];
                case 4:
                    createdFolder = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.nodes.addNode('-my-', {
                            name: nodeNames.document,
                            nodeType: 'cm:content'
                        })];
                case 5:
                    createdFile = _a.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(15000)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + '/search;q=' + randomName)];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(createdFile.entry.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(createdFolder.entry.id)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277039] Should be able to choose only one option at a time', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchFiltersPage.checkTypeFilterIsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkTypeFilterIsCollapsed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.clickTypeFilterHeader()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.none)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.all)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.folder)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.document)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsChecked(filterType.none)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, searchResults.checkContentIsDisplayed(nodeNames.folder)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, searchResults.checkContentIsDisplayed(nodeNames.document)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.typeFiltersPage().clickFilterRadioButton(filterType.folder)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsChecked(filterType.folder)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, searchResults.checkContentIsDisplayed(nodeNames.folder)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, searchResults.checkContentIsNotDisplayed(nodeNames.document)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.typeFiltersPage().clickFilterRadioButton(filterType.document)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsChecked(filterType.document)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, searchResults.checkContentIsDisplayed(nodeNames.document)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, searchResults.checkContentIsNotDisplayed(nodeNames.folder)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.typeFiltersPage().clickFilterRadioButton(filterType.all)];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsChecked(filterType.all)];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, searchResults.checkContentIsDisplayed(nodeNames.folder)];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, searchResults.checkContentIsDisplayed(nodeNames.document)];
                case 22:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('configuration change', function () {
        var jsonFile;
        beforeEach(function () {
            jsonFile = search_config_1.SearchConfiguration.getConfiguration();
        });
        it('[C277147] Should be able to customise the pageSize value', function () { return __awaiter(_this, void 0, void 0, function () {
            var numberOfOptions, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 1:
                        _d.sent();
                        jsonFile.categories[5].component.settings.pageSize = 10;
                        for (numberOfOptions = 0; numberOfOptions < 6; numberOfOptions++) {
                            jsonFile.categories[5].component.settings.options.push({
                                'name': 'APP.SEARCH.RADIO.FOLDER',
                                'value': "TYPE:'cm:folder'"
                            });
                        }
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                    case 2:
                        _d.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 3:
                        _d.sent();
                        return [4 /*yield*/, searchDialog.checkSearchBarIsVisible()];
                    case 4:
                        _d.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter(randomName)];
                    case 5:
                        _d.sent();
                        return [4 /*yield*/, searchFiltersPage.clickTypeFilterHeader()];
                    case 6:
                        _d.sent();
                        _a = expect;
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()];
                    case 7: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe(10)];
                    case 8:
                        _d.sent();
                        return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 9:
                        _d.sent();
                        jsonFile.categories[5].component.settings.pageSize = 11;
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                    case 10:
                        _d.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 11:
                        _d.sent();
                        return [4 /*yield*/, searchDialog.checkSearchBarIsVisible()];
                    case 12:
                        _d.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter(randomName)];
                    case 13:
                        _d.sent();
                        return [4 /*yield*/, searchFiltersPage.clickTypeFilterHeader()];
                    case 14:
                        _d.sent();
                        _b = expect;
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()];
                    case 15: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe(10)];
                    case 16:
                        _d.sent();
                        return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 17:
                        _d.sent();
                        jsonFile.categories[5].component.settings.pageSize = 9;
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                    case 18:
                        _d.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 19:
                        _d.sent();
                        return [4 /*yield*/, searchDialog.checkSearchBarIsVisible()];
                    case 20:
                        _d.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter(randomName)];
                    case 21:
                        _d.sent();
                        return [4 /*yield*/, searchFiltersPage.clickTypeFilterHeader()];
                    case 22:
                        _d.sent();
                        _c = expect;
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()];
                    case 23: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(9)];
                    case 24:
                        _d.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsDisplayed()];
                    case 25:
                        _d.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkShowLessButtonIsNotDisplayed()];
                    case 26:
                        _d.sent();
                        return [4 /*yield*/, protractor_1.browser.refresh()];
                    case 27:
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277148] Should be able to click show more/less button', function () { return __awaiter(_this, void 0, void 0, function () {
            var numberOfOptions, _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 1:
                        _g.sent();
                        jsonFile.categories[5].component.settings.pageSize = 0;
                        for (numberOfOptions = 0; numberOfOptions < 6; numberOfOptions++) {
                            jsonFile.categories[5].component.settings.options.push({
                                'name': 'APP.SEARCH.RADIO.FOLDER',
                                'value': "TYPE:'cm:folder'"
                            });
                        }
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 3:
                        _g.sent();
                        return [4 /*yield*/, searchDialog.checkSearchBarIsVisible()];
                    case 4:
                        _g.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter(randomName)];
                    case 5:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.clickTypeFilterHeader()];
                    case 6:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()];
                    case 7: return [4 /*yield*/, _a.apply(void 0, [_g.sent()]).toBe(5)];
                    case 8:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsDisplayed()];
                    case 9:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkShowLessButtonIsNotDisplayed()];
                    case 10:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().clickShowMoreButton()];
                    case 11:
                        _g.sent();
                        _b = expect;
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()];
                    case 12: return [4 /*yield*/, _b.apply(void 0, [_g.sent()]).toBe(10)];
                    case 13:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsNotDisplayed()];
                    case 14:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkShowLessButtonIsDisplayed()];
                    case 15:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().clickShowLessButton()];
                    case 16:
                        _g.sent();
                        _c = expect;
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()];
                    case 17: return [4 /*yield*/, _c.apply(void 0, [_g.sent()]).toBe(5)];
                    case 18:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsDisplayed()];
                    case 19:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkShowLessButtonIsNotDisplayed()];
                    case 20:
                        _g.sent();
                        return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 21:
                        _g.sent();
                        delete jsonFile.categories[5].component.settings.pageSize;
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                    case 22:
                        _g.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 23:
                        _g.sent();
                        return [4 /*yield*/, searchDialog.checkSearchBarIsVisible()];
                    case 24:
                        _g.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter(randomName)];
                    case 25:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.clickTypeFilterHeader()];
                    case 26:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()];
                    case 27: return [4 /*yield*/, _d.apply(void 0, [_g.sent()]).toBe(5)];
                    case 28:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsDisplayed()];
                    case 29:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkShowLessButtonIsNotDisplayed()];
                    case 30:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().clickShowMoreButton()];
                    case 31:
                        _g.sent();
                        _e = expect;
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()];
                    case 32: return [4 /*yield*/, _e.apply(void 0, [_g.sent()]).toBe(10)];
                    case 33:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsNotDisplayed()];
                    case 34:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkShowLessButtonIsDisplayed()];
                    case 35:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().clickShowLessButton()];
                    case 36:
                        _g.sent();
                        _f = expect;
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().getRadioButtonsNumberOnPage()];
                    case 37: return [4 /*yield*/, _f.apply(void 0, [_g.sent()]).toBe(5)];
                    case 38:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkShowMoreButtonIsDisplayed()];
                    case 39:
                        _g.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkShowLessButtonIsNotDisplayed()];
                    case 40:
                        _g.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Properties', function () {
        var jsonFile;
        beforeEach(function () {
            jsonFile = search_config_1.SearchConfiguration.getConfiguration();
        });
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277033] Should be able to add a new option', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 1:
                        _a.sent();
                        jsonFile.categories[5].component.settings.options.push({
                            'name': filterType.custom,
                            'value': "TYPE:'cm:content'"
                        });
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.checkSearchBarIsVisible()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter(randomName)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.clickTypeFilterHeader()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.none)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.all)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.folder)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.document)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsDisplayed(filterType.custom)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().checkFilterRadioButtonIsChecked(filterType.none)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, searchFiltersPage.typeFiltersPage().clickFilterRadioButton(filterType.custom)];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, searchResults.checkContentIsDisplayed(nodeNames.document)];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, searchResults.checkContentIsNotDisplayed(nodeNames.folder)];
                    case 15:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=search-radio.e2e.js.map