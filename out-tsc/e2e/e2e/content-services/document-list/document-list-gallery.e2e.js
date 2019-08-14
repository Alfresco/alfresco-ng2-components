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
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var acsUser = null;
    var navBar = new navigationBarPage_1.NavigationBarPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    describe('Gallery View', function () {
        var cardProperties = {
            DISPLAY_NAME: 'Display name',
            SIZE: 'Size',
            LOCK: 'Lock',
            CREATED_BY: 'Created by',
            CREATED: 'Created'
        };
        var funnyUser;
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
        var filePdfNode, fileTestNode, fileDocxNode, folderNode, filePDFSubNode;
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
                        funnyUser = _a.sent();
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
                        return [4 /*yield*/, uploadActions.uploadFile(pdfFile.location, pdfFile.name, folderNode.entry.id)];
                    case 8:
                        filePDFSubNode = _a.sent();
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
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
                    case 0: return [4 /*yield*/, navBar.clickHomeButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.clickGridViewButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkCardViewContainerIsDisplayed()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280016] Should be able to choose Gallery View', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.getCardElementShowedInPage()];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(4)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280023] Gallery Card should show details', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.getDocumentCardIconForElement(folderName)];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toContain('/assets/images/ft_ic_folder.svg')];
                    case 2:
                        _e.sent();
                        _b = expect;
                        return [4 /*yield*/, contentServicesPage.getDocumentCardIconForElement(pdfFile.name)];
                    case 3: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toContain('/assets/images/ft_ic_pdf.svg')];
                    case 4:
                        _e.sent();
                        _c = expect;
                        return [4 /*yield*/, contentServicesPage.getDocumentCardIconForElement(docxFile.name)];
                    case 5: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toContain('/assets/images/ft_ic_ms_word.svg')];
                    case 6:
                        _e.sent();
                        _d = expect;
                        return [4 /*yield*/, contentServicesPage.getDocumentCardIconForElement(testFile.name)];
                    case 7: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toContain('/assets/images/ft_ic_document.svg')];
                    case 8:
                        _e.sent();
                        return [4 /*yield*/, contentServicesPage.checkMenuIsShowedForElementIndex(0)];
                    case 9:
                        _e.sent();
                        return [4 /*yield*/, contentServicesPage.checkMenuIsShowedForElementIndex(1)];
                    case 10:
                        _e.sent();
                        return [4 /*yield*/, contentServicesPage.checkMenuIsShowedForElementIndex(2)];
                    case 11:
                        _e.sent();
                        return [4 /*yield*/, contentServicesPage.checkMenuIsShowedForElementIndex(3)];
                    case 12:
                        _e.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280069] Gallery Card should show attributes', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            return __generator(this, function (_r) {
                switch (_r.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.checkDocumentCardPropertyIsShowed(folderName, cardProperties.DISPLAY_NAME)];
                    case 1:
                        _r.sent();
                        return [4 /*yield*/, contentServicesPage.checkDocumentCardPropertyIsShowed(folderName, cardProperties.SIZE)];
                    case 2:
                        _r.sent();
                        return [4 /*yield*/, contentServicesPage.checkDocumentCardPropertyIsShowed(folderName, cardProperties.CREATED_BY)];
                    case 3:
                        _r.sent();
                        return [4 /*yield*/, contentServicesPage.checkDocumentCardPropertyIsShowed(folderName, cardProperties.CREATED)];
                    case 4:
                        _r.sent();
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.getAttributeValueForElement(folderName, cardProperties.DISPLAY_NAME)];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_r.sent()]).toBe(folderName)];
                    case 6:
                        _r.sent();
                        _b = expect;
                        return [4 /*yield*/, contentServicesPage.getAttributeValueForElement(folderName, cardProperties.CREATED_BY)];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_r.sent()]).toBe(funnyUser.entry.firstName + " " + funnyUser.entry.lastName)];
                    case 8:
                        _r.sent();
                        _c = expect;
                        return [4 /*yield*/, contentServicesPage.getAttributeValueForElement(folderName, cardProperties.CREATED)];
                    case 9: return [4 /*yield*/, _c.apply(void 0, [_r.sent()]).toMatch(/(ago|few)/)];
                    case 10:
                        _r.sent();
                        _d = expect;
                        return [4 /*yield*/, contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.DISPLAY_NAME)];
                    case 11: return [4 /*yield*/, _d.apply(void 0, [_r.sent()]).toBe(pdfFile.name)];
                    case 12:
                        _r.sent();
                        _e = expect;
                        return [4 /*yield*/, contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.SIZE)];
                    case 13: return [4 /*yield*/, _e.apply(void 0, [_r.sent()]).toBe("105.02 KB")];
                    case 14:
                        _r.sent();
                        _f = expect;
                        return [4 /*yield*/, contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.CREATED_BY)];
                    case 15: return [4 /*yield*/, _f.apply(void 0, [_r.sent()]).toBe(funnyUser.entry.firstName + " " + funnyUser.entry.lastName)];
                    case 16:
                        _r.sent();
                        _g = expect;
                        return [4 /*yield*/, contentServicesPage.getAttributeValueForElement(pdfFile.name, cardProperties.CREATED)];
                    case 17: return [4 /*yield*/, _g.apply(void 0, [_r.sent()]).toMatch(/(ago|few)/)];
                    case 18:
                        _r.sent();
                        _h = expect;
                        return [4 /*yield*/, contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.DISPLAY_NAME)];
                    case 19: return [4 /*yield*/, _h.apply(void 0, [_r.sent()]).toBe(docxFile.name)];
                    case 20:
                        _r.sent();
                        _j = expect;
                        return [4 /*yield*/, contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.SIZE)];
                    case 21: return [4 /*yield*/, _j.apply(void 0, [_r.sent()]).toBe("81.05 KB")];
                    case 22:
                        _r.sent();
                        _k = expect;
                        return [4 /*yield*/, contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.CREATED_BY)];
                    case 23: return [4 /*yield*/, _k.apply(void 0, [_r.sent()])
                            .toBe(funnyUser.entry.firstName + " " + funnyUser.entry.lastName)];
                    case 24:
                        _r.sent();
                        _l = expect;
                        return [4 /*yield*/, contentServicesPage.getAttributeValueForElement(docxFile.name, cardProperties.CREATED)];
                    case 25: return [4 /*yield*/, _l.apply(void 0, [_r.sent()]).toMatch(/(ago|few)/)];
                    case 26:
                        _r.sent();
                        _m = expect;
                        return [4 /*yield*/, contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.DISPLAY_NAME)];
                    case 27: return [4 /*yield*/, _m.apply(void 0, [_r.sent()]).toBe(testFile.name)];
                    case 28:
                        _r.sent();
                        _o = expect;
                        return [4 /*yield*/, contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.SIZE)];
                    case 29: return [4 /*yield*/, _o.apply(void 0, [_r.sent()]).toBe("14 Bytes")];
                    case 30:
                        _r.sent();
                        _p = expect;
                        return [4 /*yield*/, contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.CREATED_BY)];
                    case 31: return [4 /*yield*/, _p.apply(void 0, [_r.sent()])
                            .toBe(funnyUser.entry.firstName + " " + funnyUser.entry.lastName)];
                    case 32:
                        _r.sent();
                        _q = expect;
                        return [4 /*yield*/, contentServicesPage.getAttributeValueForElement(testFile.name, cardProperties.CREATED)];
                    case 33: return [4 /*yield*/, _q.apply(void 0, [_r.sent()]).toMatch(/(ago|few)/)];
                    case 34:
                        _r.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280129] Should keep Gallery View when accessing a folder', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.navigateToCardFolder(folderName)];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.getCardElementShowedInPage()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(1)];
                    case 3:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, contentServicesPage.getDocumentCardIconForElement(pdfFile.name)];
                    case 4: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toContain('/assets/images/ft_ic_pdf.svg')];
                    case 5:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C280130] Should be able to go back to List View', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.clickGridViewButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.doubleClickRow(folderName)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkRowIsDisplayed(pdfFile.name)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C261993] Should be able to sort Gallery Cards by display name', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.selectGridSortingFromDropdown(cardProperties.DISPLAY_NAME)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkListIsSortedByNameColumn('asc')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C261994] Should be able to sort Gallery Cards by size', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.selectGridSortingFromDropdown(cardProperties.SIZE)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkListIsSortedBySizeColumn('asc')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C261995] Should be able to sort Gallery Cards by author', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.selectGridSortingFromDropdown(cardProperties.CREATED_BY)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkListIsSortedByAuthorColumn('asc')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C261996] Should be able to sort Gallery Cards by created date', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.selectGridSortingFromDropdown(cardProperties.CREATED)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkListIsSortedByCreatedColumn('asc')];
                    case 2:
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
                        if (!filePdfNode) return [3 /*break*/, 3];
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(filePdfNode.entry.id)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!fileTestNode) return [3 /*break*/, 5];
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(fileTestNode.entry.id)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (!fileDocxNode) return [3 /*break*/, 7];
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(fileDocxNode.entry.id)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7:
                        if (!filePDFSubNode) return [3 /*break*/, 9];
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(filePDFSubNode.entry.id)];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        if (!folderNode) return [3 /*break*/, 11];
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(folderNode.entry.id)];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=document-list-gallery.e2e.js.map