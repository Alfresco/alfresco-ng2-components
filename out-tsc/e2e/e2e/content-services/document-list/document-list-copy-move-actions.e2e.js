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
describe('Document List Component', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var contentNodeSelector = new adf_testing_1.ContentNodeSelectorDialogPage();
    var notificationHistoryPage = new adf_testing_1.NotificationHistoryPage();
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var uploadedFolder, uploadedFile, sourceFolder, destinationFolder, subFolder, subFolder2, copyFolder, subFile, duplicateFolderName;
    var acsUser = null, anotherAcsUser;
    var folderName, sameNameFolder;
    var pdfFileModel = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.PDF.file_name,
        location: resources.Files.ADF_DOCUMENTS.PDF.file_location
    });
    var testFileModel = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.TEST.file_name,
        location: resources.Files.ADF_DOCUMENTS.TEST.file_location
    });
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    acsUser = new acsUserModel_1.AcsUserModel();
                    anotherAcsUser = new acsUserModel_1.AcsUserModel();
                    folderName = adf_testing_1.StringUtil.generateRandomString(5);
                    sameNameFolder = adf_testing_1.StringUtil.generateRandomString(5);
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
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
                    uploadedFolder = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), '-my-')];
                case 6:
                    destinationFolder = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), '-my-')];
                case 7:
                    sourceFolder = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(sameNameFolder, sourceFolder.entry.id)];
                case 8:
                    subFolder = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), subFolder.entry.id)];
                case 9:
                    subFolder2 = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), sourceFolder.entry.id)];
                case 10:
                    copyFolder = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(sameNameFolder, '-my-')];
                case 11:
                    duplicateFolderName = _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(testFileModel.location, testFileModel.name, subFolder.entry.id)];
                case 12:
                    subFile = _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, uploadedFolder.entry.id)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(pdfFileModel.location, pdfFileModel.name, '-my-')];
                case 14:
                    uploadedFile = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.updateNode(sourceFolder.entry.id, {
                            permissions: {
                                locallySet: [{
                                        authorityId: anotherAcsUser.getId(),
                                        name: 'Consumer',
                                        accessStatus: 'ALLOWED'
                                    }]
                            }
                        })];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.driver.sleep(12000)];
                case 16:
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
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(uploadedFolder.entry.id)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(uploadedFile.entry.id)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(sourceFolder.entry.id)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(destinationFolder.entry.id)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Document List Component - Actions Move and Copy', function () {
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                    case 1:
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
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260128] Move - Same name file', function () { return __awaiter(_this, void 0, void 0, function () {
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
                        return [4 /*yield*/, contentNodeSelector.clickContentNodeSelectorResult(folderName)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, contentNodeSelector.clickMoveCopyButton()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('This name is already in use, try a different name.')];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260134] Move - folder with subfolder and file within it', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(destinationFolder.entry.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(sourceFolder.entry.name)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow(sourceFolder.entry.name)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Move')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, contentNodeSelector.checkDialogIsDisplayed()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, contentNodeSelector.typeIntoNodeSelectorSearchField(destinationFolder.entry.name)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, contentNodeSelector.clickContentNodeSelectorResult(destinationFolder.entry.name)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, contentNodeSelector.clickMoveCopyButton()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(sourceFolder.entry.name)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.doubleClickRow(destinationFolder.entry.name)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(sourceFolder.entry.name)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.doubleClickRow(sourceFolder.entry.name)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(subFolder.entry.name)];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.doubleClickRow(subFolder.entry.name)];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(subFile.entry.name)];
                    case 15:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260135] Move - Same name folder', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(duplicateFolderName.entry.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow(duplicateFolderName.entry.name)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Move')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentNodeSelector.checkDialogIsDisplayed()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, contentNodeSelector.typeIntoNodeSelectorSearchField(sourceFolder.entry.name)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, contentNodeSelector.clickContentNodeSelectorResult(sourceFolder.entry.name)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, contentNodeSelector.clickMoveCopyButton()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('This name is already in use, try a different name.')];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260129] Copy - Same name file', function () { return __awaiter(_this, void 0, void 0, function () {
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
                        return [4 /*yield*/, contentNodeSelector.clickContentNodeSelectorResult(folderName)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, contentNodeSelector.clickMoveCopyButton()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('This name is already in use, try a different name.')];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260136] Copy - Same name folder', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(duplicateFolderName.entry.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow(duplicateFolderName.entry.name)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Copy')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentNodeSelector.checkDialogIsDisplayed()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, contentNodeSelector.typeIntoNodeSelectorSearchField(sourceFolder.entry.name)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, contentNodeSelector.clickContentNodeSelectorResult(sourceFolder.entry.name)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, contentNodeSelector.clickMoveCopyButton()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('This name is already in use, try a different name.')];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Document List actionns - Move, Copy on no permission folder', function () {
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(anotherAcsUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + "/files/" + sourceFolder.entry.id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260133] Move - no permission folder', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(subFolder.entry.name)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow(subFolder.entry.name)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Move')];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.checkContextActionIsEnabled('Move')];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(false)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.closeActionContext()];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260140] Copy - No permission folder', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(subFolder.entry.name)];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(copyFolder.entry.name)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow(copyFolder.entry.name)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, contentServicesPage.checkContextActionIsVisible('Copy')];
                    case 4:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.checkContextActionIsEnabled('Copy')];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Copy')];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, contentNodeSelector.checkDialogIsDisplayed()];
                    case 8:
                        _c.sent();
                        return [4 /*yield*/, contentNodeSelector.contentListPage().dataTablePage().checkRowContentIsDisplayed(subFolder.entry.name)];
                    case 9:
                        _c.sent();
                        return [4 /*yield*/, contentNodeSelector.contentListPage().dataTablePage().checkRowContentIsDisabled(subFolder.entry.name)];
                    case 10:
                        _c.sent();
                        return [4 /*yield*/, contentNodeSelector.clickContentNodeSelectorResult(subFolder.entry.name)];
                    case 11:
                        _c.sent();
                        return [4 /*yield*/, contentNodeSelector.contentListPage().dataTablePage().checkRowByContentIsSelected(subFolder.entry.name)];
                    case 12:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, contentNodeSelector.checkCopyMoveButtonIsEnabled()];
                    case 13: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(false)];
                    case 14:
                        _c.sent();
                        return [4 /*yield*/, contentNodeSelector.contentListPage().dataTablePage().doubleClickRowByContent(subFolder.entry.name)];
                    case 15:
                        _c.sent();
                        return [4 /*yield*/, contentNodeSelector.contentListPage().dataTablePage().waitTillContentLoaded()];
                    case 16:
                        _c.sent();
                        return [4 /*yield*/, contentNodeSelector.contentListPage().dataTablePage().checkRowContentIsDisplayed(subFolder2.entry.name)];
                    case 17:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=document-list-copy-move-actions.e2e.js.map