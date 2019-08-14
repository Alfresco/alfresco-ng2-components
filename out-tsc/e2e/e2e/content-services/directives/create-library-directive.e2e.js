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
var createLibraryDialog_1 = require("../../pages/adf/dialog/createLibraryDialog");
var customSourcesPage_1 = require("../../pages/adf/demo-shell/customSourcesPage");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var protractor_1 = require("protractor");
var js_api_1 = require("@alfresco/js-api");
var adf_testing_2 = require("@alfresco/adf-testing");
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
describe('Create library directive', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var createLibraryDialog = new createLibraryDialog_1.CreateLibraryDialog();
    var customSourcesPage = new customSourcesPage_1.CustomSources();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var visibility = {
        public: 'Public',
        private: 'Private',
        moderated: 'Moderated'
    };
    var createSite;
    var acsUser = new acsUserModel_1.AcsUserModel();
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'ECM',
                        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
                    });
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.sitesApi.createSite({
                            title: adf_testing_2.StringUtil.generateRandomString(20).toLowerCase(),
                            visibility: 'PUBLIC'
                        })];
                case 4:
                    createSite = _a.sent();
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
                    return [4 /*yield*/, contentServicesPage.openCreateLibraryDialog()];
                case 2:
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
    it('[C290158] Should display the Create Library defaults', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return __generator(this, function (_l) {
            switch (_l.label) {
                case 0:
                    _a = expect;
                    return [4 /*yield*/, createLibraryDialog.getTitle()];
                case 1: return [4 /*yield*/, _a.apply(void 0, [_l.sent()]).toMatch('Create Library')];
                case 2:
                    _l.sent();
                    _b = expect;
                    return [4 /*yield*/, createLibraryDialog.isNameDisplayed()];
                case 3: return [4 /*yield*/, _b.apply(void 0, [_l.sent()]).toBe(true, 'Name input field is not displayed')];
                case 4:
                    _l.sent();
                    _c = expect;
                    return [4 /*yield*/, createLibraryDialog.isLibraryIdDisplayed()];
                case 5: return [4 /*yield*/, _c.apply(void 0, [_l.sent()]).toBe(true, 'Library ID field is not displayed')];
                case 6:
                    _l.sent();
                    _d = expect;
                    return [4 /*yield*/, createLibraryDialog.isDescriptionDisplayed()];
                case 7: return [4 /*yield*/, _d.apply(void 0, [_l.sent()]).toBe(true, 'Library description is not displayed')];
                case 8:
                    _l.sent();
                    _e = expect;
                    return [4 /*yield*/, createLibraryDialog.isPublicDisplayed()];
                case 9: return [4 /*yield*/, _e.apply(void 0, [_l.sent()]).toBe(true, 'Public radio button is not displayed')];
                case 10:
                    _l.sent();
                    _f = expect;
                    return [4 /*yield*/, createLibraryDialog.isPrivateDisplayed()];
                case 11: return [4 /*yield*/, _f.apply(void 0, [_l.sent()]).toBe(true, 'Private radio button is not displayed')];
                case 12:
                    _l.sent();
                    _g = expect;
                    return [4 /*yield*/, createLibraryDialog.isModeratedDisplayed()];
                case 13: return [4 /*yield*/, _g.apply(void 0, [_l.sent()]).toBe(true, 'Moderated radio button is not displayed')];
                case 14:
                    _l.sent();
                    _h = expect;
                    return [4 /*yield*/, createLibraryDialog.isCreateEnabled()];
                case 15: return [4 /*yield*/, _h.apply(void 0, [_l.sent()]).toBe(false, 'Create button is not disabled')];
                case 16:
                    _l.sent();
                    _j = expect;
                    return [4 /*yield*/, createLibraryDialog.isCancelEnabled()];
                case 17: return [4 /*yield*/, _j.apply(void 0, [_l.sent()]).toBe(true, 'Cancel button is disabled')];
                case 18:
                    _l.sent();
                    _k = expect;
                    return [4 /*yield*/, createLibraryDialog.getSelectedRadio()];
                case 19: return [4 /*yield*/, _k.apply(void 0, [_l.sent()]).toMatch(visibility.public, 'The default visibility is not public')];
                case 20:
                    _l.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C290159] Should close the dialog when clicking Cancel button', function () { return __awaiter(_this, void 0, void 0, function () {
        var libraryName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    libraryName = 'cancelLibrary';
                    return [4 /*yield*/, createLibraryDialog.typeLibraryName(libraryName)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, createLibraryDialog.clickCancel()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, createLibraryDialog.waitForDialogToClose()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C290160] Should create a public library', function () { return __awaiter(_this, void 0, void 0, function () {
        var libraryName, libraryDescription, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    libraryName = adf_testing_2.StringUtil.generateRandomString();
                    libraryDescription = adf_testing_2.StringUtil.generateRandomString();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryName(libraryName)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryDescription(libraryDescription)];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.selectPublic()];
                case 3:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, createLibraryDialog.getSelectedRadio()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toMatch(visibility.public, 'The visibility is not public')];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.clickCreate()];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.waitForDialogToClose()];
                case 7:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, createLibraryDialog.isDialogOpen()];
                case 8: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).not.toBe(true, 'The Create Library dialog is not closed')];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, customSourcesPage.navigateToCustomSources()];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, customSourcesPage.selectMySitesSourceType()];
                case 11:
                    _d.sent();
                    return [4 /*yield*/, customSourcesPage.checkRowIsDisplayed(libraryName)];
                case 12:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, customSourcesPage.getStatusCell(libraryName)];
                case 13: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toMatch('PUBLIC', 'Wrong library status.')];
                case 14:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C290173] Should create a private library', function () { return __awaiter(_this, void 0, void 0, function () {
        var libraryName, libraryDescription, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    libraryName = adf_testing_2.StringUtil.generateRandomString();
                    libraryDescription = adf_testing_2.StringUtil.generateRandomString();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryName(libraryName)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryDescription(libraryDescription)];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.selectPrivate()];
                case 3:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, createLibraryDialog.getSelectedRadio()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toMatch(visibility.private, 'The visibility is not private')];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.clickCreate()];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.waitForDialogToClose()];
                case 7:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, createLibraryDialog.isDialogOpen()];
                case 8: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).not.toBe(true, 'The Create Library dialog is not closed')];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, customSourcesPage.navigateToCustomSources()];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, customSourcesPage.selectMySitesSourceType()];
                case 11:
                    _d.sent();
                    return [4 /*yield*/, customSourcesPage.checkRowIsDisplayed(libraryName)];
                case 12:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, customSourcesPage.getStatusCell(libraryName)];
                case 13: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toMatch('PRIVATE', 'Wrong library status.')];
                case 14:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C290174, C290175] Should create a moderated library with a given Library ID', function () { return __awaiter(_this, void 0, void 0, function () {
        var libraryName, libraryId, libraryDescription, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    libraryName = adf_testing_2.StringUtil.generateRandomString();
                    libraryId = adf_testing_2.StringUtil.generateRandomString();
                    libraryDescription = adf_testing_2.StringUtil.generateRandomString();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryName(libraryName)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryId(libraryId)];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryDescription(libraryDescription)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.selectModerated()];
                case 4:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, createLibraryDialog.getSelectedRadio()];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toMatch(visibility.moderated, 'The visibility is not moderated')];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.clickCreate()];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.waitForDialogToClose()];
                case 8:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, createLibraryDialog.isDialogOpen()];
                case 9: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).not.toBe(true, 'The Create Library dialog is not closed')];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, customSourcesPage.navigateToCustomSources()];
                case 11:
                    _d.sent();
                    return [4 /*yield*/, customSourcesPage.selectMySitesSourceType()];
                case 12:
                    _d.sent();
                    return [4 /*yield*/, customSourcesPage.checkRowIsDisplayed(libraryName)];
                case 13:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, customSourcesPage.getStatusCell(libraryName)];
                case 14: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toMatch('MODERATED', 'Wrong library status.')];
                case 15:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C290163] Should disable Create button when a mandatory field is not filled in', function () { return __awaiter(_this, void 0, void 0, function () {
        var inputValue, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    inputValue = adf_testing_2.StringUtil.generateRandomString();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryName(inputValue)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.clearLibraryId()];
                case 2:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, createLibraryDialog.isCreateEnabled()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).not.toBe(true, 'The Create button is enabled')];
                case 4:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.clearLibraryName()];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryId(inputValue)];
                case 6:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, createLibraryDialog.isCreateEnabled()];
                case 7: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).not.toBe(true, 'The Create button is enabled')];
                case 8:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.clearLibraryId()];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryDescription(inputValue)];
                case 10:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, createLibraryDialog.isCreateEnabled()];
                case 11: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).not.toBe(true, 'The Create button is enabled')];
                case 12:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C290164] Should auto-fill in the Library Id built from library name', function () { return __awaiter(_this, void 0, void 0, function () {
        var name, libraryId, i, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    name = ['abcd1234', 'ab cd 12 34', 'ab cd&12+34_@link/*'];
                    libraryId = ['abcd1234', 'ab-cd-12-34', 'ab-cd1234link'];
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < 3)) return [3 /*break*/, 7];
                    return [4 /*yield*/, createLibraryDialog.typeLibraryName(name[i])];
                case 2:
                    _b.sent();
                    _a = expect;
                    return [4 /*yield*/, createLibraryDialog.getLibraryIdText()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()]).toMatch(libraryId[i])];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, createLibraryDialog.clearLibraryName()];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    }); });
    it('[C290176] Should not accept special characters for Library Id', function () { return __awaiter(_this, void 0, void 0, function () {
        var name, libraryId, _i, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    name = 'My Library';
                    libraryId = ['My New Library', 'My+New+Library123!', '<>'];
                    return [4 /*yield*/, createLibraryDialog.typeLibraryName(name)];
                case 1:
                    _c.sent();
                    _i = 0;
                    _c.label = 2;
                case 2:
                    if (!(_i < 3)) return [3 /*break*/, 9];
                    return [4 /*yield*/, createLibraryDialog.typeLibraryId(libraryId[_i])];
                case 3:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, createLibraryDialog.isErrorMessageDisplayed()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true, 'Error message is not displayed')];
                case 5:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, createLibraryDialog.getErrorMessage()];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toMatch('Use numbers and letters only')];
                case 7:
                    _c.sent();
                    _c.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 2];
                case 9: return [2 /*return*/];
            }
        });
    }); });
    it('[C291985] Should not accept less than 2 characters for Library name', function () { return __awaiter(_this, void 0, void 0, function () {
        var name, libraryId, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    name = 'x';
                    libraryId = 'my-library-id';
                    return [4 /*yield*/, createLibraryDialog.typeLibraryName(name)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryId(libraryId)];
                case 2:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, createLibraryDialog.isErrorMessageDisplayed()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true, 'Error message is not displayed')];
                case 4:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, createLibraryDialog.getErrorMessage()];
                case 5: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toMatch('Title must be at least 2 characters long')];
                case 6:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C291793] Should display error for Name field filled in with spaces only', function () { return __awaiter(_this, void 0, void 0, function () {
        var name, libraryId, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    name = '    ';
                    libraryId = adf_testing_2.StringUtil.generateRandomString();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryName(name)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryId(libraryId)];
                case 2:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, createLibraryDialog.isErrorMessageDisplayed()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true, 'Error message is not displayed')];
                case 4:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, createLibraryDialog.getErrorMessage()];
                case 5: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toMatch("Library name can't contain only spaces")];
                case 6:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C290177] Should not accept a duplicate Library Id', function () { return __awaiter(_this, void 0, void 0, function () {
        var name, libraryId, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    name = 'My Library';
                    libraryId = adf_testing_2.StringUtil.generateRandomString();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryName(name)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryId(libraryId)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, createLibraryDialog.clickCreate()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, createLibraryDialog.waitForDialogToClose()];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, contentServicesPage.openCreateLibraryDialog()];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryName(name)];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryId(libraryId)];
                case 7:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, createLibraryDialog.isErrorMessageDisplayed()];
                case 8: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toBe(true, 'Error message is not displayed')];
                case 9:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, createLibraryDialog.getErrorMessage()];
                case 10: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).toMatch("This Library ID isn't available. Try a different Library ID.")];
                case 11:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C290178] Should accept the same library name but different Library Ids', function () { return __awaiter(_this, void 0, void 0, function () {
        var name, libraryId, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    name = createSite.entry.title;
                    libraryId = adf_testing_2.StringUtil.generateRandomString();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryName(name.toUpperCase())];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryId(libraryId)];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, createLibraryDialog.waitForLibraryNameHint()];
                case 3:
                    _c.sent();
                    _a = expect;
                    return [4 /*yield*/, createLibraryDialog.getLibraryNameHint()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_c.sent()]).toMatch('Library name already in use', 'The library name hint is wrong')];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, createLibraryDialog.clickCreate()];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, createLibraryDialog.waitForDialogToClose()];
                case 7:
                    _c.sent();
                    _b = expect;
                    return [4 /*yield*/, createLibraryDialog.isDialogOpen()];
                case 8: return [4 /*yield*/, _b.apply(void 0, [_c.sent()]).not.toBe(true, 'The Create library dialog remained open')];
                case 9:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C290179] Should not accept more than the expected characters for input fields', function () { return __awaiter(_this, void 0, void 0, function () {
        var name, libraryId, libraryDescription, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    name = adf_testing_2.StringUtil.generateRandomString(257);
                    libraryId = adf_testing_2.StringUtil.generateRandomString(73);
                    libraryDescription = adf_testing_2.StringUtil.generateRandomString(513);
                    return [4 /*yield*/, createLibraryDialog.typeLibraryName(name)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryId(libraryId)];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.typeLibraryDescription(libraryDescription)];
                case 3:
                    _d.sent();
                    return [4 /*yield*/, createLibraryDialog.selectPublic()];
                case 4:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, createLibraryDialog.getErrorMessages(0)];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toMatch('Use 256 characters or less for title')];
                case 6:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, createLibraryDialog.getErrorMessages(1)];
                case 7: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toMatch('Use 72 characters or less for the URL name')];
                case 8:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, createLibraryDialog.getErrorMessages(2)];
                case 9: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toMatch('Use 512 characters or less for description')];
                case 10:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=create-library-directive.e2e.js.map