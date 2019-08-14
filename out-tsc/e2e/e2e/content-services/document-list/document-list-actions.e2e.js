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
var contentServicesPage_1 = require("../../pages/adf/contentServicesPage");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var resources = require("../../util/resources");
var js_api_1 = require("@alfresco/js-api");
var fileModel_1 = require("../../models/ACS/fileModel");
var util_1 = require("../../util/util");
var breadCrumbDropdownPage_1 = require("../../pages/adf/content-services/breadcrumb/breadCrumbDropdownPage");
var breadCrumbPage_1 = require("../../pages/adf/content-services/breadcrumb/breadCrumbPage");
var infinitePaginationPage_1 = require("../../pages/adf/core/infinitePaginationPage");
var folderModel_1 = require("../../models/ACS/folderModel");
describe('Document List Component - Actions', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var contentListPage = contentServicesPage.getDocumentList();
    var contentNodeSelector = new adf_testing_1.ContentNodeSelectorDialogPage();
    var paginationPage = new adf_testing_1.PaginationPage();
    var breadCrumbDropdownPage = new breadCrumbDropdownPage_1.BreadCrumbDropdownPage();
    var breadCrumbPage = new breadCrumbPage_1.BreadCrumbPage();
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var infinitePaginationPage = new infinitePaginationPage_1.InfinitePaginationPage(protractor_1.element(protractor_1.by.css('adf-content-node-selector')));
    describe('Document List Component - Check Actions', function () {
        var uploadedFolder, secondUploadedFolder;
        var acsUser = null;
        var pdfUploadedNode;
        var folderName;
        var fileNames = [];
        var nrOfFiles = 5;
        var pdfFileModel = new fileModel_1.FileModel({
            name: resources.Files.ADF_DOCUMENTS.PDF.file_name,
            location: resources.Files.ADF_DOCUMENTS.PDF.file_location
        });
        var testFileModel = new fileModel_1.FileModel({
            name: resources.Files.ADF_DOCUMENTS.TEST.file_name,
            location: resources.Files.ADF_DOCUMENTS.TEST.file_location
        });
        var files = {
            base: 'newFile',
            extension: '.txt'
        };
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        acsUser = new acsUserModel_1.AcsUserModel();
                        folderName = "TATSUMAKY_" + adf_testing_1.StringUtil.generateRandomString(5) + "_SENPOUKYAKU";
                        return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, '-my-')];
                    case 4:
                        pdfUploadedNode = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(testFileModel.location, testFileModel.name, '-my-')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.createFolder(folderName, '-my-')];
                    case 6:
                        uploadedFolder = _a.sent();
                        return [4 /*yield*/, uploadActions.createFolder('secondFolder', '-my-')];
                    case 7:
                        secondUploadedFolder = _a.sent();
                        fileNames = util_1.Util.generateSequenceFiles(1, nrOfFiles, files.base, files.extension);
                        return [4 /*yield*/, uploadActions.createEmptyFiles(fileNames, uploadedFolder.entry.id)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(10000)];
                    case 10:
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
                        return [2 /*return*/];
                }
            });
        }); });
        describe('File Actions', function () {
            it('[C213257] Should be able to copy a file', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pdfUploadedNode.entry.name)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Copy')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.checkDialogIsDisplayed()];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.typeIntoNodeSelectorSearchField(folderName)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.clickContentNodeSelectorResult(folderName)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.clickMoveCopyButton()];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pdfFileModel.name)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.doubleClickRow(uploadedFolder.entry.name)];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pdfFileModel.name)];
                        case 10:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C260131] Copy - Destination picker search', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pdfFileModel.name)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Copy')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.checkDialogIsDisplayed()];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.typeIntoNodeSelectorSearchField(folderName)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.contentListPage().dataTablePage().checkCellByHighlightContent(folderName)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.clickCancelButton()];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.checkDialogIsNotDisplayed()];
                        case 8:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C297491] Should be able to move a file', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(testFileModel.name)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow(testFileModel.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Move')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.checkDialogIsDisplayed()];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.typeIntoNodeSelectorSearchField(folderName)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.clickContentNodeSelectorResult(folderName)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.clickMoveCopyButton()];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(testFileModel.name)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.doubleClickRow(uploadedFolder.entry.name)];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(testFileModel.name)];
                        case 10:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C260127] Move - Destination picker search', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pdfFileModel.name)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Move')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.checkDialogIsDisplayed()];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.typeIntoNodeSelectorSearchField(folderName)];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.contentListPage().dataTablePage().checkCellByHighlightContent(folderName)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.clickCancelButton()];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.checkDialogIsNotDisplayed()];
                        case 8:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C280561] Should be able to delete a file via dropdown menu', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, contentServicesPage.doubleClickRow(uploadedFolder.entry.name)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(fileNames[0])];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.deleteContent(fileNames[0])];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(fileNames[0])];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C280562] Only one file is deleted when multiple files are selected using dropdown menu', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, contentServicesPage.doubleClickRow(uploadedFolder.entry.name)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.getDocumentList().selectRow(fileNames[1])];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.getDocumentList().selectRow(fileNames[2])];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.deleteContent(fileNames[1])];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(fileNames[1])];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(fileNames[2])];
                        case 6:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C280565] Should be able to delete a file using context menu', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, contentServicesPage.doubleClickRow(uploadedFolder.entry.name)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(fileNames[2])];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow(fileNames[2])];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Delete')];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(fileNames[2])];
                        case 5:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C280567] Only one file is deleted when multiple files are selected using context menu', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, contentServicesPage.doubleClickRow(uploadedFolder.entry.name)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.getDocumentList().selectRow(fileNames[3])];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.getDocumentList().selectRow(fileNames[4])];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow(fileNames[3])];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Delete')];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(fileNames[3])];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(fileNames[4])];
                        case 7:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C280566] Should be able to open context menu with right click', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow(pdfFileModel.name)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Download')];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Copy')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Move')];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Delete')];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Info')];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Manage versions')];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Permission')];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Lock')];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.closeActionContext()];
                        case 10:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe('Folder Actions', function () {
            it('[C260138] Should be able to copy a folder', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, contentServicesPage.copyContent(folderName)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.checkDialogIsDisplayed()];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.typeIntoNodeSelectorSearchField(secondUploadedFolder.entry.name)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.clickContentNodeSelectorResult(secondUploadedFolder.entry.name)];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, contentNodeSelector.clickMoveCopyButton()];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderName)];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.doubleClickRow(secondUploadedFolder.entry.name)];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderName)];
                        case 8:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C260123] Should be able to delete a folder using context menu', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, contentServicesPage.deleteContent(folderName)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(folderName)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('[C280568] Should be able to open context menu with right click', function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(secondUploadedFolder.entry.name)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow(secondUploadedFolder.entry.name)];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Download')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Copy')];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Move')];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Delete')];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Info')];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Permission')];
                        case 8:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe('Folder Actions - Copy and Move', function () {
        var folderModel1 = new folderModel_1.FolderModel({ name: adf_testing_1.StringUtil.generateRandomString() });
        var folderModel2 = new folderModel_1.FolderModel({ name: adf_testing_1.StringUtil.generateRandomString() });
        var folderModel3 = new folderModel_1.FolderModel({ name: adf_testing_1.StringUtil.generateRandomString() });
        var folderModel4 = new folderModel_1.FolderModel({ name: adf_testing_1.StringUtil.generateRandomString() });
        var folderModel5 = new folderModel_1.FolderModel({ name: adf_testing_1.StringUtil.generateRandomString() });
        var folderModel6 = new folderModel_1.FolderModel({ name: adf_testing_1.StringUtil.generateRandomString() });
        var folder1, folder2, folder3, folder4, folder5, folder6;
        var folders;
        var contentServicesUser = new acsUserModel_1.AcsUserModel();
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(contentServicesUser)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.login(contentServicesUser.id, contentServicesUser.password)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.createFolder('A' + folderModel1.name, '-my-')];
                    case 4:
                        folder1 = _a.sent();
                        return [4 /*yield*/, uploadActions.createFolder('B' + folderModel2.name, '-my-')];
                    case 5:
                        folder2 = _a.sent();
                        return [4 /*yield*/, uploadActions.createFolder('C' + folderModel3.name, '-my-')];
                    case 6:
                        folder3 = _a.sent();
                        return [4 /*yield*/, uploadActions.createFolder('D' + folderModel4.name, '-my-')];
                    case 7:
                        folder4 = _a.sent();
                        return [4 /*yield*/, uploadActions.createFolder('E' + folderModel5.name, '-my-')];
                    case 8:
                        folder5 = _a.sent();
                        return [4 /*yield*/, uploadActions.createFolder('F' + folderModel6.name, '-my-')];
                    case 9:
                        folder6 = _a.sent();
                        folders = [folder1, folder2, folder3, folder4, folder5, folder6];
                        return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(contentServicesUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, paginationPage.selectItemsPerPage('5')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, contentListPage.waitForTableBody()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var _i, folders_1, folder;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _a.sent();
                        _i = 0, folders_1 = folders;
                        _a.label = 2;
                    case 2:
                        if (!(_i < folders_1.length)) return [3 /*break*/, 5];
                        folder = folders_1[_i];
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(folder.entry.id)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        it('[C260132] Move action on folder with - Load more', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_h.sent()]).toEqual('5')];
                    case 2:
                        _h.sent();
                        _b = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 3: return [4 /*yield*/, _b.apply(void 0, [_h.sent()]).toEqual('Showing 1-' + 5 + ' of ' + 6)];
                    case 4:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow('A' + folderModel1.name)];
                    case 5:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Move')];
                    case 6:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Move')];
                    case 7:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.checkDialogIsDisplayed()];
                    case 8:
                        _h.sent();
                        _c = expect;
                        return [4 /*yield*/, contentNodeSelector.getDialogHeaderText()];
                    case 9: return [4 /*yield*/, _c.apply(void 0, [_h.sent()]).toBe('Move \'' + 'A' + folderModel1.name + '\' to...')];
                    case 10:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.checkSearchInputIsDisplayed()];
                    case 11:
                        _h.sent();
                        _d = expect;
                        return [4 /*yield*/, contentNodeSelector.getSearchLabel()];
                    case 12: return [4 /*yield*/, _d.apply(void 0, [_h.sent()]).toBe('Search')];
                    case 13:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.checkSelectedSiteIsDisplayed('My files')];
                    case 14:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.checkCancelButtonIsDisplayed()];
                    case 15:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.checkMoveCopyButtonIsDisplayed()];
                    case 16:
                        _h.sent();
                        _e = expect;
                        return [4 /*yield*/, contentNodeSelector.getMoveCopyButtonText()];
                    case 17: return [4 /*yield*/, _e.apply(void 0, [_h.sent()]).toBe('MOVE')];
                    case 18:
                        _h.sent();
                        _f = expect;
                        return [4 /*yield*/, contentNodeSelector.numberOfResultsDisplayed()];
                    case 19: return [4 /*yield*/, _f.apply(void 0, [_h.sent()]).toBe(5)];
                    case 20:
                        _h.sent();
                        return [4 /*yield*/, infinitePaginationPage.clickLoadMoreButton()];
                    case 21:
                        _h.sent();
                        _g = expect;
                        return [4 /*yield*/, contentNodeSelector.numberOfResultsDisplayed()];
                    case 22: return [4 /*yield*/, _g.apply(void 0, [_h.sent()]).toBe(6)];
                    case 23:
                        _h.sent();
                        return [4 /*yield*/, infinitePaginationPage.checkLoadMoreButtonIsNotDisplayed()];
                    case 24:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.contentListPage().dataTablePage().selectRowByContent('F' + folderModel6.name)];
                    case 25:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected('F' + folderModel6.name)];
                    case 26:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.clickCancelButton()];
                    case 27:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.checkDialogIsNotDisplayed()];
                    case 28:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name)];
                    case 29:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow('A' + folderModel1.name)];
                    case 30:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Move')];
                    case 31:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Move')];
                    case 32:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.checkDialogIsDisplayed()];
                    case 33:
                        _h.sent();
                        return [4 /*yield*/, infinitePaginationPage.clickLoadMoreButton()];
                    case 34:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.contentListPage().dataTablePage().selectRowByContent('F' + folderModel6.name)];
                    case 35:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected('F' + folderModel6.name)];
                    case 36:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.clickMoveCopyButton()];
                    case 37:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed('A' + folderModel1.name)];
                    case 38:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.doubleClickRow('F' + folderModel6.name)];
                    case 39:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name)];
                    case 40:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow('A' + folderModel1.name)];
                    case 41:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Move')];
                    case 42:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Move')];
                    case 43:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.checkDialogIsDisplayed()];
                    case 44:
                        _h.sent();
                        return [4 /*yield*/, breadCrumbDropdownPage.clickParentFolder()];
                    case 45:
                        _h.sent();
                        return [4 /*yield*/, breadCrumbDropdownPage.checkBreadCrumbDropdownIsDisplayed()];
                    case 46:
                        _h.sent();
                        return [4 /*yield*/, breadCrumbDropdownPage.choosePath(contentServicesUser.id)];
                    case 47:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.clickMoveCopyButton()];
                    case 48:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed('A' + folderModel1.name)];
                    case 49:
                        _h.sent();
                        return [4 /*yield*/, breadCrumbPage.chooseBreadCrumb(contentServicesUser.id)];
                    case 50:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                    case 51:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name)];
                    case 52:
                        _h.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C305051] Copy action on folder with - Load more', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_h.sent()]).toEqual('5')];
                    case 2:
                        _h.sent();
                        _b = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 3: return [4 /*yield*/, _b.apply(void 0, [_h.sent()]).toEqual('Showing 1-' + 5 + ' of ' + 6)];
                    case 4:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow('A' + folderModel1.name)];
                    case 5:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Copy')];
                    case 6:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Copy')];
                    case 7:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.checkDialogIsDisplayed()];
                    case 8:
                        _h.sent();
                        _c = expect;
                        return [4 /*yield*/, contentNodeSelector.getDialogHeaderText()];
                    case 9: return [4 /*yield*/, _c.apply(void 0, [_h.sent()]).toBe('Copy \'' + 'A' + folderModel1.name + '\' to...')];
                    case 10:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.checkSearchInputIsDisplayed()];
                    case 11:
                        _h.sent();
                        _d = expect;
                        return [4 /*yield*/, contentNodeSelector.getSearchLabel()];
                    case 12: return [4 /*yield*/, _d.apply(void 0, [_h.sent()]).toBe('Search')];
                    case 13:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.checkSelectedSiteIsDisplayed('My files')];
                    case 14:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.checkCancelButtonIsDisplayed()];
                    case 15:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.checkMoveCopyButtonIsDisplayed()];
                    case 16:
                        _h.sent();
                        _e = expect;
                        return [4 /*yield*/, contentNodeSelector.getMoveCopyButtonText()];
                    case 17: return [4 /*yield*/, _e.apply(void 0, [_h.sent()]).toBe('COPY')];
                    case 18:
                        _h.sent();
                        _f = expect;
                        return [4 /*yield*/, contentNodeSelector.numberOfResultsDisplayed()];
                    case 19: return [4 /*yield*/, _f.apply(void 0, [_h.sent()]).toBe(5)];
                    case 20:
                        _h.sent();
                        return [4 /*yield*/, infinitePaginationPage.clickLoadMoreButton()];
                    case 21:
                        _h.sent();
                        _g = expect;
                        return [4 /*yield*/, contentNodeSelector.numberOfResultsDisplayed()];
                    case 22: return [4 /*yield*/, _g.apply(void 0, [_h.sent()]).toBe(6)];
                    case 23:
                        _h.sent();
                        return [4 /*yield*/, infinitePaginationPage.checkLoadMoreButtonIsNotDisplayed()];
                    case 24:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.contentListPage().dataTablePage().selectRowByContent('F' + folderModel6.name)];
                    case 25:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected('F' + folderModel6.name)];
                    case 26:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.clickCancelButton()];
                    case 27:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.checkDialogIsNotDisplayed()];
                    case 28:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name)];
                    case 29:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow('A' + folderModel1.name)];
                    case 30:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Copy')];
                    case 31:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Copy')];
                    case 32:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.checkDialogIsDisplayed()];
                    case 33:
                        _h.sent();
                        return [4 /*yield*/, infinitePaginationPage.clickLoadMoreButton()];
                    case 34:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.contentListPage().dataTablePage().selectRowByContent('F' + folderModel6.name)];
                    case 35:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected('F' + folderModel6.name)];
                    case 36:
                        _h.sent();
                        return [4 /*yield*/, contentNodeSelector.clickMoveCopyButton()];
                    case 37:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name)];
                    case 38:
                        _h.sent();
                        return [4 /*yield*/, paginationPage.clickOnNextPage()];
                    case 39:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.getDocumentList().waitForTableBody()];
                    case 40:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.doubleClickRow('F' + folderModel6.name)];
                    case 41:
                        _h.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed('A' + folderModel1.name)];
                    case 42:
                        _h.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=document-list-actions.e2e.js.map