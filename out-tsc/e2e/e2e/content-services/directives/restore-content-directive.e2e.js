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
var contentServicesPage_1 = require("../../pages/adf/contentServicesPage");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var js_api_1 = require("@alfresco/js-api");
var protractor_1 = require("protractor");
var fileModel_1 = require("../../models/ACS/fileModel");
var resources = require("../../util/resources");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var trashcanPage_1 = require("../../pages/adf/trashcanPage");
var adf_testing_1 = require("@alfresco/adf-testing");
var breadCrumbPage_1 = require("../../pages/adf/content-services/breadcrumb/breadCrumbPage");
describe('Restore content directive', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var anotherAcsUser = new acsUserModel_1.AcsUserModel();
    var trashcanPage = new trashcanPage_1.TrashcanPage();
    var breadCrumbPage = new breadCrumbPage_1.BreadCrumbPage();
    var notificationHistoryPage = new adf_testing_1.NotificationHistoryPage();
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var pdfFileModel = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.PDF.file_name,
        location: resources.Files.ADF_DOCUMENTS.PDF.file_location
    });
    var testFileModel = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.TEST.file_name,
        location: resources.Files.ADF_DOCUMENTS.TEST.file_location
    });
    var pngFileModel = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.PNG.file_name,
        location: resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    var folderName = adf_testing_1.StringUtil.generateRandomString(5);
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var folderWithContent, folderWithFolder, subFolder, subFile, testFile, restoreFile, publicSite, siteFolder, siteFile;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(anotherAcsUser)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(folderName, '-my-')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), '-my-')];
                case 6:
                    folderWithContent = _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(testFileModel.location, testFileModel.name, folderWithContent.entry.id)];
                case 7:
                    subFile = _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, '-my-')];
                case 8:
                    testFile = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), '-my-')];
                case 9:
                    folderWithFolder = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), folderWithFolder.entry.id)];
                case 10:
                    subFolder = _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, '-my-')];
                case 11:
                    restoreFile = _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 12:
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
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(folderWithContent.entry.id)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(folderWithFolder.entry.id)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Restore same name folders', function () {
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderName)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.deleteContent(folderName)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(folderName)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickTrashcanButton()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.waitForTableBody()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(folderName)];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260227] Should validate when restoring Folders with same name', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, uploadActions.createFolder(folderName, '-my-')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.refresh()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderName)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.deleteContent(folderName)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(folderName)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickTrashcanButton()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.waitForTableBody()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(folderName)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkAllRows()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.clickRestore()];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(folderName)];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded()];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderName)];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('Can\'t restore, ' + folderName + ' item already exists')];
                    case 17:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('[C260238] Should restore a file', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(testFile.entry.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.deleteContent(testFile.entry.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(testFile.entry.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickTrashcanButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.waitForTableBody()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().clickRowByContent(testFile.entry.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(testFile.entry.name)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.clickRestore()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowContentIsNotDisplayed(testFile.entry.name)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(testFile.entry.name)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.deleteContent(testFile.entry.name)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(testFile.entry.name)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickTrashcanButton()];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.waitForTableBody()];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(testFile.entry.name)];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, notificationHistoryPage.checkNotifyContains(testFile.entry.name + ' item restored')];
                case 18:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260239] Should restore folder with content', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderWithContent.entry.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.deleteContent(folderWithContent.entry.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(folderWithContent.entry.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickTrashcanButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.waitForTableBody()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().clickRowByContent(folderWithContent.entry.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(folderWithContent.entry.name)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.clickRestore()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowContentIsNotDisplayed(folderWithContent.entry.name)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderWithContent.entry.name)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().doubleClickRow('Display name', folderWithContent.entry.name)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(subFile.entry.name)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, notificationHistoryPage.checkNotifyContains(folderWithContent.entry.name + ' item restored')];
                case 15:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260240] Should validate restore when the original location no longer exists', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderWithFolder.entry.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.doubleClickRow(folderWithFolder.entry.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(subFolder.entry.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.deleteContent(subFolder.entry.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(subFolder.entry.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, breadCrumbPage.chooseBreadCrumb(acsUser.id)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderWithFolder.entry.name)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.deleteContent(folderWithFolder.entry.name)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(folderWithFolder.entry.name)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickTrashcanButton()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.waitForTableBody()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(subFolder.entry.name)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(folderWithFolder.entry.name)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().clickRowByContent(subFolder.entry.name)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(subFolder.entry.name)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.clickRestore()];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, notificationHistoryPage.checkNotifyContains("Can't restore " + subFolder.entry.name + " item, the original location no longer exists")];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(subFolder.entry.name)];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(folderWithFolder.entry.name)];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(subFolder.entry.name)];
                case 21:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(subFolder.entry.name)];
                case 22:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(folderWithFolder.entry.name)];
                case 23:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(folderWithFolder.entry.name)];
                case 24:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.clickRestore()];
                case 25:
                    _a.sent();
                    return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('Restore successful')];
                case 26:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 27:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 28:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderWithFolder.entry.name)];
                case 29:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.doubleClickRow(folderWithFolder.entry.name)];
                case 30:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(subFolder.entry.name)];
                case 31:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260241] Should display restore icon both for file and folder', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderName)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(restoreFile.entry.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.deleteContent(folderName)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.deleteContent(restoreFile.entry.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(folderName)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(restoreFile.entry.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickTrashcanButton()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.waitForTableBody()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.checkRestoreButtonIsNotDisplayed()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(folderName)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(folderName)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.checkRestoreButtonIsDisplayed()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(folderName)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsNotSelected(folderName)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(restoreFile.entry.name)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(restoreFile.entry.name)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.checkRestoreButtonIsDisplayed()];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(folderName)];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(folderName)];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(restoreFile.entry.name)];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.checkRestoreButtonIsDisplayed()];
                case 21:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Restore deleted library', function () {
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var publicSiteName, publicSiteBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                    case 1:
                        _a.sent();
                        publicSiteName = "00" + adf_testing_1.StringUtil.generateRandomString(5);
                        publicSiteBody = { visibility: 'PUBLIC', title: publicSiteName };
                        return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.createSite(publicSiteBody)];
                    case 2:
                        publicSite = _a.sent();
                        return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), publicSite.entry.guid)];
                    case 3:
                        siteFolder = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, siteFolder.entry.id)];
                    case 4:
                        siteFile = _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.deleteSite(publicSite.entry.id)];
                    case 5:
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
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.deleteSite(publicSite.entry.id)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        it('[C260241] Should restore the deleted library along with contents inside', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.clickTrashcanButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.waitForTableBody()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowContentIsDisplayed(publicSite.entry.id)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(publicSite.entry.id)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(publicSite.entry.id)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.clickRestore()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.selectSite(publicSite.entry.title)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(siteFolder.entry.name)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.doubleClickRow(siteFolder.entry.name)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(siteFile.entry.name)];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains(publicSite.entry.id + ' item restored')];
                    case 14:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Restore with folder hierarchies', function () {
        var parentFolder, folderWithin, pdfFile, pngFile, mainFile, mainFolder;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(anotherAcsUser.id, anotherAcsUser.password)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.createFolder(folderName, '-my-')];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), '-my-')];
                    case 3:
                        parentFolder = _a.sent();
                        return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), parentFolder.entry.id)];
                    case 4:
                        folderWithin = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, folderWithin.entry.id)];
                    case 5:
                        pdfFile = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, folderWithin.entry.id)];
                    case 6:
                        pngFile = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(testFileModel.location, testFileModel.name, '-my-')];
                    case 7:
                        mainFile = _a.sent();
                        return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), '-my-')];
                    case 8:
                        mainFolder = _a.sent();
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(anotherAcsUser)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                    case 11:
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
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(parentFolder.entry.id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(mainFolder.entry.id)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(mainFile.entry.id)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C216431] Should restore hierarchy of folders', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.deleteContent(parentFolder.entry.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.deleteContent(mainFolder.entry.name)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.deleteContent(mainFile.entry.name)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickTrashcanButton()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.waitForTableBody()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.checkRestoreButtonIsNotDisplayed()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(parentFolder.entry.name)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(parentFolder.entry.name)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(mainFolder.entry.name)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(mainFolder.entry.name)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().clickRowByContentCheckbox(mainFile.entry.name)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(mainFile.entry.name)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, trashcanPage.clickRestore()];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(parentFolder.entry.name)];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(mainFolder.entry.name)];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(mainFile.entry.name)];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.doubleClickRow(parentFolder.entry.name)];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderWithin.entry.name)];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.doubleClickRow(folderWithin.entry.name)];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pdfFile.entry.name)];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pngFile.entry.name)];
                    case 23:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=restore-content-directive.e2e.js.map