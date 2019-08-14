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
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var js_api_1 = require("@alfresco/js-api");
var drop_actions_1 = require("../../actions/drop.actions");
describe('Upload component', function () {
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var uploadDialog = new uploadDialog_1.UploadDialog();
    var uploadToggles = new uploadToggles_1.UploadToggles();
    var loginPage = new adf_testing_1.LoginPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
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
    var pngFileModel = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PNG.file_name,
        'location': resources.Files.ADF_DOCUMENTS.PNG.file_location
    });
    var fileWithSpecificSize = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_400B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_400B.file_location
    });
    var emptyFile = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.TXT_0B.file_name,
        'location': resources.Files.ADF_DOCUMENTS.TXT_0B.file_location
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
                    return [4 /*yield*/, uploadActions.uploadFile(firstPdfFileModel.location, firstPdfFileModel.name, '-my-')];
                case 5:
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
    describe('', function () {
        afterEach(function () { return __awaiter(_this, void 0, void 0, function () {
            var nodeList, _i, nodeList_1, node, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.getElementsDisplayedId()];
                    case 1:
                        nodeList = _a.sent();
                        _i = 0, nodeList_1 = nodeList;
                        _a.label = 2;
                    case 2:
                        if (!(_i < nodeList_1.length)) return [3 /*break*/, 7];
                        node = nodeList_1[_i];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, uploadActions.deleteFileOrFolder(node)];
                    case 4:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        _i++;
                        return [3 /*break*/, 2];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
        it('[C272788] Should display upload button', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.getSingleFileButtonTooltip()];
                    case 1: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('Custom tooltip')];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkUploadButton()];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(firstPdfFileModel.name)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272789] Should be able to upload PDF file', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.uploadFile(pdfFileModel.location)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pdfFileModel.name)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.fileIsUploaded(pdfFileModel.name)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272790] Should be able to upload text file', function () { return __awaiter(_this, void 0, void 0, function () {
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
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260141] Should be possible to upload PNG file', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.uploadFile(pngFileModel.location)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pngFileModel.name)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.fileIsUploaded(pngFileModel.name)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260143] Should be possible to maximize/minimize the upload dialog', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.uploadFile(docxFileModel.location)];
                    case 1:
                        _g.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(docxFileModel.name)];
                    case 2:
                        _g.sent();
                        return [4 /*yield*/, uploadDialog.fileIsUploaded(docxFileModel.name)];
                    case 3:
                        _g.sent();
                        return [4 /*yield*/, uploadDialog.checkCloseButtonIsDisplayed()];
                    case 4:
                        _g.sent();
                        _a = expect;
                        return [4 /*yield*/, uploadDialog.numberOfCurrentFilesUploaded()];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_g.sent()]).toEqual('1')];
                    case 6:
                        _g.sent();
                        _b = expect;
                        return [4 /*yield*/, uploadDialog.numberOfInitialFilesUploaded()];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_g.sent()]).toEqual('1')];
                    case 8:
                        _g.sent();
                        return [4 /*yield*/, uploadDialog.minimizeUploadDialog()];
                    case 9:
                        _g.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsMinimized()];
                    case 10:
                        _g.sent();
                        _c = expect;
                        return [4 /*yield*/, uploadDialog.numberOfCurrentFilesUploaded()];
                    case 11: return [4 /*yield*/, _c.apply(void 0, [_g.sent()]).toEqual('1')];
                    case 12:
                        _g.sent();
                        _d = expect;
                        return [4 /*yield*/, uploadDialog.numberOfInitialFilesUploaded()];
                    case 13: return [4 /*yield*/, _d.apply(void 0, [_g.sent()]).toEqual('1')];
                    case 14:
                        _g.sent();
                        return [4 /*yield*/, uploadDialog.maximizeUploadDialog()];
                    case 15:
                        _g.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsDisplayed()];
                    case 16:
                        _g.sent();
                        return [4 /*yield*/, uploadDialog.fileIsUploaded(docxFileModel.name)];
                    case 17:
                        _g.sent();
                        _e = expect;
                        return [4 /*yield*/, uploadDialog.numberOfCurrentFilesUploaded()];
                    case 18: return [4 /*yield*/, _e.apply(void 0, [_g.sent()]).toEqual('1')];
                    case 19:
                        _g.sent();
                        _f = expect;
                        return [4 /*yield*/, uploadDialog.numberOfInitialFilesUploaded()];
                    case 20: return [4 /*yield*/, _f.apply(void 0, [_g.sent()]).toEqual('1')];
                    case 21:
                        _g.sent();
                        return [4 /*yield*/, uploadDialog.checkCloseButtonIsDisplayed()];
                    case 22:
                        _g.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 23:
                        _g.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                    case 24:
                        _g.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272794] Should display tooltip for uploading files', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, uploadToggles.enableMultipleFileUpload()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, uploadToggles.checkMultipleFileUploadToggleIsEnabled()];
                    case 2:
                        _b.sent();
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.getMultipleFileButtonTooltip()];
                    case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('Custom tooltip')];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, uploadToggles.disableMultipleFileUpload()];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C279920] Should rename a file uploaded twice', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.uploadFile(pdfFileModel.location)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pdfFileModel.name)];
                    case 2:
                        _a.sent();
                        pdfFileModel.setVersion('1');
                        return [4 /*yield*/, contentServicesPage.uploadFile(pdfFileModel.location)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pdfFileModel.getVersionName())];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                    case 6:
                        _a.sent();
                        pdfFileModel.setVersion('');
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260172] Should be possible to enable versioning', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, uploadToggles.enableVersioning()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, uploadToggles.checkVersioningToggleIsEnabled()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.uploadFile(pdfFileModel.location)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pdfFileModel.name)];
                    case 4:
                        _a.sent();
                        pdfFileModel.setVersion('1');
                        return [4 /*yield*/, contentServicesPage.uploadFile(pdfFileModel.location)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(pdfFileModel.name)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.fileIsUploaded(pdfFileModel.name)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(pdfFileModel.getVersionName())];
                    case 10:
                        _a.sent();
                        pdfFileModel.setVersion('');
                        return [4 /*yield*/, uploadToggles.disableVersioning()];
                    case 11:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C260174] Should be possible to set a max size', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, uploadToggles.enableMaxSize()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, uploadToggles.checkMaxSizeToggleIsEnabled()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, uploadToggles.addMaxSize('400')];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.uploadFile(fileWithSpecificSize.location)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.fileIsUploaded(fileWithSpecificSize.name)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.deleteContent(fileWithSpecificSize.name)];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(fileWithSpecificSize.name)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, uploadToggles.addMaxSize('399')];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.uploadFile(fileWithSpecificSize.location)];
                    case 13:
                        _a.sent();
                        //  await expect(await contentServicesPage.getErrorMessage()).toEqual('File ' + fileWithSpecificSize.name + ' is larger than the allowed file size');
                        return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(fileWithSpecificSize.name)];
                    case 14:
                        //  await expect(await contentServicesPage.getErrorMessage()).toEqual('File ' + fileWithSpecificSize.name + ' is larger than the allowed file size');
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.fileIsNotDisplayedInDialog(fileWithSpecificSize.name)];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.uploadFile(emptyFile.location)];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(emptyFile.name)];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.fileIsUploaded(emptyFile.name)];
                    case 18:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 19:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, uploadToggles.disableMaxSize()];
                    case 21:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272796] Should be possible to set max size to 0', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, uploadToggles.enableMaxSize()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, uploadToggles.checkMaxSizeToggleIsEnabled()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, uploadToggles.addMaxSize('0')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.uploadFile(fileWithSpecificSize.location)];
                    case 5:
                        _a.sent();
                        // await expect(await contentServicesPage.getErrorMessage()).toEqual('File ' + fileWithSpecificSize.name + ' is larger than the allowed file size');
                        return [4 /*yield*/, uploadDialog.fileIsNotDisplayedInDialog(fileWithSpecificSize.name)];
                    case 6:
                        // await expect(await contentServicesPage.getErrorMessage()).toEqual('File ' + fileWithSpecificSize.name + ' is larger than the allowed file size');
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.uploadFile(emptyFile.location)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(emptyFile.name)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.fileIsUploaded(emptyFile.name)];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, uploadToggles.disableMaxSize()];
                    case 12:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C272797] Should be possible to set max size to 1', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, uploadToggles.enableMaxSize()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, uploadToggles.checkMaxSizeToggleIsEnabled()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, uploadToggles.addMaxSize('1')];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, uploadToggles.disableMaxSize()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.uploadFile(fileWithSpecificSize.location)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.fileIsUploaded(fileWithSpecificSize.name)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(fileWithSpecificSize.name)];
                    case 10:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C91318] Should Enable/Disable upload button when change the disable property', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, uploadToggles.clickCheckboxDisableUpload()];
                    case 1:
                        _c.sent();
                        _a = expect;
                        return [4 /*yield*/, contentServicesPage.uploadButtonIsEnabled()];
                    case 2: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(false, 'Upload button is enabled')];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, uploadToggles.clickCheckboxDisableUpload()];
                    case 4:
                        _c.sent();
                        _b = expect;
                        return [4 /*yield*/, contentServicesPage.uploadButtonIsEnabled()];
                    case 5: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toBe(true, 'Upload button not enabled')];
                    case 6:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    it('[C260171] Should upload only the extension filter allowed when Enable extension filter is enabled', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, uploadToggles.enableExtensionFilter()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, uploadToggles.addExtension('.docx')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.uploadFile(docxFileModel.location)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(docxFileModel.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.removeUploadedFile(docxFileModel.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.fileIsCancelled(docxFileModel.name)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.uploadFile(pngFileModel.location)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(pngFileModel.name)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, uploadToggles.disableExtensionFilter()];
                case 13:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C274687] Should upload with drag and drop only the extension filter allowed when Enable extension filter is enabled', function () { return __awaiter(_this, void 0, void 0, function () {
        var dragAndDrop, dragAndDropArea;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, uploadToggles.enableExtensionFilter()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, protractor_1.browser.sleep(1000)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, uploadToggles.addExtension('.docx')];
                case 3:
                    _a.sent();
                    dragAndDrop = new drop_actions_1.DropActions();
                    dragAndDropArea = protractor_1.element.all(protractor_1.by.css('adf-upload-drag-area div')).first();
                    return [4 /*yield*/, dragAndDrop.dropFile(dragAndDropArea, docxFileModel.location)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(docxFileModel.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.removeUploadedFile(docxFileModel.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.fileIsCancelled(docxFileModel.name)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.clickOnCloseButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, dragAndDrop.dropFile(dragAndDropArea, pngFileModel.location)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(pngFileModel.name)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, uploadDialog.dialogIsNotDisplayed()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, uploadToggles.disableExtensionFilter()];
                case 13:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291921] Should display tooltip for uploading files on a not found location', function () { return __awaiter(_this, void 0, void 0, function () {
        var folderName, folderUploadedModel, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    folderName = adf_testing_1.StringUtil.generateRandomString(8);
                    return [4 /*yield*/, uploadActions.createFolder(folderName, '-my-')];
                case 1:
                    folderUploadedModel = _b.sent();
                    return [4 /*yield*/, navigationBarPage.openContentServicesFolder(folderUploadedModel.entry.id)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.checkUploadButton()];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(folderUploadedModel.entry.id)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.uploadFile(pdfFileModel.location)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, uploadDialog.displayTooltip()];
                case 6:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, uploadDialog.getTooltip()];
                case 7: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toEqual('Upload location no longer exists [404]')];
                case 8:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=uploader-component.e2e.js.map