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
var contentServicesPage_1 = require("../../pages/adf/contentServicesPage");
var folderDialog_1 = require("../../pages/adf/dialog/folderDialog");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var js_api_1 = require("@alfresco/js-api");
var protractor_1 = require("protractor");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var fileModel_1 = require("../../models/ACS/fileModel");
var resources = require("../../util/resources");
describe('Edit folder directive', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var editFolderDialog = new folderDialog_1.FolderDialog();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var anotherAcsUser = new acsUserModel_1.AcsUserModel();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var notificationHistoryPage = new adf_testing_1.NotificationHistoryPage();
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var pdfFile = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.PDF.file_name,
        location: resources.Files.ADF_DOCUMENTS.PDF.file_location
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var updateFolderName = adf_testing_1.StringUtil.generateRandomString(5);
    var editFolder, anotherFolder, filePdfNode, subFolder;
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
                    return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), '-my-')];
                case 5:
                    editFolder = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), '-my-')];
                case 6:
                    anotherFolder = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), editFolder.entry.id)];
                case 7:
                    subFolder = _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(pdfFile.location, pdfFile.name, '-my-')];
                case 8:
                    filePdfNode = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.nodesApi.updateNode(editFolder.entry.id, {
                            permissions: {
                                locallySet: [{
                                        authorityId: anotherAcsUser.getId(),
                                        name: 'Consumer',
                                        accessStatus: 'ALLOWED'
                                    }]
                            }
                        })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
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
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(editFolder.entry.id)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(anotherFolder.entry.id)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(filePdfNode.entry.id)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickHomeButton()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_1.BrowserActions.closeMenuAndDialogs()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260161] Update folder - Cancel button', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', editFolder.entry.name)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, contentServicesPage.clickOnEditFolder()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, editFolderDialog.checkFolderDialogIsDisplayed()];
                case 4:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, editFolderDialog.getDialogTitle()];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe('Edit folder')];
                case 6:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, editFolderDialog.getFolderName()];
                case 7: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(editFolder.entry.name)];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, editFolderDialog.checkCreateUpdateBtnIsEnabled()];
                case 9:
                    _c.sent();
                    return [4 /*yield*/, editFolderDialog.checkCancelBtnIsEnabled()];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, editFolderDialog.clickOnCancelButton()];
                case 11:
                    _c.sent();
                    return [4 /*yield*/, editFolderDialog.checkFolderDialogIsNotDisplayed()];
                case 12:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260162] Update folder - Introducing letters', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', editFolder.entry.name)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', editFolder.entry.name)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name)];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, contentServicesPage.checkEditFolderButtonIsEnabled()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.clickOnEditFolder()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, editFolderDialog.checkFolderDialogIsDisplayed()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, editFolderDialog.checkCreateUpdateBtnIsEnabled()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, editFolderDialog.addFolderName(editFolder.entry.name + 'a')];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, editFolderDialog.checkCreateUpdateBtnIsEnabled()];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, editFolderDialog.clickOnCancelButton()];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, editFolderDialog.checkFolderDialogIsNotDisplayed()];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', editFolder.entry.name)];
                case 13:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260163] Update folder name with an existing one', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', editFolder.entry.name)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', editFolder.entry.name)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name)];
                case 3:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, contentServicesPage.checkEditFolderButtonIsEnabled()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.clickOnEditFolder()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, editFolderDialog.checkFolderDialogIsDisplayed()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, editFolderDialog.checkCreateUpdateBtnIsEnabled()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, editFolderDialog.addFolderName(anotherFolder.entry.name)];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, editFolderDialog.checkCreateUpdateBtnIsEnabled()];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, editFolderDialog.clickOnCreateUpdateButton()];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, editFolderDialog.checkFolderDialogIsDisplayed()];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, notificationHistoryPage.checkNotifyContains('There\'s already a folder with this name. Try a different name.')];
                case 13:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260164] Edit Folder - Unsupported characters', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', editFolder.entry.name)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', editFolder.entry.name)];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.clickOnEditFolder()];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.checkFolderDialogIsDisplayed()];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.addFolderName('a*"<>\\/?:|')];
                case 6:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, editFolderDialog.getValidationMessage()];
                case 7: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe('Folder name can\'t contain these characters * " < > \\ / ? : |')];
                case 8:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.checkCreateUpdateBtnIsDisabled()];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.addFolderName('a.a')];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.checkValidationMessageIsNotDisplayed()];
                case 11:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.checkCreateUpdateBtnIsEnabled()];
                case 12:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.addFolderName('a.')];
                case 13:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, editFolderDialog.getValidationMessage()];
                case 14: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe('Folder name can\'t end with a period .')];
                case 15:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.checkCreateUpdateBtnIsDisabled()];
                case 16:
                    _d.sent();
                    return [4 /*yield*/, adf_testing_1.BrowserActions.clearSendKeys(editFolderDialog.getFolderNameField(), protractor_1.protractor.Key.SPACE)];
                case 17:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, editFolderDialog.getValidationMessage()];
                case 18: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe('Folder name can\'t contain only spaces')];
                case 19:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.checkCreateUpdateBtnIsDisabled()];
                case 20:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.addFolderName(editFolder.entry.name)];
                case 21:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.addFolderDescription('a*"<>\\/?:|')];
                case 22:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.checkValidationMessageIsNotDisplayed()];
                case 23:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.checkCreateUpdateBtnIsEnabled()];
                case 24:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.addFolderDescription('a.')];
                case 25:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.checkValidationMessageIsNotDisplayed()];
                case 26:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.checkCreateUpdateBtnIsEnabled()];
                case 27:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.addFolderDescription('a.a')];
                case 28:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.checkValidationMessageIsNotDisplayed()];
                case 29:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.checkCreateUpdateBtnIsEnabled()];
                case 30:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.getFolderDescriptionField().sendKeys(protractor_1.protractor.Key.SPACE)];
                case 31:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.checkValidationMessageIsNotDisplayed()];
                case 32:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.checkCreateUpdateBtnIsEnabled()];
                case 33:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.clickOnCancelButton()];
                case 34:
                    _d.sent();
                    return [4 /*yield*/, editFolderDialog.checkFolderDialogIsNotDisplayed()];
                case 35:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260166] Enable/Disable edit folder icon - when file selected', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()];
                case 1: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe(0)];
                case 2:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, contentServicesPage.checkEditFolderButtonIsEnabled()];
                case 3: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe(false)];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', filePdfNode.entry.name)];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', filePdfNode.entry.name)];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', filePdfNode.entry.name)];
                case 7:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, contentServicesPage.checkEditFolderButtonIsEnabled()];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(false)];
                case 9:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260166] Enable/Disable edit folder icon - when multiple folders selected', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, contentServicesPage.clickMultiSelectToggle()];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkAllRowsButtonIsDisplayed()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkAllRows()];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded()];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsChecked('Display name', editFolder.entry.name)];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsChecked('Display name', anotherFolder.entry.name)];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().clickCheckbox('Display name', filePdfNode.entry.name)];
                case 8:
                    _c.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsNotChecked('Display name', filePdfNode.entry.name)];
                case 9:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()];
                case 10: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(2)];
                case 11:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, contentServicesPage.checkEditFolderButtonIsEnabled()];
                case 12: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(false)];
                case 13:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260166] Enable/Disable edit folder icon - when single folder selected', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()];
                case 1: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toBe(0)];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', editFolder.entry.name)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name)];
                case 4:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()];
                case 5: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toBe(1)];
                case 6:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, contentServicesPage.checkEditFolderButtonIsEnabled()];
                case 7: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(true)];
                case 8:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260165] Update folder name with non-existing one', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', editFolder.entry.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', editFolder.entry.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', editFolder.entry.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.clickOnEditFolder()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, editFolderDialog.checkFolderDialogIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, editFolderDialog.addFolderName(updateFolderName)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, editFolderDialog.checkCreateUpdateBtnIsEnabled()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, editFolderDialog.clickOnCreateUpdateButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, editFolderDialog.checkFolderDialogIsNotDisplayed()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', updateFolderName)];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Edit Folder - no permission', function () {
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(anotherAcsUser)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, adf_testing_1.BrowserActions.getUrl(protractor_1.browser.params.testConfig.adf.url + '/files/' + editFolder.entry.id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260167] Edit folder without permission', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', subFolder.entry.name)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', subFolder.entry.name)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', subFolder.entry.name)];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.checkEditFolderButtonIsEnabled()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(false)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=edit-folder-directive.e2e.js.map