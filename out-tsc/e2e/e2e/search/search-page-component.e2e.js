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
var searchResultsPage_1 = require("../pages/adf/searchResultsPage");
var acsUserModel_1 = require("../models/ACS/acsUserModel");
var folderModel_1 = require("../models/ACS/folderModel");
var fileModel_1 = require("../models/ACS/fileModel");
var util_1 = require("../util/util");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
describe('Search component - Search Page', function () {
    var search = {
        active: {
            firstFile: null,
            secondFile: null,
            base: adf_testing_1.StringUtil.generateRandomString(7),
            extension: '.txt'
        },
        no_permission: {
            noPermFile: 'Meetings',
            noPermFolder: 'Meeting Notes'
        }
    };
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var searchDialog = new searchDialog_1.SearchDialog();
    var searchResultPage = new searchResultsPage_1.SearchResultsPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var emptyFolderModel = new folderModel_1.FolderModel({ 'name': 'search' + adf_testing_1.StringUtil.generateRandomString() });
    var firstFileModel;
    var newFolderModel = new folderModel_1.FolderModel({ 'name': 'newFolder' });
    var fileNames = [];
    var nrOfFiles = 15;
    var adminNrOfFiles = 5;
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var adminFileNames, newFolderModelUploaded;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileNames = util_1.Util.generateSequenceFiles(1, nrOfFiles, search.active.base, search.active.extension);
                    adminFileNames = util_1.Util.generateSequenceFiles(nrOfFiles + 1, nrOfFiles + adminNrOfFiles, search.active.base, search.active.extension);
                    search.active.firstFile = fileNames[0];
                    search.active.secondFile = fileNames[1];
                    fileNames.splice(0, 1);
                    firstFileModel = new fileModel_1.FileModel({
                        'name': search.active.firstFile,
                        'location': resources.Files.ADF_DOCUMENTS.TXT.file_location
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
                    return [4 /*yield*/, uploadActions.createFolder(emptyFolderModel.name, '-my-')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(newFolderModel.name, '-my-')];
                case 5:
                    newFolderModelUploaded = _a.sent();
                    return [4 /*yield*/, uploadActions.createEmptyFiles(fileNames, newFolderModelUploaded.entry.id)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(firstFileModel.location, firstFileModel.name, '-my-')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.createEmptyFiles(adminFileNames, newFolderModelUploaded.entry.id)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(15000)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 11:
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
    it('[C260264] Should display message when no results are found', function () { return __awaiter(_this, void 0, void 0, function () {
        var notExistentFileName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    notExistentFileName = adf_testing_1.StringUtil.generateRandomString();
                    return [4 /*yield*/, searchDialog.checkSearchBarIsNotVisible()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(notExistentFileName)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.checkNoResultMessageIsDisplayed()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C272810] Should display only files corresponding to search', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(search.active.firstFile)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, searchResultPage.checkContentIsDisplayed(search.active.firstFile)];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, searchResultPage.numberOfResultsDisplayed()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(1)];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260267] Should display content when opening a folder from search results', function () { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(emptyFolderModel.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.checkNoResultMessageIsNotDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.checkContentIsDisplayed(emptyFolderModel.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.navigateToFolder(emptyFolderModel.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.currentFolderName()];
                case 6:
                    result = _a.sent();
                    return [4 /*yield*/, expect(result).toEqual(emptyFolderModel.name)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260261] Should be able to delete a file from search results', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(search.active.firstFile)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.checkContentIsDisplayed(search.active.firstFile)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.deleteContent(search.active.firstFile)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.checkNoResultMessageIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.checkContentIsNotDisplayed(search.active.firstFile)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchBarIsNotVisible()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(search.active.firstFile)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.checkNoResultMessageIsDisplayed()];
                case 11:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C272809] Should be able to delete a folder from search results', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(emptyFolderModel.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.checkContentIsDisplayed(emptyFolderModel.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.checkNoResultMessageIsNotDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.checkContentIsDisplayed(emptyFolderModel.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.deleteContent(emptyFolderModel.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.checkNoResultMessageIsDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchBarIsNotVisible()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.checkSearchIconIsVisible()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter(emptyFolderModel.name)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.checkNoResultMessageIsDisplayed()];
                case 12:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C286675] Should display results when searching for all elements', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, searchDialog.clickOnSearchIcon()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, searchDialog.enterTextAndPressEnter('*')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, searchResultPage.checkNoResultMessageIsNotDisplayed()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=search-page-component.e2e.js.map