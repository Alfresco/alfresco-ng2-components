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
var js_api_1 = require("@alfresco/js-api");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var fileModel_1 = require("../../models/ACS/fileModel");
var protractor_1 = require("protractor");
var resources = require("../../util/resources");
var search_config_1 = require("../search.config");
describe('Search Slider Filter', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var searchDialog = new searchDialog_1.SearchDialog();
    var searchFilters = new searchFiltersPage_1.SearchFiltersPage();
    var sizeSliderFilter = searchFilters.sizeSliderFilterPage();
    var searchResults = new searchResultsPage_1.SearchResultsPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var dataTable = new adf_testing_1.DataTableComponentPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var file2BytesModel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_name,
        'location': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_location
    });
    var file2Bytes;
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
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
                    return [4 /*yield*/, uploadActions.uploadFile(file2BytesModel.location, file2BytesModel.name, '-my-')];
                case 4:
                    file2Bytes = _a.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(15000)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServices(acsUser.id, acsUser.password)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter('*')];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(file2Bytes.entry.id)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.refresh()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C276970] Should be able to expand/collapse Search Size Slider', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchFilters.checkSizeSliderFilterIsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchFilters.clickSizeSliderFilterHeader()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, sizeSliderFilter.checkSliderIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, sizeSliderFilter.checkClearButtonIsDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, sizeSliderFilter.checkClearButtonIsEnabled()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, searchFilters.clickSizeSliderFilterHeader()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, searchFilters.checkSizeSliderFilterIsCollapsed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, sizeSliderFilter.checkSliderIsNotDisplayed()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, sizeSliderFilter.checkClearButtonIsNotDisplayed()];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C276972] Should be keep value when Search Size Slider is collapsed', function () { return __awaiter(_this, void 0, void 0, function () {
        var size, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    size = 5;
                    return [4 /*yield*/, searchFilters.checkSizeSliderFilterIsDisplayed()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, searchFilters.clickSizeSliderFilterHeader()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, sizeSliderFilter.checkSliderIsDisplayed()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, sizeSliderFilter.setValue(size)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, searchFilters.clickSizeSliderFilterHeader()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, searchFilters.checkSizeSliderFilterIsCollapsed()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, searchFilters.clickSizeSliderFilterHeader()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, searchFilters.checkSizeSliderFilterIsExpanded()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, searchFilters.checkSizeSliderFilterIsDisplayed()];
                case 9:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, sizeSliderFilter.getValue()];
                case 10: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual("" + size)];
                case 11:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C276981] Should be able to clear value in Search Size Slider', function () { return __awaiter(_this, void 0, void 0, function () {
        var size, results, _i, results_1, currentResult, currentSize, e_1, resultsSize, _a, resultsSize_1, currentResult, currentSize, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    size = 5;
                    return [4 /*yield*/, searchFilters.checkSizeSliderFilterIsDisplayed()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, searchFilters.clickSizeSliderFilterHeader()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, sizeSliderFilter.checkSliderIsDisplayed()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, sizeSliderFilter.setValue(size)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, searchResults.sortBySize('DESC')];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, searchResults.tableIsLoaded()];
                case 6:
                    _b.sent();
                    results = dataTable.geCellElementDetail('Size');
                    _i = 0, results_1 = results;
                    _b.label = 7;
                case 7:
                    if (!(_i < results_1.length)) return [3 /*break*/, 14];
                    currentResult = results_1[_i];
                    _b.label = 8;
                case 8:
                    _b.trys.push([8, 12, , 13]);
                    return [4 /*yield*/, currentResult.getAttribute('title')];
                case 9:
                    currentSize = _b.sent();
                    if (!(currentSize && currentSize.trim() !== '')) return [3 /*break*/, 11];
                    return [4 /*yield*/, expect(parseInt(currentSize, 10) <= 5000).toBe(true)];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    e_1 = _b.sent();
                    return [3 /*break*/, 13];
                case 13:
                    _i++;
                    return [3 /*break*/, 7];
                case 14: return [4 /*yield*/, sizeSliderFilter.checkSliderIsDisplayed()];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, sizeSliderFilter.clickClearButton()];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, searchResults.sortBySize('DESC')];
                case 17:
                    _b.sent();
                    return [4 /*yield*/, searchResults.tableIsLoaded()];
                case 18:
                    _b.sent();
                    resultsSize = dataTable.geCellElementDetail('Size');
                    _a = 0, resultsSize_1 = resultsSize;
                    _b.label = 19;
                case 19:
                    if (!(_a < resultsSize_1.length)) return [3 /*break*/, 26];
                    currentResult = resultsSize_1[_a];
                    _b.label = 20;
                case 20:
                    _b.trys.push([20, 24, , 25]);
                    return [4 /*yield*/, currentResult.getAttribute('title')];
                case 21:
                    currentSize = _b.sent();
                    if (!(currentSize && currentSize.trim() !== '')) return [3 /*break*/, 23];
                    return [4 /*yield*/, expect(parseInt(currentSize, 10) >= 5000).toBe(true)];
                case 22:
                    _b.sent();
                    _b.label = 23;
                case 23: return [3 /*break*/, 25];
                case 24:
                    e_2 = _b.sent();
                    return [3 /*break*/, 25];
                case 25:
                    _a++;
                    return [3 /*break*/, 19];
                case 26: return [2 /*return*/];
            }
        });
    }); });
    describe('Configuration change', function () {
        var jsonFile;
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jsonFile = search_config_1.SearchConfiguration.getConfiguration();
                        return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C276983] Should be able to disable thumb label in Search Size Slider', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jsonFile.categories[2].component.settings.thumbLabel = false;
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter('*')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, searchFilters.checkSizeSliderFilterIsDisplayed()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, searchFilters.clickSizeSliderFilterHeader()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, searchFilters.checkSizeSliderFilterIsExpanded()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, sizeSliderFilter.checkSliderWithThumbLabelIsNotDisplayed()];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C276985] Should be able to set min value for Search Size Slider', function () { return __awaiter(_this, void 0, void 0, function () {
            var minSize, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        minSize = 3;
                        jsonFile.categories[2].component.settings.min = minSize;
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter('*')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, searchFilters.checkSizeSliderFilterIsDisplayed()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, searchFilters.clickSizeSliderFilterHeader()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, searchFilters.checkSizeSliderFilterIsExpanded()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, sizeSliderFilter.checkSliderIsDisplayed()];
                    case 8:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, sizeSliderFilter.getMinValue()];
                    case 9: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual("" + minSize)];
                    case 10:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C276986] Should be able to set max value for Search Size Slider', function () { return __awaiter(_this, void 0, void 0, function () {
            var maxSize, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        maxSize = 50;
                        jsonFile.categories[2].component.settings.max = maxSize;
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter('*')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, searchFilters.checkSizeSliderFilterIsDisplayed()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, searchFilters.clickSizeSliderFilterHeader()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, searchFilters.checkSizeSliderFilterIsExpanded()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, sizeSliderFilter.checkSliderIsDisplayed()];
                    case 8:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, sizeSliderFilter.getMaxValue()];
                    case 9: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual("" + maxSize)];
                    case 10:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C276987] Should be able to set steps for Search Size Slider', function () { return __awaiter(_this, void 0, void 0, function () {
            var step, randomValue, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        step = 10;
                        jsonFile.categories[2].component.settings.step = step;
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter('*')];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, searchFilters.checkSizeSliderFilterIsDisplayed()];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, searchFilters.clickSizeSliderFilterHeader()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, searchFilters.checkSizeSliderFilterIsExpanded()];
                    case 7:
                        _c.sent();
                        randomValue = 5;
                        return [4 /*yield*/, sizeSliderFilter.checkSliderIsDisplayed()];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, sizeSliderFilter.setValue(randomValue)];
                    case 9:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, sizeSliderFilter.getValue()];
                    case 10: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual("0")];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, sizeSliderFilter.setValue(step)];
                    case 12:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, sizeSliderFilter.getValue()];
                    case 13: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual("" + step)];
                    case 14:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=search-slider.e2e.js.map