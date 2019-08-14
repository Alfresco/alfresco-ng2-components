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
var versionManagerPage_1 = require("../../pages/adf/versionManagerPage");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var fileModel_1 = require("../../models/ACS/fileModel");
var resources = require("../../util/resources");
var js_api_1 = require("@alfresco/js-api");
var adf_testing_2 = require("@alfresco/adf-testing");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var adf_testing_3 = require("@alfresco/adf-testing");
var uploadDialog_1 = require("../../pages/adf/dialog/uploadDialog");
describe('Version component actions', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var versionManagePage = new versionManagerPage_1.VersionManagePage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var uploadDialog = new uploadDialog_1.UploadDialog();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var txtFileModel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT.file_location
    });
    var fileModelVersionTwo = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT.file_location
    });
    var uploadActions;
    var bigFileToCancel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.LARGE_FILE.file_name,
        'location': resources.Files.ADF_DOCUMENTS.LARGE_FILE.file_location
    });
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var txtUploadedFile;
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
                    return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(txtFileModel.location, txtFileModel.name, '-my-')];
                case 4:
                    txtUploadedFile = _a.sent();
                    Object.assign(txtFileModel, txtUploadedFile.entry);
                    txtFileModel.update(txtUploadedFile.entry);
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.versionManagerContent(txtFileModel.name)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_3.BrowserActions.closeMenuAndDialogs()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280003] Should not be possible delete a file version if there is only one version', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, versionManagePage.clickActionButton('1.0')];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, protractor_1.element(protractor_1.by.css("[id=\"adf-version-list-action-delete-1.0\"]")).isEnabled()];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(false)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, versionManagePage.closeActionsMenu()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, adf_testing_3.BrowserVisibility.waitUntilElementIsNotVisible(protractor_1.element(protractor_1.by.css("[id=\"adf-version-list-action-delete-1.0\"]")))];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280004] Should not be possible restore the version if there is only one version', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, versionManagePage.clickActionButton('1.0')];
                case 1:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, protractor_1.element(protractor_1.by.css("[id=\"adf-version-list-action-restore-1.0\"]")).isEnabled()];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(false)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, versionManagePage.closeActionsMenu()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, adf_testing_3.BrowserVisibility.waitUntilElementIsNotVisible(protractor_1.element(protractor_1.by.css("[id=\"adf-version-list-action-restore-1.0\"]")))];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280005] Should be showed all the default action when you have more then one version', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, versionManagePage.showNewVersionButton.click()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.uploadNewVersionFile(fileModelVersionTwo.location)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.clickActionButton('1.1')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.checkActionsArePresent('1.1')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.closeActionsMenu()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.closeVersionDialog()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C269081] Should be possible download all the version of a file', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, versionManagePage.downloadFileVersion('1.0')];
                case 1:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, adf_testing_3.FileBrowserUtil.isFileDownloaded(txtFileModel.name)];
                case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true, txtFileModel.name + " not downloaded")];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, versionManagePage.downloadFileVersion('1.1')];
                case 4:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, adf_testing_3.FileBrowserUtil.isFileDownloaded(fileModelVersionTwo.name)];
                case 5: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true, fileModelVersionTwo.name + " not downloaded")];
                case 6:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C272819] Should be possible delete a version when click on delete version action', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, versionManagePage.deleteFileVersion('1.1')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.clickAcceptConfirm()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.checkFileVersionNotExist('1.1')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.checkFileVersionExist('1.0')];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280006] Should be possible prevent a version to be deleted when click on No on the confirm dialog', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, versionManagePage.showNewVersionButton.click()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.uploadNewVersionFile(fileModelVersionTwo.location)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.checkFileVersionExist('1.1')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.deleteFileVersion('1.1')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.clickCancelConfirm()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.checkFileVersionExist('1.1')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.checkFileVersionExist('1.0')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.closeVersionDialog()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C280007] Should be possible to restore an old version of your file and the document list updated', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.versionManagerContent(fileModelVersionTwo.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.restoreFileVersion('1.0')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.checkFileVersionExist('2.0')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.closeVersionDialog()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(txtFileModel.name)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C307033] Should be possible to cancel the upload of a new version', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, protractor_1.browser.refresh()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.versionManagerContent(txtFileModel.name)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.executeScript(' setTimeout(() => {document.querySelector(\'mat-icon[class*="adf-file-uploading-row__action"]\').click();}, 1000)')];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, versionManagePage.showNewVersionButton.click()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, versionManagePage.uploadNewVersionFile(bigFileToCancel.location)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, versionManagePage.closeVersionDialog()];
                case 6:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, uploadDialog.getTitleText()];
                case 7: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('Upload canceled')];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, protractor_1.browser.refresh()];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(txtFileModel.name)];
                case 12:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=version-actions.e2e.js.map