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
var trashcanPage_1 = require("../pages/adf/trashcanPage");
var adf_testing_2 = require("@alfresco/adf-testing");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var acsUserModel_1 = require("../models/ACS/acsUserModel");
var folderModel_1 = require("../models/ACS/folderModel");
var util_1 = require("../util/util");
var js_api_1 = require("@alfresco/js-api");
var adf_testing_3 = require("@alfresco/adf-testing");
var protractor_1 = require("protractor");
describe('Trashcan - Pagination', function () {
    var pagination = {
        base: 'newFile',
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
    var trashcanPage = new trashcanPage_1.TrashcanPage();
    var paginationPage = new adf_testing_2.PaginationPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var acsUser = new acsUserModel_1.AcsUserModel();
    var newFolderModel = new folderModel_1.FolderModel({ name: 'newFolder' });
    var noOfFiles = 20;
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var uploadActions, fileNames, folderUploadedModel, emptyFiles, _loop_1, this_1, _i, _a, entry;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'ECM',
                        hostEcm: protractor_1.browser.params.testConfig.adf_acs.host
                    });
                    uploadActions = new adf_testing_3.UploadActions(this.alfrescoJsApi);
                    fileNames = util_1.Util.generateSequenceFiles(10, noOfFiles + 9, pagination.base, pagination.extension);
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.core.peopleApi.addPerson(acsUser)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(acsUser.id, acsUser.password)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, uploadActions.createFolder(newFolderModel.name, '-my-')];
                case 4:
                    folderUploadedModel = _b.sent();
                    return [4 /*yield*/, uploadActions.createEmptyFiles(fileNames, folderUploadedModel.entry.id)];
                case 5:
                    emptyFiles = _b.sent();
                    _loop_1 = function (entry) {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this_1.alfrescoJsApi.node.deleteNode(entry.entry.id).then(function () { }, function () {
                                        _this.alfrescoJsApi.node.deleteNode(entry.entry.id);
                                    })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    this_1 = this;
                    _i = 0, _a = emptyFiles.list.entries;
                    _b.label = 6;
                case 6:
                    if (!(_i < _a.length)) return [3 /*break*/, 9];
                    entry = _a[_i];
                    return [5 /*yield**/, _loop_1(entry)];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9: return [4 /*yield*/, loginPage.loginToContentServicesUsingUserModel(acsUser)];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, navigationBarPage.clickTrashcanButton()];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, trashcanPage.waitForTableBody()];
                case 12:
                    _b.sent();
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
                case 0: return [4 /*yield*/, protractor_1.browser.refresh()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, trashcanPage.waitForTableBody()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C272811] Should be able to set Items per page to 20', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.twenty)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, trashcanPage.waitForTableBody()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, trashcanPage.waitForPagination()];
                case 3:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toEqual(itemsPerPage.twenty)];
                case 5:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual('Showing 1-' + noOfFiles + ' of ' + noOfFiles)];
                case 7:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, trashcanPage.numberOfResultsDisplayed()];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(noOfFiles)];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, paginationPage.checkNextPageButtonIsDisabled()];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                case 11:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C276742] Should be able to set Items per page to 15', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.fifteen)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, trashcanPage.waitForTableBody()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, trashcanPage.waitForPagination()];
                case 3:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toEqual(itemsPerPage.fifteen)];
                case 5:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual('Showing 1-' + itemsPerPage.fifteenValue + ' of ' + noOfFiles)];
                case 7:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, trashcanPage.numberOfResultsDisplayed()];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(itemsPerPage.fifteenValue)];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, paginationPage.checkNextPageButtonIsEnabled()];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                case 11:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C276743] Should be able to set Items per page to 10', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.ten)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, trashcanPage.waitForTableBody()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, trashcanPage.waitForPagination()];
                case 3:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toEqual(itemsPerPage.ten)];
                case 5:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual('Showing 1-' + itemsPerPage.tenValue + ' of ' + noOfFiles)];
                case 7:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, trashcanPage.numberOfResultsDisplayed()];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(itemsPerPage.tenValue)];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, paginationPage.checkNextPageButtonIsEnabled()];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                case 11:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C276744] Should be able to set Items per page to 5', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.five)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, trashcanPage.waitForTableBody()];
                case 2:
                    _d.sent();
                    return [4 /*yield*/, trashcanPage.waitForPagination()];
                case 3:
                    _d.sent();
                    _a = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 4: return [4 /*yield*/, _a.apply(void 0, [_d.sent()]).toEqual(itemsPerPage.five)];
                case 5:
                    _d.sent();
                    _b = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 6: return [4 /*yield*/, _b.apply(void 0, [_d.sent()]).toEqual('Showing 1-' + itemsPerPage.fiveValue + ' of ' + noOfFiles)];
                case 7:
                    _d.sent();
                    _c = expect;
                    return [4 /*yield*/, trashcanPage.numberOfResultsDisplayed()];
                case 8: return [4 /*yield*/, _c.apply(void 0, [_d.sent()]).toBe(itemsPerPage.fiveValue)];
                case 9:
                    _d.sent();
                    return [4 /*yield*/, paginationPage.checkNextPageButtonIsEnabled()];
                case 10:
                    _d.sent();
                    return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                case 11:
                    _d.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=trashcan-pagination.e2e.js.map