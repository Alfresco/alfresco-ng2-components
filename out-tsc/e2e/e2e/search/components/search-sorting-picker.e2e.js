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
var searchDialog_1 = require("../../pages/adf/dialog/searchDialog");
var searchResultsPage_1 = require("../../pages/adf/searchResultsPage");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var searchFiltersPage_1 = require("../../pages/adf/searchFiltersPage");
var contentServicesPage_1 = require("../../pages/adf/contentServicesPage");
var node_actions_1 = require("../../actions/ACS/node.actions");
var js_api_1 = require("@alfresco/js-api");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var protractor_1 = require("protractor");
var resources = require("../../util/resources");
var search_config_1 = require("../search.config");
describe('Search Sorting Picker', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var searchDialog = new searchDialog_1.SearchDialog();
    var searchFilters = new searchFiltersPage_1.SearchFiltersPage();
    var searchResults = new searchResultsPage_1.SearchResultsPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var searchSortingPicker = new adf_testing_1.SearchSortingPickerPage();
    var contentServices = new contentServicesPage_1.ContentServicesPage();
    var nodeActions = new node_actions_1.NodeActions();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var pngAModel = {
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    };
    var pngDModel = {
        'name': resources.Files.ADF_DOCUMENTS.PNG_D.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_D.file_location
    };
    var pngA, pngD;
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var search = '_png_file.png';
    var jsonFile;
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
                    return [4 /*yield*/, uploadActions.uploadFile(pngAModel.location, pngAModel.name, '-my-')];
                case 4:
                    pngA = _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(pngDModel.location, pngDModel.name, '-my-')];
                case 5:
                    pngD = _a.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(12000)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServices(acsUser.id, acsUser.password)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, uploadActions.deleteFileOrFolder(pngA.entry.id)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(pngD.entry.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(search)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickHomeButton()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("[C277269] Should see the \"sort by\" option when search results are displayed in search results page", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchSortingPicker.checkSortingSelectorIsDisplayed()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("[C277270] Should see the icon for ASC and DESC sort when search results are displayed in the search results page", function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchSortingPicker.checkOrderArrowIsDisplayed()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277271] Should be able to add a custom search sorter in the "sort by" option', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 1:
                    _a.sent();
                    jsonFile = search_config_1.SearchConfiguration.getConfiguration();
                    jsonFile.sorting.options.push({
                        'key': 'Modifier',
                        'label': 'Modifier',
                        'type': 'FIELD',
                        'field': 'cm:modifier',
                        'ascending': true
                    });
                    return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(search)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, searchSortingPicker.checkSortingSelectorIsDisplayed()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, searchSortingPicker.clickSortingSelector()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, searchSortingPicker.checkOptionsDropdownIsDisplayed()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, searchSortingPicker.checkOptionIsDisplayed('Modifier')];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277272] Should be able to exclude a standard search sorter from the sorting option', function () { return __awaiter(_this, void 0, void 0, function () {
        var removedOption;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 1:
                    _a.sent();
                    jsonFile = search_config_1.SearchConfiguration.getConfiguration();
                    removedOption = jsonFile.sorting.options.splice(0, 1);
                    return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(search)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, searchSortingPicker.checkSortingSelectorIsDisplayed()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, searchSortingPicker.clickSortingSelector()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, searchSortingPicker.checkOptionsDropdownIsDisplayed()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, searchSortingPicker.checkOptionIsNotDisplayed(removedOption[0].label)];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277273] Should be able to set a default order for a search sorting option', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 1:
                    _b.sent();
                    jsonFile = search_config_1.SearchConfiguration.getConfiguration();
                    jsonFile.sorting.options[0].ascending = false;
                    jsonFile.sorting.defaults[0] = {
                        'key': 'Size',
                        'label': 'Size',
                        'type': 'FIELD',
                        'field': 'content.size',
                        'ascending': true
                    };
                    return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(search)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, searchSortingPicker.checkSortingSelectorIsDisplayed()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, searchSortingPicker.clickSortingSelector()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, searchSortingPicker.checkOptionIsDisplayed('Name')];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, searchSortingPicker.clickSortingOption('Name')];
                case 9:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, searchSortingPicker.checkOrderArrowIsDownward()];
                case 10: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true)];
                case 11:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277280] Should be able to sort the search results by "Name" ASC', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, searchFilters.checkSearchFiltersIsDisplayed()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, searchFilters.creatorCheckListFiltersPage().filterBy(acsUser.firstName + " " + acsUser.lastName)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, searchResults.sortByName('ASC')];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, searchResults.checkListIsOrderedByNameAsc()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true)];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277281] Should be able to sort the search results by "Name" DESC', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, searchFilters.checkSearchFiltersIsDisplayed()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, searchFilters.creatorCheckListFiltersPage().filterBy(acsUser.firstName + " " + acsUser.lastName)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, searchResults.sortByName('DESC')];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, searchResults.checkListIsOrderedByNameDesc()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true)];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277286] Should be able to sort the search results by "Created Date" ASC', function () { return __awaiter(_this, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchResults.sortByCreated('ASC')];
                case 1:
                    _a.sent();
                    results = searchResults.dataTable.geCellElementDetail('Created');
                    return [4 /*yield*/, expect(contentServices.checkElementsDateSortedAsc(results)).toBe(true)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277287] Should be able to sort the search results by "Created Date" DESC', function () { return __awaiter(_this, void 0, void 0, function () {
        var results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchResults.sortByCreated('DESC')];
                case 1:
                    _a.sent();
                    results = searchResults.dataTable.geCellElementDetail('Created');
                    return [4 /*yield*/, expect(contentServices.checkElementsDateSortedDesc(results)).toBe(true)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277288] Should be able to sort the search results by "Modified Date" ASC', function () { return __awaiter(_this, void 0, void 0, function () {
        var idList, numberOfElements, nodeList, modifiedDateList, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 1:
                    _a.sent();
                    jsonFile = search_config_1.SearchConfiguration.getConfiguration();
                    jsonFile.sorting.options.push({
                        'key': 'Modified Date',
                        'label': 'Modified Date',
                        'type': 'FIELD',
                        'field': 'cm:modified',
                        'ascending': true
                    });
                    return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(search)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, searchSortingPicker.checkSortingSelectorIsDisplayed()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, searchSortingPicker.sortBy('ASC', 'Modified Date')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, contentServices.getElementsDisplayedId()];
                case 8:
                    idList = _a.sent();
                    return [4 /*yield*/, contentServices.numberOfResultsDisplayed()];
                case 9:
                    numberOfElements = _a.sent();
                    return [4 /*yield*/, nodeActions.getNodesDisplayed(this.alfrescoJsApi, idList, numberOfElements)];
                case 10:
                    nodeList = _a.sent();
                    modifiedDateList = [];
                    for (i = 0; i < nodeList.length; i++) {
                        modifiedDateList.push(new Date(nodeList[i].entry.modifiedAt));
                    }
                    return [4 /*yield*/, expect(contentServices.checkElementsDateSortedAsc(modifiedDateList)).toBe(true)];
                case 11:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=search-sorting-picker.e2e.js.map