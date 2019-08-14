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
var navigationBarPage_1 = require("../../pages/adf/navigationBarPage");
var acsUserModel_1 = require("../../models/ACS/acsUserModel");
var folderModel_1 = require("../../models/ACS/folderModel");
var util_1 = require("../../util/util");
var protractor_1 = require("protractor");
var js_api_1 = require("@alfresco/js-api");
describe('Document List - Pagination', function () {
    var pagination = {
        base: 'newFile',
        secondSetBase: 'secondSet',
        extension: '.txt'
    };
    var itemsPerPage = {
        five: '5',
        fiveValue: 5,
        ten: '10',
        tenValue: 10,
        fifteen: '15',
        fifteenValue: 15,
        twenty: '20',
        twentyValue: 20,
        default: '25'
    };
    var loginPage = new adf_testing_1.LoginPage();
    var contentServicesPage = new contentServicesPage_1.ContentServicesPage();
    var paginationPage = new adf_testing_1.PaginationPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var newFolderModel = new folderModel_1.FolderModel({ name: 'newFolder' });
    var fileNames = [];
    var nrOfFiles = 20;
    var currentPage = 1;
    var secondSetOfFiles = [];
    var secondSetNumber = 25;
    var folderTwoModel = new folderModel_1.FolderModel({ name: 'folderTwo' });
    var folderThreeModel = new folderModel_1.FolderModel({ name: 'folderThree' });
    _this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
        provider: 'ECM',
        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
    });
    var uploadActions = new adf_testing_1.UploadActions(_this.alfrescoJsApi);
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var folderThreeUploadedModel, newFolderUploadedModel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileNames = util_1.Util.generateSequenceFiles(10, nrOfFiles + 9, pagination.base, pagination.extension);
                    secondSetOfFiles = util_1.Util.generateSequenceFiles(10, secondSetNumber + 9, pagination.secondSetBase, pagination.extension);
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(folderThreeModel.name, '-my-')];
                case 4:
                    folderThreeUploadedModel = _a.sent();
                    return [4 /*yield*/, uploadActions.createFolder(newFolderModel.name, '-my-')];
                case 5:
                    newFolderUploadedModel = _a.sent();
                    return [4 /*yield*/, uploadActions.createEmptyFiles(fileNames, newFolderUploadedModel.entry.id)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, uploadActions.createEmptyFiles(secondSetOfFiles, folderThreeUploadedModel.entry.id)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 8:
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
    beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260062] Should use default pagination settings', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, list;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, contentServicesPage.doubleClickRow(newFolderModel.name)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 3:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toEqual(itemsPerPage.twenty)];
                case 5:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual('Showing 1-' + nrOfFiles + ' of ' + nrOfFiles)];
                case 7:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(nrOfFiles)];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.getAllRowsNameColumn()];
                case 10:
                    list = _d.sent();
                    return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, fileNames)).toEqual(true)];
                case 11:
                    _d.sent();
                    return [4 /*yield*/, paginationPage.checkNextPageButtonIsDisabled()];
                case 12:
                    _d.sent();
                    return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                case 13:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C274713] Should be able to set Items per page to 20', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, list, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, contentServicesPage.doubleClickRow(newFolderModel.name)];
                case 1:
                    _e.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 2:
                    _e.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 3:
                    _e.sent();
                    return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.twenty)];
                case 4:
                    _e.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 5:
                    _e.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 6:
                    _e.sent();
                    _a = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 7: return [4 /*yield*/, _a.apply(void 0, [_e.sent()]).toEqual(itemsPerPage.twenty)];
                case 8:
                    _e.sent();
                    _b = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 9: return [4 /*yield*/, _b.apply(void 0, [_e.sent()]).toEqual('Showing 1-' + nrOfFiles + ' of ' + nrOfFiles)];
                case 10:
                    _e.sent();
                    _c = expect;
                    return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 11: return [4 /*yield*/, _c.apply(void 0, [_e.sent()]).toBe(nrOfFiles)];
                case 12:
                    _e.sent();
                    return [4 /*yield*/, contentServicesPage.getAllRowsNameColumn()];
                case 13:
                    list = _e.sent();
                    return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, fileNames)).toEqual(true)];
                case 14:
                    _e.sent();
                    return [4 /*yield*/, paginationPage.checkNextPageButtonIsDisabled()];
                case 15:
                    _e.sent();
                    return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                case 16:
                    _e.sent();
                    return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 17:
                    _e.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 18:
                    _e.sent();
                    return [4 /*yield*/, contentServicesPage.goToDocumentList()];
                case 19:
                    _e.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 20:
                    _e.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 21:
                    _e.sent();
                    _d = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 22: return [4 /*yield*/, _d.apply(void 0, [_e.sent()]).toEqual(itemsPerPage.twenty)];
                case 23:
                    _e.sent();
                    return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 24:
                    _e.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 25:
                    _e.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260069] Should be able to set Items per page to 5', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, list, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, contentServicesPage.doubleClickRow(newFolderModel.name)];
                case 1:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 2:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 3:
                    _p.sent();
                    return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.five)];
                case 4:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 5:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 6:
                    _p.sent();
                    _a = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 7: return [4 /*yield*/, _a.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.five)];
                case 8:
                    _p.sent();
                    _b = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 9: return [4 /*yield*/, _b.apply(void 0, [_p.sent()]).toEqual('Showing 1-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfFiles)];
                case 10:
                    _p.sent();
                    _c = expect;
                    return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 11: return [4 /*yield*/, _c.apply(void 0, [_p.sent()]).toBe(itemsPerPage.fiveValue)];
                case 12:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.getAllRowsNameColumn()];
                case 13:
                    list = _p.sent();
                    return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, fileNames.slice(0, 5))).toEqual(true)];
                case 14:
                    _p.sent();
                    return [4 /*yield*/, paginationPage.clickOnNextPage()];
                case 15:
                    _p.sent();
                    currentPage++;
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 16:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 17:
                    _p.sent();
                    _d = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 18: return [4 /*yield*/, _d.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.five)];
                case 19:
                    _p.sent();
                    _e = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 20: return [4 /*yield*/, _e.apply(void 0, [_p.sent()]).toEqual('Showing 6-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfFiles)];
                case 21:
                    _p.sent();
                    _f = expect;
                    return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 22: return [4 /*yield*/, _f.apply(void 0, [_p.sent()]).toBe(itemsPerPage.fiveValue)];
                case 23:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.getAllRowsNameColumn()];
                case 24:
                    list = _p.sent();
                    return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, fileNames.slice(5, 10))).toEqual(true)];
                case 25:
                    _p.sent();
                    return [4 /*yield*/, paginationPage.clickOnNextPage()];
                case 26:
                    _p.sent();
                    currentPage++;
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 27:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 28:
                    _p.sent();
                    _g = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 29: return [4 /*yield*/, _g.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.five)];
                case 30:
                    _p.sent();
                    _h = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 31: return [4 /*yield*/, _h.apply(void 0, [_p.sent()]).toEqual('Showing 11-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfFiles)];
                case 32:
                    _p.sent();
                    _j = expect;
                    return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 33: return [4 /*yield*/, _j.apply(void 0, [_p.sent()]).toBe(itemsPerPage.fiveValue)];
                case 34:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.getAllRowsNameColumn()];
                case 35:
                    list = _p.sent();
                    return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, fileNames.slice(10, 15))).toEqual(true)];
                case 36:
                    _p.sent();
                    return [4 /*yield*/, paginationPage.clickOnNextPage()];
                case 37:
                    _p.sent();
                    currentPage++;
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 38:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 39:
                    _p.sent();
                    _k = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 40: return [4 /*yield*/, _k.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.five)];
                case 41:
                    _p.sent();
                    _l = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 42: return [4 /*yield*/, _l.apply(void 0, [_p.sent()]).toEqual('Showing 16-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfFiles)];
                case 43:
                    _p.sent();
                    _m = expect;
                    return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 44: return [4 /*yield*/, _m.apply(void 0, [_p.sent()]).toBe(itemsPerPage.fiveValue)];
                case 45:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.getAllRowsNameColumn()];
                case 46:
                    list = _p.sent();
                    return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, fileNames.slice(15, 20))).toEqual(true)];
                case 47:
                    _p.sent();
                    return [4 /*yield*/, protractor_1.browser.refresh()];
                case 48:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 49:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 50:
                    _p.sent();
                    _o = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 51: return [4 /*yield*/, _o.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.five)];
                case 52:
                    _p.sent();
                    return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 53:
                    _p.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 54:
                    _p.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260067] Should be able to set Items per page to 10', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, list, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    currentPage = 1;
                    return [4 /*yield*/, contentServicesPage.doubleClickRow(newFolderModel.name)];
                case 1:
                    _h.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 2:
                    _h.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 3:
                    _h.sent();
                    return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.ten)];
                case 4:
                    _h.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 5:
                    _h.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 6:
                    _h.sent();
                    _a = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 7: return [4 /*yield*/, _a.apply(void 0, [_h.sent()]).toEqual(itemsPerPage.ten)];
                case 8:
                    _h.sent();
                    _b = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 9: return [4 /*yield*/, _b.apply(void 0, [_h.sent()]).toEqual('Showing 1-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfFiles)];
                case 10:
                    _h.sent();
                    _c = expect;
                    return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 11: return [4 /*yield*/, _c.apply(void 0, [_h.sent()]).toBe(itemsPerPage.tenValue)];
                case 12:
                    _h.sent();
                    return [4 /*yield*/, contentServicesPage.getAllRowsNameColumn()];
                case 13:
                    list = _h.sent();
                    return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, fileNames.slice(0, 10))).toEqual(true)];
                case 14:
                    _h.sent();
                    return [4 /*yield*/, paginationPage.clickOnNextPage()];
                case 15:
                    _h.sent();
                    currentPage++;
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 16:
                    _h.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 17:
                    _h.sent();
                    _d = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 18: return [4 /*yield*/, _d.apply(void 0, [_h.sent()]).toEqual(itemsPerPage.ten)];
                case 19:
                    _h.sent();
                    _e = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 20: return [4 /*yield*/, _e.apply(void 0, [_h.sent()]).toEqual('Showing 11-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfFiles)];
                case 21:
                    _h.sent();
                    _f = expect;
                    return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 22: return [4 /*yield*/, _f.apply(void 0, [_h.sent()]).toBe(itemsPerPage.tenValue)];
                case 23:
                    _h.sent();
                    return [4 /*yield*/, contentServicesPage.getAllRowsNameColumn()];
                case 24:
                    list = _h.sent();
                    return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, fileNames.slice(10, 20))).toEqual(true)];
                case 25:
                    _h.sent();
                    return [4 /*yield*/, protractor_1.browser.refresh()];
                case 26:
                    _h.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 27:
                    _h.sent();
                    _g = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 28: return [4 /*yield*/, _g.apply(void 0, [_h.sent()]).toEqual(itemsPerPage.ten)];
                case 29:
                    _h.sent();
                    return [4 /*yield*/, navigationBarPage.clickLogoutButton()];
                case 30:
                    _h.sent();
                    return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 31:
                    _h.sent();
                    currentPage = 1;
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260065] Should be able to set Items per page to 15', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, list, _e, _f, _g, _h;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    currentPage = 1;
                    return [4 /*yield*/, contentServicesPage.doubleClickRow(newFolderModel.name)];
                case 1:
                    _j.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 2:
                    _j.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 3:
                    _j.sent();
                    _a = expect;
                    return [4 /*yield*/, contentServicesPage.getActiveBreadcrumb()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_j.sent()]).toEqual(newFolderModel.name)];
                case 5:
                    _j.sent();
                    return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.fifteen)];
                case 6:
                    _j.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 7:
                    _j.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 8:
                    _j.sent();
                    _b = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 9: return [4 /*yield*/, _b.apply(void 0, [_j.sent()]).toEqual(itemsPerPage.fifteen)];
                case 10:
                    _j.sent();
                    _c = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 11: return [4 /*yield*/, _c.apply(void 0, [_j.sent()]).toEqual('Showing 1-' + itemsPerPage.fifteenValue * currentPage + ' of ' + nrOfFiles)];
                case 12:
                    _j.sent();
                    _d = expect;
                    return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 13: return [4 /*yield*/, _d.apply(void 0, [_j.sent()]).toBe(itemsPerPage.fifteenValue)];
                case 14:
                    _j.sent();
                    return [4 /*yield*/, contentServicesPage.getAllRowsNameColumn()];
                case 15:
                    list = _j.sent();
                    return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, fileNames.slice(0, 15))).toEqual(true)];
                case 16:
                    _j.sent();
                    currentPage++;
                    return [4 /*yield*/, paginationPage.clickOnNextPage()];
                case 17:
                    _j.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 18:
                    _j.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 19:
                    _j.sent();
                    _e = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 20: return [4 /*yield*/, _e.apply(void 0, [_j.sent()]).toEqual(itemsPerPage.fifteen)];
                case 21:
                    _j.sent();
                    _f = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 22: return [4 /*yield*/, _f.apply(void 0, [_j.sent()]).toEqual('Showing 16-' + nrOfFiles + ' of ' + nrOfFiles)];
                case 23:
                    _j.sent();
                    _g = expect;
                    return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 24: return [4 /*yield*/, _g.apply(void 0, [_j.sent()]).toBe(nrOfFiles - itemsPerPage.fifteenValue)];
                case 25:
                    _j.sent();
                    return [4 /*yield*/, contentServicesPage.getAllRowsNameColumn()];
                case 26:
                    list = _j.sent();
                    return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, fileNames.slice(15, 20))).toEqual(true)];
                case 27:
                    _j.sent();
                    return [4 /*yield*/, protractor_1.browser.refresh()];
                case 28:
                    _j.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 29:
                    _j.sent();
                    _h = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 30: return [4 /*yield*/, _h.apply(void 0, [_j.sent()]).toEqual(itemsPerPage.fifteen)];
                case 31:
                    _j.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C91320] Pagination should preserve sorting', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, contentServicesPage.doubleClickRow(newFolderModel.name)];
                case 1:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 2:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 3:
                    _g.sent();
                    _a = expect;
                    return [4 /*yield*/, contentServicesPage.getActiveBreadcrumb()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_g.sent()]).toEqual(newFolderModel.name)];
                case 5:
                    _g.sent();
                    return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.twenty)];
                case 6:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 7:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 8:
                    _g.sent();
                    _b = expect;
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkListIsSorted('ASC', 'Display name')];
                case 9: return [4 /*yield*/, _b.apply(void 0, [_g.sent()])];
                case 10:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.sortByName('DESC')];
                case 11:
                    _g.sent();
                    _c = expect;
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkListIsSorted('DESC', 'Display name')];
                case 12: return [4 /*yield*/, _c.apply(void 0, [_g.sent()])];
                case 13:
                    _g.sent();
                    return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.five)];
                case 14:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 15:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 16:
                    _g.sent();
                    _d = expect;
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkListIsSorted('DESC', 'Display name')];
                case 17: return [4 /*yield*/, _d.apply(void 0, [_g.sent()])];
                case 18:
                    _g.sent();
                    return [4 /*yield*/, paginationPage.clickOnNextPage()];
                case 19:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 20:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 21:
                    _g.sent();
                    _e = expect;
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkListIsSorted('DESC', 'Display name')];
                case 22: return [4 /*yield*/, _e.apply(void 0, [_g.sent()])];
                case 23:
                    _g.sent();
                    return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.ten)];
                case 24:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 25:
                    _g.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 26:
                    _g.sent();
                    _f = expect;
                    return [4 /*yield*/, contentServicesPage.getDocumentList().dataTablePage().checkListIsSorted('DESC', 'Display name')];
                case 27: return [4 /*yield*/, _f.apply(void 0, [_g.sent()])];
                case 28:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260107] Should not display pagination bar when a folder is empty', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.five)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 3:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toEqual(itemsPerPage.five)];
                case 5:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.doubleClickRow(newFolderModel.name)];
                case 6:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 7:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 8:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, contentServicesPage.getActiveBreadcrumb()];
                case 9: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual(newFolderModel.name)];
                case 10:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 11: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toEqual(itemsPerPage.five)];
                case 12:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.createNewFolder(folderTwoModel.name)];
                case 13:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.checkContentIsDisplayed(folderTwoModel.name)];
                case 14:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.doubleClickRow(folderTwoModel.name)];
                case 15:
                    _d.sent();
                    return [4 /*yield*/, contentServicesPage.checkPaginationIsNotDisplayed()];
                case 16:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260071] Should be able to change pagination when having 25 files', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, list, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0:
                    currentPage = 1;
                    return [4 /*yield*/, contentServicesPage.doubleClickRow(folderThreeModel.name)];
                case 1:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 2:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 3:
                    _p.sent();
                    _a = expect;
                    return [4 /*yield*/, contentServicesPage.getActiveBreadcrumb()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_p.sent()]).toEqual(folderThreeModel.name)];
                case 5:
                    _p.sent();
                    return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.fifteen)];
                case 6:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 7:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 8:
                    _p.sent();
                    _b = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 9: return [4 /*yield*/, _b.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.fifteen)];
                case 10:
                    _p.sent();
                    _c = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 11: return [4 /*yield*/, _c.apply(void 0, [_p.sent()]).toEqual('Showing 1-' + itemsPerPage.fifteenValue * currentPage + ' of ' + secondSetNumber)];
                case 12:
                    _p.sent();
                    _d = expect;
                    return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 13: return [4 /*yield*/, _d.apply(void 0, [_p.sent()]).toBe(itemsPerPage.fifteenValue)];
                case 14:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.getAllRowsNameColumn()];
                case 15:
                    list = _p.sent();
                    return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, secondSetOfFiles.slice(0, 15))).toEqual(true)];
                case 16:
                    _p.sent();
                    currentPage++;
                    return [4 /*yield*/, paginationPage.clickOnNextPage()];
                case 17:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 18:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 19:
                    _p.sent();
                    _e = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 20: return [4 /*yield*/, _e.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.fifteen)];
                case 21:
                    _p.sent();
                    _f = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 22: return [4 /*yield*/, _f.apply(void 0, [_p.sent()]).toEqual('Showing 16-' + secondSetNumber + ' of ' + secondSetNumber)];
                case 23:
                    _p.sent();
                    _g = expect;
                    return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 24: return [4 /*yield*/, _g.apply(void 0, [_p.sent()]).toBe(secondSetNumber - itemsPerPage.fifteenValue)];
                case 25:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.getAllRowsNameColumn()];
                case 26:
                    list = _p.sent();
                    return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, secondSetOfFiles.slice(15, 25))).toEqual(true)];
                case 27:
                    _p.sent();
                    currentPage = 1;
                    return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.twenty)];
                case 28:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 29:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 30:
                    _p.sent();
                    _h = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 31: return [4 /*yield*/, _h.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.twenty)];
                case 32:
                    _p.sent();
                    _j = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 33: return [4 /*yield*/, _j.apply(void 0, [_p.sent()]).toEqual('Showing 1-' + itemsPerPage.twentyValue * currentPage + ' of ' + secondSetNumber)];
                case 34:
                    _p.sent();
                    _k = expect;
                    return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 35: return [4 /*yield*/, _k.apply(void 0, [_p.sent()]).toBe(itemsPerPage.twentyValue)];
                case 36:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.getAllRowsNameColumn()];
                case 37:
                    list = _p.sent();
                    return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, secondSetOfFiles.slice(0, 20))).toEqual(true)];
                case 38:
                    _p.sent();
                    currentPage++;
                    return [4 /*yield*/, paginationPage.clickOnNextPage()];
                case 39:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.checkAcsContainer()];
                case 40:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.waitForTableBody()];
                case 41:
                    _p.sent();
                    _l = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 42: return [4 /*yield*/, _l.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.twenty)];
                case 43:
                    _p.sent();
                    _m = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 44: return [4 /*yield*/, _m.apply(void 0, [_p.sent()]).toEqual('Showing 21-' + secondSetNumber + ' of ' + secondSetNumber)];
                case 45:
                    _p.sent();
                    _o = expect;
                    return [4 /*yield*/, contentServicesPage.numberOfResultsDisplayed()];
                case 46: return [4 /*yield*/, _o.apply(void 0, [_p.sent()]).toBe(secondSetNumber - itemsPerPage.twentyValue)];
                case 47:
                    _p.sent();
                    return [4 /*yield*/, contentServicesPage.getAllRowsNameColumn()];
                case 48:
                    list = _p.sent();
                    return [4 /*yield*/, expect(util_1.Util.arrayContainsArray(list, secondSetOfFiles.slice(20, 25))).toEqual(true)];
                case 49:
                    _p.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=document-list-pagination.e2e.js.map