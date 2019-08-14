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
describe('Search Number Range Filter', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var searchDialog = new searchDialog_1.SearchDialog();
    var searchFilters = new searchFiltersPage_1.SearchFiltersPage();
    var sizeRangeFilter = searchFilters.sizeRangeFilterPage();
    var searchResults = new searchResultsPage_1.SearchResultsPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var dataTable = new adf_testing_1.DataTableComponentPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var file2BytesModel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_name,
        'location': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_location
    });
    var file0BytesModel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });
    var file2Bytes, file0Bytes;
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
                    return [4 /*yield*/, uploadActions.uploadFile(file0BytesModel.location, file0BytesModel.name, '-my-')];
                case 5:
                    file0Bytes = _a.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(15000)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServices(acsUser.id, acsUser.password)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter('*')];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(file2Bytes.entry.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(file0Bytes.entry.id)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchFilters.checkSizeRangeFilterIsDisplayed()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchFilters.clickSizeRangeFilterHeader()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchFilters.checkSizeRangeFilterIsExpanded()];
                case 3:
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
    it('[C276921] Should display default values for Number Range widget', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, sizeRangeFilter.checkFromFieldIsDisplayed()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkToFieldIsDisplayed()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsDisplayed()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkClearButtonIsDisplayed()];
                case 4:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(false)];
                case 6:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C276922] Should be keep value when Number Range widget is collapsed', function () { return __awaiter(_this, void 0, void 0, function () {
        var size, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    size = 5;
                    return [4 /*yield*/, sizeRangeFilter.putFromNumber(size)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, sizeRangeFilter.putToNumber(size)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, searchFilters.clickSizeRangeFilterHeader()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, searchFilters.checkSizeRangeFilterIsCollapsed()];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, searchFilters.clickSizeRangeFilterHeader()];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, searchFilters.checkSizeRangeFilterIsExpanded()];
                case 6:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, sizeRangeFilter.getFromNumber()];
                case 7: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual("" + size)];
                case 8:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, sizeRangeFilter.getToNumber()];
                case 9: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual("" + size)];
                case 10:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C276924] Should display error message when input had an invalid format', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return __generator(this, function (_r) {
            switch (_r.label) {
                case 0: return [4 /*yield*/, sizeRangeFilter.checkFromFieldIsDisplayed()];
                case 1:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.putFromNumber('a')];
                case 2:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.putToNumber('A')];
                case 3:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkFromErrorInvalidIsDisplayed()];
                case 4:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkToErrorInvalidIsDisplayed()];
                case 5:
                    _r.sent();
                    _a = expect;
                    return [4 /*yield*/, sizeRangeFilter.getFromErrorInvalid()];
                case 6: return [4 /*yield*/, _a.apply(void 0, [_r.sent()]).toEqual('Invalid Format')];
                case 7:
                    _r.sent();
                    _b = expect;
                    return [4 /*yield*/, sizeRangeFilter.getToErrorInvalid()];
                case 8: return [4 /*yield*/, _b.apply(void 0, [_r.sent()]).toEqual('Invalid Format')];
                case 9:
                    _r.sent();
                    _c = expect;
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                case 10: return [4 /*yield*/, _c.apply(void 0, [_r.sent()]).toBe(false)];
                case 11:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.putFromNumber('@')];
                case 12:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.putToNumber('£')];
                case 13:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkFromErrorInvalidIsDisplayed()];
                case 14:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkToErrorInvalidIsDisplayed()];
                case 15:
                    _r.sent();
                    _d = expect;
                    return [4 /*yield*/, sizeRangeFilter.getFromErrorInvalid()];
                case 16: return [4 /*yield*/, _d.apply(void 0, [_r.sent()]).toEqual('Invalid Format')];
                case 17:
                    _r.sent();
                    _e = expect;
                    return [4 /*yield*/, sizeRangeFilter.getToErrorInvalid()];
                case 18: return [4 /*yield*/, _e.apply(void 0, [_r.sent()]).toEqual('Invalid Format')];
                case 19:
                    _r.sent();
                    _f = expect;
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                case 20: return [4 /*yield*/, _f.apply(void 0, [_r.sent()]).toBe(false)];
                case 21:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.putFromNumber('4.5')];
                case 22:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.putToNumber('4,5')];
                case 23:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkFromErrorInvalidIsDisplayed()];
                case 24:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkToErrorInvalidIsDisplayed()];
                case 25:
                    _r.sent();
                    _g = expect;
                    return [4 /*yield*/, sizeRangeFilter.getFromErrorInvalid()];
                case 26: return [4 /*yield*/, _g.apply(void 0, [_r.sent()]).toEqual('Invalid Format')];
                case 27:
                    _r.sent();
                    _h = expect;
                    return [4 /*yield*/, sizeRangeFilter.getToErrorInvalid()];
                case 28: return [4 /*yield*/, _h.apply(void 0, [_r.sent()]).toEqual('Invalid Format')];
                case 29:
                    _r.sent();
                    _j = expect;
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                case 30: return [4 /*yield*/, _j.apply(void 0, [_r.sent()]).toBe(false)];
                case 31:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.putFromNumber('01')];
                case 32:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.putToNumber('-1')];
                case 33:
                    _r.sent();
                    _k = expect;
                    return [4 /*yield*/, sizeRangeFilter.getFromErrorInvalid()];
                case 34: return [4 /*yield*/, _k.apply(void 0, [_r.sent()]).toEqual('Invalid Format')];
                case 35:
                    _r.sent();
                    _l = expect;
                    return [4 /*yield*/, sizeRangeFilter.getToErrorInvalid()];
                case 36: return [4 /*yield*/, _l.apply(void 0, [_r.sent()]).toEqual('Invalid Format')];
                case 37:
                    _r.sent();
                    _m = expect;
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                case 38: return [4 /*yield*/, _m.apply(void 0, [_r.sent()]).toBe(false)];
                case 39:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.clearFromField()];
                case 40:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.clearToField()];
                case 41:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkFromErrorRequiredIsDisplayed()];
                case 42:
                    _r.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkToErrorRequiredIsDisplayed()];
                case 43:
                    _r.sent();
                    _o = expect;
                    return [4 /*yield*/, sizeRangeFilter.getFromErrorRequired()];
                case 44: return [4 /*yield*/, _o.apply(void 0, [_r.sent()]).toEqual('Required value')];
                case 45:
                    _r.sent();
                    _p = expect;
                    return [4 /*yield*/, sizeRangeFilter.getToErrorRequired()];
                case 46: return [4 /*yield*/, _p.apply(void 0, [_r.sent()]).toEqual('Required value')];
                case 47:
                    _r.sent();
                    _q = expect;
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                case 48: return [4 /*yield*/, _q.apply(void 0, [_r.sent()]).toBe(false)];
                case 49:
                    _r.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C276943] Should be able to put a big value in To field', function () { return __awaiter(_this, void 0, void 0, function () {
        var toSize, fromSize, _a, results, _i, results_1, currentResult, currentSize, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    toSize = 999999999;
                    fromSize = 0;
                    return [4 /*yield*/, sizeRangeFilter.checkToFieldIsDisplayed()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, sizeRangeFilter.putToNumber(toSize)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, sizeRangeFilter.putFromNumber(fromSize)];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, sizeRangeFilter.clickApplyButton()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, searchResults.tableIsLoaded()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, searchResults.sortBySize('DESC')];
                case 8:
                    _b.sent();
                    results = dataTable.geCellElementDetail('Size');
                    _i = 0, results_1 = results;
                    _b.label = 9;
                case 9:
                    if (!(_i < results_1.length)) return [3 /*break*/, 16];
                    currentResult = results_1[_i];
                    _b.label = 10;
                case 10:
                    _b.trys.push([10, 14, , 15]);
                    return [4 /*yield*/, currentResult.getAttribute('title')];
                case 11:
                    currentSize = _b.sent();
                    if (!(currentSize && currentSize.trim() !== '')) return [3 /*break*/, 13];
                    return [4 /*yield*/, expect(parseInt(currentSize, 10) <= toSize).toBe(true)];
                case 12:
                    _b.sent();
                    _b.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    e_1 = _b.sent();
                    return [3 /*break*/, 15];
                case 15:
                    _i++;
                    return [3 /*break*/, 9];
                case 16: return [2 /*return*/];
            }
        });
    }); });
    it('[C276944] Should be able to filter by name when size range filter is applied', function () { return __awaiter(_this, void 0, void 0, function () {
        var nameFilter, toSize, fromSize, _a, results, _i, results_2, currentResult, currentSize, e_2, resultsSize, _b, resultsSize_1, currentResult, currentSize, e_3, resultsDisplay, _c, resultsDisplay_1, currentResult, name_1, e_4;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, searchFilters.textFiltersPage()];
                case 1:
                    nameFilter = _d.sent();
                    toSize = 40;
                    fromSize = 0;
                    return [4 /*yield*/, searchFilters.checkNameFilterIsDisplayed()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, searchFilters.checkNameFilterIsExpanded()];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, nameFilter.searchByName('*')];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkFromFieldIsDisplayed()];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, sizeRangeFilter.putFromNumber(fromSize)];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, sizeRangeFilter.putToNumber(toSize)];
                case 7:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                case 8: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe(true)];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, sizeRangeFilter.clickApplyButton()];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, searchResults.sortBySize('DESC')];
                case 11:
                    _d.sent();
                    results = dataTable.geCellElementDetail('Size');
                    _i = 0, results_2 = results;
                    _d.label = 12;
                case 12:
                    if (!(_i < results_2.length)) return [3 /*break*/, 19];
                    currentResult = results_2[_i];
                    _d.label = 13;
                case 13:
                    _d.trys.push([13, 17, , 18]);
                    return [4 /*yield*/, currentResult.getAttribute('title')];
                case 14:
                    currentSize = _d.sent();
                    if (!(currentSize && currentSize.trim() !== '')) return [3 /*break*/, 16];
                    return [4 /*yield*/, expect(parseInt(currentSize, 10) <= toSize).toBe(true)];
                case 15:
                    _d.sent();
                    _d.label = 16;
                case 16: return [3 /*break*/, 18];
                case 17:
                    e_2 = _d.sent();
                    return [3 /*break*/, 18];
                case 18:
                    _i++;
                    return [3 /*break*/, 12];
                case 19: return [4 /*yield*/, searchFilters.checkNameFilterIsDisplayed()];
                case 20:
                    _d.sent();
                    return [4 /*yield*/, searchFilters.checkNameFilterIsExpanded()];
                case 21:
                    _d.sent();
                    return [4 /*yield*/, nameFilter.searchByName('z*')];
                case 22:
                    _d.sent();
                    return [4 /*yield*/, searchResults.sortBySize('DESC')];
                case 23:
                    _d.sent();
                    resultsSize = dataTable.geCellElementDetail('Size');
                    _b = 0, resultsSize_1 = resultsSize;
                    _d.label = 24;
                case 24:
                    if (!(_b < resultsSize_1.length)) return [3 /*break*/, 31];
                    currentResult = resultsSize_1[_b];
                    _d.label = 25;
                case 25:
                    _d.trys.push([25, 29, , 30]);
                    return [4 /*yield*/, currentResult.getAttribute('title')];
                case 26:
                    currentSize = _d.sent();
                    if (!(currentSize && currentSize.trim() !== '')) return [3 /*break*/, 28];
                    return [4 /*yield*/, expect(parseInt(currentSize, 10) <= toSize).toBe(true)];
                case 27:
                    _d.sent();
                    _d.label = 28;
                case 28: return [3 /*break*/, 30];
                case 29:
                    e_3 = _d.sent();
                    return [3 /*break*/, 30];
                case 30:
                    _b++;
                    return [3 /*break*/, 24];
                case 31:
                    resultsDisplay = dataTable.geCellElementDetail('Display name');
                    _c = 0, resultsDisplay_1 = resultsDisplay;
                    _d.label = 32;
                case 32:
                    if (!(_c < resultsDisplay_1.length)) return [3 /*break*/, 39];
                    currentResult = resultsDisplay_1[_c];
                    _d.label = 33;
                case 33:
                    _d.trys.push([33, 37, , 38]);
                    return [4 /*yield*/, currentResult.getAttribute('title')];
                case 34:
                    name_1 = _d.sent();
                    if (!(name_1 && name_1.trim() !== '')) return [3 /*break*/, 36];
                    return [4 /*yield*/, expect(/z*/i.test(name_1)).toBe(true)];
                case 35:
                    _d.sent();
                    _d.label = 36;
                case 36: return [3 /*break*/, 38];
                case 37:
                    e_4 = _d.sent();
                    return [3 /*break*/, 38];
                case 38:
                    _c++;
                    return [3 /*break*/, 32];
                case 39: return [2 /*return*/];
            }
        });
    }); });
    it('[C276951] Should not display folders when Size range is applied', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, sizeRangeFilter.checkToFieldIsDisplayed()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, sizeRangeFilter.putToNumber(99999999)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, sizeRangeFilter.putFromNumber(0)];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, sizeRangeFilter.clickApplyButton()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, searchResults.tableIsLoaded()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, searchFilters.checkCheckListFilterIsDisplayed()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, searchFilters.clickCheckListFilter()];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, searchFilters.checkCheckListFilterIsExpanded()];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, searchFilters.checkListFiltersPage().clickCheckListOption('Folder')];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, searchResults.tableIsLoaded()];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, searchResults.checkNoResultMessageIsDisplayed()];
                case 13:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C276952] Should only display empty files when size range is set from 0 to 1', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, results, _i, results_3, currentResult, currentSize, e_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, sizeRangeFilter.checkToFieldIsDisplayed()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, sizeRangeFilter.putToNumber(1)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, sizeRangeFilter.putFromNumber(0)];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, sizeRangeFilter.clickApplyButton()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, searchResults.tableIsLoaded()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, searchResults.sortBySize('DESC')];
                case 8:
                    _b.sent();
                    results = dataTable.geCellElementDetail('Size');
                    _i = 0, results_3 = results;
                    _b.label = 9;
                case 9:
                    if (!(_i < results_3.length)) return [3 /*break*/, 16];
                    currentResult = results_3[_i];
                    _b.label = 10;
                case 10:
                    _b.trys.push([10, 14, , 15]);
                    return [4 /*yield*/, currentResult.getAttribute('title')];
                case 11:
                    currentSize = _b.sent();
                    if (!(currentSize && currentSize.trim() !== '')) return [3 /*break*/, 13];
                    return [4 /*yield*/, expect(currentSize === '0').toBe(true)];
                case 12:
                    _b.sent();
                    _b.label = 13;
                case 13: return [3 /*break*/, 15];
                case 14:
                    e_5 = _b.sent();
                    return [3 /*break*/, 15];
                case 15:
                    _i++;
                    return [3 /*break*/, 9];
                case 16: return [2 /*return*/];
            }
        });
    }); });
    it('[C277092] Should disable apply button when from field value equal/is bigger than to field value', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, sizeRangeFilter.checkFromFieldIsDisplayed()];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, sizeRangeFilter.putFromNumber(10)];
                case 2:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe(false)];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, sizeRangeFilter.putToNumber('5')];
                case 5:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe(false)];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, sizeRangeFilter.putToNumber('10')];
                case 8:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                case 9: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(false)];
                case 10:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C289930] Should be able to clear values in number range fields', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, results, _i, results_4, currentResult, currentSize, e_6, _c, _d, resultsSize, _e, resultsSize_2, currentResult, currentSize, e_7;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, sizeRangeFilter.checkFromFieldIsDisplayed()];
                case 1:
                    _f.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkClearButtonIsDisplayed()];
                case 2:
                    _f.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkNoErrorMessageIsDisplayed()];
                case 3:
                    _f.sent();
                    return [4 /*yield*/, sizeRangeFilter.clickClearButton()];
                case 4:
                    _f.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkNoErrorMessageIsDisplayed()];
                case 5:
                    _f.sent();
                    return [4 /*yield*/, sizeRangeFilter.putFromNumber(0)];
                case 6:
                    _f.sent();
                    return [4 /*yield*/, sizeRangeFilter.putToNumber(1)];
                case 7:
                    _f.sent();
                    return [4 /*yield*/, sizeRangeFilter.clickClearButton()];
                case 8:
                    _f.sent();
                    _a = expect;
                    return [4 /*yield*/, sizeRangeFilter.getFromNumber()];
                case 9: return [4 /*yield*/, _a.apply(void 0, [_f.sent()]).toEqual('')];
                case 10:
                    _f.sent();
                    _b = expect;
                    return [4 /*yield*/, sizeRangeFilter.getToNumber()];
                case 11: return [4 /*yield*/, _b.apply(void 0, [_f.sent()]).toEqual('')];
                case 12:
                    _f.sent();
                    return [4 /*yield*/, sizeRangeFilter.putFromNumber(0)];
                case 13:
                    _f.sent();
                    return [4 /*yield*/, sizeRangeFilter.putToNumber(1)];
                case 14:
                    _f.sent();
                    return [4 /*yield*/, sizeRangeFilter.clickApplyButton()];
                case 15:
                    _f.sent();
                    return [4 /*yield*/, searchResults.sortBySize('DESC')];
                case 16:
                    _f.sent();
                    results = dataTable.geCellElementDetail('Size');
                    _i = 0, results_4 = results;
                    _f.label = 17;
                case 17:
                    if (!(_i < results_4.length)) return [3 /*break*/, 24];
                    currentResult = results_4[_i];
                    _f.label = 18;
                case 18:
                    _f.trys.push([18, 22, , 23]);
                    return [4 /*yield*/, currentResult.getAttribute('title')];
                case 19:
                    currentSize = _f.sent();
                    if (!(currentSize && currentSize.trim() !== '')) return [3 /*break*/, 21];
                    return [4 /*yield*/, expect(parseInt(currentSize, 10) <= 1000).toBe(true)];
                case 20:
                    _f.sent();
                    _f.label = 21;
                case 21: return [3 /*break*/, 23];
                case 22:
                    e_6 = _f.sent();
                    return [3 /*break*/, 23];
                case 23:
                    _i++;
                    return [3 /*break*/, 17];
                case 24: return [4 /*yield*/, sizeRangeFilter.clickClearButton()];
                case 25:
                    _f.sent();
                    _c = expect;
                    return [4 /*yield*/, sizeRangeFilter.getFromNumber()];
                case 26: return [4 /*yield*/, _c.apply(void 0, [_f.sent()]).toEqual('')];
                case 27:
                    _f.sent();
                    _d = expect;
                    return [4 /*yield*/, sizeRangeFilter.getToNumber()];
                case 28: return [4 /*yield*/, _d.apply(void 0, [_f.sent()]).toEqual('')];
                case 29:
                    _f.sent();
                    resultsSize = dataTable.geCellElementDetail('Size');
                    _e = 0, resultsSize_2 = resultsSize;
                    _f.label = 30;
                case 30:
                    if (!(_e < resultsSize_2.length)) return [3 /*break*/, 37];
                    currentResult = resultsSize_2[_e];
                    _f.label = 31;
                case 31:
                    _f.trys.push([31, 35, , 36]);
                    return [4 /*yield*/, currentResult.getAttribute('title')];
                case 32:
                    currentSize = _f.sent();
                    if (!(currentSize && currentSize.trim() !== '')) return [3 /*break*/, 34];
                    return [4 /*yield*/, expect(parseInt(currentSize, 10) >= 1000).toBe(true)];
                case 33:
                    _f.sent();
                    _f.label = 34;
                case 34: return [3 /*break*/, 36];
                case 35:
                    e_7 = _f.sent();
                    return [3 /*break*/, 36];
                case 36:
                    _e++;
                    return [3 /*break*/, 30];
                case 37: return [2 /*return*/];
            }
        });
    }); });
    it('[C277137] Number Range should be inclusive', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, sizeRangeFilter.checkToFieldIsDisplayed()];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, sizeRangeFilter.putToNumber(2)];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, sizeRangeFilter.putFromNumber(1)];
                case 3:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toBe(true)];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, sizeRangeFilter.clickApplyButton()];
                case 6:
                    _e.sent();
                    return [4 /*yield*/, searchResults.tableIsLoaded()];
                case 7:
                    _e.sent();
                    return [4 /*yield*/, searchResults.checkContentIsDisplayed(file2BytesModel.name)];
                case 8:
                    _e.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkToFieldIsDisplayed()];
                case 9:
                    _e.sent();
                    return [4 /*yield*/, sizeRangeFilter.putToNumber(1)];
                case 10:
                    _e.sent();
                    return [4 /*yield*/, sizeRangeFilter.putFromNumber(0)];
                case 11:
                    _e.sent();
                    _b = expect;
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                case 12: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toBe(true)];
                case 13:
                    _e.sent();
                    return [4 /*yield*/, sizeRangeFilter.clickApplyButton()];
                case 14:
                    _e.sent();
                    return [4 /*yield*/, searchResults.tableIsLoaded()];
                case 15:
                    _e.sent();
                    return [4 /*yield*/, searchResults.checkContentIsNotDisplayed(file2BytesModel.name)];
                case 16:
                    _e.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkToFieldIsDisplayed()];
                case 17:
                    _e.sent();
                    return [4 /*yield*/, sizeRangeFilter.putToNumber(3)];
                case 18:
                    _e.sent();
                    return [4 /*yield*/, sizeRangeFilter.putFromNumber(2)];
                case 19:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                case 20: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toBe(true)];
                case 21:
                    _e.sent();
                    return [4 /*yield*/, sizeRangeFilter.clickApplyButton()];
                case 22:
                    _e.sent();
                    return [4 /*yield*/, searchResults.tableIsLoaded()];
                case 23:
                    _e.sent();
                    return [4 /*yield*/, searchResults.checkContentIsDisplayed(file2BytesModel.name)];
                case 24:
                    _e.sent();
                    return [4 /*yield*/, sizeRangeFilter.checkToFieldIsDisplayed()];
                case 25:
                    _e.sent();
                    return [4 /*yield*/, sizeRangeFilter.putToNumber(4)];
                case 26:
                    _e.sent();
                    return [4 /*yield*/, sizeRangeFilter.putFromNumber(3)];
                case 27:
                    _e.sent();
                    _d = expect;
                    return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                case 28: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toBe(true)];
                case 29:
                    _e.sent();
                    return [4 /*yield*/, sizeRangeFilter.clickApplyButton()];
                case 30:
                    _e.sent();
                    return [4 /*yield*/, searchResults.tableIsLoaded()];
                case 31:
                    _e.sent();
                    return [4 /*yield*/, searchResults.checkContentIsNotDisplayed(file2BytesModel.name)];
                case 32:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Configuration change', function () {
        var jsonFile;
        beforeEach(function () {
            jsonFile = search_config_1.SearchConfiguration.getConfiguration();
        });
        it('[C276928] Should be able to change the field property for number range', function () { return __awaiter(_this, void 0, void 0, function () {
            var fromYear, toYear, _a, results, _i, results_5, currentResult, currentDate, currentDateFormatted;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 1:
                        _b.sent();
                        jsonFile.categories[3].component.settings.field = 'cm:created';
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter('*')];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, searchFilters.checkSizeRangeFilterIsDisplayed()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, searchFilters.clickSizeRangeFilterHeader()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, searchFilters.checkSizeRangeFilterIsExpanded()];
                    case 8:
                        _b.sent();
                        fromYear = (new Date()).getFullYear();
                        toYear = fromYear + 1;
                        return [4 /*yield*/, sizeRangeFilter.checkToFieldIsDisplayed()];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, sizeRangeFilter.putToNumber(toYear)];
                    case 10:
                        _b.sent();
                        return [4 /*yield*/, sizeRangeFilter.putFromNumber(fromYear)];
                    case 11:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                    case 12: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true)];
                    case 13:
                        _b.sent();
                        return [4 /*yield*/, sizeRangeFilter.clickApplyButton()];
                    case 14:
                        _b.sent();
                        return [4 /*yield*/, searchResults.tableIsLoaded()];
                    case 15:
                        _b.sent();
                        return [4 /*yield*/, searchResults.sortByCreated('DESC')];
                    case 16:
                        _b.sent();
                        results = dataTable.geCellElementDetail('Created');
                        _i = 0, results_5 = results;
                        _b.label = 17;
                    case 17:
                        if (!(_i < results_5.length)) return [3 /*break*/, 22];
                        currentResult = results_5[_i];
                        return [4 /*yield*/, currentResult.getAttribute('title')];
                    case 18:
                        currentDate = _b.sent();
                        currentDateFormatted = adf_testing_1.DateUtil.parse(currentDate, 'MMM DD, YYYY, h:mm:ss a');
                        return [4 /*yield*/, expect(currentDateFormatted.getFullYear() <= toYear).toBe(true)];
                    case 19:
                        _b.sent();
                        return [4 /*yield*/, expect(currentDateFormatted.getFullYear() >= fromYear).toBe(true)];
                    case 20:
                        _b.sent();
                        _b.label = 21;
                    case 21:
                        _i++;
                        return [3 /*break*/, 17];
                    case 22: return [2 /*return*/];
                }
            });
        }); });
        it('[C277139] Should be able to set To field to be exclusive', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 1:
                        _c.sent();
                        jsonFile.categories[3].component.settings.format = '[{FROM} TO {TO}>';
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter('*')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, searchFilters.checkSizeRangeFilterIsDisplayed()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, searchFilters.clickSizeRangeFilterHeader()];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, searchFilters.checkSizeRangeFilterIsExpanded()];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, sizeRangeFilter.checkToFieldIsDisplayed()];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, sizeRangeFilter.putToNumber(2)];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, sizeRangeFilter.putFromNumber(1)];
                    case 11:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                    case 12: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 13:
                        _c.sent();
                        return [4 /*yield*/, sizeRangeFilter.clickApplyButton()];
                    case 14:
                        _c.sent();
                        return [4 /*yield*/, searchResults.tableIsLoaded()];
                    case 15:
                        _c.sent();
                        return [4 /*yield*/, searchResults.checkContentIsNotDisplayed(file2BytesModel.name)];
                    case 16:
                        _c.sent();
                        return [4 /*yield*/, sizeRangeFilter.checkToFieldIsDisplayed()];
                    case 17:
                        _c.sent();
                        return [4 /*yield*/, sizeRangeFilter.putToNumber(3)];
                    case 18:
                        _c.sent();
                        return [4 /*yield*/, sizeRangeFilter.putFromNumber(1)];
                    case 19:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                    case 20: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 21:
                        _c.sent();
                        return [4 /*yield*/, sizeRangeFilter.clickApplyButton()];
                    case 22:
                        _c.sent();
                        return [4 /*yield*/, searchResults.tableIsLoaded()];
                    case 23:
                        _c.sent();
                        return [4 /*yield*/, searchResults.checkContentIsDisplayed(file2BytesModel.name)];
                    case 24:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277140] Should be able to set From field to be exclusive', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 1:
                        _c.sent();
                        jsonFile.categories[3].component.settings.format = '<{FROM} TO {TO}]';
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter('*')];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, searchFilters.checkSizeRangeFilterIsDisplayed()];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, searchFilters.clickSizeRangeFilterHeader()];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, searchFilters.checkSizeRangeFilterIsExpanded()];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, sizeRangeFilter.checkToFieldIsDisplayed()];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, sizeRangeFilter.putToNumber(3)];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, sizeRangeFilter.putFromNumber(1)];
                    case 11:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                    case 12: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 13:
                        _c.sent();
                        return [4 /*yield*/, sizeRangeFilter.clickApplyButton()];
                    case 14:
                        _c.sent();
                        return [4 /*yield*/, searchResults.tableIsLoaded()];
                    case 15:
                        _c.sent();
                        return [4 /*yield*/, searchResults.checkContentIsDisplayed(file2BytesModel.name)];
                    case 16:
                        _c.sent();
                        return [4 /*yield*/, sizeRangeFilter.checkToFieldIsDisplayed()];
                    case 17:
                        _c.sent();
                        return [4 /*yield*/, sizeRangeFilter.putToNumber(3)];
                    case 18:
                        _c.sent();
                        return [4 /*yield*/, sizeRangeFilter.putFromNumber(2)];
                    case 19:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, sizeRangeFilter.checkApplyButtonIsEnabled()];
                    case 20: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true)];
                    case 21:
                        _c.sent();
                        return [4 /*yield*/, sizeRangeFilter.clickApplyButton()];
                    case 22:
                        _c.sent();
                        return [4 /*yield*/, searchResults.tableIsLoaded()];
                    case 23:
                        _c.sent();
                        return [4 /*yield*/, searchResults.checkContentIsNotDisplayed(file2BytesModel.name)];
                    case 24:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=search-number-range.e2e.js.map