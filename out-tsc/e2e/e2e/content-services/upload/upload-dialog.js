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
var uploadDialog_1 = require("../../pages/adf/dialog/uploadDialog");
var uploadToggles_1 = require("../../pages/adf/dialog/uploadToggles");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var fileModel_1 = require("../../models/ACS/fileModel");
var protractor_1 = require("protractor");
var resources = require("../../util/resources");
var js_api_1 = require("@alfresco/js-api");
var versionManagerPage_1 = require("../../pages/adf/versionManagerPage");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
describe('Upload component', function () {
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var uploadDialog = new uploadDialog_1.UploadDialog();
    var uploadToggles = new uploadToggles_1.UploadToggles();
    var loginPage = new adf_testing_1.LoginPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var versionManagePage = new versionManagerPage_1.VersionManagePage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var firstPdfFileModel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF_B.file_location
    });
    var docxFileModel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.DOCX.file_name,
        'location': resources.Files.ADF_DOCUMENTS.DOCX.file_location
    });
    var pdfFileModel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PDF.file_location
    });
    var pngFileModelTwo = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG_B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG_B.file_location
    });
    var pngFileModel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    var filesLocation = [pdfFileModel.location, docxFileModel.location, pngFileModel.location, firstPdfFileModel.location];
    var filesName = [pdfFileModel.name, docxFileModel.name, pngFileModel.name, firstPdfFileModel.name];
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
    afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
        var nbResults, nodesPromise;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 1:
                    nbResults = _a.sent();
                    if (!(nbResults > 1)) return [3 /*break*/, 3];
                    return [4 /*yield*/, contentServicesPage.getElementsDisplayedId()];
                case 2:
                    nodesPromise = _a.sent();
                    nodesPromise.forEach(function (currentNodePromise) { return __awaiter(_this, void 0, void 0, function () {
                        var nodeId;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, currentNodePromise];
                                case 1:
                                    nodeId = _a.sent();
                                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(nodeId)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); });
    it('[C260143] Should be possible to maximize/minimize the upload dialog', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.uploadFile(docxFileModel.location)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(docxFileModel.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.fileIsUploaded(docxFileModel.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.checkCloseButtonIsDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, expect(uploadDialog.numberOfCurrentFilesUploaded()).toEqual('1')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, expect(uploadDialog.numberOfInitialFilesUploaded()).toEqual('1')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.minimizeUploadDialog()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.dialogIsMinimized()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, expect(uploadDialog.numberOfCurrentFilesUploaded()).toEqual('1')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, expect(uploadDialog.numberOfInitialFilesUploaded()).toEqual('1')];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.maximizeUploadDialog()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.dialogIsDisplayed()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.fileIsUploaded(docxFileModel.name)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, expect(uploadDialog.numberOfCurrentFilesUploaded()).toEqual('1')];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, expect(uploadDialog.numberOfInitialFilesUploaded()).toEqual('1')];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.checkCloseButtonIsDisplayed()];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                case 18:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291902] Should be shown upload counter display in dialog box', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage
                        .uploadFile(docxFileModel.location)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(docxFileModel.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.fileIsUploaded(docxFileModel.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.checkCloseButtonIsDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, expect(uploadDialog.getTitleText()).toEqual('Uploaded 1 / 1')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.checkCloseButtonIsDisplayed()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260168] Should be possible to cancel upload using dialog icon', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.uploadFile(pdfFileModel.location)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pdfFileModel.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.removeUploadedFile(pdfFileModel.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.fileIsCancelled(pdfFileModel.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, expect(uploadDialog.getTitleText()).toEqual('Upload canceled')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(pdfFileModel.name)];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260176] Should remove files from upload dialog box when closed', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.uploadFile(pngFileModelTwo.location)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pngFileModelTwo.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.fileIsUploaded(pngFileModelTwo.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.uploadFile(pngFileModel.location)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pngFileModel.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.fileIsUploaded(pngFileModel.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.fileIsUploaded(pngFileModelTwo.name)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.uploadFile(pdfFileModel.location)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pdfFileModel.name)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.fileIsUploaded(pdfFileModel.name)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.fileIsNotDisplayedInDialog(pngFileModel.name)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.fileIsNotDisplayedInDialog(pngFileModelTwo.name)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                case 16:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260170] Should be possible to upload multiple files', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, uploadToggles.enableMultipleFileUpload()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.uploadMultipleFile(filesLocation)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentsAreDisplayed(filesName)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.filesAreUploaded(filesName)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, expect(uploadDialog.getTitleText()).toEqual('Uploaded 4 / 4')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, uploadToggles.disableMultipleFileUpload()];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C311305] Should NOT be able to remove uploaded version', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.uploadFile(docxFileModel.location)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.fileIsUploaded(docxFileModel.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(docxFileModel.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.versionManagerContent(docxFileModel.name)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, adf_testing_1.BrowserActions.click(versionManagePage.showNewVersionButton)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.uploadNewVersionFile(pngFileModel.location)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, versionManagePage.closeVersionDialog()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.removeUploadedFile(pngFileModel.name)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pngFileModel.name)];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=upload-dialog.js.map