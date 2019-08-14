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
var viewerPage_1 = require("../../pages/adf/viewerPage");
var resources = require("../../util/resources");
var fileModel_1 = require("../../models/ACS/fileModel");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var js_api_1 = require("@alfresco/js-api");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
describe('Content Services Viewer', function () {
    var acsUser = new acsUserModel_1.AcsUserModel();
    var viewerPage = new viewerPage_1.ViewerPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var zoom;
    var pdfFile = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF.file_name,
        'firstPageText': resources.Files.ADF_DOCUMENTS.PDF.first_page_text,
        'secondPageText': resources.Files.ADF_DOCUMENTS.PDF.second_page_text,
        'lastPageNumber': resources.Files.ADF_DOCUMENTS.PDF.last_page_number
    });
    var protectedFile = new fileModel_1.FileModel({
        'name': resources.Files.ADF_DOCUMENTS.PDF_PROTECTED.file_name,
        'firstPageText': resources.Files.ADF_DOCUMENTS.PDF_PROTECTED.first_page_text,
        'secondPageText': resources.Files.ADF_DOCUMENTS.PDF_PROTECTED.second_page_text,
        'lastPageNumber': resources.Files.ADF_DOCUMENTS.PDF_PROTECTED.last_page_number,
        'password': resources.Files.ADF_DOCUMENTS.PDF_PROTECTED.password,
        'location': resources.Files.ADF_DOCUMENTS.PDF_PROTECTED.file_location
    });
    var docxFile = new fileModel_1.FileModel({
        'location': resources.Files.ADF_DOCUMENTS.DOCX_SUPPORTED.file_location,
        'name': resources.Files.ADF_DOCUMENTS.DOCX_SUPPORTED.file_name,
        'firstPageText': resources.Files.ADF_DOCUMENTS.DOCX_SUPPORTED.first_page_text
    });
    var jpgFile = new fileModel_1.FileModel({
        'location': resources.Files.ADF_DOCUMENTS.JPG.file_location,
        'name': resources.Files.ADF_DOCUMENTS.JPG.file_name
    });
    var mp4File = new fileModel_1.FileModel({
        'location': resources.Files.ADF_DOCUMENTS.MP4.file_location,
        'name': resources.Files.ADF_DOCUMENTS.MP4.file_name
    });
    var unsupportedFile = new fileModel_1.FileModel({
        'location': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_location,
        'name': resources.Files.ADF_DOCUMENTS.UNSUPPORTED.file_name
    });
    var pptFile = new fileModel_1.FileModel({
        'location': resources.Files.ADF_DOCUMENTS.PPT.file_location,
        'name': resources.Files.ADF_DOCUMENTS.PPT.file_name,
        'firstPageText': resources.Files.ADF_DOCUMENTS.PPT.first_page_text
    });
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var pdfFileUploaded, protectedFileUploaded, docxFileUploaded, jpgFileUploaded, mp4FileUploaded, pptFileUploaded, unsupportedFileUploaded;
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
                    return [4 /*yield*/, uploadActions.uploadFile(pdfFile.location, pdfFile.name, '-my-')];
                case 4:
                    pdfFileUploaded = _a.sent();
                    Object.assign(pdfFile, pdfFileUploaded.entry);
                    return [4 /*yield*/, uploadActions.uploadFile(protectedFile.location, protectedFile.name, '-my-')];
                case 5:
                    protectedFileUploaded = _a.sent();
                    Object.assign(protectedFile, protectedFileUploaded.entry);
                    return [4 /*yield*/, uploadActions.uploadFile(docxFile.location, docxFile.name, '-my-')];
                case 6:
                    docxFileUploaded = _a.sent();
                    Object.assign(docxFile, docxFileUploaded.entry);
                    return [4 /*yield*/, uploadActions.uploadFile(jpgFile.location, jpgFile.name, '-my-')];
                case 7:
                    jpgFileUploaded = _a.sent();
                    Object.assign(jpgFile, jpgFileUploaded.entry);
                    return [4 /*yield*/, uploadActions.uploadFile(mp4File.location, mp4File.name, '-my-')];
                case 8:
                    mp4FileUploaded = _a.sent();
                    Object.assign(mp4File, mp4FileUploaded.entry);
                    return [4 /*yield*/, uploadActions.uploadFile(pptFile.location, pptFile.name, '-my-')];
                case 9:
                    pptFileUploaded = _a.sent();
                    Object.assign(pptFile, pptFileUploaded.entry);
                    return [4 /*yield*/, uploadActions.uploadFile(unsupportedFile.location, unsupportedFile.name, '-my-')];
                case 10:
                    unsupportedFileUploaded = _a.sent();
                    Object.assign(unsupportedFile, unsupportedFileUploaded.entry);
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                case 12:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, uploadActions.deleteFileOrFolder(pdfFile.getId())];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(protectedFile.getId())];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(docxFile.getId())];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(jpgFile.getId())];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(mp4File.getId())];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(pptFile.getId())];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(unsupportedFile.getId())];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260038] Should display first page, toolbar and pagination when opening a .pdf file', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.viewFile(pdfFile.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomInButtonIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileContent('1', pdfFile.firstPageText)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkCloseButtonIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileNameIsDisplayed(pdfFile.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileThumbnailIsDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkDownloadButtonIsDisplayed()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFullScreenButtonIsDisplayed()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoButtonIsDisplayed()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkPreviousPageButtonIsDisplayed()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkNextPageButtonIsDisplayed()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkPageSelectorInputIsDisplayed('1')];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkPercentageIsDisplayed()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomInButtonIsDisplayed()];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomOutButtonIsDisplayed()];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkScalePageButtonIsDisplayed()];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 18:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260040] Should be able to change pages and zoom when .pdf file is open', function () { return __awaiter(_this, void 0, void 0, function () {
        var initialWidth, initialHeight, _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, viewerPage.viewFile(pdfFile.name)];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, viewerPage.checkZoomInButtonIsDisplayed()];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, viewerPage.checkFileContent('1', pdfFile.firstPageText)];
                case 3:
                    _g.sent();
                    return [4 /*yield*/, viewerPage.clickNextPageButton()];
                case 4:
                    _g.sent();
                    return [4 /*yield*/, viewerPage.checkFileContent('2', pdfFile.secondPageText)];
                case 5:
                    _g.sent();
                    return [4 /*yield*/, viewerPage.checkPageSelectorInputIsDisplayed('2')];
                case 6:
                    _g.sent();
                    return [4 /*yield*/, viewerPage.clickPreviousPageButton()];
                case 7:
                    _g.sent();
                    return [4 /*yield*/, viewerPage.checkFileContent('1', pdfFile.firstPageText)];
                case 8:
                    _g.sent();
                    return [4 /*yield*/, viewerPage.checkPageSelectorInputIsDisplayed('1')];
                case 9:
                    _g.sent();
                    return [4 /*yield*/, viewerPage.clearPageNumber()];
                case 10:
                    _g.sent();
                    return [4 /*yield*/, viewerPage.checkPageSelectorInputIsDisplayed('')];
                case 11:
                    _g.sent();
                    return [4 /*yield*/, viewerPage.getCanvasWidth()];
                case 12:
                    initialWidth = _g.sent();
                    return [4 /*yield*/, viewerPage.getCanvasHeight()];
                case 13:
                    initialHeight = _g.sent();
                    return [4 /*yield*/, viewerPage.clickZoomInButton()];
                case 14:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, viewerPage.getCanvasWidth()];
                case 15: return [4 /*yield*/, _a.apply(void 0, [+(_g.sent())]).toBeGreaterThan(+initialWidth)];
                case 16:
                    _g.sent();
                    _b = expect;
                    return [4 /*yield*/, viewerPage.getCanvasHeight()];
                case 17: return [4 /*yield*/, _b.apply(void 0, [+(_g.sent())]).toBeGreaterThan(+initialHeight)];
                case 18:
                    _g.sent();
                    return [4 /*yield*/, viewerPage.clickActualSize()];
                case 19:
                    _g.sent();
                    _c = expect;
                    return [4 /*yield*/, viewerPage.getCanvasWidth()];
                case 20: return [4 /*yield*/, _c.apply(void 0, [+(_g.sent())]).toEqual(+initialWidth)];
                case 21:
                    _g.sent();
                    _d = expect;
                    return [4 /*yield*/, viewerPage.getCanvasHeight()];
                case 22: return [4 /*yield*/, _d.apply(void 0, [+(_g.sent())]).toEqual(+initialHeight)];
                case 23:
                    _g.sent();
                    return [4 /*yield*/, viewerPage.clickZoomOutButton()];
                case 24:
                    _g.sent();
                    _e = expect;
                    return [4 /*yield*/, viewerPage.getCanvasWidth()];
                case 25: return [4 /*yield*/, _e.apply(void 0, [+(_g.sent())]).toBeLessThan(+initialWidth)];
                case 26:
                    _g.sent();
                    _f = expect;
                    return [4 /*yield*/, viewerPage.getCanvasHeight()];
                case 27: return [4 /*yield*/, _f.apply(void 0, [+(_g.sent())]).toBeLessThan(+initialHeight)];
                case 28:
                    _g.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 29:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260042] Should be able to download, open full-screen and Info container from the Viewer', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.viewFile(jpgFile.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomInButtonIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkImgContainerIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFullScreenButtonIsDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickFullScreenButton()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.exitFullScreen()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkDownloadButtonIsDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickDownloadButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260052] Should display image, toolbar and pagination when opening a .jpg file', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.viewFile(jpgFile.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomInButtonIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkImgContainerIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkCloseButtonIsDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileNameIsDisplayed(jpgFile.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileThumbnailIsDisplayed()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkDownloadButtonIsDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFullScreenButtonIsDisplayed()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoButtonIsDisplayed()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomInButtonIsDisplayed()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomOutButtonIsDisplayed()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkPercentageIsDisplayed()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkRotateLeftButtonIsDisplayed()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkRotateRightButtonIsDisplayed()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkScaleImgButtonIsDisplayed()];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 16:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260483] Should be able to zoom and rotate image when .jpg file is open', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.viewFile(jpgFile.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomInButtonIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkPercentageIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.getZoom()];
                case 4:
                    zoom = _a.sent();
                    return [4 /*yield*/, viewerPage.clickZoomInButton()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomedIn(zoom)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.getZoom()];
                case 7:
                    zoom = _a.sent();
                    return [4 /*yield*/, viewerPage.clickZoomOutButton()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomedOut(zoom)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickRotateLeftButton()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkRotation('transform: scale(1, 1) rotate(-90deg) translate(0px, 0px);')];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickScaleImgButton()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkRotation('transform: scale(1, 1) rotate(0deg) translate(0px, 0px);')];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickRotateRightButton()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkRotation('transform: scale(1, 1) rotate(90deg) translate(0px, 0px);')];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 16:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C279922] Should display first page, toolbar and pagination when opening a .ppt file', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.viewFile(pptFile.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomInButtonIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileContent('1', pptFile.firstPageText)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkCloseButtonIsDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileThumbnailIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileNameIsDisplayed(pptFile.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkDownloadButtonIsDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoButtonIsDisplayed()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkPreviousPageButtonIsDisplayed()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkNextPageButtonIsDisplayed()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkPageSelectorInputIsDisplayed('1')];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomInButtonIsDisplayed()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomOutButtonIsDisplayed()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkScalePageButtonIsDisplayed()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 15:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291903] Should display the buttons in order in the adf viewer toolbar', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, viewerPage.viewFile(pdfFile.name)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, viewerPage.checkLeftSideBarIsNotDisplayed()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, viewerPage.clickLeftSidebarButton()];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, viewerPage.checkLeftSideBarIsDisplayed()];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, viewerPage.enableMoreActionsMenu()];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, viewerPage.checkToolbarIsDisplayed()];
                case 6:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, viewerPage.getLastButtonTitle()];
                case 7:
                    _c = (_a = _b.apply(void 0, [_d.sent()])).toEqual;
                    return [4 /*yield*/, viewerPage.getMoreActionsMenuTitle()];
                case 8: return [4 /*yield*/, _c.apply(_a, [_d.sent()])];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 10:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260053] Should display first page, toolbar and pagination when opening a .docx file', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.viewFile(docxFile.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomInButtonIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileContent('1', docxFile.firstPageText)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkCloseButtonIsDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileThumbnailIsDisplayed()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileNameIsDisplayed(docxFile.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkDownloadButtonIsDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoButtonIsDisplayed()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkPreviousPageButtonIsDisplayed()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkNextPageButtonIsDisplayed()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkPageSelectorInputIsDisplayed('1')];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomInButtonIsDisplayed()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomOutButtonIsDisplayed()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkScalePageButtonIsDisplayed()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 15:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260054] Should display Preview could not be loaded and viewer toolbar when opening an unsupported file', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, viewerPage.viewFile(unsupportedFile.name)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, viewerPage.checkCloseButtonIsDisplayed()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, viewerPage.checkFileNameIsDisplayed(unsupportedFile.name)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, viewerPage.checkFileThumbnailIsDisplayed()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, viewerPage.checkDownloadButtonIsDisplayed()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, viewerPage.checkInfoButtonIsDisplayed()];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, viewerPage.checkZoomInButtonIsNotDisplayed()];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, viewerPage.checkUnknownFormatIsDisplayed()];
                case 8:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, viewerPage.getUnknownFormatMessage()];
                case 9: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe('Couldn\'t load preview. Unknown format.')];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 11:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260056] Should display video and viewer toolbar when opening a media file', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.viewFile(mp4File.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkMediaPlayerContainerIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkCloseButtonIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileThumbnailIsDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileNameIsDisplayed(mp4File.name)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkDownloadButtonIsDisplayed()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkInfoButtonIsDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFullScreenButtonIsNotDisplayed()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomInButtonIsNotDisplayed()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C261123] Should be able to preview all pages and navigate to a page when using thumbnails', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.viewFile(pdfFile.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomInButtonIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileContent('1', pdfFile.firstPageText)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkThumbnailsBtnIsDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickThumbnailsBtn()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkThumbnailsContentIsDisplayed()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkThumbnailsCloseIsDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkAllThumbnailsDisplayed(pdfFile.lastPageNumber)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickSecondThumbnail()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileContent('2', pdfFile.secondPageText)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkCurrentThumbnailIsSelected()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkPreviousPageButtonIsDisplayed()];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickPreviousPageButton()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileContent('1', pdfFile.firstPageText)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkCurrentThumbnailIsSelected()];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickThumbnailsBtn()];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkThumbnailsContentIsNotDisplayed()];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickThumbnailsBtn()];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkThumbnailsCloseIsDisplayed()];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickThumbnailsClose()];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 21:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C268105] Should display current thumbnail when getting to the page following the last visible thumbnail', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.viewFile(pdfFile.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomInButtonIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileContent('1', pdfFile.firstPageText)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkThumbnailsBtnIsDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickThumbnailsBtn()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickLastThumbnailDisplayed()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkCurrentThumbnailIsSelected()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkNextPageButtonIsDisplayed()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickNextPageButton()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkCurrentThumbnailIsSelected()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 11:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C269109] Should not be able to open thumbnail panel before the pdf is loaded', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.viewFile(pdfFile.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkThumbnailsBtnIsDisabled()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkCloseButtonIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C268901] Should need a password when opening a protected file', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.viewFile(protectedFile.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkZoomInButtonIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkPasswordDialogIsDisplayed()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkPasswordSubmitDisabledIsDisplayed()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.enterPassword('random password')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickPasswordSubmit()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkPasswordErrorIsDisplayed()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkPasswordInputIsDisplayed()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.enterPassword(protectedFile.password)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickPasswordSubmit()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkFileContent('1', protectedFile.firstPageText)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickCloseButton()];
                case 12:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C307985] Should close the viewer when password dialog is cancelled', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, viewerPage.viewFile(protectedFile.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.checkPasswordDialogIsDisplayed()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, viewerPage.clickClosePasswordDialog()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(protectedFile.name)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=viewer-content-services-component.e2e.js.map