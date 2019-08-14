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
var searchDialog_1 = require("../pages/adf/dialog/searchDialog");
var contentServicesPage_1 = require("../pages/adf/contentServicesPage");
var viewerPage_1 = require("../pages/adf/viewerPage");
var searchResultsPage_1 = require("../pages/adf/searchResultsPage");
var acsUserModel_1 = require("../models/ACS/acsUserModel");
var fileModel_1 = require("../models/ACS/fileModel");
var folderModel_1 = require("../models/ACS/folderModel");
var js_api_1 = require("@alfresco/js-api");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var search_config_1 = require("./search.config");
describe('Search component - Search Bar', function () {
    var search = {
        inactive: {
            firstChar: 'x',
            secondChar: 'y',
            thirdChar: 'z',
            name: 'impossible-name-folder' + adf_testing_1.StringUtil.generateRandomString(8)
        }
    };
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var searchDialog = new searchDialog_1.SearchDialog();
    var searchResultPage = new searchResultsPage_1.SearchResultsPage();
    var viewerPage = new viewerPage_1.ViewerPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var filename = adf_testing_1.StringUtil.generateRandomString(16);
    var firstFolderName = adf_testing_1.StringUtil.generateRandomString(16);
    var secondFolderName = adf_testing_1.StringUtil.generateRandomString(16);
    var thirdFolderName = adf_testing_1.StringUtil.generateRandomString(16);
    var filesToDelete = [];
    var firstFileModel = new fileModel_1.FileModel({
        'name': filename, 'shortName': filename.substring(0, 8)
    });
    var firstFolderModel = new folderModel_1.FolderModel({
        'name': firstFolderName, 'shortName': firstFolderName.substring(0, 8)
    });
    var secondFolder = new folderModel_1.FolderModel({
        'name': secondFolderName, 'shortName': secondFolderName.substring(0, 8)
    });
    var thirdFolder = new folderModel_1.FolderModel({
        'name': thirdFolderName, 'shortName': thirdFolderName.substring(0, 8)
    });
    var term = 'Zoizo';
    var fileHighlightUploaded;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var firstFileUploaded, _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 3:
                    _g.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(firstFileModel.location, firstFileModel.name, '-my-')];
                case 4:
                    firstFileUploaded = _g.sent();
                    Object.assign(firstFileModel, firstFileUploaded.entry);
                    return [4 /*yield*/, this.alfrescoJsApi.nodes.addNode('-my-', {
                            'name': adf_testing_1.StringUtil.generateRandomString(16),
                            'nodeType': 'cm:content',
                            'properties': {
                                'cm:title': term,
                                'cm:description': 'Jadore les ' + term
                            }
                        })];
                case 5:
                    fileHighlightUploaded = _g.sent();
                    filesToDelete.push(fileHighlightUploaded);
                    filesToDelete.push(firstFileUploaded);
                    _b = (_a = filesToDelete).push;
                    return [4 /*yield*/, uploadActions.createFolder(firstFolderModel.name, '-my-')];
                case 6:
                    _b.apply(_a, [_g.sent()]);
                    _d = (_c = filesToDelete).push;
                    return [4 /*yield*/, uploadActions.createFolder(secondFolder.name, '-my-')];
                case 7:
                    _d.apply(_c, [_g.sent()]);
                    _f = (_e = filesToDelete).push;
                    return [4 /*yield*/, uploadActions.createFolder(thirdFolder.name, '-my-')];
                case 8:
                    _f.apply(_e, [_g.sent()]);
                    return [4 /*yield*/, protractor_1.browser.sleep(15000)];
                case 9:
                    _g.sent(); // wait search index previous file/folder uploaded
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 10:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var _i, filesToDelete_1, currentNode;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _i = 0, filesToDelete_1 = filesToDelete;
                    _a.label = 1;
                case 1:
                    if (!(_i < filesToDelete_1.length)) return [3 /*break*/, 4];
                    currentNode = filesToDelete_1[_i];
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(currentNode.entry.id)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
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
                case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C272798] Search bar should be visible', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchDialog.checkSearchBarIsNotVisible()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchBarIsVisible()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchBarIsNotVisible()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C272799] Should be possible to hide search bar after input', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterText(firstFolderModel.shortName)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260255] Should display message when searching for an inexistent file', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchDialog.checkSearchBarIsNotVisible()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkNoResultMessageIsNotDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterText(search.inactive.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkNoResultMessageIsDisplayed()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260256] Should display file/folder in search suggestion when typing first characters', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, searchDialog.checkSearchBarIsVisible()];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, searchDialog.enterText(firstFolderModel.shortName)];
                case 3:
                    _g.sent();
                    return [4 /*yield*/, searchDialog.resultTableContainsRow(firstFolderModel.name)];
                case 4:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, searchDialog.getSpecificRowsHighlightName(firstFolderModel.name)];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_g.sent()]).toEqual(firstFolderModel.shortName)];
                case 6:
                    _g.sent();
                    _b = expect;
                    return [4 /*yield*/, searchDialog.getSpecificRowsAuthor(firstFolderModel.name)];
                case 7: return [4 /*yield*/, _b.apply(void 0, [_g.sent()]).toEqual(acsUser.firstName + ' ' + acsUser.lastName)];
                case 8:
                    _g.sent();
                    _c = expect;
                    return [4 /*yield*/, searchDialog.getSpecificRowsCompleteName(firstFolderModel.name)];
                case 9: return [4 /*yield*/, _c.apply(void 0, [_g.sent()]).toEqual(firstFolderModel.name)];
                case 10:
                    _g.sent();
                    return [4 /*yield*/, searchDialog.clearText()];
                case 11:
                    _g.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 12:
                    _g.sent();
                    return [4 /*yield*/, searchDialog.enterText(firstFileModel.shortName)];
                case 13:
                    _g.sent();
                    return [4 /*yield*/, searchDialog.resultTableContainsRow(firstFileModel.name)];
                case 14:
                    _g.sent();
                    _d = expect;
                    return [4 /*yield*/, searchDialog.getSpecificRowsHighlightName(firstFileModel.name)];
                case 15: return [4 /*yield*/, _d.apply(void 0, [_g.sent()]).toEqual(firstFileModel.shortName)];
                case 16:
                    _g.sent();
                    _e = expect;
                    return [4 /*yield*/, searchDialog.getSpecificRowsAuthor(firstFileModel.name)];
                case 17: return [4 /*yield*/, _e.apply(void 0, [_g.sent()]).toEqual(acsUser.firstName + ' ' + acsUser.lastName)];
                case 18:
                    _g.sent();
                    _f = expect;
                    return [4 /*yield*/, searchDialog.getSpecificRowsCompleteName(firstFileModel.name)];
                case 19: return [4 /*yield*/, _f.apply(void 0, [_g.sent()]).toEqual(firstFileModel.name)];
                case 20:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C272800] Should display file/folder in search suggestion when typing name', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, searchDialog.checkSearchBarIsVisible()];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, searchDialog.enterText(firstFolderModel.name)];
                case 3:
                    _g.sent();
                    return [4 /*yield*/, searchDialog.resultTableContainsRow(firstFolderModel.name)];
                case 4:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, searchDialog.getSpecificRowsHighlightName(firstFolderModel.name)];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_g.sent()]).toEqual(firstFolderModel.name)];
                case 6:
                    _g.sent();
                    _b = expect;
                    return [4 /*yield*/, searchDialog.getSpecificRowsAuthor(firstFolderModel.name)];
                case 7: return [4 /*yield*/, _b.apply(void 0, [_g.sent()]).toEqual(acsUser.firstName + ' ' + acsUser.lastName)];
                case 8:
                    _g.sent();
                    _c = expect;
                    return [4 /*yield*/, searchDialog.getSpecificRowsCompleteName(firstFolderModel.name)];
                case 9: return [4 /*yield*/, _c.apply(void 0, [_g.sent()]).toEqual(firstFolderModel.name)];
                case 10:
                    _g.sent();
                    return [4 /*yield*/, searchDialog.clearText()];
                case 11:
                    _g.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 12:
                    _g.sent();
                    return [4 /*yield*/, searchDialog.enterText(firstFileModel.name)];
                case 13:
                    _g.sent();
                    return [4 /*yield*/, searchDialog.resultTableContainsRow(firstFileModel.name)];
                case 14:
                    _g.sent();
                    _d = expect;
                    return [4 /*yield*/, searchDialog.getSpecificRowsHighlightName(firstFileModel.name)];
                case 15: return [4 /*yield*/, _d.apply(void 0, [_g.sent()]).toEqual(firstFileModel.name)];
                case 16:
                    _g.sent();
                    _e = expect;
                    return [4 /*yield*/, searchDialog.getSpecificRowsAuthor(firstFileModel.name)];
                case 17: return [4 /*yield*/, _e.apply(void 0, [_g.sent()]).toEqual(acsUser.firstName + ' ' + acsUser.lastName)];
                case 18:
                    _g.sent();
                    _f = expect;
                    return [4 /*yield*/, searchDialog.getSpecificRowsCompleteName(firstFileModel.name)];
                case 19: return [4 /*yield*/, _f.apply(void 0, [_g.sent()]).toEqual(firstFileModel.name)];
                case 20:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260257] Should display content when clicking on folder from search suggestions', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, searchDialog.checkSearchBarIsVisible()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, searchDialog.enterText(firstFolderModel.shortName)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, searchDialog.resultTableContainsRow(firstFolderModel.name)];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, searchDialog.clickOnSpecificRow(firstFolderModel.name)];
                case 5:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, contentServicesPage.currentFolderName()];
                case 6: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toEqual(firstFolderModel.name)];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, searchDialog.checkSearchBarIsVisible()];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, searchDialog.enterText(firstFileModel.name)];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, searchDialog.resultTableContainsRow(firstFileModel.name)];
                case 12:
                    _c.sent();
                    return [4 /*yield*/, searchDialog.clickOnSpecificRow(firstFileModel.name)];
                case 13:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, viewerPage.getDisplayedFileName()];
                case 14: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toEqual(firstFileModel.name)];
                case 15:
                    _c.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 16:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C272801] Should display message when searching for non-existent folder', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchBarIsVisible()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(search.inactive.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.checkNoResultMessageIsDisplayed()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C272802] Should be able to find an existent folder in search results', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchBarIsVisible()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(firstFolderModel.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.checkContentIsDisplayed(firstFolderModel.name)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260258] Should be able to find an existent file in search results', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchBarIsVisible()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(firstFileModel.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.checkContentIsDisplayed(firstFileModel.name)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C91321] Should be able to use down arrow key when navigating throw suggestions', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, searchDialog.checkSearchBarIsVisible()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, searchDialog.enterText(secondFolder.shortName)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, searchDialog.pressDownArrowAndEnter()];
                case 5:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, contentServicesPage.currentFolderName()];
                case 6: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(secondFolder.name)];
                case 7:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C290137] Should be able to search by \'%\'', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter('%')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.tableIsLoaded()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Highlight', function () {
        var searchConfiguration = search_config_1.SearchConfiguration.getConfiguration();
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setConfigField('search', JSON.stringify(searchConfiguration))];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.checkSearchBarIsVisible()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, searchDialog.enterTextAndPressEnter(term)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C299212] Should be able to configure the highlight option for search results', function () { return __awaiter(_this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, searchResultPage.getNodeHighlight(fileHighlightUploaded.entry.name).getText()];
                    case 1:
                        text = _a.sent();
                        return [4 /*yield*/, expect(text.includes("\u00BF" + term + "?")).toBe(true)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, expect(text.includes("(" + term + ")")).toBe(true)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=search-component.e2e.js.map