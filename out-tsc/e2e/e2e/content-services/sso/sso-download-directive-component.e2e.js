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
var protractor_1 = require("protractor");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var adf_testing_1 = require("@alfresco/adf-testing");
var fileModel_1 = require("../../models/ACS/fileModel");
var viewerPage_1 = require("../../pages/adf/viewerPage");
var resources = require("../../util/resources");
var js_api_1 = require("@alfresco/js-api");
describe('SSO in ADF using ACS and AIS, Download Directive, Viewer, DocumentList, implicitFlow true', function () {
    var settingsPage = new adf_testing_1.SettingsPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var contentListPage = contentServicesPage.getDocumentList();
    var loginSsoPage = new adf_testing_1.LoginSSOPage();
    var viewerPage = new viewerPage_1.ViewerPage();
    var silentLogin;
    var implicitFlow;
    var firstPdfFileModel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF_B.file_location
    });
    var pngFileModel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    var pdfUploadedFile, pngUploadedFile, folder;
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host,
        authType: 'OAUTH',
        oauth2: {
            host: protractor_1.browser.params.testConfig.adf.hostSso,
            clientId: protractor_1.browser.params.config.oauth2.clientId,
            scope: 'openid',
            secret: '',
            implicitFlow: false,
            silentLogin: false,
            redirectUri: '/',
            redirectUriLogout: '/logout'
        }
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var folderName = adf_testing_1.StringUtil.generateRandomString(5);
    var acsUser = new adf_testing_1.UserModel();
    var identityService;
    describe('SSO in ADF using ACS and AIS, implicit flow set', function () {
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var apiService;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apiService = new adf_testing_1.ApiService(protractor_1.browser.params.config.oauth2.clientId, protractor_1.browser.params.testConfig.adf_acs.host, protractor_1.browser.params.testConfig.adf.hostSso, 'ECM');
                        return [4 /*yield*/, apiService.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _a.sent();
                        identityService = new adf_testing_1.IdentityService(apiService);
                        return [4 /*yield*/, identityService.createIdentityUserAndSyncECMBPM(acsUser)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.createFolder(folderName, '-my-')];
                    case 4:
                        folder = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(firstPdfFileModel.location, firstPdfFileModel.name, folder.entry.id)];
                    case 5:
                        pdfUploadedFile = _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(pngFileModel.location, pngFileModel.name, folder.entry.id)];
                    case 6:
                        pngUploadedFile = _a.sent();
                        silentLogin = false;
                        implicitFlow = true;
                        return [4 /*yield*/, settingsPage.setProviderEcmSso(protractor_1.browser.params.testConfig.adf_acs.host, protractor_1.browser.params.testConfig.adf.hostSso, protractor_1.browser.params.testConfig.adf.hostIdentity, silentLogin, implicitFlow, protractor_1.browser.params.config.oauth2.clientId)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, loginSsoPage.clickOnSSOButton()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, loginSsoPage.loginSSOIdentityService(acsUser.id, acsUser.password)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, contentListPage.doubleClickRow(folderName)];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, contentListPage.waitForTableBody()];
                    case 13:
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
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(folder.entry.id)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, identityService.deleteIdentityUser(acsUser.id)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        return [3 /*break*/, 5];
                    case 5: return [4 /*yield*/, this.alfrescoJsApi.logout()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.executeScript('window.sessionStorage.clear();')];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.executeScript('window.localStorage.clear();')];
                    case 8:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.refresh()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentListPage.waitForTableBody()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291936] Should be able to download a file', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, contentListPage.selectRow(pngFileModel.name)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.clickDownloadButton()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, adf_testing_1.FileBrowserUtil.isFileDownloaded(pngFileModel.name)];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true, pngFileModel.name + " not downloaded")];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291938] Should be able to open a document', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.doubleClickRow(firstPdfFileModel.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.checkFileIsLoaded()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.checkFileNameIsDisplayed(firstPdfFileModel.name)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.clickCloseButton()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, contentListPage.waitForTableBody()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291942] Should be able to open an image', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, viewerPage.viewFile(pngFileModel.name)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.checkImgViewerIsDisplayed()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.checkFileNameIsDisplayed(pngFileModel.name)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, viewerPage.clickCloseButton()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, contentListPage.waitForTableBody()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291941] Should be able to download multiple files', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.clickMultiSelectToggle()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, contentListPage.dataTablePage().checkAllRows()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, contentListPage.dataTablePage().checkRowIsChecked('Display name', pngFileModel.name)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, contentListPage.dataTablePage().checkRowIsChecked('Display name', firstPdfFileModel.name)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.clickDownloadButton()];
                    case 6:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, adf_testing_1.FileBrowserUtil.isFileDownloaded('archive.zip')];
                    case 7: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(true, "archive.zip not downloaded")];
                    case 8:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C291940] Should be able to view thumbnails when enabled', function () { return __awaiter(_this, void 0, void 0, function () {
            var filePdfIconUrl, filePngIconUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.enableThumbnails()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentListPage.waitForTableBody()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.getRowIconImageUrl(firstPdfFileModel.name)];
                    case 4:
                        filePdfIconUrl = _a.sent();
                        return [4 /*yield*/, expect(filePdfIconUrl).toContain("/versions/1/nodes/" + pdfUploadedFile.entry.id + "/renditions")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.getRowIconImageUrl(pngFileModel.name)];
                    case 6:
                        filePngIconUrl = _a.sent();
                        return [4 /*yield*/, expect(filePngIconUrl).toContain("/versions/1/nodes/" + pngUploadedFile.entry.id + "/renditions")];
                    case 7:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=sso-download-directive-component.e2e.js.map