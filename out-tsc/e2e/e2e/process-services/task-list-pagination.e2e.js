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
var tasksPage_1 = require("../pages/adf/process-services/tasksPage");
var navigationBarPage_1 = require("../pages/adf/navigationBarPage");
var adf_testing_2 = require("@alfresco/adf-testing");
var CONSTANTS = require("../util/constants");
var protractor_1 = require("protractor");
var resources = require("../util/resources");
var js_api_1 = require("@alfresco/js-api");
var apps_actions_1 = require("../actions/APS/apps.actions");
var users_actions_1 = require("../actions/users.actions");
describe('Task List Pagination', function () {
    var loginPage = new adf_testing_1.LoginPage();
    var navigationBarPage = new navigationBarPage_1.NavigationBarPage();
    var taskPage = new tasksPage_1.TasksPage();
    var paginationPage = new adf_testing_2.PaginationPage();
    var processUserModel, processUserModelEmpty;
    var app = resources.Files.SIMPLE_APP_WITH_USER_FORM;
    var currentPage = 1;
    var nrOfTasks = 20;
    var totalPages;
    var itemsPerPage = {
        five: '5',
        fiveValue: 5,
        ten: '10',
        tenValue: 10,
        fifteen: '15',
        fifteenValue: 15,
        twenty: '20',
        twentyValue: 20,
        default: '20'
    };
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var apps, users, resultApp, i;
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
                    return [4 /*yield*/, users.createTenantAndUser(this.alfrescoJsApi)];
                case 3:
                    processUserModelEmpty = _a.sent();
                    return [4 /*yield*/, this.alfrescoJsApi.login(processUserModel.email, processUserModel.password)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, apps.importPublishDeployApp(this.alfrescoJsApi, app.file_location)];
                case 5:
                    resultApp = _a.sent();
                    i = 0;
                    _a.label = 6;
                case 6:
                    if (!(i < nrOfTasks)) return [3 /*break*/, 9];
                    return [4 /*yield*/, apps.startProcess(this.alfrescoJsApi, resultApp)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 6];
                case 9: return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(processUserModel)];
                case 10:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260301] Should display default pagination', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_f.sent()).goToTaskApp()];
                case 2:
                    _f.sent();
                    _a = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 3: return [4 /*yield*/, _a.apply(void 0, [_f.sent()]).toEqual(itemsPerPage.default)];
                case 4:
                    _f.sent();
                    _b = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 5: return [4 /*yield*/, _b.apply(void 0, [_f.sent()]).toEqual('Showing 1-' + nrOfTasks + ' of ' + nrOfTasks)];
                case 6:
                    _f.sent();
                    _c = expect;
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().numberOfRows()];
                case 7: return [4 /*yield*/, _c.apply(void 0, [_f.sent()]).toBe(nrOfTasks)];
                case 8:
                    _f.sent();
                    return [4 /*yield*/, paginationPage.checkNextPageButtonIsDisabled()];
                case 9:
                    _f.sent();
                    return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                case 10:
                    _f.sent();
                    return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.twenty)];
                case 11:
                    _f.sent();
                    _d = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 12: return [4 /*yield*/, _d.apply(void 0, [_f.sent()]).toEqual(itemsPerPage.twenty)];
                case 13:
                    _f.sent();
                    _e = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 14: return [4 /*yield*/, _e.apply(void 0, [_f.sent()]).toEqual('Showing 1-' + nrOfTasks + ' of ' + nrOfTasks)];
                case 15:
                    _f.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260304] Should be possible to set Items per page to 5', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
            switch (_p.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_p.sent()).goToTaskApp()];
                case 2:
                    _p.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS)];
                case 3:
                    _p.sent();
                    return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.five)];
                case 4:
                    _p.sent();
                    _a = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.five)];
                case 6:
                    _p.sent();
                    _b = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 7: return [4 /*yield*/, _b.apply(void 0, [_p.sent()]).toEqual('Showing 1-' + itemsPerPage.fiveValue + ' of ' + nrOfTasks)];
                case 8:
                    _p.sent();
                    _c = expect;
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().numberOfRows()];
                case 9: return [4 /*yield*/, _c.apply(void 0, [_p.sent()]).toBe(itemsPerPage.fiveValue)];
                case 10:
                    _p.sent();
                    return [4 /*yield*/, paginationPage.clickOnNextPage()];
                case 11:
                    _p.sent();
                    currentPage++;
                    _d = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 12: return [4 /*yield*/, _d.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.five)];
                case 13:
                    _p.sent();
                    _e = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 14: return [4 /*yield*/, _e.apply(void 0, [_p.sent()]).toEqual('Showing 6-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks)];
                case 15:
                    _p.sent();
                    _f = expect;
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().numberOfRows()];
                case 16: return [4 /*yield*/, _f.apply(void 0, [_p.sent()]).toBe(itemsPerPage.fiveValue)];
                case 17:
                    _p.sent();
                    return [4 /*yield*/, paginationPage.clickOnNextPage()];
                case 18:
                    _p.sent();
                    currentPage++;
                    _g = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 19: return [4 /*yield*/, _g.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.five)];
                case 20:
                    _p.sent();
                    _h = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 21: return [4 /*yield*/, _h.apply(void 0, [_p.sent()]).toEqual('Showing 11-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks)];
                case 22:
                    _p.sent();
                    _j = expect;
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().numberOfRows()];
                case 23: return [4 /*yield*/, _j.apply(void 0, [_p.sent()]).toBe(itemsPerPage.fiveValue)];
                case 24:
                    _p.sent();
                    return [4 /*yield*/, paginationPage.clickOnNextPage()];
                case 25:
                    _p.sent();
                    currentPage++;
                    _k = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 26: return [4 /*yield*/, _k.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.five)];
                case 27:
                    _p.sent();
                    _l = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 28: return [4 /*yield*/, _l.apply(void 0, [_p.sent()]).toEqual('Showing 16-' + itemsPerPage.fiveValue * currentPage + ' of ' + nrOfTasks)];
                case 29:
                    _p.sent();
                    _m = expect;
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().numberOfRows()];
                case 30: return [4 /*yield*/, _m.apply(void 0, [_p.sent()]).toBe(itemsPerPage.fiveValue)];
                case 31:
                    _p.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 32: return [4 /*yield*/, (_p.sent()).goToTaskApp()];
                case 33:
                    _p.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS)];
                case 34:
                    _p.sent();
                    _o = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 35: return [4 /*yield*/, _o.apply(void 0, [_p.sent()]).toEqual(itemsPerPage.five)];
                case 36:
                    _p.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260303] Should be possible to set Items per page to 10', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_h.sent()).goToTaskApp()];
                case 2:
                    _h.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS)];
                case 3:
                    _h.sent();
                    return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.ten)];
                case 4:
                    _h.sent();
                    _a = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_h.sent()]).toEqual(itemsPerPage.ten)];
                case 6:
                    _h.sent();
                    _b = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 7: return [4 /*yield*/, _b.apply(void 0, [_h.sent()]).toEqual('Showing 1-' + itemsPerPage.tenValue + ' of ' + nrOfTasks)];
                case 8:
                    _h.sent();
                    _c = expect;
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().numberOfRows()];
                case 9: return [4 /*yield*/, _c.apply(void 0, [_h.sent()]).toBe(itemsPerPage.tenValue)];
                case 10:
                    _h.sent();
                    return [4 /*yield*/, paginationPage.clickOnNextPage()];
                case 11:
                    _h.sent();
                    _d = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 12: return [4 /*yield*/, _d.apply(void 0, [_h.sent()]).toEqual(itemsPerPage.ten)];
                case 13:
                    _h.sent();
                    _e = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 14: return [4 /*yield*/, _e.apply(void 0, [_h.sent()]).toEqual('Showing 11-' + itemsPerPage.twentyValue + ' of ' + nrOfTasks)];
                case 15:
                    _h.sent();
                    _f = expect;
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().numberOfRows()];
                case 16: return [4 /*yield*/, _f.apply(void 0, [_h.sent()]).toBe(itemsPerPage.tenValue)];
                case 17:
                    _h.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 18: return [4 /*yield*/, (_h.sent()).goToTaskApp()];
                case 19:
                    _h.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS)];
                case 20:
                    _h.sent();
                    _g = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 21: return [4 /*yield*/, _g.apply(void 0, [_h.sent()]).toEqual(itemsPerPage.ten)];
                case 22:
                    _h.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C260302] Should be possible to set Items per page to 15', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_h.sent()).goToTaskApp()];
                case 2:
                    _h.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS)];
                case 3:
                    _h.sent();
                    return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.fifteen)];
                case 4:
                    _h.sent();
                    _a = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 5: return [4 /*yield*/, _a.apply(void 0, [_h.sent()]).toEqual(itemsPerPage.fifteen)];
                case 6:
                    _h.sent();
                    _b = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 7: return [4 /*yield*/, _b.apply(void 0, [_h.sent()]).toEqual('Showing 1-' + itemsPerPage.fifteenValue + ' of ' + nrOfTasks)];
                case 8:
                    _h.sent();
                    _c = expect;
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().numberOfRows()];
                case 9: return [4 /*yield*/, _c.apply(void 0, [_h.sent()]).toBe(itemsPerPage.fifteenValue)];
                case 10:
                    _h.sent();
                    return [4 /*yield*/, paginationPage.clickOnNextPage()];
                case 11:
                    _h.sent();
                    _d = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 12: return [4 /*yield*/, _d.apply(void 0, [_h.sent()]).toEqual(itemsPerPage.fifteen)];
                case 13:
                    _h.sent();
                    _e = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 14: return [4 /*yield*/, _e.apply(void 0, [_h.sent()]).toEqual('Showing 16-' + itemsPerPage.twentyValue + ' of ' + nrOfTasks)];
                case 15:
                    _h.sent();
                    _f = expect;
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().numberOfRows()];
                case 16: return [4 /*yield*/, _f.apply(void 0, [_h.sent()]).toBe(itemsPerPage.fiveValue)];
                case 17:
                    _h.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 18: return [4 /*yield*/, (_h.sent()).goToTaskApp()];
                case 19:
                    _h.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS)];
                case 20:
                    _h.sent();
                    _g = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 21: return [4 /*yield*/, _g.apply(void 0, [_h.sent()]).toEqual(itemsPerPage.fifteen)];
                case 22:
                    _h.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('[C261006] Should be possible to navigate to a page with page number dropdown', function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        return __generator(this, function (_t) {
            switch (_t.label) {
                case 0:
                    currentPage = 1;
                    totalPages = 2;
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 1: return [4 /*yield*/, (_t.sent()).goToTaskApp()];
                case 2:
                    _t.sent();
                    return [4 /*yield*/, taskPage.filtersPage().goToFilter(CONSTANTS.TASK_FILTERS.INV_TASKS)];
                case 3:
                    _t.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().waitForTableBody()];
                case 4:
                    _t.sent();
                    return [4 /*yield*/, paginationPage.selectItemsPerPage(itemsPerPage.ten)];
                case 5:
                    _t.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().waitForTableBody()];
                case 6:
                    _t.sent();
                    _a = expect;
                    return [4 /*yield*/, paginationPage.getCurrentPage()];
                case 7: return [4 /*yield*/, _a.apply(void 0, [_t.sent()]).toEqual('Page ' + currentPage)];
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
                    _d = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 13: return [4 /*yield*/, _d.apply(void 0, [_t.sent()]).toEqual('Showing 1-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfTasks)];
                case 14:
                    _t.sent();
                    _e = expect;
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().numberOfRows()];
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
                    currentPage = 2;
                    return [4 /*yield*/, paginationPage.clickOnPageDropdownOption('2')];
                case 22:
                    _t.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().waitForTableBody()];
                case 23:
                    _t.sent();
                    _g = expect;
                    return [4 /*yield*/, paginationPage.getCurrentPage()];
                case 24: return [4 /*yield*/, _g.apply(void 0, [_t.sent()]).toEqual('Page ' + currentPage)];
                case 25:
                    _t.sent();
                    _h = expect;
                    return [4 /*yield*/, paginationPage.getTotalPages()];
                case 26: return [4 /*yield*/, _h.apply(void 0, [_t.sent()]).toEqual('of ' + totalPages)];
                case 27:
                    _t.sent();
                    _j = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 28: return [4 /*yield*/, _j.apply(void 0, [_t.sent()]).toEqual(itemsPerPage.ten)];
                case 29:
                    _t.sent();
                    _k = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 30: return [4 /*yield*/, _k.apply(void 0, [_t.sent()]).toEqual('Showing 11-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfTasks)];
                case 31:
                    _t.sent();
                    _l = expect;
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().numberOfRows()];
                case 32: return [4 /*yield*/, _l.apply(void 0, [_t.sent()]).toBe(itemsPerPage.tenValue)];
                case 33:
                    _t.sent();
                    return [4 /*yield*/, paginationPage.checkNextPageButtonIsDisabled()];
                case 34:
                    _t.sent();
                    return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsEnabled()];
                case 35:
                    _t.sent();
                    return [4 /*yield*/, paginationPage.clickOnPageDropdown()];
                case 36:
                    _t.sent();
                    _m = expect;
                    return [4 /*yield*/, paginationPage.getPageDropdownOptions()];
                case 37: return [4 /*yield*/, _m.apply(void 0, [_t.sent()]).toEqual(['1', '2'])];
                case 38:
                    _t.sent();
                    currentPage = 1;
                    return [4 /*yield*/, paginationPage.clickOnPageDropdownOption('1')];
                case 39:
                    _t.sent();
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().waitForTableBody()];
                case 40:
                    _t.sent();
                    _o = expect;
                    return [4 /*yield*/, paginationPage.getCurrentPage()];
                case 41: return [4 /*yield*/, _o.apply(void 0, [_t.sent()]).toEqual('Page ' + currentPage)];
                case 42:
                    _t.sent();
                    _p = expect;
                    return [4 /*yield*/, paginationPage.getTotalPages()];
                case 43: return [4 /*yield*/, _p.apply(void 0, [_t.sent()]).toEqual('of ' + totalPages)];
                case 44:
                    _t.sent();
                    _q = expect;
                    return [4 /*yield*/, paginationPage.getCurrentItemsPerPage()];
                case 45: return [4 /*yield*/, _q.apply(void 0, [_t.sent()]).toEqual(itemsPerPage.ten)];
                case 46:
                    _t.sent();
                    _r = expect;
                    return [4 /*yield*/, paginationPage.getPaginationRange()];
                case 47: return [4 /*yield*/, _r.apply(void 0, [_t.sent()]).toEqual('Showing 1-' + itemsPerPage.tenValue * currentPage + ' of ' + nrOfTasks)];
                case 48:
                    _t.sent();
                    _s = expect;
                    return [4 /*yield*/, taskPage.tasksListPage().getDataTable().numberOfRows()];
                case 49: return [4 /*yield*/, _s.apply(void 0, [_t.sent()]).toBe(itemsPerPage.tenValue)];
                case 50:
                    _t.sent();
                    return [4 /*yield*/, paginationPage.checkNextPageButtonIsEnabled()];
                case 51:
                    _t.sent();
                    return [4 /*yield*/, paginationPage.checkPreviousPageButtonIsDisabled()];
                case 52:
                    _t.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('Pagination in an empty task list', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loginPage.loginToProcessServicesUsingUserModel(processUserModelEmpty)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, navigationBarPage.navigateToProcessServicesPage()];
                case 2: return [4 /*yield*/, (_a.sent()).goToTaskApp()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, paginationPage.checkPaginationIsNotDisplayed()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=task-list-pagination.e2e.js.map