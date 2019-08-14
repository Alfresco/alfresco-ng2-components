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
var fileModel_1 = require("../../models/ACS/fileModel");
var adf_testing_1 = require("@alfresco/adf-testing");
var protractor_1 = require("protractor");
var resources = require("../../util/resources");
var js_api_1 = require("@alfresco/js-api");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var folderModel_1 = require("../../models/ACS/folderModel");
describe('Version component actions', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var contentListPage = contentServicesPage.getDocumentList();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var txtFileComma = new fileModel_1.FileModel({
        name: 'comma,name',
        location: resources.Files.ADF_DOCUMENTS.TXT.file_location
    });
    var txtFileModel = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.TXT.file_name,
        location: resources.Files.ADF_DOCUMENTS.TXT.file_location
    });
    var file0BytesModel = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        location: resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
    });
    var folderInfo = new folderModel_1.FolderModel({
        name: 'myFolder',
        location: resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_location
    });
    var folderSecond = new folderModel_1.FolderModel({
        name: 'myrSecondFolder',
        location: resources.Files.ADF_DOCUMENTS.TEXT_FOLDER.folder_location
    });
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var textFolderUploaded;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
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
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(file0BytesModel.location, file0BytesModel.name, '-my-')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(txtFileComma.location, txtFileComma.name, '-my-')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(folderInfo.name, '-my-')];
                case 7:
                    textFolderUploaded = _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFolder(folderInfo.location, textFolderUploaded.entry.id)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(folderSecond.name, '-my-')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 12:
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
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilDialogIsClose()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260083] Download files - Different size values', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentListPage.selectRow(txtFileModel.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.clickDownloadButton()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.FileBrowserUtil.isFileDownloaded(txtFileModel.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilDialogIsClose()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, contentListPage.selectRow(file0BytesModel.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.clickDownloadButton()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.FileBrowserUtil.isFileDownloaded(file0BytesModel.name)];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260084] Download folder', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentListPage.selectRow(folderInfo.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.clickDownloadButton()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.FileBrowserUtil.isFileDownloaded(folderInfo.name + '.zip')];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C261032] File and Folder', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.clickMultiSelectToggle()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentListPage.dataTablePage().checkAllRows()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.clickDownloadButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.FileBrowserUtil.isFileDownloaded('archive.zip')];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C261033] Folder and Folder', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentListPage.selectRow(folderInfo.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentListPage.selectRow(folderSecond.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.clickDownloadButton()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.FileBrowserUtil.isFileDownloaded('archive.zip')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.BrowserVisibility.waitUntilDialogIsClose()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C277757] Download file - Comma in file name', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentListPage.selectRow(txtFileComma.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.clickDownloadButton()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.FileBrowserUtil.isFileDownloaded(txtFileComma.name)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=download-directive.e2e.js.map