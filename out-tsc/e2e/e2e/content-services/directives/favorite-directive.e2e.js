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
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var js_api_1 = require("@alfresco/js-api");
var protractor_1 = require("protractor");
var fileModel_1 = require("../../models/ACS/fileModel");
var resources = require("../../util/resources");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var customSourcesPage_1 = require("../../pages/adf/demo-shell/customSourcesPage");
var trashcanPage_1 = require("../../pages/adf/trashcanPage");
describe('Favorite directive', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var customSourcesPage = new customSourcesPage_1.CustomSources();
    var trashcanPage = new trashcanPage_1.TrashcanPage();
    var contentListPage = contentServicesPage.getDocumentList();
    var contentNodeSelector = new adf_testing_1.ContentNodeSelectorDialogPage();
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var pdfFile = new fileModel_1.FileModel({
        name: resources.Files.ADF_DOCUMENTS.PDF.file_name,
        location: resources.Files.ADF_DOCUMENTS.PDF.file_location
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    var testFolder1, testFolder2, testFolder3, testFolder4, testFile;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
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
                    return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), '-my-')];
                case 4:
                    testFolder1 = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), '-my-')];
                case 5:
                    testFolder2 = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), '-my-')];
                case 6:
                    testFolder3 = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(adf_testing_1.StringUtil.generateRandomString(5), '-my-')];
                case 7:
                    testFolder4 = _a.sent();
                    return [4 /*yield*/, uploadActions.uploadFile(pdfFile.location, pdfFile.name, '-my-')];
                case 8:
                    testFile = _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.goToDocumentList()];
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
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(testFolder1.entry.id)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(testFolder2.entry.id)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(testFolder3.entry.id)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.deleteFileOrFolder(testFolder4.entry.id)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260247] Should be able to mark a file as favorite', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', testFile.entry.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', testFile.entry.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.clickOnFavoriteButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkIsMarkedFavorite()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, customSourcesPage.navigateToCustomSources()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, customSourcesPage.selectFavoritesSourceType()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, customSourcesPage.checkRowIsDisplayed(testFile.entry.name)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', testFile.entry.name)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', testFile.entry.name)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.clickOnFavoriteButton()];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkIsNotMarkedFavorite()];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, customSourcesPage.navigateToCustomSources()];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, customSourcesPage.selectFavoritesSourceType()];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, customSourcesPage.checkRowIsNotDisplayed(testFile.entry.name)];
                case 19:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260249] Should be able to mark a folder as favorite', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', testFolder1.entry.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', testFolder1.entry.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder1.entry.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.clickOnFavoriteButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkIsMarkedFavorite()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, customSourcesPage.navigateToCustomSources()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, customSourcesPage.selectFavoritesSourceType()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, customSourcesPage.checkRowIsDisplayed(testFolder1.entry.name)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', testFolder1.entry.name)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', testFolder1.entry.name)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder1.entry.name)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.clickOnFavoriteButton()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkIsNotMarkedFavorite()];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, customSourcesPage.navigateToCustomSources()];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, customSourcesPage.selectFavoritesSourceType()];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, customSourcesPage.checkRowIsNotDisplayed(testFolder1.entry.name)];
                case 18:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260251] Should retain the restored file as favorite', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', testFile.entry.name)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', testFile.entry.name)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.clickOnFavoriteButton()];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.checkIsMarkedFavorite()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, contentListPage.rightClickOnRow(testFile.entry.name)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Delete')];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(testFile.entry.name)];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, customSourcesPage.navigateToCustomSources()];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, customSourcesPage.selectFavoritesSourceType()];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, customSourcesPage.checkRowIsNotDisplayed(testFile.entry.name)];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, navigationBarPage.clickTrashcanButton()];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, trashcanPage.waitForTableBody()];
                case 13:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, trashcanPage.numberOfResultsDisplayed()];
                case 14: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toBe(1)];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().clickRowByContent(testFile.entry.name)];
                case 16:
                    _b.sent();
                    return [4 /*yield*/, trashcanPage.getDocumentList().dataTablePage().checkRowByContentIsSelected(testFile.entry.name)];
                case 17:
                    _b.sent();
                    return [4 /*yield*/, trashcanPage.clickRestore()];
                case 18:
                    _b.sent();
                    return [4 /*yield*/, trashcanPage.checkTrashcanIsEmpty()];
                case 19:
                    _b.sent();
                    return [4 /*yield*/, navigationBarPage.clickContentServicesButton()];
                case 20:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded()];
                case 21:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', testFile.entry.name)];
                case 22:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', testFile.entry.name)];
                case 23:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name)];
                case 24:
                    _b.sent();
                    return [4 /*yield*/, contentServicesPage.checkIsMarkedFavorite()];
                case 25:
                    _b.sent();
                    return [4 /*yield*/, customSourcesPage.navigateToCustomSources()];
                case 26:
                    _b.sent();
                    return [4 /*yield*/, customSourcesPage.selectFavoritesSourceType()];
                case 27:
                    _b.sent();
                    return [4 /*yield*/, customSourcesPage.checkRowIsDisplayed(testFile.entry.name)];
                case 28:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260252] Should retain the moved file as favorite', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkContentIsDisplayed('Display name', testFile.entry.name)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', testFile.entry.name)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.clickOnFavoriteButton()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkIsMarkedFavorite()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().rightClickOnRow(testFile.entry.name)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.pressContextMenuActionNamed('Move')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, contentNodeSelector.checkDialogIsDisplayed()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, contentNodeSelector.typeIntoNodeSelectorSearchField(testFolder1.entry.name)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, contentNodeSelector.clickContentNodeSelectorResult(testFolder1.entry.name)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, contentNodeSelector.clickMoveCopyButton()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsNotDisplayed(testFile.entry.name)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.doubleClickRow(testFolder1.entry.name)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(testFile.entry.name)];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().selectRow('Display name', testFile.entry.name)];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFile.entry.name)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkIsMarkedFavorite()];
                case 17:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C217216] Should be able to mark and unmark multiple folders as favorite', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, contentServicesPage.clickMultiSelectToggle()];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().waitTillContentLoaded()];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().clickCheckbox('Display name', testFolder1.entry.name)];
                case 3:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().clickCheckbox('Display name', testFolder2.entry.name)];
                case 4:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().clickCheckbox('Display name', testFolder3.entry.name)];
                case 5:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder1.entry.name)];
                case 6:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder2.entry.name)];
                case 7:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder3.entry.name)];
                case 8:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()];
                case 9: return [4 /*yield*/, _a.apply(void 0, [_g.sent()]).toBe(3)];
                case 10:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.clickOnFavoriteButton()];
                case 11:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.checkIsMarkedFavorite()];
                case 12:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().clickCheckbox('Display name', testFolder3.entry.name)];
                case 13:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsNotSelected('Display name', testFolder3.entry.name)];
                case 14:
                    _g.sent();
                    _b = expect;
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()];
                case 15: return [4 /*yield*/, _b.apply(void 0, [_g.sent()]).toBe(2)];
                case 16:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().clickCheckbox('Display name', testFolder4.entry.name)];
                case 17:
                    _g.sent();
                    _c = expect;
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()];
                case 18: return [4 /*yield*/, _c.apply(void 0, [_g.sent()]).toBe(3)];
                case 19:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder1.entry.name)];
                case 20:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder2.entry.name)];
                case 21:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder4.entry.name)];
                case 22:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.clickOnFavoriteButton()];
                case 23:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.checkIsMarkedFavorite()];
                case 24:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.clickOnFavoriteButton()];
                case 25:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.checkIsNotMarkedFavorite()];
                case 26:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkAllRows()];
                case 27:
                    _g.sent();
                    _d = expect;
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()];
                case 28: return [4 /*yield*/, _d.apply(void 0, [_g.sent()]).toBeGreaterThanOrEqual(4)];
                case 29:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().uncheckAllRows()];
                case 30:
                    _g.sent();
                    _e = expect;
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()];
                case 31: return [4 /*yield*/, _e.apply(void 0, [_g.sent()]).toBe(0)];
                case 32:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().clickCheckbox('Display name', testFolder3.entry.name)];
                case 33:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkRowIsSelected('Display name', testFolder3.entry.name)];
                case 34:
                    _g.sent();
                    _f = expect;
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().getNumberOfSelectedRows()];
                case 35: return [4 /*yield*/, _f.apply(void 0, [_g.sent()]).toBe(1)];
                case 36:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.checkIsMarkedFavorite()];
                case 37:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=favorite-directive.e2e.js.map