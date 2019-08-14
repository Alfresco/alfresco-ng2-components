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
var uploadDialog_1 = require("../../pages/adf/dialog/uploadDialog");
var uploadToggles_1 = require("../../pages/adf/dialog/uploadToggles");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var fileModel_1 = require("../../models/ACS/fileModel");
var resources = require("../../util/resources");
var js_api_1 = require("@alfresco/js-api");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
describe('Upload component', function () { return __awaiter(_this, void 0, void 0, function () {
    var contentServicesPage, uploadDialog, uploadToggles, loginPage, acsUser, uploadActions, navigationBarPage, firstPdfFileModel, pngFileModel, largeFile;
    var _this = this;
    return __generator(this, function (_a) {
        this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
            provider: 'ECM',
            hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
        });
        contentServicesPage = new contentServicesPage_1.ContentServicesPage();
        uploadDialog = new uploadDialog_1.UploadDialog();
        uploadToggles = new uploadToggles_1.UploadToggles();
        loginPage = new adf_testing_1.LoginPage();
        acsUser = new acsUserModel_1.AcsUserModel();
        uploadActions = new adf_testing_1.UploadActions(this.alfrescoJsApi);
        navigationBarPage = new navigationBarPage_1.NavigationBarPage();
        firstPdfFileModel = new fileModel_1.FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PDF_B.file_location
        });
        pngFileModel = new fileModel_1.FileModel({
            'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
            'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
        });
        largeFile = new fileModel_1.FileModel({
            'name': resources.Files.ADF_DOCUMENTS.LARGE_FILE.file_name,
            'location': resources.Files.ADF_DOCUMENTS.LARGE_FILE.file_location
        });
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var pdfUploadedFile;
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
                        return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, uploadActions.uploadFile(firstPdfFileModel.location, firstPdfFileModel.name, '-my-')];
                    case 6:
                        pdfUploadedFile = _a.sent();
                        Object.assign(firstPdfFileModel, pdfUploadedFile.entry);
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
                    case 0: return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272792] Should be possible to cancel upload of a big file using row cancel icon', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.executeScript(' setTimeout(() => {document.querySelector(\'mat-icon[class*="adf-file-uploading-row__action"]\').click();}, 3000)')];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.uploadFile(largeFile.location)];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, uploadDialog.getTitleText()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('Upload canceled')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(largeFile.name)];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C287790] Should be possible to cancel upload of a big file through the cancel uploads button', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.executeScript(' setInterval(() => {document.querySelector("#adf-upload-dialog-cancel-all").click();' +
                            'document.querySelector("#adf-upload-dialog-cancel").click();  }, 500)')];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.uploadFile(largeFile.location)];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, uploadDialog.getTitleText()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('Upload canceled')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(largeFile.name)];
                    case 7:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272793] Should be able to cancel multiple files upload', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, protractor_1.browser.executeScript(' setInterval(() => {document.querySelector("#adf-upload-dialog-cancel-all").click();' +
                            'document.querySelector("#adf-upload-dialog-cancel").click();  }, 500)')];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, uploadToggles.enableMultipleFileUpload()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.uploadMultipleFile([pngFileModel.location, largeFile.location])];
                    case 3:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, uploadDialog.getTitleText()];
                    case 4: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('Upload canceled')];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(pngFileModel.name)];
                    case 8:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(largeFile.name)];
                    case 9:
                        _b.sent();
                        return [4 /*yield*/, uploadToggles.disableMultipleFileUpload()];
                    case 10:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=cancel-upload.e2e.js.map