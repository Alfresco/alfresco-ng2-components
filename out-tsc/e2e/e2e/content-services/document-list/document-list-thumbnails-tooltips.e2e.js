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
var protractor_1 = require("protractor");
var resources = require("../../util/resources");
var adf_testing_1 = require("@alfresco/adf-testing");
var js_api_1 = require("@alfresco/js-api");
var fileModel_1 = require("../../models/ACS/fileModel");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
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
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
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
    describe('Thumbnails and tooltips', function () {
        var pdfFile = new fileModel_1.FileModel({
            name: resources.Files.ADF_DOCUMENTS.PDF.file_name,
            location: resources.Files.ADF_DOCUMENTS.PDF.file_location
        });
        var testFile = new fileModel_1.FileModel({
            name: resources.Files.ADF_DOCUMENTS.TEST.file_name,
            location: resources.Files.ADF_DOCUMENTS.TEST.file_location
        });
        var docxFile = new fileModel_1.FileModel({
            name: resources.Files.ADF_DOCUMENTS.DOCX.file_name,
            location: resources.Files.ADF_DOCUMENTS.DOCX.file_location
        });
        var folderName = "MEESEEKS_" + adf_testing_1.StringUtil.generateRandomString(5) + "_LOOK_AT_ME";
        var filePdfNode, fileTestNode, fileDocxNode, folderNode;
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
                        return [4 /*yield*/, uploadActions.uploadFile(pdfFile.location, pdfFile.name, '-my-')];
                    case 4:
                        filePdfNode = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(testFile.location, testFile.name, '-my-')];
                    case 5:
                        fileTestNode = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(docxFile.location, docxFile.name, '-my-')];
                    case 6:
                        fileDocxNode = _a.sent();
                        return [4 /*yield*/, uploadActions.createFolder(folderName, '-my-')];
                    case 7:
                        folderNode = _a.sent();
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
                        return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 2:
                        _a.sent();
                        if (!filePdfNode) return [3 /*break*/, 4];
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(filePdfNode.entry.id)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        if (!fileTestNode) return [3 /*break*/, 6];
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(fileTestNode.entry.id)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        if (!fileDocxNode) return [3 /*break*/, 8];
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(fileDocxNode.entry.id)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        if (!folderNode) return [3 /*break*/, 10];
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(folderNode.entry.id)];
                    case 9:
                        _a.sent();
                        _a.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260108] Should display tooltip for file\'s name', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.getDocumentList().getTooltip(pdfFile.name)];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(pdfFile.name)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260109] Should display tooltip for folder\'s name', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.getDocumentList().getTooltip(folderName)];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual(folderName)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260119] Should have a specific thumbnail for folders', function () { return __awaiter(_this, void 0, void 0, function () {
            var folderIconUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.getRowIconImageUrl(folderName)];
                    case 1:
                        folderIconUrl = _a.sent();
                        return [4 /*yield*/, expect(folderIconUrl).toContain('/assets/images/ft_ic_folder.svg')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280066] Should have a specific thumbnail PDF files', function () { return __awaiter(_this, void 0, void 0, function () {
            var fileIconUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.getRowIconImageUrl(pdfFile.name)];
                    case 1:
                        fileIconUrl = _a.sent();
                        return [4 /*yield*/, expect(fileIconUrl).toContain('/assets/images/ft_ic_pdf.svg')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280067] Should have a specific thumbnail DOCX files', function () { return __awaiter(_this, void 0, void 0, function () {
            var fileIconUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.getRowIconImageUrl(docxFile.name)];
                    case 1:
                        fileIconUrl = _a.sent();
                        return [4 /*yield*/, expect(fileIconUrl).toContain('/assets/images/ft_ic_ms_word.svg')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280068] Should have a specific thumbnail files', function () { return __awaiter(_this, void 0, void 0, function () {
            var fileIconUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.getRowIconImageUrl(testFile.name)];
                    case 1:
                        fileIconUrl = _a.sent();
                        return [4 /*yield*/, expect(fileIconUrl).toContain('/assets/images/ft_ic_document.svg')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C274701] Should be able to enable thumbnails', function () { return __awaiter(_this, void 0, void 0, function () {
            var fileIconUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.enableThumbnails()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.getRowIconImageUrl(pdfFile.name)];
                    case 3:
                        fileIconUrl = _a.sent();
                        return [4 /*yield*/, expect(fileIconUrl).toContain("/versions/1/nodes/" + filePdfNode.entry.id + "/renditions")];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=document-list-thumbnails-tooltips.e2e.js.map