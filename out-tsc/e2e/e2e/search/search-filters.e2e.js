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
var searchDialog_1 = require("../pages/adf/dialog/searchDialog");
var searchFiltersPage_1 = require("../pages/adf/searchFiltersPage");
var searchResultsPage_1 = require("../pages/adf/searchResultsPage");
var acsUserModel_1 = require("../models/ACS/acsUserModel");
var fileModel_1 = require("../models/ACS/fileModel");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var adf_testing_1 = require("@alfresco/adf-testing");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var protractor_1 = require("protractor");
var search_config_1 = require("./search.config");
describe('Search Filters', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var searchDialog = new searchDialog_1.SearchDialog();
    var searchFiltersPage = new searchFiltersPage_1.SearchFiltersPage();
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var paginationPage = new adf_testing_1.PaginationPage();
    var contentList = new adf_testing_1.DocumentListPage();
    var searchResults = new searchResultsPage_1.SearchResultsPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var filename = adf_testing_1.StringUtil.generateRandomString(16);
    var fileNamePrefix = adf_testing_1.StringUtil.generateRandomString(5);
    var uniqueFileName1 = fileNamePrefix + adf_testing_1.StringUtil.generateRandomString(5);
    var uniqueFileName2 = fileNamePrefix + adf_testing_1.StringUtil.generateRandomString(5);
    var uniqueFileName3 = fileNamePrefix + adf_testing_1.StringUtil.generateRandomString(5);
    var fileModel = new fileModel_1.FileModel({
        'name': filename, 'shortName': filename.substring(0, 8)
    });
    var pngFileModel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    var txtFileModel1 = new fileModel_1.FileModel({
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location,
        'name': uniqueFileName1 + ".txt"
    });
    var jpgFileModel = new fileModel_1.FileModel({
        'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
        'name': uniqueFileName2 + ".jpg"
    });
    var txtFileModel2 = new fileModel_1.FileModel({
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location,
        'name': uniqueFileName3 + ".txt"
    });
    var fileUploaded, fileTypePng, fileTypeTxt1, fileTypeJpg, fileTypeTxt2;
    var filter = { type: 'TYPE-PNG Image' };
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
                    return [4 /*yield*/, uploadActions.uploadFile(fileModel.location, fileModel.name, '-my-')];
                case 4:
                    fileUploaded = _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-')];
                case 5:
                    fileTypePng = _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(txtFileModel1.location, txtFileModel1.name, '-my-')];
                case 6:
                    fileTypeTxt1 = _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(jpgFileModel.location, jpgFileModel.name, '-my-')];
                case 7:
                    fileTypeJpg = _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(txtFileModel2.location, txtFileModel2.name, '-my-')];
                case 8:
                    fileTypeTxt2 = _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(15000)];
                case 10:
                    _a.sent(); // wait search index previous file/folder uploaded
                    jsonFile = search_config_1.SearchConfiguration.getConfiguration();
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
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(fileUploaded.entry.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(fileTypePng.entry.id)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(fileTypeTxt1.entry.id)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(fileTypeTxt2.entry.id)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(fileTypeJpg.entry.id)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286298] Should be able to cancel a filter using "x" button from the toolbar', function () { return __awaiter(_this, void 0, void 0, function () {
        var userOption, searchCheckListPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(fileUploaded.entry.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkSearchFiltersIsDisplayed()];
                case 4:
                    _a.sent();
                    userOption = acsUser.firstName + " " + acsUser.lastName;
                    return [4 /*yield*/, searchFiltersPage.creatorCheckListFiltersPage().filterBy(userOption)];
                case 5:
                    searchCheckListPage = _a.sent();
                    return [4 /*yield*/, searchCheckListPage.checkChipIsDisplayed(userOption)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, searchCheckListPage.removeFilterOption(userOption)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, searchCheckListPage.checkChipIsNotDisplayed(userOption)];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277146] Should Show more/less buttons be hidden when inactive', function () { return __awaiter(_this, void 0, void 0, function () {
        var searchCheckListPage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + "/search;q=*")];
                case 1:
                    _a.sent();
                    searchCheckListPage = searchFiltersPage.creatorCheckListFiltersPage();
                    return [4 /*yield*/, searchCheckListPage.checkShowLessButtonIsNotDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchCheckListPage.checkShowMoreButtonIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchCheckListPage.clickShowMoreButtonUntilIsNotDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchCheckListPage.checkShowLessButtonIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, searchCheckListPage.clickShowLessButtonUntilIsNotDisplayed()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286556] Search categories should preserve their collapsed/expanded state after the search', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + "/search;q=*")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.clickFileTypeListFilter()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkFileTypeFilterIsCollapsed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.clickFileSizeFilterHeader()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkFileSizeFilterIsCollapsed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.creatorCheckListFiltersPage().clickCheckListOption('Administrator')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkFileTypeFilterIsCollapsed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkFileSizeFilterIsCollapsed()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C287796] Should be able to display the correct bucket number after selecting a filter', function () { return __awaiter(_this, void 0, void 0, function () {
        var bucketNumberForFilter, resultFileNames, _a;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + "/search;q=*")];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, searchFiltersPage.fileTypeCheckListFiltersPage().clickCheckListOption('PNG Image')];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, searchFiltersPage.fileTypeCheckListFiltersPage().getBucketNumberOfFilterType(filter.type)];
                case 3:
                    bucketNumberForFilter = _b.sent();
                    return [4 /*yield*/, contentList.getAllRowsColumnValues('Display name')];
                case 4:
                    resultFileNames = _b.sent();
                    return [4 /*yield*/, expect(bucketNumberForFilter).not.toEqual('0')];
                case 5:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, paginationPage.getTotalNumberOfFiles()];
                case 6: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(bucketNumberForFilter)];
                case 7:
                    _b.sent();
                    resultFileNames.map(function (nameOfResultFiles) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, expect(nameOfResultFiles).toContain('.png')];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291802] Should be able to filter facet fields with "Contains"', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 1:
                    _a.sent();
                    jsonFile['filterWithContains'] = true;
                    return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter('*')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchResults.tableIsLoaded()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.creatorCheckListFiltersPage().searchInFilter('dminis')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.creatorCheckListFiltersPage().checkCheckListOptionIsDisplayed('Administrator')];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291980] Should group search facets under specified labels', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + "/search;q=*")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkDefaultFacetQueryGroupIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkTypeFacetQueryGroupIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkSizeFacetQueryGroupIsDisplayed()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291981] Should group search facets under the default label, by default', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter('*')];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, searchResults.tableIsLoaded()];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, searchFiltersPage.checkDefaultFacetQueryGroupIsDisplayed()];
                case 6:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, searchFiltersPage.isTypeFacetQueryGroupPresent()];
                case 7: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(false)];
                case 8:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, searchFiltersPage.isSizeFacetQueryGroupPresent()];
                case 9: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(false)];
                case 10:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C297509] Should display search intervals under specified labels from config', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + "/search;q=*")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkFacetIntervalsByCreatedIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkFacetIntervalsByCreatedIsExpanded()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.clickFacetIntervalsByCreatedFilterHeader()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkFacetIntervalsByCreatedIsCollapsed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.clickFacetIntervalsByCreatedFilterHeader()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkFacetIntervalsByCreatedIsExpanded()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkFacetIntervalsByModifiedIsDisplayed()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkFacetIntervalsByModifiedIsExpanded()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.clickFacetIntervalsByModifiedFilterHeader()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkFacetIntervalsByModifiedIsCollapsed()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.clickFacetIntervalsByModifiedFilterHeader()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkFacetIntervalsByModifiedIsExpanded()];
                case 13:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C299200] Should reset the filters facet with search query', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(fileTypeTxt1.entry.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkSearchFiltersIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, searchResults.tableIsLoaded()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, searchResults.checkContentIsDisplayed(fileTypeTxt1.entry.name)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkFileTypeFacetLabelIsDisplayed('Plain Text (1)')];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkFileTypeFacetLabelIsNotDisplayed('JPEG Image')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(fileNamePrefix)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkSearchFiltersIsDisplayed()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, searchResults.tableIsLoaded()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, searchResults.checkContentIsDisplayed(fileTypeTxt1.entry.name)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, searchResults.checkContentIsDisplayed(fileTypeTxt2.entry.name)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, searchResults.checkContentIsDisplayed(fileTypeJpg.entry.name)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkFileTypeFacetLabelIsDisplayed('Plain Text (2)')];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkFileTypeFacetLabelIsDisplayed('JPEG Image (1)')];
                case 19:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C299124] Should be able to parse escaped empty spaced labels inside facetFields', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 1:
                    _a.sent();
                    jsonFile.facetFields.fields[0].label = 'My File Types';
                    jsonFile.facetFields.fields[1].label = 'My File Sizes';
                    return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(jsonFile))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter('*')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchResults.tableIsLoaded()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkCustomFacetFieldLabelIsDisplayed('My File Types')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, searchFiltersPage.checkCustomFacetFieldLabelIsDisplayed('My File Sizes')];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=search-filters.e2e.js.map