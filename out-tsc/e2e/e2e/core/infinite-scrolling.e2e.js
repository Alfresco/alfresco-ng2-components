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
var contentServicesPage_1 = require("../pages/adf/contentServicesPage");
var infinitePaginationPage_1 = require("../pages/adf/core/infinitePaginationPage");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var acsUserModel_1 = require("../models/ACS/acsUserModel");
var folderModel_1 = require("../models/ACS/folderModel");
var protractor_1 = require("protractor");
var util_1 = require("../util/util");
var js_api_1 = require("@alfresco/js-api");
var adf_testing_2 = require("@alfresco/adf-testing");
describe('Enable infinite scrolling', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var infinitePaginationPage = new infinitePaginationPage_1.InfinitePaginationPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var folderModel = new folderModel_1.FolderModel({ 'name': 'folderOne' });
    var fileNames = [];
    var nrOfFiles = 30;
    var deleteFileNames = [];
    var nrOfDeletedFiles = 22;
    var deleteUploaded;
    var pageSize = 20;
    var emptyFolderModel;
    var files = {
        base: 'newFile',
        extension: '.txt'
    };
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var uploadActions, folderUploadedModel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'ECM',
                        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
                    });
                    uploadActions = new adf_testing_2.UploadActions(this.alfrescoJsApi);
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 3:
                    _a.sent();
                    fileNames = util_1.Util.generateSequenceFiles(1, nrOfFiles, files.base, files.extension);
                    deleteFileNames = util_1.Util.generateSequenceFiles(1, nrOfDeletedFiles, files.base, files.extension);
                    return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(folderModel.name, '-my-')];
                case 5:
                    folderUploadedModel = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder('emptyFolder', '-my-')];
                case 6:
                    emptyFolderModel = _a.sent();
                    return [4 /*yield*/, uploadActions.createEmptyFiles(fileNames, folderUploadedModel.entry.id)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder('deleteFolder', '-my-')];
                case 8:
                    deleteUploaded = _a.sent();
                    return [4 /*yield*/, uploadActions.createEmptyFiles(deleteFileNames, deleteUploaded.entry.id)];
                case 9:
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
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260484] Should be possible to enable infinite scrolling', function () { return __awaiter(_this, void 0, void 0, function () {
        var i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.doubleClickRow(folderModel.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.enableInfiniteScrolling()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, infinitePaginationPage.clickLoadMoreButton()];
                case 3:
                    _a.sent();
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < nrOfFiles)) return [3 /*break*/, 7];
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(fileNames[i])];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    it('[C268165] Delete folder when infinite scrolling is enabled', function () { return __awaiter(_this, void 0, void 0, function () {
        var i, _a, i;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, contentServicesPage.doubleClickRow(deleteUploaded.entry.name)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.enableInfiniteScrolling()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, infinitePaginationPage.clickLoadMoreButton()];
                case 5:
                    _b.sent();
                    i = 0;
                    _b.label = 6;
                case 6:
                    if (!(i < nrOfDeletedFiles)) return [3 /*break*/, 9];
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(deleteFileNames[i])];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 6];
                case 9:
                    _a = expect;
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().numberOfRows()];
                case 10: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(nrOfDeletedFiles)];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.deleteContent(deleteFileNames[nrOfDeletedFiles - 1])];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(deleteFileNames[nrOfDeletedFiles - 1])];
                case 13:
                    _b.sent();
                    i = 0;
                    _b.label = 14;
                case 14:
                    if (!(i < nrOfDeletedFiles - 1)) return [3 /*break*/, 17];
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(deleteFileNames[i])];
                case 15:
                    _b.sent();
                    _b.label = 16;
                case 16:
                    i++;
                    return [3 /*break*/, 14];
                case 17: return [2 /*return*/];
            }
        });
    }); });
    it('[C299201] Should use default pagination settings for infinite pagination', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, contentServicesPage.doubleClickRow(folderModel.name)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, contentServicesPage.enableInfiniteScrolling()];
                case 4:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(pageSize)];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, infinitePaginationPage.clickLoadMoreButton()];
                case 7:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(nrOfFiles)];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, infinitePaginationPage.checkLoadMoreButtonIsNotDisplayed()];
                case 10:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C299202] Should not display load more button when all the files are already displayed', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, adf_testing_1.LocalStorageUtil.setUserPreference('paginationSize', '30')];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.doubleClickRow(folderModel.name)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.enableInfiniteScrolling()];
                case 5:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 6: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(nrOfFiles)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, infinitePaginationPage.checkLoadMoreButtonIsNotDisplayed()];
                case 8:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C299203] Should not display load more button when a folder is empty', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.doubleClickRow(emptyFolderModel.entry.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, infinitePaginationPage.checkLoadMoreButtonIsNotDisplayed()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=infinite-scrolling.e2e.js.map