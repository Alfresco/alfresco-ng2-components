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
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var adf_testing_2 = require("@alfresco/adf-testing");
var processFiltersPage_1 = require("../pages/adf/process-services/processFiltersPage");
var processDetailsPage_1 = require("../pages/adf/process-services/processDetailsPage");
var protractor_1 = require("protractor");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var apps_actions_1 = require("../actions/APS/apps.actions");
var users_actions_1 = require("../actions/users.actions");
describe('Process List - Pagination', function () {
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
    var processFilterRunning = 'Running';
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var paginationPage = new adf_testing_2.PaginationPage();
    var processFiltersPage = new processFiltersPage_1.ProcessFiltersPage();
    var processDetailsPage = new processDetailsPage_1.ProcessDetailsPage();
    var deployedTestApp;
    var processUserModel;
    var app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var nrOfProcesses = 20;
    var page;
    var totalPages;
    var processNameBase = 'process';
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var apps, users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apps = new apps_actions_1.AppsActions();
                    users = new users_actions_1.UsersActions();
                    this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                        provider: 'BPM',
                        hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                    });
                    return [4 /*yield*/, this.alfrescoJsApi.login(protractor_1.browser.params.testConfig.adf.adminEmail, protractor_1.browser.params.testConfig.adf.adminPassword)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, users.createTenantAndUser(this.alfrescoJsApi)];
                case 2:
                    processUserModel = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(processUserModel.email, processUserModel.password)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location)];
                case 4:
                    deployedTestApp = _a.sent();
                    return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(processUserModel)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Empty processes', function () {
        it('[C280015] Should show empty content message an no pagination when no process are present', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                    case 1: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                    case 2: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.checkNoContentMessage()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, paginationPage.checkPaginationIsNotDisplayed()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('With processes Pagination', function () {
        beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
            var apps, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        apps = new apps_actions_1.AppsActions();
                        this.alfrescoJsApi = new js_api_1.AlfrescoApiCompatibility({
                            provider: 'BPM',
                            hostBpm: protractor_1.browser.params.testConfig.adf_aps.host
                        });
                        return [4 /*yield*/, this.alfrescoJsApi.login(processUserModel.email, processUserModel.password)];
                    case 1:
                        _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < nrOfProcesses)) return [3 /*break*/, 5];
                        return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, deployedTestApp, processNameBase + (i < 10 ? "0" + i : i))];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        }); });
        beforeEach(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                    case 1: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                    case 2: return [4 /*yield*/, (_a.sent()).clickProcessButton()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C261042] Should display default pagination', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        page = 1;
                        totalPages = 1;
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 1:
                        _f.sent();
                        return [4 /*yield*/, processFiltersPage.checkFilterIsHighlighted(processFilterRunning)];
                    case 2:
                        _f.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 3:
                        _f.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 4:
                        _f.sent();
                        _a = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 5: return [4 /*yield*/, _a.apply(void 0, [_f.sent()]).toEqual('Page ' + page)];
                    case 6:
                        _f.sent();
                        _b = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 7: return [4 /*yield*/, _b.apply(void 0, [_f.sent()]).toEqual('of ' + totalPages)];
                    case 8:
                        _f.sent();
                        _c = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 9: return [4 /*yield*/, _c.apply(void 0, [_f.sent()]).toEqual(itemsPerPage.twenty)];
                    case 10:
                        _f.sent();
                        _d = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 11: return [4 /*yield*/, _d.apply(void 0, [_f.sent()]).toEqual('Showing 1-' + nrOfProcesses + ' of ' + nrOfProcesses)];
                    case 12:
                        _f.sent();
                        _e = expect;
                        return [4 /*yield*/, processFiltersPage.numberOfProcessRows()];
                    case 13: return [4 /*yield*/, _e.apply(void 0, [_f.sent()]).toBe(nrOfProcesses)];
                    case 14:
                        _f.sent();
                        return [4 /*yield*/, paginationPage.checkNextPageButtonIsDisabled()];
                    case 15:
                        _f.sent();
                        return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                    case 16:
                        _f.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C261043] Should be possible to Items per page to 15', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            return __generator(this, function (_p) {
                switch (_p.label) {
                    case 0:
                        page = 1;
                        totalPages = 2;
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 1:
                        _p.sent();
                        return [4 /*yield*/, processFiltersPage.checkFilterIsHighlighted(processFilterRunning)];
                    case 2:
                        _p.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 3:
                        _p.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 4:
                        _p.sent();
                        return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.fifteen)];
                    case 5:
                        _p.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 6:
                        _p.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 7:
                        _p.sent();
                        _a = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 8: return [4 /*yield*/, _a.apply(void 0, [_p.sent()]).toEqual('Page ' + page)];
                    case 9:
                        _p.sent();
                        _b = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 10: return [4 /*yield*/, _b.apply(void 0, [_p.sent()]).toEqual('of ' + totalPages)];
                    case 11:
                        _p.sent();
                        _c = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 12: return [4 /*yield*/, _c.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.fifteen)];
                    case 13:
                        _p.sent();
                        _d = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 14: return [4 /*yield*/, _d.apply(void 0, [_p.sent()]).toEqual('Showing 1-' + itemsPerPage.fifteenValue * page + ' of ' + nrOfProcesses)];
                    case 15:
                        _p.sent();
                        _e = expect;
                        return [4 /*yield*/, processFiltersPage.numberOfProcessRows()];
                    case 16: return [4 /*yield*/, _e.apply(void 0, [_p.sent()]).toBe(itemsPerPage.fifteenValue)];
                    case 17:
                        _p.sent();
                        return [4 /*yield*/, paginationPage.checkNextPageButtonIsEnabled()];
                    case 18:
                        _p.sent();
                        return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                    case 19:
                        _p.sent();
                        page++;
                        return [4 /*yield*/, paginationPage.clickOnNextPage()];
                    case 20:
                        _p.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 21:
                        _p.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 22:
                        _p.sent();
                        _f = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 23: return [4 /*yield*/, _f.apply(void 0, [_p.sent()]).toEqual('Page ' + page)];
                    case 24:
                        _p.sent();
                        _g = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 25: return [4 /*yield*/, _g.apply(void 0, [_p.sent()]).toEqual('of ' + totalPages)];
                    case 26:
                        _p.sent();
                        _h = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 27: return [4 /*yield*/, _h.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.fifteen)];
                    case 28:
                        _p.sent();
                        _j = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 29: return [4 /*yield*/, _j.apply(void 0, [_p.sent()]).toEqual('Showing 16-' + nrOfProcesses + ' of ' + nrOfProcesses)];
                    case 30:
                        _p.sent();
                        _k = expect;
                        return [4 /*yield*/, processFiltersPage.numberOfProcessRows()];
                    case 31: return [4 /*yield*/, _k.apply(void 0, [_p.sent()]).toBe(nrOfProcesses - itemsPerPage.fifteenValue)];
                    case 32:
                        _p.sent();
                        return [4 /*yield*/, paginationPage.checkNextPageButtonIsDisabled()];
                    case 33:
                        _p.sent();
                        return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsEnabled()];
                    case 34:
                        _p.sent();
                        page = 1;
                        return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                    case 35: return [4 /*yield*/, (_p.sent()).goToTaskApp()];
                    case 36: return [4 /*yield*/, (_p.sent()).clickProcessButton()];
                    case 37:
                        _p.sent();
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 38:
                        _p.sent();
                        return [4 /*yield*/, processFiltersPage.checkFilterIsHighlighted(processFilterRunning)];
                    case 39:
                        _p.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 40:
                        _p.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 41:
                        _p.sent();
                        _l = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 42: return [4 /*yield*/, _l.apply(void 0, [_p.sent()]).toEqual('Page ' + page)];
                    case 43:
                        _p.sent();
                        _m = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 44: return [4 /*yield*/, _m.apply(void 0, [_p.sent()]).toEqual('of ' + totalPages)];
                    case 45:
                        _p.sent();
                        _o = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 46: return [4 /*yield*/, _o.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.fifteen)];
                    case 47:
                        _p.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C261044] Should be possible to Items per page to 10', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            return __generator(this, function (_p) {
                switch (_p.label) {
                    case 0:
                        page = 1;
                        totalPages = 2;
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 1:
                        _p.sent();
                        return [4 /*yield*/, processFiltersPage.checkFilterIsHighlighted(processFilterRunning)];
                    case 2:
                        _p.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 3:
                        _p.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 4:
                        _p.sent();
                        return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.ten)];
                    case 5:
                        _p.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 6:
                        _p.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 7:
                        _p.sent();
                        _a = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 8: return [4 /*yield*/, _a.apply(void 0, [_p.sent()]).toEqual('Page ' + page)];
                    case 9:
                        _p.sent();
                        _b = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 10: return [4 /*yield*/, _b.apply(void 0, [_p.sent()]).toEqual('of ' + totalPages)];
                    case 11:
                        _p.sent();
                        _c = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 12: return [4 /*yield*/, _c.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.ten)];
                    case 13:
                        _p.sent();
                        _d = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 14: return [4 /*yield*/, _d.apply(void 0, [_p.sent()]).toEqual('Showing 1-' + itemsPerPage.tenValue * page + ' of ' + nrOfProcesses)];
                    case 15:
                        _p.sent();
                        _e = expect;
                        return [4 /*yield*/, processFiltersPage.numberOfProcessRows()];
                    case 16: return [4 /*yield*/, _e.apply(void 0, [_p.sent()]).toBe(itemsPerPage.tenValue)];
                    case 17:
                        _p.sent();
                        return [4 /*yield*/, paginationPage.checkNextPageButtonIsEnabled()];
                    case 18:
                        _p.sent();
                        return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                    case 19:
                        _p.sent();
                        page++;
                        return [4 /*yield*/, paginationPage.clickOnNextPage()];
                    case 20:
                        _p.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 21:
                        _p.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 22:
                        _p.sent();
                        _f = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 23: return [4 /*yield*/, _f.apply(void 0, [_p.sent()]).toEqual('Page ' + page)];
                    case 24:
                        _p.sent();
                        _g = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 25: return [4 /*yield*/, _g.apply(void 0, [_p.sent()]).toEqual('of ' + totalPages)];
                    case 26:
                        _p.sent();
                        _h = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 27: return [4 /*yield*/, _h.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.ten)];
                    case 28:
                        _p.sent();
                        _j = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 29: return [4 /*yield*/, _j.apply(void 0, [_p.sent()]).toEqual('Showing 11-' + nrOfProcesses + ' of ' + nrOfProcesses)];
                    case 30:
                        _p.sent();
                        _k = expect;
                        return [4 /*yield*/, processFiltersPage.numberOfProcessRows()];
                    case 31: return [4 /*yield*/, _k.apply(void 0, [_p.sent()]).toBe(itemsPerPage.tenValue)];
                    case 32:
                        _p.sent();
                        return [4 /*yield*/, paginationPage.checkNextPageButtonIsDisabled()];
                    case 33:
                        _p.sent();
                        return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsEnabled()];
                    case 34:
                        _p.sent();
                        page = 1;
                        return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                    case 35: return [4 /*yield*/, (_p.sent()).goToTaskApp()];
                    case 36: return [4 /*yield*/, (_p.sent()).clickProcessButton()];
                    case 37:
                        _p.sent();
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 38:
                        _p.sent();
                        return [4 /*yield*/, processFiltersPage.checkFilterIsHighlighted(processFilterRunning)];
                    case 39:
                        _p.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 40:
                        _p.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 41:
                        _p.sent();
                        _l = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 42: return [4 /*yield*/, _l.apply(void 0, [_p.sent()]).toEqual('Page ' + page)];
                    case 43:
                        _p.sent();
                        _m = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 44: return [4 /*yield*/, _m.apply(void 0, [_p.sent()]).toEqual('of ' + totalPages)];
                    case 45:
                        _p.sent();
                        _o = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 46: return [4 /*yield*/, _o.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.ten)];
                    case 47:
                        _p.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C261047] Should be possible to Items per page to 20', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        page = 1;
                        totalPages = 1;
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 1:
                        _j.sent();
                        return [4 /*yield*/, processFiltersPage.checkFilterIsHighlighted(processFilterRunning)];
                    case 2:
                        _j.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 3:
                        _j.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 4:
                        _j.sent();
                        return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.twenty)];
                    case 5:
                        _j.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 6:
                        _j.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 7:
                        _j.sent();
                        _a = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 8: return [4 /*yield*/, _a.apply(void 0, [_j.sent()]).toEqual('Page ' + page)];
                    case 9:
                        _j.sent();
                        _b = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 10: return [4 /*yield*/, _b.apply(void 0, [_j.sent()]).toEqual('of ' + totalPages)];
                    case 11:
                        _j.sent();
                        _c = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 12: return [4 /*yield*/, _c.apply(void 0, [_j.sent()]).toEqual(itemsPerPage.twenty)];
                    case 13:
                        _j.sent();
                        _d = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 14: return [4 /*yield*/, _d.apply(void 0, [_j.sent()]).toEqual('Showing 1-' + nrOfProcesses + ' of ' + nrOfProcesses)];
                    case 15:
                        _j.sent();
                        _e = expect;
                        return [4 /*yield*/, processFiltersPage.numberOfProcessRows()];
                    case 16: return [4 /*yield*/, _e.apply(void 0, [_j.sent()]).toBe(nrOfProcesses)];
                    case 17:
                        _j.sent();
                        return [4 /*yield*/, paginationPage.checkNextPageButtonIsDisabled()];
                    case 18:
                        _j.sent();
                        return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                    case 19:
                        _j.sent();
                        return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                    case 20: return [4 /*yield*/, (_j.sent()).goToTaskApp()];
                    case 21: return [4 /*yield*/, (_j.sent()).clickProcessButton()];
                    case 22:
                        _j.sent();
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 23:
                        _j.sent();
                        return [4 /*yield*/, processFiltersPage.checkFilterIsHighlighted(processFilterRunning)];
                    case 24:
                        _j.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 25:
                        _j.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 26:
                        _j.sent();
                        _f = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 27: return [4 /*yield*/, _f.apply(void 0, [_j.sent()]).toEqual('Page ' + page)];
                    case 28:
                        _j.sent();
                        _g = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 29: return [4 /*yield*/, _g.apply(void 0, [_j.sent()]).toEqual('of ' + totalPages)];
                    case 30:
                        _j.sent();
                        _h = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 31: return [4 /*yield*/, _h.apply(void 0, [_j.sent()]).toEqual(itemsPerPage.twenty)];
                    case 32:
                        _j.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C261045] Should be possible to Items per page to 5', function () { return __awaiter(_this, void 0, void 0, function () {
            var showing, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
            return __generator(this, function (_z) {
                switch (_z.label) {
                    case 0:
                        page = 1;
                        totalPages = 4;
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 1:
                        _z.sent();
                        return [4 /*yield*/, processFiltersPage.checkFilterIsHighlighted(processFilterRunning)];
                    case 2:
                        _z.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 3:
                        _z.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 4:
                        _z.sent();
                        return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.five)];
                    case 5:
                        _z.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 6:
                        _z.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 7:
                        _z.sent();
                        _a = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 8: return [4 /*yield*/, _a.apply(void 0, [_z.sent()]).toEqual('Page ' + page)];
                    case 9:
                        _z.sent();
                        _b = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 10: return [4 /*yield*/, _b.apply(void 0, [_z.sent()]).toEqual('of ' + totalPages)];
                    case 11:
                        _z.sent();
                        _c = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 12: return [4 /*yield*/, _c.apply(void 0, [_z.sent()]).toEqual(itemsPerPage.five)];
                    case 13:
                        _z.sent();
                        showing = (itemsPerPage.fiveValue * page);
                        _d = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 14: return [4 /*yield*/, _d.apply(void 0, [_z.sent()]).toEqual('Showing 1-' + showing + ' of ' + nrOfProcesses)];
                    case 15:
                        _z.sent();
                        _e = expect;
                        return [4 /*yield*/, processFiltersPage.numberOfProcessRows()];
                    case 16: return [4 /*yield*/, _e.apply(void 0, [_z.sent()]).toBe(itemsPerPage.fiveValue)];
                    case 17:
                        _z.sent();
                        return [4 /*yield*/, paginationPage.checkNextPageButtonIsEnabled()];
                    case 18:
                        _z.sent();
                        return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                    case 19:
                        _z.sent();
                        page++;
                        return [4 /*yield*/, paginationPage.clickOnNextPage()];
                    case 20:
                        _z.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 21:
                        _z.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 22:
                        _z.sent();
                        _f = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 23: return [4 /*yield*/, _f.apply(void 0, [_z.sent()]).toEqual('Page ' + page)];
                    case 24:
                        _z.sent();
                        _g = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 25: return [4 /*yield*/, _g.apply(void 0, [_z.sent()]).toEqual('of ' + totalPages)];
                    case 26:
                        _z.sent();
                        _h = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 27: return [4 /*yield*/, _h.apply(void 0, [_z.sent()]).toEqual(itemsPerPage.five)];
                    case 28:
                        _z.sent();
                        showing = (itemsPerPage.fiveValue * page);
                        _j = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 29: return [4 /*yield*/, _j.apply(void 0, [_z.sent()]).toEqual('Showing 6-' + showing + ' of ' + nrOfProcesses)];
                    case 30:
                        _z.sent();
                        _k = expect;
                        return [4 /*yield*/, processFiltersPage.numberOfProcessRows()];
                    case 31: return [4 /*yield*/, _k.apply(void 0, [_z.sent()]).toBe(itemsPerPage.fiveValue)];
                    case 32:
                        _z.sent();
                        return [4 /*yield*/, paginationPage.checkNextPageButtonIsEnabled()];
                    case 33:
                        _z.sent();
                        return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsEnabled()];
                    case 34:
                        _z.sent();
                        page++;
                        return [4 /*yield*/, paginationPage.clickOnNextPage()];
                    case 35:
                        _z.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 36:
                        _z.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 37:
                        _z.sent();
                        _l = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 38: return [4 /*yield*/, _l.apply(void 0, [_z.sent()]).toEqual('Page ' + page)];
                    case 39:
                        _z.sent();
                        _m = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 40: return [4 /*yield*/, _m.apply(void 0, [_z.sent()]).toEqual('of ' + totalPages)];
                    case 41:
                        _z.sent();
                        _o = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 42: return [4 /*yield*/, _o.apply(void 0, [_z.sent()]).toEqual(itemsPerPage.five)];
                    case 43:
                        _z.sent();
                        showing = (itemsPerPage.fiveValue * page);
                        _p = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 44: return [4 /*yield*/, _p.apply(void 0, [_z.sent()]).toEqual('Showing 11-' + showing + ' of ' + nrOfProcesses)];
                    case 45:
                        _z.sent();
                        _q = expect;
                        return [4 /*yield*/, processFiltersPage.numberOfProcessRows()];
                    case 46: return [4 /*yield*/, _q.apply(void 0, [_z.sent()]).toBe(itemsPerPage.fiveValue)];
                    case 47:
                        _z.sent();
                        return [4 /*yield*/, paginationPage.checkNextPageButtonIsEnabled()];
                    case 48:
                        _z.sent();
                        return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsEnabled()];
                    case 49:
                        _z.sent();
                        page++;
                        return [4 /*yield*/, paginationPage.clickOnNextPage()];
                    case 50:
                        _z.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 51:
                        _z.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 52:
                        _z.sent();
                        _r = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 53: return [4 /*yield*/, _r.apply(void 0, [_z.sent()]).toEqual('Page ' + page)];
                    case 54:
                        _z.sent();
                        _s = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 55: return [4 /*yield*/, _s.apply(void 0, [_z.sent()]).toEqual('of ' + totalPages)];
                    case 56:
                        _z.sent();
                        _t = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 57: return [4 /*yield*/, _t.apply(void 0, [_z.sent()]).toEqual(itemsPerPage.five)];
                    case 58:
                        _z.sent();
                        showing = (itemsPerPage.fiveValue * page);
                        _u = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 59: return [4 /*yield*/, _u.apply(void 0, [_z.sent()]).toEqual('Showing 16-' + showing + ' of ' + nrOfProcesses)];
                    case 60:
                        _z.sent();
                        _v = expect;
                        return [4 /*yield*/, processFiltersPage.numberOfProcessRows()];
                    case 61: return [4 /*yield*/, _v.apply(void 0, [_z.sent()]).toBe(itemsPerPage.fiveValue)];
                    case 62:
                        _z.sent();
                        return [4 /*yield*/, paginationPage.checkNextPageButtonIsDisabled()];
                    case 63:
                        _z.sent();
                        return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsEnabled()];
                    case 64:
                        _z.sent();
                        page = 1;
                        return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                    case 65: return [4 /*yield*/, (_z.sent()).goToTaskApp()];
                    case 66: return [4 /*yield*/, (_z.sent()).clickProcessButton()];
                    case 67:
                        _z.sent();
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 68:
                        _z.sent();
                        return [4 /*yield*/, processFiltersPage.checkFilterIsHighlighted(processFilterRunning)];
                    case 69:
                        _z.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 70:
                        _z.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 71:
                        _z.sent();
                        _w = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 72: return [4 /*yield*/, _w.apply(void 0, [_z.sent()]).toEqual('Page ' + page)];
                    case 73:
                        _z.sent();
                        _x = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 74: return [4 /*yield*/, _x.apply(void 0, [_z.sent()]).toEqual('of ' + totalPages)];
                    case 75:
                        _z.sent();
                        _y = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 76: return [4 /*yield*/, _y.apply(void 0, [_z.sent()]).toEqual(itemsPerPage.five)];
                    case 77:
                        _z.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C261049] Should be possible to open page number dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
            var showing, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
            return __generator(this, function (_t) {
                switch (_t.label) {
                    case 0:
                        page = 1;
                        totalPages = 2;
                        return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 1:
                        _t.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 2:
                        _t.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 3:
                        _t.sent();
                        return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.ten)];
                    case 4:
                        _t.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 5:
                        _t.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 6:
                        _t.sent();
                        _a = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 7: return [4 /*yield*/, _a.apply(void 0, [_t.sent()]).toEqual('Page ' + page)];
                    case 8:
                        _t.sent();
                        _b = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 9: return [4 /*yield*/, _b.apply(void 0, [_t.sent()]).toEqual('of ' + totalPages)];
                    case 10:
                        _t.sent();
                        _c = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 11: return [4 /*yield*/, _c.apply(void 0, [_t.sent()]).toEqual(itemsPerPage.ten)];
                    case 12:
                        _t.sent();
                        showing = (itemsPerPage.tenValue * page);
                        _d = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 13: return [4 /*yield*/, _d.apply(void 0, [_t.sent()]).toEqual('Showing 1-' + showing + ' of ' + nrOfProcesses)];
                    case 14:
                        _t.sent();
                        _e = expect;
                        return [4 /*yield*/, processFiltersPage.numberOfProcessRows()];
                    case 15: return [4 /*yield*/, _e.apply(void 0, [_t.sent()]).toBe(itemsPerPage.tenValue)];
                    case 16:
                        _t.sent();
                        return [4 /*yield*/, paginationPage.checkNextPageButtonIsEnabled()];
                    case 17:
                        _t.sent();
                        return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                    case 18:
                        _t.sent();
                        return [4 /*yield*/, paginationPage.clickOnPageDropdown()];
                    case 19:
                        _t.sent();
                        _f = expect;
                        return [4 /*yield*/, paginationPage.getPageDropdownOptions()];
                    case 20: return [4 /*yield*/, _f.apply(void 0, [_t.sent()]).toEqual(['1', '2'])];
                    case 21:
                        _t.sent();
                        page = 2;
                        return [4 /*yield*/, paginationPage.clickOnPageDropdownOption('2')];
                    case 22:
                        _t.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 23:
                        _t.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 24:
                        _t.sent();
                        _g = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 25: return [4 /*yield*/, _g.apply(void 0, [_t.sent()]).toEqual('Page ' + page)];
                    case 26:
                        _t.sent();
                        _h = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 27: return [4 /*yield*/, _h.apply(void 0, [_t.sent()]).toEqual('of ' + totalPages)];
                    case 28:
                        _t.sent();
                        _j = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 29: return [4 /*yield*/, _j.apply(void 0, [_t.sent()]).toEqual(itemsPerPage.ten)];
                    case 30:
                        _t.sent();
                        showing = (itemsPerPage.tenValue * page);
                        _k = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 31: return [4 /*yield*/, _k.apply(void 0, [_t.sent()]).toEqual('Showing 11-' + showing + ' of ' + nrOfProcesses)];
                    case 32:
                        _t.sent();
                        _l = expect;
                        return [4 /*yield*/, processFiltersPage.numberOfProcessRows()];
                    case 33: return [4 /*yield*/, _l.apply(void 0, [_t.sent()]).toBe(itemsPerPage.tenValue)];
                    case 34:
                        _t.sent();
                        return [4 /*yield*/, paginationPage.checkNextPageButtonIsDisabled()];
                    case 35:
                        _t.sent();
                        return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsEnabled()];
                    case 36:
                        _t.sent();
                        return [4 /*yield*/, paginationPage.clickOnPageDropdown()];
                    case 37:
                        _t.sent();
                        _m = expect;
                        return [4 /*yield*/, paginationPage.getPageDropdownOptions()];
                    case 38: return [4 /*yield*/, _m.apply(void 0, [_t.sent()]).toEqual(['1', '2'])];
                    case 39:
                        _t.sent();
                        page = 1;
                        return [4 /*yield*/, paginationPage.clickOnPageDropdownOption('1')];
                    case 40:
                        _t.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 41:
                        _t.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 42:
                        _t.sent();
                        _o = expect;
                        return [4 /*yield*/, paginationPage.getCurrentPage()];
                    case 43: return [4 /*yield*/, _o.apply(void 0, [_t.sent()]).toEqual('Page ' + page)];
                    case 44:
                        _t.sent();
                        _p = expect;
                        return [4 /*yield*/, paginationPage.getTotalPages()];
                    case 45: return [4 /*yield*/, _p.apply(void 0, [_t.sent()]).toEqual('of ' + totalPages)];
                    case 46:
                        _t.sent();
                        _q = expect;
                        return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                    case 47: return [4 /*yield*/, _q.apply(void 0, [_t.sent()]).toEqual(itemsPerPage.ten)];
                    case 48:
                        _t.sent();
                        showing = (itemsPerPage.tenValue * page);
                        _r = expect;
                        return [4 /*yield*/, paginationPage.getPaginationRange()];
                    case 49: return [4 /*yield*/, _r.apply(void 0, [_t.sent()]).toEqual('Showing 1-' + showing + ' of ' + nrOfProcesses)];
                    case 50:
                        _t.sent();
                        _s = expect;
                        return [4 /*yield*/, processFiltersPage.numberOfProcessRows()];
                    case 51: return [4 /*yield*/, _s.apply(void 0, [_t.sent()]).toBe(itemsPerPage.tenValue)];
                    case 52:
                        _t.sent();
                        return [4 /*yield*/, paginationPage.checkNextPageButtonIsEnabled()];
                    case 53:
                        _t.sent();
                        return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                    case 54:
                        _t.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C261048] Should be possible to sort processes by name', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.checkFilterIsHighlighted(processFilterRunning)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.twenty)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.sortByName('ASC')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.checkProcessesSortedByNameAsc()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.sortByName('DESC')];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.checkProcessesSortedByNameDesc()];
                    case 13:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        it('[C286260] Should keep sorting when changing \'Items per page\'', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, processFiltersPage.clickRunningFilterButton()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.checkFilterIsHighlighted(processFilterRunning)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.twenty)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, processDetailsPage.checkProcessTitleIsDisplayed()];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.sortByName('ASC')];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.checkProcessesSortedByNameAsc()];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.five)];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.waitForTableBody()];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, processFiltersPage.checkProcessesSortedByNameAsc()];
                    case 13:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=processlist-pagination.e2e.js.map