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
var viewerPage_1 = require("../../pages/adf/viewerPage");
var protractor_1 = require("protractor");
var resources = require("../../util/resources");
var adf_testing_1 = require("@alfresco/adf-testing");
var js_api_1 = require("@alfresco/js-api");
var fileModel_1 = require("../../models/ACS/fileModel");
var moment_es6_1 = require("moment-es6");
describe('Document List Component', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var uploadedFolder, uploadedFolderExtra;
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var acsUser = null;
    var testFileNode, pdfBFileNode;
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    if (!uploadedFolder) return [3 /*break*/, 3];
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(uploadedFolder.entry.id)];
                case 2:
                    _a.sent();
                    uploadedFolder = null;
                    _a.label = 3;
                case 3:
                    if (!uploadedFolderExtra) return [3 /*break*/, 5];
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(uploadedFolderExtra.entry.id)];
                case 4:
                    _a.sent();
                    uploadedFolderExtra = null;
                    _a.label = 5;
                case 5:
                    if (!testFileNode) return [3 /*break*/, 7];
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(testFileNode.entry.id)];
                case 6:
                    _a.sent();
                    testFileNode = null;
                    _a.label = 7;
                case 7:
                    if (!pdfBFileNode) return [3 /*break*/, 9];
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(pdfBFileNode.entry.id)];
                case 8:
                    _a.sent();
                    pdfBFileNode = null;
                    _a.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    }); });
    describe('Custom Column', function () {
        var folderName;
        var pdfFileModel = new fileModel_1.FileModel({
            name: resources.Files.ADF_DOCUMENTS.PDF.file_name,
            location: resources.Files.ADF_DOCUMENTS.PDF.file_location
        });
        var docxFileModel = new fileModel_1.FileModel({
            name: resources.Files.ADF_DOCUMENTS.DOCX.file_name,
            location: resources.Files.ADF_DOCUMENTS.DOCX.file_location
        });
        var timeAgoFileModel = new fileModel_1.FileModel({
            name: resources.Files.ADF_DOCUMENTS.TEST.file_name,
            location: resources.Files.ADF_DOCUMENTS.TEST.file_location
        });
        var mediumFileModel = new fileModel_1.FileModel({
            name: resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
            location: resources.Files.ADF_DOCUMENTS.PDF_B.file_location
        });
        var pdfUploadedNode, docxUploadedNode, timeAgoUploadedNode, mediumDateUploadedNode;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        acsUser = new acsUserModel_1.AcsUserModel();
                        /* cspell:disable-next-line */
                        folderName = "MEESEEKS_" + adf_testing_1.StringUtil.generateRandomString(5) + "_LOOK_AT_ME";
                        return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.createFolder(folderName, '-my-')];
                    case 4:
                        uploadedFolder = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, '-my-')];
                    case 5:
                        pdfUploadedNode = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(docxFileModel.location, docxFileModel.name, '-my-')];
                    case 6:
                        docxUploadedNode = _a.sent();
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
                        if (!pdfUploadedNode) return [3 /*break*/, 3];
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(pdfUploadedNode.entry.id)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!docxUploadedNode) return [3 /*break*/, 5];
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(docxUploadedNode.entry.id)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!timeAgoUploadedNode) return [3 /*break*/, 7];
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(timeAgoUploadedNode.entry.id)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        if (!mediumDateUploadedNode) return [3 /*break*/, 9];
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(mediumDateUploadedNode.entry.id)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279926] Should only display the user\'s files and folders', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderName)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pdfFileModel.name)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(docxFileModel.name)];
                    case 4:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.getDocumentListRowNumber()];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(4)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279927] Should display default columns', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkColumnNameHeader()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkColumnSizeHeader()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkColumnCreatedByHeader()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkColumnCreatedHeader()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279928] Should be able to display date with timeAgo', function () { return __awaiter(_this, void 0, void 0, function () {
            var dateValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(timeAgoFileModel.location, timeAgoFileModel.name, '-my-')];
                    case 2:
                        timeAgoUploadedNode = _a.sent();
                        return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.getColumnValueForRow(timeAgoFileModel.name, 'Created')];
                    case 4:
                        dateValue = _a.sent();
                        return [4 /*yield*/, expect(dateValue).toMatch(/(ago|few)/)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279929] Should be able to display the date with date type', function () { return __awaiter(_this, void 0, void 0, function () {
            var createdDate, dateValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(mediumFileModel.location, mediumFileModel.name, '-my-')];
                    case 2:
                        mediumDateUploadedNode = _a.sent();
                        createdDate = moment_es6_1.default(mediumDateUploadedNode.createdAt).format('ll');
                        return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.enableMediumTimeFormat()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.getColumnValueForRow(mediumFileModel.name, 'Created')];
                    case 5:
                        dateValue = _a.sent();
                        return [4 /*yield*/, expect(dateValue).toContain(createdDate)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Column Sorting', function () {
        var fakeFileA = new fileModel_1.FileModel({
            name: 'A',
            location: resources.Files.ADF_DOCUMENTS.TEST.file_location
        });
        var fakeFileB = new fileModel_1.FileModel({
            name: 'B',
            location: resources.Files.ADF_DOCUMENTS.TEST.file_location
        });
        var fakeFileC = new fileModel_1.FileModel({
            name: 'C',
            location: resources.Files.ADF_DOCUMENTS.TEST.file_location
        });
        var fileANode, fileBNode, fileCNode;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = new acsUserModel_1.AcsUserModel();
                        return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(user)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.login(user.id, user.password)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(fakeFileA.location, fakeFileA.name, '-my-')];
                    case 4:
                        fileANode = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(fakeFileB.location, fakeFileB.name, '-my-')];
                    case 5:
                        fileBNode = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(fakeFileC.location, fakeFileC.name, '-my-')];
                    case 6:
                        fileCNode = _a.sent();
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(user)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.goToDocumentList()];
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
                        if (!fileANode) return [3 /*break*/, 3];
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(fileANode.entry.id)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!fileBNode) return [3 /*break*/, 5];
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(fileBNode.entry.id)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!fileCNode) return [3 /*break*/, 7];
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(fileCNode.entry.id)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        it('[C260112] Should be able to sort by name (Ascending)', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.sortAndCheckListIsOrderedByName('asc')];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true, 'List is not sorted.')];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272770] Should be able to sort by name (Descending)', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.sortAndCheckListIsOrderedByName('desc')];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true, 'List is not sorted.')];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272771] Should be able to sort by author (Ascending)', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.sortAndCheckListIsOrderedByAuthor('asc')];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true, 'List is not sorted.')];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272772] Should be able to sort by author (Descending)', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.sortAndCheckListIsOrderedByAuthor('desc')];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true, 'List is not sorted.')];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272773] Should be able to sort by date (Ascending)', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.sortAndCheckListIsOrderedByCreated('asc')];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true, 'List is not sorted.')];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272774] Should be able to sort by date (Descending)', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.sortAndCheckListIsOrderedByCreated('desc')];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true, 'List is not sorted.')];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('[C279959] Should display empty folder state for new folders', function () { return __awaiter(_this, void 0, void 0, function () {
        var folderName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    acsUser = new acsUserModel_1.AcsUserModel();
                    folderName = 'BANANA';
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.createNewFolder(folderName)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.doubleClickRow(folderName)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkEmptyFolderTextToBe('This folder is empty')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkEmptyFolderImageUrlToContain('/assets/images/empty_doc_lib.svg')];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C272775] Should be able to upload a file in new folder', function () { return __awaiter(_this, void 0, void 0, function () {
        var testFile, folderName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testFile = new fileModel_1.FileModel({
                        name: resources.Files.ADF_DOCUMENTS.TEST.file_name,
                        location: resources.Files.ADF_DOCUMENTS.TEST.file_location
                    });
                    acsUser = new acsUserModel_1.AcsUserModel();
                    folderName = "MEESEEKS_" + adf_testing_1.StringUtil.generateRandomString(5) + "_LOOK_AT_ME";
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(folderName, '-my-')];
                case 4:
                    uploadedFolder = _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(uploadedFolder.entry.name)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.doubleClickRow(uploadedFolder.entry.name)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.uploadFile(testFile.location)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(testFile.name)];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C261997] Should be able to clean Recent Files history', function () { return __awaiter(_this, void 0, void 0, function () {
        var icon;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    acsUser = new acsUserModel_1.AcsUserModel();
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.clickOnContentServices()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkRecentFileToBeShowed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getRecentFileIcon()];
                case 6:
                    icon = _a.sent();
                    return [4 /*yield*/, expect(icon).toBe('history')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.expandRecentFiles()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkEmptyRecentFileIsDisplayed()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.closeRecentFiles()];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279970] Should display Islocked field for folders', function () { return __awaiter(_this, void 0, void 0, function () {
        var folderNameA, folderNameB;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    acsUser = new acsUserModel_1.AcsUserModel();
                    folderNameA = "MEESEEKS_" + adf_testing_1.StringUtil.generateRandomString(5) + "_LOOK_AT_ME";
                    folderNameB = "MEESEEKS_" + adf_testing_1.StringUtil.generateRandomString(5) + "_LOOK_AT_ME";
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(folderNameA, '-my-')];
                case 4:
                    uploadedFolder = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(folderNameB, '-my-')];
                case 5:
                    uploadedFolderExtra = _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderNameA)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderNameB)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkLockIsDisplayedForElement(folderNameA)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkLockIsDisplayedForElement(folderNameB)];
                case 11:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C269086] Should display Islocked field for files', function () { return __awaiter(_this, void 0, void 0, function () {
        var testFileA, testFileB;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testFileA = new fileModel_1.FileModel({
                        name: resources.Files.ADF_DOCUMENTS.TEST.file_name,
                        location: resources.Files.ADF_DOCUMENTS.TEST.file_location
                    });
                    testFileB = new fileModel_1.FileModel({
                        name: resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
                        location: resources.Files.ADF_DOCUMENTS.PDF_B.file_location
                    });
                    acsUser = new acsUserModel_1.AcsUserModel();
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(testFileA.location, testFileA.name, '-my-')];
                case 4:
                    testFileNode = _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(testFileB.location, testFileB.name, '-my-')];
                case 5:
                    pdfBFileNode = _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(testFileA.name)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(testFileB.name)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkLockIsDisplayedForElement(testFileA.name)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkLockIsDisplayedForElement(testFileB.name)];
                case 11:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Once uploaded 20 folders', function () {
        var folderCreated;
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var folderName, folder, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        acsUser = new acsUserModel_1.AcsUserModel();
                        folderCreated = [];
                        return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                    case 3:
                        _a.sent();
                        folderName = '';
                        folder = null;
                        i = 0;
                        _a.label = 4;
                    case 4:
                        if (!(i < 20)) return [3 /*break*/, 7];
                        folderName = "MEESEEKS_000" + i;
                        return [4 /*yield*/, uploadActions.createFolder(folderName, '-my-')];
                    case 5:
                        folder = _a.sent();
                        folderCreated.push(folder);
                        _a.label = 6;
                    case 6:
                        i++;
                        return [3 /*break*/, 4];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(folderCreated.map(function (folder) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, uploadActions.deleteFileOrFolder(folder.entry.id)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); })).then(function () {
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C277093] Should sort files with Items per page set to default', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkListIsSortedByNameColumn('asc')];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Column Template', function () {
        var file0BytesModel = new fileModel_1.FileModel({
            name: resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
            location: resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
        });
        var file;
        var viewer = new viewerPage_1.ViewerPage();
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        acsUser = new acsUserModel_1.AcsUserModel();
                        return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(file0BytesModel.location, file0BytesModel.name, '-my-')];
                    case 4:
                        file = _a.sent();
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291843] Should be able to navigate using nodes hyperlink when activated', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.clickHyperlinkNavigationToggle()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkFileHyperlinkIsEnabled(file.entry.name)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.clickFileHyperlink(file.entry.name)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, viewer.checkFileIsLoaded()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=document-list-component.e2e.js.map